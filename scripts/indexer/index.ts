import * as path from 'path';
import * as fs from 'fs';
import { getAllFiles, getFileHash, getLastModified, writeJson, readJson, ensureDirectoryExistence } from './fileUtils';
import { parsePdf } from './parser';
import { determineSubject, determineClass, determineLanguage, estimateDifficulty } from './classifier';
import { parseSections } from './sectionParser';
import { generateLessonMetadata } from './metadataGenerator';
import { generateReports, ReportStats } from './reportGenerator';
import { PDFMetadata, ActivityMap, IndexCache, LessonObject } from './types';

const DATA_DIR = path.resolve(process.cwd(), 'Data');
const PDF_DIR = path.join(DATA_DIR, 'pdf');
const METADATA_DIR = path.join(DATA_DIR, 'metadata');
const JSON_DIR = path.join(DATA_DIR, 'json');
const LOG_DIR = path.join(process.cwd(), 'logs');
const CACHE_FILE = path.join(METADATA_DIR, '.index-cache.json');

ensureDirectoryExistence(path.join(LOG_DIR, 'index.log'));
const logStream = fs.createWriteStream(path.join(LOG_DIR, 'index.log'), { flags: 'a' });

function log(message: string) {
  const time = new Date().toISOString();
  const line = `[${time}] ${message}`;
  console.log(line);
  logStream.write(line + '\n');
}

async function run() {
  const startTime = Date.now();
  log('Starting AR Smart Lab Advanced Hybrid Indexing...');

  const cache = readJson<IndexCache>(CACHE_FILE, {});
  const pdfFiles = getAllFiles(PDF_DIR);
  
  log(`Found ${pdfFiles.length} PDF files.`);

  const allMetadata: PDFMetadata[] = [];
  const allActivities: ActivityMap[] = [];
  let skipped = 0;
  let errors = 0;

  const unreadablePdfs: string[] = [];
  let duplicateActivities = 0;
  let duplicatePdfs = 0;
  const largeFiles: string[] = [];
  const seenHashes = new Set<string>();
  const seenActivities = new Set<string>();

  for (const file of pdfFiles) {
    try {
      const stats = fs.statSync(file);
      if (stats.size > 10 * 1024 * 1024) { 
        largeFiles.push(path.basename(file));
      }

      const hash = getFileHash(file);
      const modified = getLastModified(file);
      
      const relPath = path.relative(process.cwd(), file);
      const fileName = path.basename(file);

      if (seenHashes.has(hash)) {
        duplicatePdfs++;
        log(`Duplicate PDF found based on hash: ${fileName}`);
        continue;
      }
      seenHashes.add(hash);

      if (cache[file] && cache[file].hash === hash) {
        log(`Skipping (cached): ${fileName}`);
        allMetadata.push(cache[file].metadata);
        
        cache[file].metadata.activitiesList.forEach(act => {
          if (seenActivities.has(act.title)) {
             duplicateActivities++;
          } else {
             seenActivities.add(act.title);
          }
          allActivities.push({
            activityName: act.activityType,
            activityTitle: act.title,
            lessonTitle: act.title,
            subject: act.subject,
            classLevel: act.classLevel,
            chapter: act.chapter,
            requiredEngine: act.interactiveEngine
          });
        });
        skipped++;
        continue;
      }

      log(`Processing: ${fileName}`);
      const parsed = await parsePdf(file);
      
      if (!parsed.success) {
        log(`WARNING: Failed to extract text for ${fileName}`);
        unreadablePdfs.push(fileName);
        errors++;
      }
      
      const first5PagesText = parsed.text.substring(0, Math.min(parsed.text.length, 10000));
      
      const subject = determineSubject(first5PagesText + ' ' + fileName, fileName, file);
      const classLevel = determineClass(first5PagesText + ' ' + fileName, fileName, file);
      const language = determineLanguage(parsed.text);
      
      const extractedLessons = parseSections(parsed.text, first5PagesText, fileName, file);

      // Extract unique keywords for the whole PDF
      const pdfKeywords = new Set<string>();
      extractedLessons.forEach(l => l.keywords.forEach(k => pdfKeywords.add(k)));

      // Default chapter from first lesson or generic
      const defaultChapter = extractedLessons.length > 0 ? extractedLessons[0].chapter : 'General Chapter';
      
      const meta: PDFMetadata = {
        fileName,
        absolutePath: file,
        relativePath: relPath,
        subject,
        classLevel,
        chapter: defaultChapter,
        unit: 'Unit 1',
        activity: extractedLessons.length > 0 ? extractedLessons[0].title : 'None',
        experiment: 'None',
        lessonTitle: fileName.replace('.pdf', ''),
        numPages: parsed.numPages,
        language,
        hasImages: parsed.hasImages,
        hasDiagrams: parsed.hasDiagrams,
        hasFormulae: parsed.hasFormulae,
        hasTables: parsed.hasTables,
        keywords: Array.from(pdfKeywords),
        topicsCovered: [defaultChapter],
        difficulty: estimateDifficulty(classLevel),
        activitiesList: extractedLessons,
        formulaTypes: parsed.hasFormulae ? ['General Math/Science'] : []
      };

      allMetadata.push(meta);
      cache[file] = { hash, lastModified: modified, metadata: meta };

      extractedLessons.forEach(act => {
        if (seenActivities.has(act.title)) {
          duplicateActivities++;
        } else {
          seenActivities.add(act.title);
        }
        allActivities.push({
          activityName: act.activityType,
          activityTitle: act.title,
          lessonTitle: act.title,
          subject: act.subject,
          classLevel: act.classLevel,
          chapter: act.chapter,
          requiredEngine: act.interactiveEngine
        });
        
        // Write the individual hierarchical JSON for the lesson
        const classSlug = act.classLevel.toLowerCase().replace(' ', '-');
        const subjectSlug = act.subject.toLowerCase();
        const chapterSlug = act.chapter.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const lessonSlug = act.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        if (lessonSlug) {
          const outDir = path.join(JSON_DIR, subjectSlug, classSlug, chapterSlug, lessonSlug);
          const lessonMeta = generateLessonMetadata(meta);
          // Override requiredEngine with the specific activity engine
          lessonMeta.requiredEngine = act.interactiveEngine;
          
          writeJson(path.join(outDir, 'metadata.json'), lessonMeta);
          writeJson(path.join(outDir, 'lesson.json'), act); // Write the full structured object
          writeJson(path.join(outDir, 'quiz.json'), { questions: [] });
          writeJson(path.join(outDir, 'assets.json'), {});
          writeJson(path.join(outDir, 'translations.json'), {});
          writeJson(path.join(outDir, 'formula.json'), { formulae: [] });
        }
      });

    } catch (e) {
      log(`ERROR processing ${file}: ${e}`);
      errors++;
    }
  }

  writeJson(path.join(METADATA_DIR, 'content-index.json'), allMetadata);
  writeJson(path.join(METADATA_DIR, 'activity-index.json'), allActivities);
  writeJson(CACHE_FILE, cache);

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  const reportStats: ReportStats = {
    duration,
    errors,
    totalPdfCount: pdfFiles.length,
    unreadablePdfs,
    duplicateActivities,
    duplicatePdfs,
    largeFiles
  };

  const finalSummary = generateReports(allMetadata, allActivities, DATA_DIR, reportStats);

  log(`Indexing Complete in ${duration}s.`);
  log(`Processed: ${pdfFiles.length - skipped}, Skipped: ${skipped}, Errors: ${errors}`);
  
  console.log('\n========================================');
  console.log('       INDEXING PROCESS SUMMARY         ');
  console.log('========================================');
  console.log(`• Number of PDFs processed:          ${finalSummary.numPdfsProcessed}`);
  console.log(`• Number of unique activities:       ${finalSummary.numUniqueActivities}`);
  console.log(`• Number of reusable engines:        ${finalSummary.numReusableEngines}`);
  console.log(`• Number of duplicate activities:    ${finalSummary.numDuplicateActivities}`);
  console.log(`• Number of lessons to generate:     ${finalSummary.numLessonsCanBeGenerated}`);
  console.log(`• Estimated completion percentage:   ${finalSummary.completionPercentage}%`);
  console.log('========================================\n');
  
  logStream.end();
}

run().catch(err => {
  log(`FATAL ERROR: ${err}`);
});
