import { create } from 'zustand';

interface VoiceState {
  isSpeaking: boolean;
  currentText: string | null;
  speak: (text: string) => void;
  stop: () => void;
}

export const useVoiceStore = create<VoiceState>((set) => ({
  isSpeaking: false,
  currentText: null,
  speak: (text) => {
    // Web Speech API integration placeholder
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => set({ isSpeaking: false, currentText: null });
      window.speechSynthesis.speak(utterance);
      set({ isSpeaking: true, currentText: text });
    }
  },
  stop: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    set({ isSpeaking: false, currentText: null });
  }
}));
