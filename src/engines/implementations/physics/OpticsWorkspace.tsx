import React from 'react';
import { usePhysicsStore } from './usePhysicsStore';

export const OpticsWorkspace: React.FC = () => {
  const { params } = usePhysicsStore();
  const { incidentAngle = 35, refractiveIndex = 1.5 } = params;

  const svgWidth = 550;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Snell's Law calculation: sin(r) = sin(i) / n2
  const iRad = (incidentAngle * Math.PI) / 180;
  const sinR = Math.sin(iRad) / refractiveIndex;
  const rRad = Math.asin(Math.min(1, Math.max(-1, sinR)));
  const rDeg = (rRad * 180) / Math.PI;

  // Incident ray start point
  const rayLength = 160;
  const incX = centerX - rayLength * Math.sin(iRad);
  const incY = centerY - rayLength * Math.cos(iRad);

  // Refracted ray end point inside medium
  const refX = centerX + rayLength * Math.sin(rRad);
  const refY = centerY + rayLength * Math.cos(rRad);

  // Reflected ray (i = r_reflected)
  const reflX = centerX + rayLength * Math.sin(iRad);
  const reflY = centerY - rayLength * Math.cos(iRad);

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative shadow-xl min-h-[380px]">
      <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
        OPTICS BENCH: REFLECTION & REFRACTION
      </span>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[600px] max-h-[400px] select-none">
        {/* Medium 2 (Glass Slab / Water) */}
        <rect x="50" y={centerY} width={svgWidth - 100} height="150" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="2" rx="8" />
        <text x="70" y={centerY + 30} fill="#93c5fd" fontSize="12" fontWeight="bold">
          Medium 2 (n = {refractiveIndex})
        </text>
        <text x="70" y={centerY - 20} fill="#94a3b8" fontSize="12" fontWeight="bold">
          Medium 1 (Air, n = 1.0)
        </text>

        {/* Normal Line (Perpendicular Dash Line) */}
        <line x1={centerX} y1={centerY - 160} x2={centerX} y2={centerY + 140} stroke="#94a3b8" strokeDasharray="5 5" strokeWidth="1.5" />
        <text x={centerX + 6} y={centerY - 140} fill="#cbd5e1" fontSize="10" fontWeight="bold">Normal</text>

        {/* Interface Boundary Line */}
        <line x1="50" y1={centerY} x2={svgWidth - 50} y2={centerY} stroke="#64748b" strokeWidth="2" />

        {/* Incident Ray (Yellow) */}
        <line x1={incX} y1={incY} x2={centerX} y2={centerY} stroke="#facc15" strokeWidth="3.5" />
        <circle cx={centerX} cy={centerY} r="5" fill="#facc15" />

        {/* Incident Ray Arrow Head */}
        <path d={`M ${centerX - 20 * Math.sin(iRad)} ${centerY - 20 * Math.cos(iRad)} L ${centerX} ${centerY}`} stroke="#facc15" strokeWidth="4" />

        {/* Refracted Ray (Green) */}
        <line x1={centerX} y1={centerY} x2={refX} y2={refY} stroke="#22c55e" strokeWidth="3.5" />

        {/* Reflected Ray (Faint Red) */}
        <line x1={centerX} y1={centerY} x2={reflX} y2={reflY} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

        {/* Angle Arcs & Labels */}
        <text x={centerX - 35} y={centerY - 40} fill="#facc15" fontSize="13" fontWeight="bold">
          i = {incidentAngle}°
        </text>
        <text x={centerX + 20} y={centerY + 40} fill="#4ade80" fontSize="13" fontWeight="bold">
          r = {rDeg.toFixed(1)}°
        </text>
      </svg>
    </div>
  );
};
