import { create } from 'zustand';

interface SettingsState {
  highContrast: boolean;
  largeText: boolean;
  voiceEnabled: boolean;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleVoice: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  highContrast: false,
  largeText: false,
  voiceEnabled: true,
  toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),
  toggleLargeText: () => set((state) => ({ largeText: !state.largeText })),
  toggleVoice: () => set((state) => ({ voiceEnabled: !state.voiceEnabled })),
}));
