import React from 'react';
import { useBiologyStore } from './useBiologyStore';
import type { AnatomySystem } from './biologyTypes';
import { Heart } from 'lucide-react';

export const AnatomyWorkspace: React.FC = () => {
  const { params, updateParam } = useBiologyStore();
  const { systemType = 'circulatory' } = params;

  const svgWidth = 550;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-between relative shadow-xl min-h-[380px]">
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
          <Heart size={14} className="text-red-400" />
          HUMAN ANATOMY: {systemType.toUpperCase()} SYSTEM
        </span>

        {/* System Selector Switcher */}
        <div className="flex gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {(['circulatory', 'respiratory', 'digestive'] as AnatomySystem[]).map((sys) => (
            <button
              key={sys}
              onClick={() => updateParam('systemType', sys)}
              className={`px-3 py-1 rounded text-xs font-bold capitalize transition ${
                systemType === sys ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {sys}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Anatomy Graphic */}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[550px] max-h-[330px] select-none my-auto">
        {/* CIRCULATORY SYSTEM: 4-CHAMBER HEART & BLOOD FLOW */}
        {systemType === 'circulatory' && (
          <g>
            {/* Heart 4-Chamber Outline */}
            <g transform={`translate(${centerX}, ${centerY})`} className="animate-pulse">
              {/* Right Atrium (Deox - Blue) */}
              <rect x="-80" y="-70" width="75" height="65" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2.5" rx="8" />
              <text x="-42" y="-35" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="black">RA</text>

              {/* Right Ventricle (Deox - Blue) */}
              <rect x="-80" y="0" width="75" height="75" fill="#1e40af" stroke="#60a5fa" strokeWidth="2.5" rx="8" />
              <text x="-42" y="42" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="black">RV</text>

              {/* Left Atrium (Ox - Red) */}
              <rect x="5" y="-70" width="75" height="65" fill="#991b1b" stroke="#f87171" strokeWidth="2.5" rx="8" />
              <text x="42" y="-35" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="black">LA</text>

              {/* Left Ventricle (Ox - Red) */}
              <rect x="5" y="0" width="75" height="75" fill="#b91c1c" stroke="#f87171" strokeWidth="2.5" rx="8" />
              <text x="42" y="42" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="black">LV</text>
            </g>

            {/* Animated Flowing Blood Particles */}
            <g>
              {/* Deoxygenated Blood Dots (Blue) */}
              <circle cx={centerX - 42} cy={centerY - 40} r="4" fill="#38bdf8" className="animate-ping" />
              <circle cx={centerX - 42} cy={centerY + 30} r="4" fill="#38bdf8" className="animate-ping" />

              {/* Oxygenated Blood Dots (Red) */}
              <circle cx={centerX + 42} cy={centerY - 40} r="4" fill="#ef4444" className="animate-ping" />
              <circle cx={centerX + 42} cy={centerY + 30} r="4" fill="#ef4444" className="animate-ping" />
            </g>
          </g>
        )}

        {/* RESPIRATORY SYSTEM */}
        {systemType === 'respiratory' && (
          <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Trachea */}
            <rect x="-10" y="-120" width="20" height="70" fill="#334155" stroke="#94a3b8" strokeWidth="2" rx="4" />
            {/* Lungs */}
            <ellipse cx="-55" cy="-10" rx="45" ry="60" fill="#f43f5e" fillOpacity="0.4" stroke="#f43f5e" strokeWidth="3" className="animate-pulse" />
            <ellipse cx="55" cy="-10" rx="45" ry="60" fill="#f43f5e" fillOpacity="0.4" stroke="#f43f5e" strokeWidth="3" className="animate-pulse" />
            <text x="-55" y="0" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Left Lung</text>
            <text x="55" y="0" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">Right Lung</text>
            {/* Diaphragm */}
            <path d="M -110 70 Q 0 40 110 70" fill="none" stroke="#e11d48" strokeWidth="4" />
            <text x="0" y="90" textAnchor="middle" fill="#fecdd3" fontSize="11" fontWeight="bold">Diaphragm</text>
          </g>
        )}

        {/* DIGESTIVE SYSTEM */}
        {systemType === 'digestive' && (
          <g transform={`translate(${centerX}, ${centerY})`}>
            {/* Esophagus */}
            <rect x="-8" y="-130" width="16" height="75" fill="#475569" rx="3" />
            {/* Stomach */}
            <path d="M -30 -55 Q -60 -20 -10 10 Q 20 -20 -30 -55" fill="#f59e0b" fillOpacity="0.5" stroke="#f59e0b" strokeWidth="3" />
            <text x="-20" y="-25" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="bold">Stomach</text>
            {/* Intestines */}
            <circle cx="0" cy="50" r="38" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="3" />
            <text x="0" y="55" textAnchor="middle" fill="#a7f3d0" fontSize="11" fontWeight="bold">Intestines</text>
          </g>
        )}
      </svg>
    </div>
  );
};
