import { forwardRef, useEffect } from 'react';
import { BaseEngine } from '../../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../../core/types';
import { useEngineAdapterStore } from '../../core/EngineAdapterStore';
import { useLessonStore } from '../../../store/LessonStore';
import { useVoiceAdapter } from '../../hooks/adapters';
import { useMensurationStore } from './useMensurationStore';
import { MensurationToolbar } from './MensurationToolbar';
import { MensurationCanvas2D } from './MensurationCanvas2D';
import { MensurationCanvas3D } from './MensurationCanvas3D';
import { MensurationControls } from './MensurationControls';
import { MensurationFormulaPanel } from './MensurationFormulaPanel';
import { calculateMensuration } from './mensurationMath';
import { Eye, HelpCircle, Volume2 } from 'lucide-react';

export const MensurationEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((s) => s.setAdapter);
  const presentationMode = useLessonStore((s) => s.presentationMode);
  const revealLevel = useLessonStore((s) => s.revealLevel);
  const voiceEnabled = useLessonStore((s) => s.voiceEnabled);

  const { speak, stop } = useVoiceAdapter();

  const {
    activeShape,
    params,
    setShape,
    setParams,
    resetParams
  } = useMensurationStore();

  const is3D = ['cube', 'cuboid', 'cylinder', 'cone', 'sphere', 'prism', 'pyramid'].includes(activeShape);

  // Read config from lesson JSON and apply on load
  const config = props.lesson?.engineConfig || {};

  useEffect(() => {
    if (config.shape) {
      setShape(config.shape as any);
    } else if (props.lesson?.engine === 'Cube Engine') setShape('cube');
    else if (props.lesson?.engine === 'Cuboid Engine') setShape('cuboid');
    else if (props.lesson?.engine === 'Cylinder Engine') setShape('cylinder');
    else if (props.lesson?.engine === 'Cone Engine') setShape('cone');
    else if (props.lesson?.engine === 'Sphere Engine') setShape('sphere');
    else if (props.lesson?.engine === 'Circle Engine') setShape('circle');

    if (config.initialParams) {
      setParams(config.initialParams);
    }
  }, [config, props.lesson, setShape, setParams]);

  // Voice Narration trigger on parameter / shape change
  useEffect(() => {
    if (!voiceEnabled) return;

    const { summaryText } = calculateMensuration(activeShape, params);
    speak(summaryText);

    return () => {
      stop();
    };
  }, [activeShape, params, voiceEnabled, speak, stop]);

  // Register standard IEngineAdapter adapter triggers for lesson verification
  useEffect(() => {
    setAdapter({
      reset: () => resetParams(),
      getMeasurements: () => ({ ...params }),
      getProperties: () => ({ shape: activeShape }),
      getState: () => ({
        activeShape: useMensurationStore.getState().activeShape,
        params: useMensurationStore.getState().params
      }),
      getProgress: () => 100,
      isCompleted: (validationKey: string) => {
        const state = useMensurationStore.getState();
        if (validationKey === 'any') return true;
        if (validationKey === 'adjust_slider') return state.params.length > 8 || state.params.radius > 5;
        return true;
      }
    });
  }, [setAdapter, resetParams, params, activeShape]);

  const { steps } = calculateMensuration(activeShape, params);

  return (
    <BaseEngine ref={ref} {...props} surface={is3D ? 'threejs' : 'html'}>
      {is3D ? (
        <>
          <MensurationCanvas3D />
          {/* Overlay UI over 3D Canvas */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 p-2">
            <div className="pointer-events-auto">
              <MensurationToolbar />
            </div>
            <div className="flex-1 flex flex-col md:flex-row justify-between items-end p-4 pointer-events-none gap-4">
              <div className="pointer-events-auto">
                <MensurationControls />
              </div>
              <div className="pointer-events-auto">
                <MensurationFormulaPanel presentationMode={presentationMode} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`w-full h-full flex flex-col bg-slate-950 text-white font-sans ${presentationMode ? 'text-lg' : ''}`}>
          <MensurationToolbar />

          <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-auto relative">
            <div className="flex-1 flex items-center justify-center">
              <MensurationCanvas2D />
            </div>
            <div className="flex flex-col gap-4">
              <MensurationControls />
              <MensurationFormulaPanel presentationMode={presentationMode} />
            </div>
          </div>
        </div>
      )}

      {/* Teacher Mode Solution & Reveal Overlays */}
      {revealLevel > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 border-t border-amber-500/30 p-4 px-6 flex items-center justify-between shadow-2xl z-30 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              {revealLevel === 3 ? <Eye size={18} /> : <HelpCircle size={18} />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {revealLevel === 1 ? 'Hint 1' : revealLevel === 2 ? 'Hint 2' : 'Answer Solution'}
              </span>
              <p className="text-sm font-semibold text-slate-200 mt-0.5">
                {revealLevel === 1 && 'Adjust the sliders to see how parameters scale the calculated Area, Perimeter or Volume.'}
                {revealLevel === 2 && 'Review the KaTeX Formula Panel for step-by-step substitution and calculations.'}
                {revealLevel === 3 && steps.length > 0 && (
                  <span>
                    Final Solution: <strong className="text-emerald-400 font-mono">{steps[0].label}</strong> $\rightarrow$ <strong className="text-white font-mono">{steps[0].answer}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          {voiceEnabled && (
            <button
              onClick={() => speak(`Hint: ${revealLevel === 3 ? 'Full mensuration formula solved.' : 'Review shape sliders.'}`)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
              title="Speak Hint"
            >
              <Volume2 size={16} />
            </button>
          )}
        </div>
      )}
    </BaseEngine>
  );
});

MensurationEngine.displayName = 'MensurationEngine';
export default MensurationEngine;
