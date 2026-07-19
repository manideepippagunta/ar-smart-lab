import { forwardRef, useEffect } from 'react';
import { BaseEngine } from '../../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../../core/types';
import { useEngineAdapterStore } from '../../core/EngineAdapterStore';
import { useLessonStore } from '../../../store/LessonStore';
import { useVoiceAdapter } from '../../hooks/adapters';
import { useChemistryStore } from './useChemistryStore';
import { ChemistryToolbar } from './ChemistryToolbar';
import { BohrAtomWorkspace } from './BohrAtomWorkspace';
import { PeriodicTableWorkspace } from './PeriodicTableWorkspace';
import { ReactionsWorkspace } from './ReactionsWorkspace';
import { BalancingWorkspace } from './BalancingWorkspace';
import { PhScaleWorkspace } from './PhScaleWorkspace';
import { ChemistryControls } from './ChemistryControls';
import { ChemistryFormulaPanel } from './ChemistryFormulaPanel';
import { calculateChemistry } from './chemistryMath';
import { Eye, HelpCircle, Volume2 } from 'lucide-react';

export const ChemistryEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((s) => s.setAdapter);
  const presentationMode = useLessonStore((s) => s.presentationMode);
  const revealLevel = useLessonStore((s) => s.revealLevel);
  const voiceEnabled = useLessonStore((s) => s.voiceEnabled);

  const { speak, stop } = useVoiceAdapter();

  const {
    activeTopic,
    params,
    setTopic,
    setParams,
    resetAll
  } = useChemistryStore();

  // Read config from lesson JSON and apply on load
  const config = props.lesson?.engineConfig || {};

  useEffect(() => {
    if (config.topic) {
      setTopic(config.topic as any);
    } else if (props.lesson?.engine === 'Periodic Table Engine') setTopic('periodic_table');
    else if (props.lesson?.engine === 'Molecule Engine' || props.lesson?.engine === 'Chemical Reaction Engine') setTopic('reactions');

    if (config.initialParams) {
      setParams(config.initialParams);
    }
  }, [config, props.lesson, setTopic, setParams]);

  // Voice Narration trigger on topic or parameter change
  useEffect(() => {
    if (!voiceEnabled) return;

    const { summaryText } = calculateChemistry(activeTopic, params);
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
        activeTopic: useChemistryStore.getState().activeTopic,
        params: useChemistryStore.getState().params
      }),
      getProgress: () => 100,
      isCompleted: (validationKey: string) => {
        const state = useChemistryStore.getState();
        if (validationKey === 'any') return true;
        if (validationKey === 'balance_equation') {
          return state.params.coefA * 2 === state.params.coefC * 2 && state.params.coefB * 2 === state.params.coefC * 1;
        }
        if (validationKey === 'select_element') return state.params.atomicNumber > 1;
        if (validationKey === 'adjust_ph') return state.params.phValue !== 7.0;
        return true;
      }
    });
  }, [setAdapter, resetAll, params, activeTopic]);

  const { steps } = calculateChemistry(activeTopic, params);

  return (
    <BaseEngine ref={ref} {...props} surface="html">
      <div className={`w-full h-full flex flex-col bg-slate-950 text-white font-sans ${presentationMode ? 'text-lg' : ''}`}>
        <ChemistryToolbar />

        <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-auto relative">
          <div className="flex-1 flex items-center justify-center">
            {activeTopic === 'atom_structure' && <BohrAtomWorkspace />}
            {activeTopic === 'periodic_table' && <PeriodicTableWorkspace />}
            {activeTopic === 'reactions' && <ReactionsWorkspace />}
            {activeTopic === 'balancing' && <BalancingWorkspace />}
            {activeTopic === 'acids_bases' && <PhScaleWorkspace />}
          </div>
          <div className="flex flex-col gap-4">
            <ChemistryControls />
            <ChemistryFormulaPanel presentationMode={presentationMode} />
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
                  {revealLevel === 1 && 'Adjust parameter sliders or equation coefficients to observe chemical properties.'}
                  {revealLevel === 2 && 'Review the KaTeX Formula Panel for step-by-step electronic shell or pH concentration equations.'}
                  {revealLevel === 3 && steps.length > 0 && (
                    <span>
                      Chemistry Solution: <strong className="text-emerald-400 font-mono">{steps[0].label}</strong> $\rightarrow$ <strong className="text-white font-mono">{steps[0].answer}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {voiceEnabled && (
              <button
                onClick={() => speak(`Hint: ${revealLevel === 3 ? 'Full chemical equation solved.' : 'Review electron configurations.'}`)}
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

ChemistryEngine.displayName = 'ChemistryEngine';
export default ChemistryEngine;
