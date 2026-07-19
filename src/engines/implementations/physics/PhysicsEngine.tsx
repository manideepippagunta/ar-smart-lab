import { forwardRef, useEffect } from 'react';
import { BaseEngine } from '../../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../../core/types';
import { useEngineAdapterStore } from '../../core/EngineAdapterStore';
import { useLessonStore } from '../../../store/LessonStore';
import { useVoiceAdapter } from '../../hooks/adapters';
import { usePhysicsStore } from './usePhysicsStore';
import { PhysicsToolbar } from './PhysicsToolbar';
import { MechanicsWorkspace } from './MechanicsWorkspace';
import { OpticsWorkspace } from './OpticsWorkspace';
import { CircuitWorkspace } from './CircuitWorkspace';
import { MagnetismWorkspace } from './MagnetismWorkspace';
import { PhysicsControls } from './PhysicsControls';
import { PhysicsFormulaPanel } from './PhysicsFormulaPanel';
import { calculatePhysics } from './physicsMath';
import { Eye, HelpCircle, Volume2 } from 'lucide-react';

export const PhysicsEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((s) => s.setAdapter);
  const presentationMode = useLessonStore((s) => s.presentationMode);
  const revealLevel = useLessonStore((s) => s.revealLevel);
  const voiceEnabled = useLessonStore((s) => s.voiceEnabled);

  const { speak, stop } = useVoiceAdapter();

  const {
    activeTopic,
    params,
    simTime,
    setTopic,
    setParams,
    resetAll
  } = usePhysicsStore();

  const is3D = activeTopic === 'motion' || activeTopic === 'force_laws' || activeTopic === 'work_energy';

  // Read config from lesson JSON and apply on load
  const config = props.lesson?.engineConfig || {};

  useEffect(() => {
    if (config.topic) {
      setTopic(config.topic as any);
    } else if (props.lesson?.engine === 'Light Engine') setTopic('optics');
    else if (props.lesson?.engine === 'Electric Circuit Engine') setTopic('circuits');
    else if (props.lesson?.engine === 'Magnetism Engine') setTopic('magnetism');

    if (config.initialParams) {
      setParams(config.initialParams);
    }
  }, [config, props.lesson, setTopic, setParams]);

  // Voice Narration trigger on topic or parameter change
  useEffect(() => {
    if (!voiceEnabled) return;

    const { summaryText } = calculatePhysics(activeTopic, params, simTime > 0 ? simTime : 2);
    speak(summaryText);

    return () => {
      stop();
    };
  }, [activeTopic, params, simTime, voiceEnabled, speak, stop]);

  // Register standard IEngineAdapter adapter triggers for lesson verification
  useEffect(() => {
    setAdapter({
      reset: () => resetAll(),
      getMeasurements: () => ({ ...params }),
      getProperties: () => ({ topic: activeTopic }),
      getState: () => ({
        activeTopic: usePhysicsStore.getState().activeTopic,
        params: usePhysicsStore.getState().params,
        simTime: usePhysicsStore.getState().simTime
      }),
      getProgress: () => 100,
      isCompleted: (validationKey: string) => {
        const state = usePhysicsStore.getState();
        if (validationKey === 'any') return true;
        if (validationKey === 'adjust_slider') return state.params.force > 30 || state.params.voltage > 15;
        if (validationKey === 'toggle_switch') return state.params.switchClosed;
        return true;
      }
    });
  }, [setAdapter, resetAll, params, activeTopic]);

  const { steps } = calculatePhysics(activeTopic, params, simTime > 0 ? simTime : 2);

  return (
    <BaseEngine ref={ref} {...props} surface={is3D ? 'threejs' : 'html'}>
      {is3D ? (
        <>
          <MechanicsWorkspace />
          {/* Overlay UI over 3D Canvas */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-10 p-2">
            <div className="pointer-events-auto">
              <PhysicsToolbar />
            </div>
            <div className="flex-1 flex flex-col md:flex-row justify-between items-end p-4 pointer-events-none gap-4">
              <div className="pointer-events-auto">
                <PhysicsControls />
              </div>
              <div className="pointer-events-auto">
                <PhysicsFormulaPanel presentationMode={presentationMode} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={`w-full h-full flex flex-col bg-slate-950 text-white font-sans ${presentationMode ? 'text-lg' : ''}`}>
          <PhysicsToolbar />

          <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-auto relative">
            <div className="flex-1 flex items-center justify-center">
              {activeTopic === 'optics' && <OpticsWorkspace />}
              {activeTopic === 'circuits' && <CircuitWorkspace />}
              {activeTopic === 'magnetism' && <MagnetismWorkspace />}
            </div>
            <div className="flex flex-col gap-4">
              <PhysicsControls />
              <PhysicsFormulaPanel presentationMode={presentationMode} />
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
                {revealLevel === 1 && 'Adjust the parameter sliders to observe vector arrows, ray angles, or electric current flow.'}
                {revealLevel === 2 && 'Review the KaTeX Formula Panel for step-by-step physical law substitutions.'}
                {revealLevel === 3 && steps.length > 0 && (
                  <span>
                    Physics Solution: <strong className="text-emerald-400 font-mono">{steps[0].label}</strong> $\rightarrow$ <strong className="text-white font-mono">{steps[0].answer}</strong>
                  </span>
                )}
              </p>
            </div>
          </div>

          {voiceEnabled && (
            <button
              onClick={() => speak(`Hint: ${revealLevel === 3 ? 'Full physics formula solved.' : 'Review parameter sliders.'}`)}
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

PhysicsEngine.displayName = 'PhysicsEngine';
export default PhysicsEngine;
