import * as fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export interface ParseResult {
  text: string;
  numPages: number;
  hasImages: boolean;
  hasTables: boolean;
  hasDiagrams: boolean;
  hasFormulae: boolean;
  success: boolean;
}

export async function parsePdf(filePath: string): Promise<ParseResult> {
  const dataBuffer = fs.readFileSync(filePath);

  let text = '';
  let numPages = 0;
  let success = false;

  try {
    const data = await pdfParse(dataBuffer);
    text = data.text;
    numPages = data.numpages;
    success = true;
  } catch (error) {
    console.warn(`[Parser] pdf-parse failed for ${filePath}. Trying fallback...`);
    // Fallback to pdfjs-dist (dynamic import to avoid top-level issues)
    try {
      const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
      const uint8Array = new Uint8Array(dataBuffer);
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdf = await loadingTask.promise;
      numPages = pdf.numPages;
      let fullText = '';
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str + (item.hasEOL ? '\n' : ' ')).join('');
        fullText += pageText + '\n';
      }
      text = fullText;
      success = true;
    } catch (fallbackError) {
      console.error(`[Parser] Fallback also failed for ${filePath}: ${fallbackError}`);
    }
  }

  // Heuristic detections
  const lowerText = text.toLowerCase();
  
  // Tables: "table 1.", "table 2", tabular data structures
  const hasTables = /table\s+\d+/i.test(text) || /\|\s*-\s*\|/.test(text);
  
  // Images/Diagrams: "fig.", "figure", "diagram"
  const hasImages = /fig\.\s*\d+/i.test(text) || /figure\s+\d+/i.test(text);
  const hasDiagrams = /diagram/i.test(text) || /schematic/i.test(text) || hasImages; // often overlap
  
  // Formulae: equations, x^2, = math symbols
  const hasFormulae = /equation\s+\d+/i.test(text) || /[\+\-\=\/\*]\s*\d+/.test(text) || /x\^2/.test(lowerText) || /sin\(/i.test(lowerText);

  return {
    text,
    numPages,
    hasImages,
    hasTables,
    hasDiagrams,
    hasFormulae,
    success
  };
}
