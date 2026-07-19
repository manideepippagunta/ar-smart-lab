import React, { useState } from 'react';
import { useChemistryStore } from './useChemistryStore';
import { Play, Sparkles } from 'lucide-react';

export const ReactionsWorkspace: React.FC = () => {
  const { params, updateParam } = useChemistryStore();
  const { reactionType = 'synthesis' } = params;
  const [animating, setAnimating] = useState(false);

  const triggerReaction = () => {
    setAnimating(true);
    setTimeout(() => setAnimating(false), 1200);
  };

  const svgWidth = 550;
  const svgHeight = 380;

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-between relative shadow-xl min-h-[380px]">
      <div className="w-full flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
          <Sparkles size={14} className="text-amber-400" />
          CHEMICAL REACTION SIMULATOR
        </span>

        {/* Reaction Type Switcher Buttons */}
        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['synthesis', 'neutralisation', 'displacement'] as const).map((type) => (
            <button
              key={type}
              onClick={() => updateParam('reactionType', type)}
              className={`px-2.5 py-1 rounded text-xs font-bold capitalize transition ${
                reactionType === type ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Reaction Graphic */}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[600px] max-h-[340px] select-none my-auto">
        {reactionType === 'synthesis' && (
          <g>
            {/* Reactant 1: 2 H2 */}
            <g transform={`translate(${animating ? 240 : 120}, 180)`} className="transition-all duration-700">
              <circle cx="-15" cy="0" r="14" fill="#38bdf8" />
              <circle cx="15" cy="0" r="14" fill="#38bdf8" />
              <text x="0" y="32" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">2 H₂</text>
            </g>
            <text x="200" y="185" fill="#f8fafc" fontSize="22" fontWeight="black">+</text>
            {/* Reactant 2: O2 */}
            <g transform={`translate(${animating ? 260 : 270}, 180)`} className="transition-all duration-700">
              <circle cx="0" cy="0" r="22" fill="#ef4444" />
              <text x="0" y="40" textAnchor="middle" fill="#fca5a5" fontSize="12" fontWeight="bold">O₂</text>
            </g>
            <text x="330" y="185" fill="#f8fafc" fontSize="22" fontWeight="black">→</text>
            {/* Product: 2 H2O */}
            <g transform={`translate(${animating ? 430 : 430}, 180)`}>
              <circle cx="0" cy="0" r="22" fill="#ef4444" opacity={animating ? 1 : 0.4} />
              <circle cx="-18" cy="-14" r="10" fill="#38bdf8" opacity={animating ? 1 : 0.4} />
              <circle cx="18" cy="-14" r="10" fill="#38bdf8" opacity={animating ? 1 : 0.4} />
              <text x="0" y="40" textAnchor="middle" fill="#4ade80" fontSize="13" fontWeight="black">2 H₂O</text>
            </g>
          </g>
        )}

        {reactionType === 'neutralisation' && (
          <g>
            {/* Reactants: HCl + NaOH */}
            <g transform="translate(140, 180)">
              <rect x="-40" y="-30" width="80" height="60" fill="#ec4899" fillOpacity="0.25" stroke="#ec4899" strokeWidth="2" rx="8" />
              <text x="0" y="5" textAnchor="middle" fill="#f472b6" fontSize="14" fontWeight="black">HCl (Acid)</text>
            </g>
            <text x="215" y="185" fill="#f8fafc" fontSize="22" fontWeight="black">+</text>
            <g transform="translate(290, 180)">
              <rect x="-45" y="-30" width="90" height="60" fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="2" rx="8" />
              <text x="0" y="5" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="black">NaOH (Base)</text>
            </g>
            <text x="365" y="185" fill="#f8fafc" fontSize="22" fontWeight="black">→</text>
            {/* Products: NaCl + H2O */}
            <g transform="translate(460, 180)">
              <rect x="-45" y="-30" width="90" height="60" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="2" rx="8" />
              <text x="0" y="-2" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="black">NaCl (Salt)</text>
              <text x="0" y="15" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">+ H₂O</text>
            </g>
          </g>
        )}

        {reactionType === 'displacement' && (
          <g>
            <g transform="translate(140, 180)">
              <circle cx="0" cy="0" r="22" fill="#94a3b8" />
              <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="black">Fe</text>
            </g>
            <text x="200" y="185" fill="#f8fafc" fontSize="22" fontWeight="black">+</text>
            <g transform="translate(280, 180)">
              <rect x="-40" y="-30" width="80" height="60" fill="#06b6d4" fillOpacity="0.25" stroke="#06b6d4" strokeWidth="2" rx="8" />
              <text x="0" y="5" textAnchor="middle" fill="#67e8f9" fontSize="13" fontWeight="black">CuSO₄</text>
            </g>
            <text x="350" y="185" fill="#f8fafc" fontSize="22" fontWeight="black">→</text>
            <g transform="translate(450, 180)">
              <rect x="-40" y="-30" width="80" height="60" fill="#22c55e" fillOpacity="0.25" stroke="#22c55e" strokeWidth="2" rx="8" />
              <text x="0" y="-2" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="black">FeSO₄</text>
              <text x="0" y="16" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">+ Cu</text>
            </g>
          </g>
        )}
      </svg>

      <button
        onClick={triggerReaction}
        className="w-full max-w-xs py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
      >
        <Play size={14} /> Start Reaction Animation
      </button>
    </div>
  );
};
