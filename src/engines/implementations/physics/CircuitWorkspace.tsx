import React from 'react';
import { usePhysicsStore } from './usePhysicsStore';

export const CircuitWorkspace: React.FC = () => {
  const { params, updateParam } = usePhysicsStore();
  const { voltage = 12, resistance = 4, switchClosed = true } = params;

  const current = switchClosed && resistance > 0 ? voltage / resistance : 0;
  const glowOpacity = Math.min(1, Math.max(0.1, current / 5));

  const svgWidth = 550;
  const svgHeight = 380;

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative shadow-xl min-h-[380px]">
      <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
        ELECTRIC CIRCUIT SIMULATOR (DC)
      </span>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full max-w-[600px] max-h-[400px] select-none">
        {/* Main Circuit Loop Wires */}
        <rect x="80" y="80" width="390" height="220" fill="none" stroke="#475569" strokeWidth="4" rx="16" />

        {/* Battery Component (Left Branch) */}
        <g transform="translate(80, 190)">
          <rect x="-20" y="-30" width="40" height="60" fill="#0f172a" stroke="#64748b" strokeWidth="2" rx="4" />
          <line x1="-12" y1="-15" x2="-12" y2="15" stroke="#ef4444" strokeWidth="5" />
          <line x1="12" y1="-25" x2="12" y2="25" stroke="#3b82f6" strokeWidth="5" />
          <text x="-35" y="-5" fill="#ef4444" fontSize="14" fontWeight="black">+</text>
          <text x="25" y="-5" fill="#3b82f6" fontSize="14" fontWeight="black">-</text>
          <text x="0" y="45" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">{voltage}V Battery</text>
        </g>

        {/* Switch Component (Top Branch) */}
        <g transform="translate(275, 80)" className="cursor-pointer" onClick={() => updateParam('switchClosed', !switchClosed)}>
          <circle cx="-25" cy="0" r="6" fill="#cbd5e1" />
          <circle cx="25" cy="0" r="6" fill="#cbd5e1" />
          <line
            x1="-25"
            y1="0"
            x2="25"
            y2={switchClosed ? 0 : -25}
            stroke={switchClosed ? '#22c55e' : '#ef4444'}
            strokeWidth="4"
            className="transition-all duration-300"
          />
          <text x="0" y="-35" textAnchor="middle" fill={switchClosed ? '#4ade80' : '#f87171'} fontSize="11" fontWeight="bold">
            Switch {switchClosed ? 'ON' : 'OFF'}
          </text>
        </g>

        {/* Light Bulb Component (Right Branch) */}
        <g transform="translate(470, 190)">
          {/* Bulb Glow Halo */}
          {switchClosed && current > 0 && (
            <circle cx="0" cy="0" r={35 + current * 4} fill="#facc15" opacity={glowOpacity * 0.4} className="animate-pulse" />
          )}
          <circle cx="0" cy="0" r="22" fill={switchClosed && current > 0 ? '#facc15' : '#334155'} stroke="#e2e8f0" strokeWidth="3" />
          <path d="M -10 10 L 0 -10 L 10 10" fill="none" stroke="#0f172a" strokeWidth="3" />
          <text x="0" y="45" textAnchor="middle" fill="#f8fafc" fontSize="11" fontWeight="bold">
            Bulb (I = {current.toFixed(1)}A)
          </text>
        </g>

        {/* Resistor Coil Component (Bottom Branch) */}
        <g transform="translate(275, 300)">
          <rect x="-35" y="-12" width="70" height="24" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="4" />
          <path d="M -30 0 L -20 -8 L -10 8 L 0 -8 L 10 8 L 20 -8 L 30 0" fill="none" stroke="#f59e0b" strokeWidth="2" />
          <text x="0" y="32" textAnchor="middle" fill="#fde68a" fontSize="11" fontWeight="bold">
            Resistor R = {resistance}Ω
          </text>
        </g>

        {/* Animated Flowing Electron Dots */}
        {switchClosed && current > 0 && (
          <g className="animate-ping" opacity="0.8">
            <circle cx="180" cy="80" r="4" fill="#38bdf8" />
            <circle cx="370" cy="80" r="4" fill="#38bdf8" />
            <circle cx="470" cy="240" r="4" fill="#38bdf8" />
            <circle cx="370" cy="300" r="4" fill="#38bdf8" />
            <circle cx="180" cy="300" r="4" fill="#38bdf8" />
            <circle cx="80" cy="140" r="4" fill="#38bdf8" />
          </g>
        )}
      </svg>
    </div>
  );
};
