import { LessonObject } from './types';
import { mapToEngine } from './engineMapper';
import { determineSubject, determineClass, extractKeywords, extractChapter, determineLanguage } from './classifier';

export function parseSections(
  fullText: string, 
  first5PagesText: string, 
  fileName: string, 
  filePath: string
): LessonObject[] {
  const lessons: LessonObject[] = [];
  
  // 1. Detect document-level metadata
  const subject = determineSubject(first5PagesText + ' ' + fileName, fileName, filePath);
  const classLevel = determineClass(first5PagesText + ' ' + fileName, fileName, filePath);
  const chapterAndUnit = extractChapter(first5PagesText + ' ' + fullText); // naive global chapter for now if not found in section
  
  const lines = fullText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Keywords indicating boundary starts
  const activityBoundaryRegex = /^(Activity|Experiment|Lab Activity|Practical|Exercise|Worksheet|Investigation|Project|Case Study)\s+(\d+(?:\.\d+)*)\b\s*[-:]?\s*(.*)/i;
  
  let currentLesson: Partial<LessonObject> | null = null;
  let currentSection = 'None';
  let buffer: string[] = [];
  
  const saveSection = () => {
    if (!currentLesson) return;
    const content = buffer.join('\n');
    buffer = [];
    if (currentSection === 'Objective' || currentSection.includes('aim')) currentLesson.objective = content;
    else if (currentSection === 'Material Required' || currentSection.includes('material')) currentLesson.materials = content;
    else if (currentSection === 'Procedure' || currentSection.includes('method')) currentLesson.procedure = content;
    else if (currentSection === 'Observation') currentLesson.observation = content;
    else if (currentSection === 'Discussion' || currentSection.includes('conclusion')) currentLesson.discussion = content;
  };

  const finalizeLesson = () => {
    if (currentLesson) {
      saveSection();
      // Heuristic for activity Title: it usually immediately follows the "Activity X" heading.
      // If we didn't explicitly find a title, let's look at the first few lines of the objective or the buffer right after Activity
      const fullTextCombined = Object.values(currentLesson).join(' ');
      currentLesson.keywords = extractKeywords(currentLesson.activityTitle + ' ' + fullTextCombined);
      currentLesson.interactiveEngine = mapToEngine(currentLesson.activityTitle || '', currentLesson.keywords);
      
      lessons.push(currentLesson as LessonObject);
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check for a new Activity/Experiment
    const match = line.match(activityBoundaryRegex);
    if (match) {
      finalizeLesson();
      
      let activityType = match[1] + (match[2] ? ' ' + match[2] : '');
      let activityTitle = (match[4] || '').trim();
      
      let nextIdx = i + 1;
      let titleLinesCount = 0;
      while (nextIdx < lines.length && titleLinesCount < 2 && !lines[nextIdx].match(/^(objective|materials? required|procedure|observation|discussion|aim|method)/i)) {
        const tLine = lines[nextIdx].trim();
        if (tLine.length > 0) {
           activityTitle += ' ' + tLine;
           titleLinesCount++;
        }
        nextIdx++;
      }
      i = nextIdx - 1; // skip the title lines

      currentLesson = {
        id: Math.random().toString(36).substring(7),
        title: activityTitle.trim() || activityType,
        subject,
        classLevel,
        chapter: chapterAndUnit.chapter,
        unit: chapterAndUnit.unit,
        activityTitle: activityTitle.trim() || activityType,
        activityType: activityType,
        objective: '',
        materials: '',
        procedure: '',
        observation: '',
        discussion: '',
        keywords: [],
        interactiveEngine: ''
      };
      currentSection = 'Intro';
      continue;
    }

    if (currentLesson) {
      const cleanLine = line.substring(0, 30).replace(/\s/g, '').toLowerCase();
      
      let matchedSection = '';
      if (cleanLine.startsWith('objective') || cleanLine.startsWith('aim')) matchedSection = 'Objective';
      else if (cleanLine.startsWith('material') || cleanLine.startsWith('materialsrequired')) matchedSection = 'Material Required';
      else if (cleanLine.startsWith('procedure') || cleanLine.startsWith('method') || cleanLine.startsWith('methodofconstruction')) matchedSection = 'Procedure';
      else if (cleanLine.startsWith('observation') || cleanLine.startsWith('demonstration')) matchedSection = 'Observation';
      else if (cleanLine.startsWith('discussion') || cleanLine.startsWith('conclusion') || cleanLine.startsWith('application')) matchedSection = 'Discussion';

      if (matchedSection) {
        saveSection();
        currentSection = matchedSection;
      } else {
        buffer.push(line);
      }
    }
  }
  
  finalizeLesson();
  
  return lessons;
}
