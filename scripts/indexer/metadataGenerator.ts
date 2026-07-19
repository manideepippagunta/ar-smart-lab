import { PDFMetadata, LessonMetadata } from './types';
import { mapToEngine } from './engineMapper';

export function generateLessonMetadata(pdfMeta: PDFMetadata): LessonMetadata {
  const engine = mapToEngine(pdfMeta.topicsCovered.join(' ') + ' ' + pdfMeta.lessonTitle, pdfMeta.keywords);
  
  const requires3D = engine.includes('Engine') && !engine.includes('Graph') && !engine.includes('Number Line');
  const requiresGraph = engine.includes('Graph') || engine.includes('Coordinate') || engine.includes('Statistics');
  const requiresFormula = pdfMeta.hasFormulae || pdfMeta.subject === 'Mathematics';
  
  return {
    estimatedDuration: pdfMeta.numPages * 5, // rough estimate: 5 mins per page
    requiredEngine: engine,
    requires3D,
    requiresGraph,
    requiresAnimation: requires3D,
    requiresAudio: true, // Accessibility default
    requiresQuiz: true,
    requiresFormula,
    requiresAR: requires3D
  };
}
