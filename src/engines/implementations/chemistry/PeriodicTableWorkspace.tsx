import React from 'react';
import { useChemistryStore } from './useChemistryStore';
import { ELEMENTS_DB } from './chemistryData';

export const PeriodicTableWorkspace: React.FC = () => {
  const { params, updateParam } = useChemistryStore();
  const { atomicNumber = 6 } = params;

  const currentElement = ELEMENTS_DB[atomicNumber] || ELEMENTS_DB[6];

  const categoryColors: Record<string, string> = {
    alkali: 'bg-red-500/20 border-red-500/50 text-red-400',
    alkaline: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    transition: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    nonmetal: 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400',
    halogen: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    noble: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
    metalloid: 'bg-teal-500/20 border-teal-500/50 text-teal-400'
  };

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col md:flex-row gap-4 overflow-auto shadow-xl min-h-[380px]">
      {/* Periodic Table Grid (Representational) */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          Interactive Periodic Table Grid (Click Element)
        </div>
        <div className="grid grid-cols-6 gap-2">
          {Object.values(ELEMENTS_DB).map((elem) => {
            const isSelected = elem.z === atomicNumber;
            const colorClass = categoryColors[elem.category] || 'bg-slate-800 text-slate-300';

            return (
              <button
                key={elem.z}
                onClick={() => updateParam('atomicNumber', elem.z)}
                className={`p-2.5 rounded-xl border transition flex flex-col items-center justify-center ${colorClass} ${
                  isSelected ? 'ring-2 ring-white scale-105 shadow-lg' : 'hover:scale-105 opacity-85 hover:opacity-100'
                }`}
              >
                <span className="text-[10px] font-mono opacity-60">{elem.z}</span>
                <span className="text-base font-black tracking-tight">{elem.symbol}</span>
                <span className="text-[10px] truncate max-w-full font-medium">{elem.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Element Detail Card */}
      <div className="w-full md:w-64 bg-slate-900/90 p-4 rounded-xl border border-slate-800 flex flex-col justify-between shadow-xl">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2 mb-3">
            Element Inspector
          </div>
          <div className="text-center bg-slate-950 p-4 rounded-xl border border-slate-800 mb-3">
            <span className="text-xs font-bold text-slate-500">Atomic Number Z = {currentElement.z}</span>
            <div className="text-4xl font-black text-blue-400 my-1">{currentElement.symbol}</div>
            <div className="text-base font-bold text-white">{currentElement.name}</div>
            <div className="text-xs font-mono text-slate-400 mt-1">{currentElement.mass} u</div>
          </div>

          <div className="space-y-1.5 text-xs font-medium text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-blue-400 capitalize">{currentElement.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Group:</span>
              <span className="font-bold text-white">{currentElement.group}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Period:</span>
              <span className="font-bold text-white">{currentElement.period}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Electron Shells:</span>
              <span className="font-bold text-emerald-400 font-mono">[{currentElement.shells.join(', ')}]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
