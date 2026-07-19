import React from 'react';
import { useBiologyStore } from './useBiologyStore';

export const CellWorkspace: React.FC = () => {
  const { params, updateParam } = useBiologyStore();
  const { cellType = 'plant', selectedOrganelle } = params;

  const svgWidth = 550;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  const organelleDescriptions: Record<string, string> = {
    Nucleus: 'Contains genetic DNA material and controls all cellular activities.',
    Mitochondria: 'Powerhouse of the cell; performs cellular respiration to generate ATP energy.',
    Chloroplast: 'Contains green chlorophyll pigment; performs photosynthesis using sunlight & CO₂.',
    CellWall: 'Rigid outer cellulose wall providing structural support & protection.',
    Vacuole: 'Stores water, cell sap, and nutrients; maintains turgor pressure.',
    Ribosomes: 'Synthesizes proteins essential for cellular function and repair.',
    Cytoplasm: 'Jelly-like fluid matrix suspending organelles and facilitating reactions.'
  };

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-between relative shadow-xl min-h-[380px]">
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          CELL STRUCTURE: {cellType === 'plant' ? 'PLANT CELL (AUTOTROPHIC)' : 'ANIMAL CELL (HETEROTROPHIC)'}
        </span>

        {/* Cell Type Toggle */}
        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => updateParam('cellType', 'plant')}
            className={`px-3 py-1 rounded text-xs font-bold transition ${
              cellType === 'plant' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Plant Cell
          </button>
          <button
            onClick={() => updateParam('cellType', 'animal')}
            className={`px-3 py-1 rounded text-xs font-bold transition ${
              cellType === 'animal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Animal Cell
          </button>
        </div>
      </div>

      {/* SVG Cell Visualizer */}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[550px] max-h-[330px] select-none my-auto">
        {/* Cell Wall (Plant Only - Rectangular Green Border) */}
        {cellType === 'plant' && (
          <rect x="70" y="40" width="410" height="280" fill="none" stroke="#22c55e" strokeWidth="8" rx="36" />
        )}

        {/* Cell Membrane */}
        <rect
          x="82"
          y="52"
          width="386"
          height="256"
          fill={cellType === 'plant' ? '#14532d' : '#1e3a8a'}
          fillOpacity="0.35"
          stroke={cellType === 'plant' ? '#4ade80' : '#60a5fa'}
          strokeWidth="4"
          rx={cellType === 'plant' ? '28' : '120'}
        />

        {/* Central Nucleus (Purple) */}
        <g
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => updateParam('selectedOrganelle', 'Nucleus')}
        >
          <circle cx={centerX - 60} cy={centerY - 20} r="42" fill="#a855f7" fillOpacity="0.8" stroke="#ffffff" strokeWidth="2.5" />
          <circle cx={centerX - 60} cy={centerY - 20} r="16" fill="#6b21a8" />
          <text x={centerX - 60} y={centerY + 36} textAnchor="middle" fill="#f3e8ff" fontSize="11" fontWeight="bold">Nucleus</text>
        </g>

        {/* Mitochondria (Red Oval Coils) */}
        <g
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => updateParam('selectedOrganelle', 'Mitochondria')}
        >
          <ellipse cx={centerX + 110} cy={centerY - 50} rx="26" ry="15" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <path d={`M ${centerX + 90} ${centerY - 50} Q ${centerX + 110} ${centerY - 60} ${centerX + 130} ${centerY - 50}`} fill="none" stroke="#ffffff" strokeWidth="2" />
          <text x={centerX + 110} y={centerY - 22} textAnchor="middle" fill="#fca5a5" fontSize="10" fontWeight="bold">Mitochondria</text>
        </g>

        {/* Chloroplasts (Plant Only - Green Ovals) */}
        {cellType === 'plant' && (
          <g
            className="cursor-pointer hover:scale-105 transition-transform"
            onClick={() => updateParam('selectedOrganelle', 'Chloroplast')}
          >
            <ellipse cx={centerX + 100} cy={centerY + 60} rx="28" ry="16" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
            <circle cx={centerX + 90} cy={centerY + 60} r="4" fill="#86efac" />
            <circle cx={centerX + 105} cy={centerY + 60} r="4" fill="#86efac" />
            <text x={centerX + 100} y={centerY + 90} textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold">Chloroplast</text>
          </g>
        )}

        {/* Vacuole (Large Blue Bubble) */}
        <g
          className="cursor-pointer hover:scale-105 transition-transform"
          onClick={() => updateParam('selectedOrganelle', 'Vacuole')}
        >
          <ellipse
            cx={centerX - 70}
            cy={centerY + 65}
            rx={cellType === 'plant' ? '55' : '20'}
            ry={cellType === 'plant' ? '35' : '16'}
            fill="#38bdf8"
            fillOpacity="0.4"
            stroke="#38bdf8"
            strokeWidth="2"
          />
          <text x={centerX - 70} y={centerY + 70} textAnchor="middle" fill="#bae6fd" fontSize="10" fontWeight="bold">Vacuole</text>
        </g>

        {/* Ribosomes (Tiny Dots scattered) */}
        {[
          [centerX + 10, centerY - 60],
          [centerX - 120, centerY - 50],
          [centerX + 30, centerY + 80]
        ].map(([rx, ry], idx) => (
          <circle key={idx} cx={rx} cy={ry} r="3" fill="#facc15" />
        ))}
      </svg>

      {/* Selected Organelle Card */}
      {selectedOrganelle && (
        <div className="w-full bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-medium text-slate-300 flex justify-between items-center">
          <div>
            <span className="font-bold text-blue-400 uppercase mr-2">{selectedOrganelle}:</span>
            <span>{organelleDescriptions[selectedOrganelle]}</span>
          </div>
          <button
            onClick={() => updateParam('selectedOrganelle', null)}
            className="text-slate-500 hover:text-white font-bold ml-3"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
