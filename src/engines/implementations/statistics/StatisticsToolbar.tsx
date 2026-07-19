import React from 'react';
import { useStatisticsStore } from './useStatisticsStore';
import type { ChartType, ProbabilityType } from './useStatisticsStore';
import {
  BarChart2,
  PieChart as PieIcon,
  TrendingUp,
  Activity,
  Coins,
  Dices,
  Layers,
  Disc,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const StatisticsToolbar: React.FC = () => {
  const {
    activeTab,
    chartType,
    probabilityType,
    setActiveTab,
    setChartType,
    setProbabilityType,
    resetAll
  } = useStatisticsStore();

  const chartOptions: { type: ChartType; label: string; icon: any }[] = [
    { type: 'bar', label: 'Bar Graph', icon: BarChart2 },
    { type: 'histogram', label: 'Histogram', icon: BarChart2 },
    { type: 'pie', label: 'Pie Chart', icon: PieIcon },
    { type: 'line', label: 'Line Graph', icon: TrendingUp },
    { type: 'frequency-polygon', label: 'Polygon', icon: Activity },
    { type: 'scatter', label: 'Scatter Plot', icon: Activity }
  ];

  const probOptions: { type: ProbabilityType; label: string; icon: any }[] = [
    { type: 'coin', label: 'Coin Toss', icon: Coins },
    { type: 'dice', label: 'Dice Roll', icon: Dices },
    { type: 'cards', label: 'Cards Draw', icon: Layers },
    { type: 'spinner', label: 'Spinner Wheel', icon: Disc }
  ];

  return (
    <div className="w-full bg-slate-900/95 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
      {/* Primary Mode Tabs (Statistics vs Probability) */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('statistics')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
            activeTab === 'statistics'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 size={14} />
          Descriptive Statistics
        </button>

        <button
          onClick={() => setActiveTab('probability')}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
            activeTab === 'probability'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={14} />
          Probability Simulations
        </button>
      </div>

      {/* Secondary Sub-Controls */}
      {activeTab === 'statistics' ? (
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-hide">
          {chartOptions.map((opt) => {
            const Icon = opt.icon;
            const active = chartType === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => setChartType(opt.type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  active
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={13} />
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-hide">
          {probOptions.map((opt) => {
            const Icon = opt.icon;
            const active = probabilityType === opt.type;
            return (
              <button
                key={opt.type}
                onClick={() => setProbabilityType(opt.type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  active
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon size={13} />
                {opt.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Global Engine Reset Button */}
      <button
        onClick={resetAll}
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/50"
      >
        <RotateCcw size={13} />
        Reset Engine
      </button>
    </div>
  );
};
