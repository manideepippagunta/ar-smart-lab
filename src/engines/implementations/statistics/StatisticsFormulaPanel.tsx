import React from 'react';
import { useStatisticsStore } from './useStatisticsStore';
import {
  calculateMean,
  calculateMedian,
  calculateMode,
  calculateRange,
  calculateProbabilityStats
} from './statisticsMath';
import { BlockMath } from 'react-katex';

interface StatisticsFormulaPanelProps {
  presentationMode?: boolean;
}

export const StatisticsFormulaPanel: React.FC<StatisticsFormulaPanelProps> = ({ presentationMode = false }) => {
  const { activeTab, dataset, probability, probabilityType } = useStatisticsStore();

  let steps = [];

  if (activeTab === 'statistics') {
    const meanResult = calculateMean(dataset);
    const medianResult = calculateMedian(dataset);
    const modeResult = calculateMode(dataset);
    const rangeResult = calculateRange(dataset);

    steps = [
      meanResult.step,
      medianResult.step,
      modeResult.step,
      rangeResult.step
    ];
  } else {
    const outcomeEntries = Object.entries(probability.outcomes);
    const primaryLabel = outcomeEntries.length > 0 ? outcomeEntries[0][0] : 'Event';
    const primaryObserved = outcomeEntries.length > 0 ? outcomeEntries[0][1] : 0;
    const theoreticalRate = probabilityType === 'coin' ? 0.5 
      : probabilityType === 'dice' ? 1 / 6 
      : 0.25;

    const probRes = calculateProbabilityStats(
      primaryLabel,
      primaryObserved,
      probability.totalTrials,
      theoreticalRate
    );

    steps = probRes.steps;
  }

  if (steps.length === 0) return null;

  return (
    <div className={`w-full max-w-md bg-slate-900/90 backdrop-blur rounded-2xl border border-slate-800 p-4 shadow-2xl ${presentationMode ? 'scale-105 border-blue-500/40' : ''}`}>
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
        <span>Step-by-Step KaTeX Formula Panel</span>
        <span className="text-[10px] text-blue-400 font-mono">Formula → Substitution → Answer</span>
      </h3>

      <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-hide pr-1">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{step.label}</span>
            </div>

            {/* Formula */}
            {step.formula && (
              <div className="text-xs text-blue-300 bg-slate-900/60 p-1.5 rounded border border-slate-800 overflow-x-auto">
                <BlockMath math={step.formula} />
              </div>
            )}

            {/* Substitution */}
            {step.substitution && (
              <div className="text-xs text-amber-300 bg-slate-900/60 p-1.5 rounded border border-slate-800 overflow-x-auto">
                <BlockMath math={step.substitution} />
              </div>
            )}

            {/* Answer */}
            <div className="text-sm font-bold text-emerald-400 bg-slate-900/80 p-2 rounded border border-emerald-500/20 overflow-x-auto">
              <BlockMath math={step.answer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
