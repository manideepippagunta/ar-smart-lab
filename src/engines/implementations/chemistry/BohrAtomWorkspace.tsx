import React from 'react';
import { useChemistryStore } from './useChemistryStore';
import { ELEMENTS_DB } from './chemistryData';

export const BohrAtomWorkspace: React.FC = () => {
  const { params } = useChemistryStore();
  const { atomicNumber = 11 } = params;
  const element = ELEMENTS_DB[atomicNumber] || ELEMENTS_DB[11];

  const svgWidth = 550;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  const shellRadii = [55, 95, 135, 170];

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative shadow-xl min-h-[380px]">
      <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
        BOHR ATOMIC MODEL: {element.name.toUpperCase()} ({element.symbol})
      </span>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[600px] max-h-[400px] select-none">
        {/* Concentric Shell Rings (K, L, M, N) */}
        {element.shells.map((count, shellIdx) => {
          const r = shellRadii[shellIdx];
          const isValence = shellIdx === element.shells.length - 1;
          const shellNames = ['K', 'L', 'M', 'N'];

          return (
            <g key={shellIdx}>
              {/* Shell Orbit Line */}
              <circle
                cx={centerX}
                cy={centerY}
                r={r}
                fill="none"
                stroke={isValence ? '#38bdf8' : '#475569'}
                strokeWidth={isValence ? '2.5' : '1.5'}
                strokeDasharray={isValence ? 'none' : '4 4'}
              />
              <text x={centerX + r + 8} y={centerY + 4} fill={isValence ? '#38bdf8' : '#94a3b8'} fontSize="11" fontWeight="bold">
                {shellNames[shellIdx]} Shell ({count}e⁻)
              </text>

              {/* Electron Dots on Orbit */}
              {Array.from({ length: count }).map((_, eIdx) => {
                const angle = (eIdx / count) * 2 * Math.PI - Math.PI / 2;
                const ex = centerX + r * Math.cos(angle);
                const ey = centerY + r * Math.sin(angle);

                return (
                  <g key={eIdx} className="animate-pulse">
                    <circle cx={ex} cy={ey} r="6" fill={isValence ? '#38bdf8' : '#f8fafc'} stroke="#0284c7" strokeWidth="2" />
                  </g>
                );
              })}
            </g>
          );
        })}

        {/* Central Atomic Nucleus */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          <circle cx="0" cy="0" r="32" fill="#ef4444" opacity="0.9" className="shadow-2xl" />
          <text x="0" y="-4" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="black">{element.symbol}</text>
          <text x="0" y="12" textAnchor="middle" fill="#fecaca" fontSize="9" fontWeight="bold">Z = {element.z}</text>
        </g>
      </svg>
    </div>
  );
};
