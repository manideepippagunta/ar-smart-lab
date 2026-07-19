import React from 'react';
import { useBiologyStore } from './useBiologyStore';
import { Sun } from 'lucide-react';

export const PhotosynthesisWorkspace: React.FC = () => {
  const { params } = useBiologyStore();
  const { sunlightIntensity = 80, co2Level = 60 } = params;

  const rate = (sunlightIntensity * co2Level) / 100;
  const svgWidth = 550;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-between relative shadow-xl min-h-[380px]">
      <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
        <Sun size={14} className="text-amber-400" />
        PHOTOSYNTHESIS & CELLULAR RESPIRATION SIMULATOR
      </span>

      {/* SVG Leaf Reaction Simulator */}
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[550px] max-h-[330px] select-none my-auto">
        {/* Sunlight Beam (Yellow Rays) */}
        <g opacity={sunlightIntensity / 100}>
          <line x1="100" y1="50" x2={centerX - 30} y2={centerY - 20} stroke="#facc15" strokeWidth="4" strokeDasharray="6 4" className="animate-pulse" />
          <line x1="140" y1="40" x2={centerX} y2={centerY - 30} stroke="#facc15" strokeWidth="4" strokeDasharray="6 4" className="animate-pulse" />
          <text x="120" y="30" fill="#facc15" fontSize="12" fontWeight="black">Sunlight ({sunlightIntensity}%)</text>
        </g>

        {/* Green Plant Leaf */}
        <g transform={`translate(${centerX}, ${centerY + 20})`}>
          <path d="M -160 0 C -100 -110, 100 -110, 160 0 C 100 110, -100 110, -160 0 Z" fill="#16a34a" fillOpacity="0.8" stroke="#22c55e" strokeWidth="4" />
          {/* Leaf Veins */}
          <line x1="-160" y1="0" x2="160" y2="0" stroke="#86efac" strokeWidth="3" />
          <line x1="-60" y1="0" x2="-20" y2="-45" stroke="#86efac" strokeWidth="2" />
          <line x1="20" y1="0" x2="60" y2="-45" stroke="#86efac" strokeWidth="2" />
          <line x1="-60" y1="0" x2="-20" y2="45" stroke="#86efac" strokeWidth="2" />
          <line x1="20" y1="0" x2="60" y2="45" stroke="#86efac" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="black">Chloroplast Active</text>
        </g>

        {/* CO2 Intake (Left Arrow) */}
        <g transform="translate(60, 220)">
          <path d="M 0 0 L 70 0" stroke="#94a3b8" strokeWidth="3" markerEnd="url(#arrow)" />
          <text x="35" y="-10" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="bold">CO₂ Intake ({co2Level}%)</text>
        </g>

        {/* O2 Gas Release (Right Bubbles Animation) */}
        <g transform="translate(470, 220)">
          <text x="-35" y="-10" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="black">O₂ Release</text>
          {rate > 20 && <circle cx="-20" cy="-30" r="8" fill="#86efac" className="animate-bounce" />}
          {rate > 40 && <circle cx="-35" cy="-50" r="10" fill="#86efac" className="animate-bounce" />}
          {rate > 60 && <circle cx="-10" cy="-70" r="12" fill="#86efac" className="animate-bounce" />}
        </g>
      </svg>
    </div>
  );
};
