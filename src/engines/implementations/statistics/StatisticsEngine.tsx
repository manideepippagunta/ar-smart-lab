import { forwardRef, useEffect } from 'react';
import { BaseEngine } from '../../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../../core/types';
import { useEngineAdapterStore } from '../../core/EngineAdapterStore';
import { useLessonStore } from '../../../store/LessonStore';
import { useVoiceAdapter } from '../../hooks/adapters';
import { useStatisticsStore } from './useStatisticsStore';
import { StatisticsToolbar } from './StatisticsToolbar';
import { StatisticsWorkspace } from './StatisticsWorkspace';
import { ProbabilityWorkspace } from './ProbabilityWorkspace';
import { StatisticsFormulaPanel } from './StatisticsFormulaPanel';
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateRange
} from './statisticsMath';
import { Eye, HelpCircle, Volume2 } from 'lucide-react';

export const StatisticsEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((s) => s.setAdapter);
  const presentationMode = useLessonStore((s) => s.presentationMode);
  const revealLevel = useLessonStore((s) => s.revealLevel);
  const voiceEnabled = useLessonStore((s) => s.voiceEnabled);

  const { speak, stop } = useVoiceAdapter();

  const {
    activeTab,
    dataset,
    probability,
    setActiveTab,
    setChartType,
    setProbabilityType,
    setDataset
  } = useStatisticsStore();

  // Read config from lesson JSON and apply on load
  const config = props.lesson?.engineConfig || {};

  useEffect(() => {
    if (config.tab === 'probability' || props.lesson?.subject === 'Probability' || props.lesson?.engine === 'Probability Engine') {
      setActiveTab('probability');
    }
    if (config.chartType) {
      setChartType(config.chartType as any);
    }
    if (config.probabilityType) {
      setProbabilityType(config.probabilityType as any);
    }
    if (config.initialDataset && Array.isArray(config.initialDataset)) {
      setDataset(config.initialDataset);
    }
  }, [config, props.lesson, setActiveTab, setChartType, setProbabilityType, setDataset]);

  // Voice Narration trigger after dataset or simulation updates
  useEffect(() => {
    if (!voiceEnabled) return;

    if (activeTab === 'statistics') {
      const meanRes = calculateMean(dataset);
      const medianRes = calculateMedian(dataset);
      const modeRes = calculateMode(dataset);
      const text = `In this dataset, the mean is ${meanRes.mean.toFixed(1)}, the median is ${medianRes.median.toFixed(1)}, and the mode is ${modeRes.mode.length > 0 ? modeRes.mode.join(', ') : 'none'}.`;
      speak(text);
    } else if (probability.totalTrials > 0) {
      const outcomeEntries = Object.entries(probability.outcomes);
      const primaryLabel = outcomeEntries.length > 0 ? outcomeEntries[0][0] : 'Event';
      const primaryCount = outcomeEntries.length > 0 ? outcomeEntries[0][1] : 0;
      const rate = ((primaryCount / probability.totalTrials) * 100).toFixed(1);
      const text = `After ${probability.totalTrials} trials, the experimental probability of ${primaryLabel} is ${rate} percent.`;
      speak(text);
    }

    return () => {
      stop();
    };
  }, [dataset, probability.totalTrials, activeTab, voiceEnabled, speak, stop]);

  // Register standard IEngineAdapter adapter triggers for lesson verification
  useEffect(() => {
    setAdapter({
      reset: () => useStatisticsStore.getState().resetAll(),
      getMeasurements: () => ({}),
      getProperties: () => ({}),
      getState: () => ({
        activeTab: useStatisticsStore.getState().activeTab,
        chartType: useStatisticsStore.getState().chartType,
        dataset: useStatisticsStore.getState().dataset,
        probability: useStatisticsStore.getState().probability
      }),
      getProgress: () => 100,
      isCompleted: (validationKey: string) => {
        const state = useStatisticsStore.getState();
        if (validationKey === 'any') return true;
        if (validationKey === 'drag_bar') return state.dataset.some(d => d.value > 60);
        if (validationKey === 'run_100_trials') return state.probability.totalTrials >= 100;
        return true;
      }
    });
  }, [setAdapter]);

  const meanData = calculateMean(dataset);
  const medianData = calculateMedian(dataset);
  const rangeData = calculateRange(dataset);

  return (
    <BaseEngine ref={ref} {...props} surface="html">
      <div className={`w-full h-full flex flex-col bg-slate-950 text-white font-sans ${presentationMode ? 'text-lg' : ''}`}>
        {/* Top Control Bar */}
        <StatisticsToolbar />

        {/* Workspace Center Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          <div className="flex-1 overflow-auto">
            {activeTab === 'statistics' ? <StatisticsWorkspace /> : <ProbabilityWorkspace />}
          </div>

          {/* Right Floating Formula Panel */}
          <div className="p-4 flex justify-end items-start pointer-events-auto">
            <StatisticsFormulaPanel presentationMode={presentationMode} />
          </div>
        </div>

        {/* Teacher Mode Solution & Reveal Overlays */}
        {revealLevel > 0 && (
          <div className="bg-slate-900/95 border-t border-amber-500/30 p-4 px-6 flex items-center justify-between shadow-2xl z-30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                {revealLevel === 3 ? <Eye size={18} /> : <HelpCircle size={18} />}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {revealLevel === 1 ? 'Hint 1' : revealLevel === 2 ? 'Hint 2' : 'Answer Solution'}
                </span>
                <p className="text-sm font-semibold text-slate-200 mt-0.5">
                  {revealLevel === 1 && 'Drag the bars or edit values in the table to observe how Mean and Median shift.'}
                  {revealLevel === 2 && 'Run batch trials (+100 or +1000) to see Experimental Probability converge toward Theoretical Probability.'}
                  {revealLevel === 3 && (
                    <span>
                      Mean = <strong className="text-white">{meanData.mean.toFixed(2)}</strong> | Median = <strong className="text-white">{medianData.median.toFixed(2)}</strong> | Range = <strong className="text-white">{rangeData.range}</strong>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {voiceEnabled && (
              <button
                onClick={() => speak(`Hint: ${revealLevel === 3 ? 'Full answer revealed.' : 'Observe statistical formulas.'}`)}
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

StatisticsEngine.displayName = 'StatisticsEngine';
export default StatisticsEngine;
