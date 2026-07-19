import { create } from 'zustand';

interface ProgressState {
  xp: number;
  level: number;
  completedLessons: string[];
  achievements: string[];
  addXp: (amount: number) => void;
  markLessonComplete: (lessonId: string) => void;
  addAchievement: (achievementId: string) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  xp: 0,
  level: 1,
  completedLessons: [],
  achievements: [],
  addXp: (amount) => set((state) => ({ xp: state.xp + amount, level: Math.floor((state.xp + amount) / 1000) + 1 })),
  markLessonComplete: (lessonId) => set((state) => ({ completedLessons: [...new Set([...state.completedLessons, lessonId])] })),
  addAchievement: (achievementId) => set((state) => ({ achievements: [...new Set([...state.achievements, achievementId])] })),
}));
