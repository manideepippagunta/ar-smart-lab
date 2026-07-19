export interface PDFMetadata {
  fileName: string;
  absolutePath: string;
  relativePath: string;
  subject: string;
  classLevel: string;
  chapter: string;
  unit: string;
  activity: string;
  experiment: string;
  lessonTitle: string;
  numPages: number;
  language: string;
  hasImages: boolean;
  hasDiagrams: boolean;
  hasFormulae: boolean;
  hasTables: boolean;
  keywords: string[];
  topicsCovered: string[];
  // Derived metadata
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  activitiesList: LessonObject[];
  formulaTypes: string[];
}

export interface LessonObject {
  id: string; // unique identifier
  title: string; // The extracted lesson title
  subject: string;
  classLevel: string;
  chapter: string;
  unit: string;
  activityTitle: string; // e.g. "Construction of a Triangle"
  activityType: string; // e.g. "Activity 4", "Experiment 2"
  objective: string;
  materials: string;
  procedure: string;
  observation: string;
  discussion: string;
  keywords: string[];
  interactiveEngine: string;
}

export interface ActivityMap {
  activityName: string;
  activityTitle: string;
  lessonTitle: string;
  subject: string;
  classLevel: string;
  chapter: string;
  requiredEngine: string;
}

export interface IndexCache {
  [filePath: string]: {
    hash: string;
    lastModified: number;
    metadata: PDFMetadata;
  }
}

export interface LessonMetadata {
  estimatedDuration: number;
  requiredEngine: string;
  requires3D: boolean;
  requiresGraph: boolean;
  requiresAnimation: boolean;
  requiresAudio: boolean;
  requiresQuiz: boolean;
  requiresFormula: boolean;
  requiresAR: boolean;
}
