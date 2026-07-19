import React from 'react';
import { useBiologyStore } from './useBiologyStore';
import { Sliders, RotateCcw } from 'lucide-react';
import type { BiologyParams } from './biologyTypes';

export const BiologyControls: React.FC = () => {
  const { activeTopic, params, updateParam, resetAll } = useBiologyStore();

  const renderSlider = (key: keyof BiologyParams, label: string, min: number, max: number, step: number = 1, unit: string = '') => (
    <div key={key} className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-300">{label}</span>
        <span className="text-emerald-400 font-mono">{params[key]} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={params[key] as number}
        onChange={(e) => updateParam(key, Number(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
    </div>
  );

  return (
    <div className="w-full md:w-80 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} className="text-emerald-400" />
            Biology Controls
          </h3>
          <button
            onClick={resetAll}
            title="Reset Parameters"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Dynamic Sliders based on Active Topic */}
        <div className="space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-hide pr-1">
          {activeTopic === 'photosynthesis' && (
            <>
              {renderSlider('sunlightIntensity', 'Sunlight Intensity', 0, 100, 5, '%')}
              {renderSlider('co2Level', 'Stomatal CO₂ Concentration', 0, 100, 5, '%')}
            </>
          )}

          {activeTopic === 'ecosystem' && (
            renderSlider('producerEnergy', 'Producer Energy Base', 1000, 50000, 1000, 'J')
          )}
        </div>
      </div>
    </div>
  );
};
