import React, { useState } from 'react';

export const MagnetismWorkspace: React.FC = () => {
  const [compassPos, setCompassPos] = useState({ x: 180, y: 120 });

  const svgWidth = 550;
  const svgHeight = 380;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;

  // Calculate compass needle angle towards North pole (left) and South pole (right)
  const dxNorth = compassPos.x - (centerX - 90);
  const dyNorth = compassPos.y - centerY;
  const angleRad = Math.atan2(dyNorth, dxNorth);
  const angleDeg = (angleRad * 180) / Math.PI;

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCompassPos({ x, y });
  };

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative shadow-xl min-h-[380px]">
      <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
        MAGNETIC FIELD LINES & COMPASS
      </span>
      <span className="absolute top-4 right-4 text-xs font-semibold text-slate-500">
        (Click anywhere to place compass)
      </span>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full max-w-[600px] max-h-[400px] select-none cursor-crosshair"
        onPointerDown={handlePointerDown}
      >
        {/* Curved Magnetic Field Lines */}
        {[-80, -50, -25, 25, 50, 80].map((offset, idx) => (
          <path
            key={idx}
            d={`M ${centerX - 90} ${centerY} C ${centerX - 90} ${centerY + offset * 2.5}, ${centerX + 90} ${centerY + offset * 2.5}, ${centerX + 90} ${centerY}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            opacity="0.6"
          />
        ))}

        {/* Bar Magnet (North / South Poles) */}
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* North Pole (Red) */}
          <rect x="-100" y="-25" width="100" height="50" fill="#ef4444" rx="4" />
          <text x="-50" y="8" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="black">N</text>

          {/* South Pole (Blue) */}
          <rect x="0" y="-25" width="100" height="50" fill="#3b82f6" rx="4" />
          <text x="50" y="8" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="black">S</text>
        </g>

        {/* Draggable Compass Needle */}
        <g transform={`translate(${compassPos.x}, ${compassPos.y})`}>
          <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2.5" />
          <g transform={`rotate(${angleDeg})`}>
            {/* North Pointer (Red) */}
            <polygon points="0,-16 -6,0 6,0" fill="#ef4444" />
            {/* South Pointer (Silver) */}
            <polygon points="0,16 -6,0 6,0" fill="#94a3b8" />
          </g>
          <circle cx="0" cy="0" r="3" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};
