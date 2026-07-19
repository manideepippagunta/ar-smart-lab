import { create } from 'zustand';

export type ThemeMode = 'light';

interface ThemeState {
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const applyThemeToDOM = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('dark');
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ar_smart_lab_theme');
  }
};

// Always apply light theme on load
applyThemeToDOM();

export const useThemeStore = create<ThemeState>(() => ({
  themeMode: 'light',
  isDark: false,
  setThemeMode: (_mode: ThemeMode) => { /* light only — no-op */ },
  toggleTheme: () => { /* light only — no-op */ },
}));
