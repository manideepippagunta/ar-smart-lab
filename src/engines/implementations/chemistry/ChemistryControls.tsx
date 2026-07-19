import React from 'react';
import { useChemistryStore } from './useChemistryStore';
import { Sliders, RotateCcw } from 'lucide-react';
import { ELEMENTS_DB } from './chemistryData';

export const ChemistryControls: React.FC = () => {
  const { activeTopic, params, updateParam, resetAll } = useChemistryStore();

  return (
    <div className="w-full md:w-80 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} className="text-blue-400" />
            Chemistry Controls
          </h3>
          <button
            onClick={resetAll}
            title="Reset Parameters"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Dynamic Controls based on Active Topic */}
        <div className="space-y-3 max-h-[340px] overflow-y-auto scrollbar-hide pr-1">
          {(activeTopic === 'atom_structure' || activeTopic === 'periodic_table') && (
            <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">Select Element Atomic Number Z</span>
                <span className="text-blue-400 font-mono">Z = {params.atomicNumber}</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={params.atomicNumber}
                onChange={(e) => updateParam('atomicNumber', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-[11px] text-slate-400 font-bold mt-1 text-center">
                Element: {ELEMENTS_DB[params.atomicNumber]?.name || 'Sodium'} ({ELEMENTS_DB[params.atomicNumber]?.symbol || 'Na'})
              </div>
            </div>
          )}

          {activeTopic === 'acids_bases' && (
            <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-300">pH Level Indicator</span>
                <span className="text-emerald-400 font-mono">pH {params.phValue.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.1"
                value={params.phValue}
                onChange={(e) => updateParam('phValue', Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
