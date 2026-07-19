import { forwardRef, useEffect } from 'react';
import { BaseEngine } from '../../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../../core/types';
import { useEngineAdapterStore } from '../../core/EngineAdapterStore';
import { useLessonStore } from '../../../store/LessonStore';
import { useVoiceAdapter } from '../../hooks/adapters';
import { useBiologyStore } from './useBiologyStore';
import { BiologyToolbar } from './BiologyToolbar';
import { CellWorkspace } from './CellWorkspace';
import { AnatomyWorkspace } from './AnatomyWorkspace';
import { PhotosynthesisWorkspace } from './PhotosynthesisWorkspace';
import { EcosystemWorkspace } from './EcosystemWorkspace';
import { LabelingWorkspace } from './LabelingWorkspace';
import { BiologyControls } from './BiologyControls';
import { BiologyFormulaPanel } from './BiologyFormulaPanel';
import { calculateBiology } from './biologyMath';
import { Eye, HelpCircle, Volume2 } from 'lucide-react';

export const BiologyEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((s) => s.setAdapter);
  const presentationMode = useLessonStore((s) => s.presentationMode);
  const revealLevel = useLessonStore((s) => s.revealLevel);
  const voiceEnabled = useLessonStore((s) => s.voiceEnabled);

  const { speak, stop } = useVoiceAdapter();

  const {
    activeTopic,
    params,
    setTopic,
    setCellType,
    setSystemType,
    updateParam,
    resetAll
  } = useBiologyStore();

  // Read config from lesson JSON and apply on load
  const config = props.lesson?.engineConfig || {};

  useEffect(() => {
    if (config.topic) {
      setTopic(config.topic as any);
    } else if (props.lesson?.engine === 'Plant Cell Engine') {
      setTopic('cell_structure');
      setCellType('plant');
    } else if (props.lesson?.engine === 'Animal Cell Engine') {
      setTopic('cell_structure');
      setCellType('animal');
    } else if (props.lesson?.engine === 'Anatomy Engine') {
      setTopic('anatomy');
      if (config.systemType) setSystemType(config.systemType);
    }

    if (config.initialParams) {
      Object.entries(config.initialParams).forEach(([k, v]) => updateParam(k as any, v));
    }
  }, [config, props.lesson, setTopic, setCellType, setSystemType, updateParam]);

  // Voice Narration trigger on topic or parameter change
  useEffect(() => {
    if (!voiceEnabled) return;

    const { summaryText } = calculateBiology(activeTopic, params);
    speak(summaryText);

    return () => {
      stop();
    };
  }, [activeTopic, params, voiceEnabled, speak, stop]);

  // Register standard IEngineAdapter adapter triggers for lesson verification
  useEffect(() => {
    setAdapter({
      reset: () => resetAll(),
      getMeasurements: () => ({ ...params }),
      getProperties: () => ({ topic: activeTopic }),
      getState: () => ({
        activeTopic: useBiologyStore.getState().activeTopic,
        params: useBiologyStore.getState().params
      }),
      getProgress: () => 100,
      isCompleted: (validationKey: string) => {
        const state = useBiologyStore.getState();
        if (validationKey === 'any') return true;
        if (validationKey === 'select_organelle') return !!state.params.selectedOrganelle;
        if (validationKey === 'adjust_sunlight') return state.params.sunlightIntensity > 50;
        return true;
      }
    });
  }, [setAdapter, resetAll, params, activeTopic]);

  const { steps } = calculateBiology(activeTopic, params);

  return (
    <BaseEngine ref={ref} {...props} surface="html">
      <div className={`w-full h-full flex flex-col bg-slate-950 text-white font-sans ${presentationMode ? 'text-lg' : ''}`}>
        <BiologyToolbar />

        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-auto relative">
          <div className="flex-1 flex items-center justify-center">
            {activeTopic === 'cell_structure' && <CellWorkspace />}
            {activeTopic === 'anatomy' && <AnatomyWorkspace />}
            {activeTopic === 'photosynthesis' && <PhotosynthesisWorkspace />}
            {activeTopic === 'ecosystem' && <EcosystemWorkspace />}
            {activeTopic === 'labeling' && <LabelingWorkspace />}
          </div>
          <div className="flex flex-col gap-4">
            <BiologyControls />
            <BiologyFormulaPanel presentationMode={presentationMode} />
          </div>
        </div>

        {/* Teacher Mode Solution & Reveal Overlays */}
        {revealLevel > 0 && (
          <div className="bg-slate-900/95 border-t border-amber-500/30 p-4 px-6 flex items-center justify-between shadow-2xl z-30 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                {revealLevel === 3 ? <Eye size={18} /> : <HelpCircle size={18} />}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {revealLevel === 1 ? 'Hint 1' : revealLevel === 2 ? 'Hint 2' : 'Answer Solution'}
                </span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">
                  {revealLevel === 1 && 'Click organelles or toggle between Plant and Animal cells to observe functional differences.'}
                  {revealLevel === 2 && 'Review the KaTeX Formula Panel for step-by-step Photosynthesis reactions and 10% Trophic Energy Transfer calculations.'}
                  {revealLevel === 3 && steps.length > 0 && (
                    <span>
                      Biology Solution: <strong className="text-emerald-400 font-mono">{steps[0].label}</strong> $\rightarrow$ <strong className="text-white font-mono">{steps[0].answer}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {voiceEnabled && (
              <button
                onClick={() => speak(`Hint: ${revealLevel === 3 ? 'Full biological process solved.' : 'Review organelle functions.'}`)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                title="Speak Hint"
              >
                <Volume2 size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </BaseEngine>
  );
});

BiologyEngine.displayName = 'BiologyEngine';
export default BiologyEngine;
