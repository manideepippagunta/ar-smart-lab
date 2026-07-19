export interface FullLessonExperience {
  id: string;
  title: string;
  subject: string;
  classId: string;
  engine: string;

  /** Engine configuration passed directly to the interactive engine component */
  engineConfig?: Record<string, unknown>;
  
  steps: {
    intro: {
      duration: string;
      difficulty: string;
      learningOutcomes: string[];
      materials: string[];
    };
    objectives: {
      checklist: { id: string; text: string }[];
    };
    theory: {
      content: string; // markdown or rich text
      formulae: string[]; // latex
    };
    exploration: {
      hints: string[];
    };
    guidedActivity: {
      tasks: {
        id: string;
        instruction: string;
        validationKey: string; // evaluated by the Engine Adapter
      }[];
    };
    observation: {
      prompts: string[];
    };
    realWorld: {
      examples: { title: string; image?: string; description: string }[];
    };
    practice: {
      exercises: unknown[];
    };
    quiz: {
      questions: {
        id: string;
        type: 'mcq' | 'interactive';
        question: string;
        options?: string[];
        correctAnswer: string | number;
      }[];
    };
    summary: {
      keyConcepts: string[];
      commonMistakes: string[];
    };
  }
}

// Global state extension for LessonStore
export interface LessonExperienceState {
  currentStepIndex: number;
  completedSteps: Record<number, boolean>;
  teacherMode: boolean;
  highContrast: boolean;
  largeText: boolean;
}
