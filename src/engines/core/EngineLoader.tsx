import React, { useRef } from 'react';
import { EngineFactory } from './EngineFactory';
import type { EngineImperativeAPI } from './types';
import { useLessonStore } from '../../store/LessonStore';
import { useThemeStore } from '../../store/ThemeStore';
import { useSettingsStore } from '../../store/SettingsStore';
import { useVoiceStore } from '../../store/VoiceStore';

export const EngineLoader: React.FC = () => {
  const engineRef = useRef<EngineImperativeAPI>(null);
  
  const currentLesson = useLessonStore((state) => state.currentLesson);
  const themeState = useThemeStore();
  const settingsState = useSettingsStore();
  const voiceState = useVoiceStore((state) => state);
  
  // Mock Quiz and AI adapters since their stores might not be fully built yet
  const quiz = { active: false, score: 0 };
  const aiContext = { active: true, context: 'lesson-started' };

  if (!currentLesson) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
        No lesson selected.
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <EngineFactory
        ref={engineRef}
        engineName={currentLesson.engine || 'Interactive Engine'}
        lesson={currentLesson}
        theme={themeState}
        settings={settingsState}
        voice={voiceState}
        quiz={quiz}
        aiContext={aiContext}
      />
      
      {/* Example Toolbar calling imperative methods */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-4 bg-slate-800/90 backdrop-blur px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
        <button 
          onClick={() => engineRef.current?.reset()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Reset Scene
        </button>
        <button 
          onClick={() => {
            const data = engineRef.current?.export();
            console.log('Exported State:', data);
          }}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Export State
        </button>
      </div>
    </div>
  );
};

export default EngineLoader;
