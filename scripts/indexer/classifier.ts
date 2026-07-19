import * as path from 'path';

export function determineSubject(text: string, fileName: string, filePath: string): string {
  const lowerText = text.toLowerCase();
  const lowerFile = fileName.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  
  if (lowerPath.includes('math') || lowerFile.includes('math') || lowerText.includes('mathematics') || lowerText.includes('algebra') || lowerText.includes('geometry') || lowerFile.includes('lem') || lowerFile.includes('ahelm')) {
    return 'Mathematics';
  }
  if (lowerPath.includes('physics') || lowerText.includes('physics')) return 'Physics';
  if (lowerPath.includes('chemistry') || lowerText.includes('chemistry')) return 'Chemistry';
  if (lowerPath.includes('biology') || lowerText.includes('biology')) return 'Biology';
  if (
    lowerPath.includes('environment') || lowerPath.includes('earth') || 
    lowerText.includes('environment') || lowerText.includes('earth') || 
    lowerText.includes('pollution') || lowerText.includes('garbage') ||
    lowerText.includes('water cycle') || lowerText.includes('natural resources')
  ) {
    return 'Earth & Environmental Science';
  }
  
  if (lowerPath.includes('science') || lowerFile.includes('sci') || lowerText.includes('science')) {
    return 'General Science';
  }
  return 'Unknown';
}

export function determineClass(text: string, fileName: string, filePath: string): string {
  const lowerText = text.toLowerCase();
  const lowerPath = filePath.toLowerCase();
  
  if (lowerPath.includes('class 6') || lowerPath.includes('class_6') || /class\s*6|class\s*vi\b/i.test(lowerText) || /06\w{2}\d+/.test(fileName) || fileName.includes('class6')) return 'Class 6';
  if (lowerPath.includes('class 7') || lowerPath.includes('class_7') || /class\s*7|class\s*vii\b/i.test(lowerText) || /07\w{2}\d+/.test(fileName) || fileName.includes('class7')) return 'Class 7';
  if (lowerPath.includes('class 8') || lowerPath.includes('class_8') || /class\s*8|class\s*viii\b/i.test(lowerText) || /08\w{2}\d+/.test(fileName) || fileName.includes('class8')) return 'Class 8';
  if (lowerPath.includes('class 9') || lowerPath.includes('class_9') || /class\s*9|class\s*ix\b/i.test(lowerText) || /09\w{2}\d+/.test(fileName) || fileName.includes('class9')) return 'Class 9';
  if (lowerPath.includes('class 10') || lowerPath.includes('class_10') || /class\s*10|class\s*x\b/i.test(lowerText) || /10\w{2}\d+/.test(fileName) || fileName.includes('class10')) return 'Class 10';
  
  return 'Unknown Class';
}

export function extractChapter(text: string): { chapter: string, unit: string } {
  let chapter = 'General Chapter';
  let unit = 'General Unit';

  const chapterMatch = text.match(/chapter\s+(\d+|[ivxlc]+)[^\n]*\n([A-Z][a-zA-Z\s]+)/i);
  if (chapterMatch && chapterMatch[2]) {
    chapter = `Chapter ${chapterMatch[1].toUpperCase()} - ${chapterMatch[2].trim()}`;
  } else {
    const fallbackMatch = text.match(/chapter\s+(\d+|[ivxlc]+)/i);
    if (fallbackMatch) chapter = `Chapter ${fallbackMatch[1].toUpperCase()}`;
  }

  const unitMatch = text.match(/unit\s+(\d+|[ivxlc]+)[^\n]*\n([A-Z][a-zA-Z\s]+)/i);
  if (unitMatch && unitMatch[2]) {
    unit = `Unit ${unitMatch[1].toUpperCase()} - ${unitMatch[2].trim()}`;
  } else {
    const fallbackUnit = text.match(/unit\s+(\d+|[ivxlc]+)/i);
    if (fallbackUnit) unit = `Unit ${fallbackUnit[1].toUpperCase()}`;
  }

  return { chapter, unit };
}

export function determineLanguage(text: string): string {
  const hindiChars = text.match(/[\u0900-\u097F]/g);
  if (hindiChars && hindiChars.length > 50) {
    return 'Hindi';
  }
  return 'English';
}

export function estimateDifficulty(classLevel: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  if (classLevel === 'Class 6' || classLevel === 'Class 7') return 'Beginner';
  if (classLevel === 'Class 8' || classLevel === 'Class 9') return 'Intermediate';
  if (classLevel === 'Class 10') return 'Advanced';
  return 'Intermediate';
}

export function extractKeywords(text: string): string[] {
  const dictionary = [
    'triangle', 'circle', 'fraction', 'graph', 'probability', 'abacus',
    'cube', 'cone', 'cylinder', 'electric circuit', 'heart', 'cell',
    'photosynthesis', 'reflection', 'light', 'sound', 'heat', 'magnetism',
    'coordinate', 'polygon', 'number line', 'statistics', 'mensuration',
    'cuboid', 'sphere', 'transformation', 'rotation', 'human body', 'plant cell',
    'animal cell', 'solar system', 'water cycle', 'periodic table', 'molecule',
    'chemical reaction', 'integers'
  ];
  
  const found: Set<string> = new Set();
  const lowerText = text.toLowerCase();
  
  for (const word of dictionary) {
    if (lowerText.includes(word)) {
      found.add(word);
    }
  }
  
  return Array.from(found);
}
