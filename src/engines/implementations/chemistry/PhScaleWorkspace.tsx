import React from 'react';
import { useChemistryStore } from './useChemistryStore';
import { FlaskConical } from 'lucide-react';

export const PhScaleWorkspace: React.FC = () => {
  const { params, updateParam } = useChemistryStore();
  const { phValue = 7.0 } = params;

  // Universal Indicator Color spectrum from 0 to 14
  const getPhColor = (ph: number): string => {
    if (ph < 3) return '#ef4444';       // Strong Acid (Red)
    if (ph < 6) return '#f97316';       // Weak Acid (Orange/Yellow)
    if (ph < 8) return '#22c55e';       // Neutral (Green)
    if (ph < 11) return '#3b82f6';      // Weak Base (Blue)
    return '#a855f7';                   // Strong Base (Purple)
  };

  const currentColor = getPhColor(phValue);

  const getSubstance = (ph: number): string => {
    if (ph <= 1) return 'Battery Acid (pH ~0)';
    if (ph <= 2) return 'Gastric Acid (pH ~1.5)';
    if (ph <= 3) return 'Lemon Juice (pH ~2.4)';
    if (ph <= 4) return 'Tomato Juice (pH ~4.0)';
    if (ph <= 5) return 'Black Coffee (pH ~5.0)';
    if (ph <= 6) return 'Milk (pH ~6.5)';
    if (ph <= 7.5) return 'Pure Water / Blood (pH 7.0 - 7.4)';
    if (ph <= 8.5) return 'Baking Soda Solution (pH ~8.3)';
    if (ph <= 10) return 'Milk of Magnesia (pH ~10.5)';
    if (ph <= 11.5) return 'Ammonia Solution (pH ~11.5)';
    return 'Bleach / Drain Cleaner (pH ~13)';
  };

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <FlaskConical size={16} className="text-emerald-400" />
          UNIVERSAL INDICATOR pH SCALE (0 - 14)
        </span>
        <span className="text-xs font-bold text-slate-300 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Substance: {getSubstance(phValue)}
        </span>
      </div>

      {/* Liquid Beaker Representation */}
      <div className="my-auto flex flex-col items-center justify-center">
        <div className="relative w-36 h-44 border-4 border-slate-400 border-t-0 rounded-b-3xl overflow-hidden bg-slate-900/60 shadow-2xl flex flex-col justify-end p-2">
          {/* Liquid Fill */}
          <div
            className="w-full rounded-b-2xl transition-colors duration-500 flex flex-col items-center justify-center text-white font-black text-xl shadow-inner"
            style={{ height: '75%', backgroundColor: currentColor }}
          >
            <span>pH {phValue.toFixed(1)}</span>
            <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">
              {phValue < 6.5 ? 'ACIDIC' : phValue > 7.5 ? 'BASIC' : 'NEUTRAL'}
            </span>
          </div>
        </div>
      </div>

      {/* pH Slider Spectrum (0 to 14) */}
      <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-red-400">0 (Acidic)</span>
          <span className="text-green-400">7 (Neutral)</span>
          <span className="text-purple-400">14 (Alkaline)</span>
        </div>
        <input
          type="range"
          min="0"
          max="14"
          step="0.1"
          value={phValue}
          onChange={(e) => updateParam('phValue', Number(e.target.value))}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer"
          style={{
            background: 'linear-gradient(to right, #ef4444 0%, #f97316 25%, #22c55e 50%, #3b82f6 75%, #a855f7 100%)'
          }}
        />
      </div>
    </div>
  );
};
