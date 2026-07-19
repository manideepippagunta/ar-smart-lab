import React from 'react';
import { useMensurationStore } from './useMensurationStore';

export const MensurationCanvas2D: React.FC = () => {
  const { activeShape, params } = useMensurationStore();
  const {
    length: l = 5,
    width: w = 4,
    radius: r = 3,
    side: a = 4,
    base: b = 6,
    height: h = 5,
    d1 = 6,
    d2 = 8,
    baseA = 8,
    baseB = 5
  } = params;

  const svgWidth = 500;
  const svgHeight = 350;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2;
  const scale = 25; // Scale factor pixels per unit

  return (
    <div className="w-full h-full bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative shadow-xl min-h-[380px]">
      <span className="absolute top-4 left-4 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
        2D PLANE FIGURE: {activeShape.toUpperCase()}
      </span>

      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full max-w-[550px] max-h-[380px] select-none"
      >
        {/* Background Grid Pattern */}
        <defs>
          <pattern id="grid2d" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={svgWidth} height={svgHeight} fill="url(#grid2d)" rx="12" />

        {/* RECTANGLE */}
        {activeShape === 'rectangle' && (() => {
          const rectW = Math.min(l * scale, 340);
          const rectH = Math.min(w * scale, 220);
          const x = centerX - rectW / 2;
          const y = centerY - rectH / 2;
          return (
            <g>
              <rect x={x} y={y} width={rectW} height={rectH} fill="#3b82f6" fillOpacity="0.25" stroke="#3b82f6" strokeWidth="3" rx="4" />
              {/* Length label */}
              <text x={centerX} y={y - 10} textAnchor="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">
                Length (l) = {l}
              </text>
              {/* Width label */}
              <text x={x - 12} y={centerY} textAnchor="end" dominantBaseline="middle" fill="#93c5fd" fontSize="13" fontWeight="bold">
                Breadth (b) = {w}
              </text>
            </g>
          );
        })()}

        {/* SQUARE */}
        {activeShape === 'square' && (() => {
          const sidePx = Math.min(a * scale, 240);
          const x = centerX - sidePx / 2;
          const y = centerY - sidePx / 2;
          return (
            <g>
              <rect x={x} y={y} width={sidePx} height={sidePx} fill="#8b5cf6" fillOpacity="0.25" stroke="#8b5cf6" strokeWidth="3" rx="4" />
              <text x={centerX} y={y - 10} textAnchor="middle" fill="#c4b5fd" fontSize="13" fontWeight="bold">
                Side (a) = {a}
              </text>
            </g>
          );
        })()}

        {/* TRIANGLE */}
        {activeShape === 'triangle' && (() => {
          const basePx = Math.min(b * scale, 320);
          const heightPx = Math.min(h * scale, 220);
          const p1 = `${centerX - basePx / 2},${centerY + heightPx / 2}`;
          const p2 = `${centerX + basePx / 2},${centerY + heightPx / 2}`;
          const p3 = `${centerX - basePx / 2},${centerY - heightPx / 2}`;
          return (
            <g>
              <polygon points={`${p1} ${p2} ${p3}`} fill="#ec4899" fillOpacity="0.25" stroke="#ec4899" strokeWidth="3" />
              {/* Height line */}
              <line x1={centerX - basePx / 2} y1={centerY + heightPx / 2} x2={centerX - basePx / 2} y2={centerY - heightPx / 2} stroke="#f472b6" strokeDasharray="4 4" strokeWidth="2" />
              <text x={centerX} y={centerY + heightPx / 2 + 20} textAnchor="middle" fill="#fbcfe8" fontSize="13" fontWeight="bold">
                Base (b) = {b}
              </text>
              <text x={centerX - basePx / 2 - 12} y={centerY} textAnchor="end" fill="#fbcfe8" fontSize="13" fontWeight="bold">
                Height (h) = {h}
              </text>
            </g>
          );
        })()}

        {/* CIRCLE */}
        {activeShape === 'circle' && (() => {
          const rPx = Math.min(r * scale, 130);
          return (
            <g>
              <circle cx={centerX} cy={centerY} r={rPx} fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="3" />
              <circle cx={centerX} cy={centerY} r="5" fill="#ffffff" />
              <line x1={centerX} y1={centerY} x2={centerX + rPx} y2={centerY} stroke="#6ee7b7" strokeWidth="2.5" strokeDasharray="3 3" />
              <text x={centerX + rPx / 2} y={centerY - 10} textAnchor="middle" fill="#6ee7b7" fontSize="13" fontWeight="bold">
                Radius (r) = {r}
              </text>
            </g>
          );
        })()}

        {/* PARALLELOGRAM */}
        {activeShape === 'parallelogram' && (() => {
          const basePx = Math.min(b * scale, 260);
          const heightPx = Math.min(h * scale, 180);
          const offset = 40;
          const p1 = `${centerX - basePx / 2},${centerY + heightPx / 2}`;
          const p2 = `${centerX + basePx / 2},${centerY + heightPx / 2}`;
          const p3 = `${centerX + basePx / 2 + offset},${centerY - heightPx / 2}`;
          const p4 = `${centerX - basePx / 2 + offset},${centerY - heightPx / 2}`;
          return (
            <g>
              <polygon points={`${p1} ${p2} ${p3} ${p4}`} fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="3" />
              <text x={centerX} y={centerY + heightPx / 2 + 20} textAnchor="middle" fill="#fde68a" fontSize="13" fontWeight="bold">
                Base (b) = {b}
              </text>
              <text x={centerX + basePx / 2 + offset + 15} y={centerY} textAnchor="start" fill="#fde68a" fontSize="13" fontWeight="bold">
                Height (h) = {h}
              </text>
            </g>
          );
        })()}

        {/* RHOMBUS */}
        {activeShape === 'rhombus' && (() => {
          const d1Px = Math.min(d1 * scale, 260);
          const d2Px = Math.min(d2 * scale, 200);
          const p1 = `${centerX},${centerY - d2Px / 2}`;
          const p2 = `${centerX + d1Px / 2},${centerY}`;
          const p3 = `${centerX},${centerY + d2Px / 2}`;
          const p4 = `${centerX - d1Px / 2},${centerY}`;
          return (
            <g>
              <polygon points={`${p1} ${p2} ${p3} ${p4}`} fill="#06b6d4" fillOpacity="0.25" stroke="#06b6d4" strokeWidth="3" />
              <line x1={centerX - d1Px / 2} y1={centerY} x2={centerX + d1Px / 2} y2={centerY} stroke="#67e8f9" strokeDasharray="4 4" strokeWidth="2" />
              <line x1={centerX} y1={centerY - d2Px / 2} x2={centerX} y2={centerY + d2Px / 2} stroke="#67e8f9" strokeDasharray="4 4" strokeWidth="2" />
              <text x={centerX + d1Px / 4} y={centerY - 8} fill="#67e8f9" fontSize="12" fontWeight="bold">d1 = {d1}</text>
              <text x={centerX + 8} y={centerY - d2Px / 4} fill="#67e8f9" fontSize="12" fontWeight="bold">d2 = {d2}</text>
            </g>
          );
        })()}

        {/* TRAPEZIUM */}
        {activeShape === 'trapezium' && (() => {
          const baseAPx = Math.min(baseA * scale, 280);
          const baseBPx = Math.min(baseB * scale, 180);
          const heightPx = Math.min(h * scale, 180);
          const p1 = `${centerX - baseAPx / 2},${centerY + heightPx / 2}`;
          const p2 = `${centerX + baseAPx / 2},${centerY + heightPx / 2}`;
          const p3 = `${centerX + baseBPx / 2},${centerY - heightPx / 2}`;
          const p4 = `${centerX - baseBPx / 2},${centerY - heightPx / 2}`;
          return (
            <g>
              <polygon points={`${p1} ${p2} ${p3} ${p4}`} fill="#6366f1" fillOpacity="0.25" stroke="#6366f1" strokeWidth="3" />
              <line x1={centerX - baseBPx / 2} y1={centerY - heightPx / 2} x2={centerX - baseBPx / 2} y2={centerY + heightPx / 2} stroke="#a5b4fc" strokeDasharray="3 3" strokeWidth="2" />
              <text x={centerX} y={centerY + heightPx / 2 + 20} textAnchor="middle" fill="#a5b4fc" fontSize="13" fontWeight="bold">a = {baseA}</text>
              <text x={centerX} y={centerY - heightPx / 2 - 10} textAnchor="middle" fill="#a5b4fc" fontSize="13" fontWeight="bold">b = {baseB}</text>
              <text x={centerX - baseBPx / 2 - 12} y={centerY} textAnchor="end" fill="#a5b4fc" fontSize="13" fontWeight="bold">h = {h}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
