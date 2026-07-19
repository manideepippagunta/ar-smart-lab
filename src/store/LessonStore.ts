import { create } from 'zustand';
import type { FullLessonExperience } from '../types/lesson';
import { StorageService } from '../services/StorageService';

interface LessonState {
  currentLessonId: string | null;
  currentLesson: FullLessonExperience | null;
  activeStep: number;
  materialsLoaded: boolean;
  lessons: Record<string, FullLessonExperience>;
  
  // Teacher Mode Settings
  teacherMode: boolean;
  presentationMode: boolean;
  revealLevel: number; // 0 = none, 1 = hint 1, 2 = hint 2, 3 = answer
  animationPaused: boolean;
  voiceEnabled: boolean;
  bookmarks: Record<string, { isFavorite: boolean; collections: string[] }>;
  teacherNotes: Record<string, string>;

  // Actions
  setLesson: (lesson: FullLessonExperience | null) => void;
  setCurrentLesson: (id: string) => void;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setMaterialsLoaded: (loaded: boolean) => void;
  discoverLessons: () => void;
  
  // Teacher Actions
  setTeacherMode: (enabled: boolean) => void;
  setPresentationMode: (enabled: boolean) => void;
  setRevealLevel: (level: number) => void;
  toggleAnimationPause: () => void;
  toggleVoiceEnabled: () => void;
  toggleFavorite: (lessonId: string) => void;
  addCollection: (lessonId: string, collection: string) => void;
  saveTeacherNote: (lessonId: string, note: string) => void;
  resetProgress: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  currentLessonId: null,
  currentLesson: null,
  activeStep: 0,
  materialsLoaded: false,
  lessons: {},

  // Load initial teacher data from StorageService
  teacherMode: StorageService.getItem('teacherMode', false),
  presentationMode: StorageService.getItem('presentationMode', false),
  revealLevel: 0,
  animationPaused: false,
  voiceEnabled: true,
  bookmarks: StorageService.getItem('bookmarks', {}),
  teacherNotes: StorageService.getItem('teacherNotes', {}),

  setLesson: (lesson) => set({ currentLesson: lesson }),
  
  setCurrentLesson: (id) => {
    const { lessons } = get();
    const lesson = lessons[id] || null;
    set({ currentLessonId: id, currentLesson: lesson, activeStep: 0, materialsLoaded: false, revealLevel: 0 });
  },
  
  setStep: (step) => set({ activeStep: step }),
  nextStep: () => set((state) => ({ activeStep: state.activeStep + 1 })),
  prevStep: () => set((state) => ({ activeStep: Math.max(0, state.activeStep - 1) })),
  setMaterialsLoaded: (loaded) => set({ materialsLoaded: loaded }),
  
  // Teacher Actions
  setTeacherMode: (enabled) => {
    StorageService.setItem('teacherMode', enabled);
    set({ teacherMode: enabled });
  },
  
  setPresentationMode: (enabled) => {
    StorageService.setItem('presentationMode', enabled);
    set({ presentationMode: enabled });
  },
  
  setRevealLevel: (level) => set({ revealLevel: level }),
  
  toggleAnimationPause: () => set(s => ({ animationPaused: !s.animationPaused })),
  
  toggleVoiceEnabled: () => set(s => ({ voiceEnabled: !s.voiceEnabled })),

  toggleFavorite: (lessonId) => set(s => {
    const entry = s.bookmarks[lessonId] || { isFavorite: false, collections: [] };
    const nextBookmarks = {
      ...s.bookmarks,
      [lessonId]: { ...entry, isFavorite: !entry.isFavorite }
    };
    StorageService.setItem('bookmarks', nextBookmarks);
    return { bookmarks: nextBookmarks };
  }),

  addCollection: (lessonId, collection) => set(s => {
    const entry = s.bookmarks[lessonId] || { isFavorite: false, collections: [] };
    if (!entry.collections.includes(collection)) {
      const nextBookmarks = {
        ...s.bookmarks,
        [lessonId]: { ...entry, collections: [...entry.collections, collection] }
      };
      StorageService.setItem('bookmarks', nextBookmarks);
      return { bookmarks: nextBookmarks };
    }
    return {};
  }),

  saveTeacherNote: (lessonId, note) => set(s => {
    const nextNotes = { ...s.teacherNotes, [lessonId]: note };
    StorageService.setItem('teacherNotes', nextNotes);
    return { teacherNotes: nextNotes };
  }),

  resetProgress: () => set({
    activeStep: 0,
    revealLevel: 0,
    animationPaused: false
  }),

  discoverLessons: () => {
    const modules = import.meta.glob('../../Data/json/**/*.json', { eager: true });
    const grouped: Record<string, Record<string, any>> = {};
    
    for (const filePath in modules) {
      const match = filePath.match(/\/json\/([^/]+)\/(class-\d+|unknown-class)\/([^/]+)\/([^/]+)\.json$/);
      if (match) {
        const rawSubject = match[1];
        const classId = match[2];
        const slug = match[3];
        const fileName = match[4];
        
        const subject = rawSubject === 'mathematics' ? 'Mathematics' : rawSubject.replace(/\b\w/g, c => c.toUpperCase());
        const groupKey = `${subject}/${classId}/${slug}`;
        if (!grouped[groupKey]) {
          grouped[groupKey] = {};
        }
        
        grouped[groupKey][fileName] = (modules[filePath] as any).default || modules[filePath];
      }
    }
    
    const discoveredLessons: Record<string, FullLessonExperience> = {};
    
    for (const groupKey in grouped) {
      const parts = groupKey.split('/');
      const subject = parts[0];
      const classId = parts[1];
      const slug = parts[2];
      const id = `${subject}-${classId}-${slug}`;
      
      const files = grouped[groupKey];
      const lessonJson = files['lesson'] || {};
      const quizJson = files['quiz'] || {};
      const metadataJson = files['metadata'] || {};
      
      const fullLesson: FullLessonExperience = {
        id,
        title: lessonJson.title || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        subject,
        classId,
        engine: metadataJson.requiredEngine || lessonJson.engine || 'Interactive Engine',
        steps: {
          intro: {
            duration: `${metadataJson.estimatedDuration || 15} Mins`,
            difficulty: 'Beginner',
            learningOutcomes: lessonJson.learningOutcomes || ['Understand the basic concept.'],
            materials: lessonJson.materials || ['Digital Lab Toolkit']
          },
          objectives: {
            checklist: lessonJson.objectives || [
              { id: 'obj1', text: 'Complete the visual tasks.' }
            ]
          },
          theory: {
            content: lessonJson.theory || 'Learn about this math concept.',
            formulae: lessonJson.formulae || []
          },
          exploration: {
            hints: lessonJson.hints || ['Drag elements in the 3D viewer to explore.']
          },
          guidedActivity: {
            tasks: lessonJson.tasks || [
              { id: 'task1', instruction: 'Interact with the engine.', validationKey: 'any' }
            ]
          },
          observation: {
            prompts: lessonJson.observationPrompts || ['What observations did you make?']
          },
          realWorld: {
            examples: lessonJson.realWorldExamples || [
              { title: 'Real World Use', description: 'This concept is used globally.' }
            ]
          },
          practice: {
            exercises: lessonJson.practiceExercises || []
          },
          quiz: {
            questions: quizJson.questions || [
              { id: 'q1', type: 'mcq', question: 'Default sample question?', options: ['Yes', 'No'], correctAnswer: 'Yes' }
            ]
          },
          summary: {
            keyConcepts: lessonJson.keyConcepts || ['Basic properties.'],
            commonMistakes: lessonJson.commonMistakes || ['Incorrect values.']
          }
        }
      };
      
      // Forward engineConfig from lesson.json (used by engines like AlgebraEngine)
      if (lessonJson.engineConfig) {
        fullLesson.engineConfig = lessonJson.engineConfig;
      }
      
      discoveredLessons[id] = fullLesson;
    }
    
    set({ lessons: discoveredLessons });
  }
}));
