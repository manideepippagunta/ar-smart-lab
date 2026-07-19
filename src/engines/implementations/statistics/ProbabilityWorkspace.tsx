import React, { useState } from 'react';
import { useStatisticsStore } from './useStatisticsStore';
import { Play, RotateCcw, Zap, Sparkles, Award } from 'lucide-react';

export const ProbabilityWorkspace: React.FC = () => {
  const {
    probabilityType,
    probability,
    runTrials,
    resetProbability
  } = useStatisticsStore();

  const [animating, setAnimating] = useState(false);

  const handleSingleTrial = () => {
    setAnimating(true);
    setTimeout(() => {
      runTrials(1);
      setAnimating(false);
    }, 400);
  };

  const handleBatchTrial = (count: number) => {
    setAnimating(true);
    setTimeout(() => {
      runTrials(count);
      setAnimating(false);
    }, 150);
  };

  const totalTrials = probability.totalTrials;
  const outcomeEntries = Object.entries(probability.outcomes);

  // Theoretical probability for first outcome category (e.g., Heads or '1' or Hearts)
  const theoreticalRate = probabilityType === 'coin' ? 0.5 
    : probabilityType === 'dice' ? 1 / 6 
    : probabilityType === 'cards' ? 0.25 
    : 0.25;

  const primaryLabel = outcomeEntries.length > 0 ? outcomeEntries[0][0] : 'Event';
  const primaryObserved = outcomeEntries.length > 0 ? outcomeEntries[0][1] : 0;
  const expRate = totalTrials > 0 ? primaryObserved / totalTrials : 0;

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-auto">
      {/* Simulation Graphic Area */}
      <div className="flex-1 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-between relative shadow-xl min-h-[420px]">
        {/* Top Header */}
        <div className="w-full flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <Sparkles size={14} className="text-amber-400" />
            {probabilityType.toUpperCase()} EXPERIMENT
          </span>
          <button
            onClick={resetProbability}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition font-medium"
          >
            <RotateCcw size={12} /> Reset Simulation
          </button>
        </div>

        {/* Visual Graphic Representation */}
        <div className="my-auto flex flex-col items-center justify-center min-h-[220px]">
          {/* COIN GRAPHIC */}
          {probabilityType === 'coin' && (
            <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 border-4 border-amber-300 shadow-2xl flex flex-col items-center justify-center text-slate-950 font-black transition-all duration-300 ${animating ? 'animate-spin scale-110' : 'hover:scale-105'}`}>
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-amber-600/50 flex flex-col items-center justify-center">
                <span className="text-2xl tracking-tight uppercase">
                  {probability.lastOutcome || 'FLIP'}
                </span>
                <span className="text-[10px] text-amber-900 font-bold">COIN</span>
              </div>
            </div>
          )}

          {/* DICE GRAPHIC */}
          {probabilityType === 'dice' && (
            <div className={`w-32 h-32 bg-gradient-to-tr from-slate-100 to-white border-4 border-slate-300 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-slate-900 font-black text-4xl transition-all duration-300 ${animating ? 'animate-bounce scale-110 rotate-12' : 'hover:scale-105'}`}>
              <span>{probability.lastOutcome || '?'}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">DICE DIE</span>
            </div>
          )}

          {/* CARDS GRAPHIC */}
          {probabilityType === 'cards' && (
            <div className={`w-28 h-40 bg-white border-4 border-slate-200 rounded-2xl shadow-2xl flex flex-col justify-between p-3 transition-all duration-300 ${animating ? 'rotate-180 scale-105' : 'hover:scale-105'}`}>
              <div className="text-left font-black text-slate-800 text-lg">
                {probability.lastOutcome === 'Hearts' || probability.lastOutcome === 'Diamonds' ? '♥️' : '♠️'}
              </div>
              <div className="text-center font-black text-slate-900 text-xl tracking-wide">
                {probability.lastOutcome || 'CARD'}
              </div>
              <div className="text-right font-black text-slate-800 text-lg">
                {probability.lastOutcome === 'Hearts' || probability.lastOutcome === 'Diamonds' ? '♦️' : '♣️'}
              </div>
            </div>
          )}

          {/* SPINNER WHEEL GRAPHIC */}
          {probabilityType === 'spinner' && (
            <div className="relative">
              <svg
                width="160"
                height="160"
                viewBox="0 0 160 160"
                className={`transition-transform duration-500 ${animating ? 'rotate-[720deg]' : ''}`}
              >
                <path d="M 80 80 L 80 10 A 70 70 0 0 1 150 80 Z" fill="#ef4444" />
                <path d="M 80 80 L 150 80 A 70 70 0 0 1 80 150 Z" fill="#3b82f6" />
                <path d="M 80 80 L 80 150 A 70 70 0 0 1 10 80 Z" fill="#22c55e" />
                <path d="M 80 80 L 10 80 A 70 70 0 0 1 80 10 Z" fill="#eab308" />
                <circle cx="80" cy="80" r="16" fill="#0f172a" stroke="#ffffff" strokeWidth="3" />
              </svg>
              {/* Spinner Needle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[16px] border-t-white" />
            </div>
          )}

          <div className="mt-4 text-center">
            <div className="text-xs text-slate-400 font-semibold uppercase">Last Picked Outcome</div>
            <div className="text-xl font-black text-white">{probability.lastOutcome || 'None'}</div>
          </div>
        </div>

        {/* Experiment Trial Control Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <button
            onClick={handleSingleTrial}
            disabled={animating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-blue-900/40"
          >
            <Play size={14} /> Run 1 Trial
          </button>
          {[10, 50, 100, 500, 1000].map((count) => (
            <button
              key={count}
              onClick={() => handleBatchTrial(count)}
              disabled={animating}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition border border-slate-700/60 flex items-center gap-1"
            >
              <Zap size={12} className="text-amber-400" /> +{count}
            </button>
          ))}
        </div>
      </div>

      {/* Law of Large Numbers & Stats Panel */}
      <div className="w-full md:w-88 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-emerald-400" />
              Live Outcomes Tally
            </h3>
            <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Total: {totalTrials}
            </span>
          </div>

          {/* Outcome Frequencies Bar Chart */}
          <div className="space-y-3 mb-6">
            {outcomeEntries.map(([label, count]) => {
              const freq = totalTrials > 0 ? (count / totalTrials) * 100 : 0;
              return (
                <div key={label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-slate-400">{count} ({freq.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300"
                      style={{ width: `${freq}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Convergence Tracker (Theoretical vs Experimental) */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 flex justify-between">
            <span>Convergence Analysis</span>
            <span className="text-emerald-400">Law of Large Numbers</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Theoretical P({primaryLabel})</div>
              <div className="text-lg font-black text-blue-400">{(theoreticalRate * 100).toFixed(1)}%</div>
            </div>

            <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Experimental P({primaryLabel})</div>
              <div className="text-lg font-black text-emerald-400">{(expRate * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic text-center">
            {totalTrials > 200 
              ? 'As total trials scale higher, Experimental Probability converges tightly with Theoretical Probability.' 
              : 'Run more trials (+100 or +1000) to observe convergence.'}
          </div>
        </div>
      </div>
    </div>
  );
};
