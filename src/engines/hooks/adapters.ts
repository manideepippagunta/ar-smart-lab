import { useEffect } from 'react';

export function useQuizAdapter(lessonId: string) {
  useEffect(() => {
    // In the future, this will connect to QuizStore to fetch lesson-specific quizzes
    console.log(`[QuizAdapter] Initialized for lesson ${lessonId}`);
  }, [lessonId]);

  return { activeQuiz: null, triggerQuiz: () => console.log('Quiz triggered') };
}

export function useVoiceAdapter() {
  return {
    speak: (text: string) => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95; // Clear speed for education
        window.speechSynthesis.speak(utterance);
      } else {
        console.log(`[VoiceAdapter] Speaking: ${text}`);
      }
    },
    stop: () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      } else {
        console.log('[VoiceAdapter] Stopped speaking');
      }
    }
  };
}

export function useAIAdapter() {
  return {
    askQuestion: (question: string) => console.log(`[AIAdapter] Asked: ${question}`),
    getHint: () => console.log('[AIAdapter] Hint requested')
  };
}
