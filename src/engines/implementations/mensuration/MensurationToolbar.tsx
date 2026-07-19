import React, { useState } from 'react';
import { useMensurationStore } from './useMensurationStore';
import type { ShapeType } from './mensurationTypes';
import { Shapes, Box, RotateCcw } from 'lucide-react';

export const MensurationToolbar: React.FC = () => {
  const { activeShape, setShape, resetParams } = useMensurationStore();
  const [category, setCategory] = useState<'2D' | '3D'>('2D');

  const shapes2D: { id: ShapeType; label: string }[] = [
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'square', label: 'Square' },
    { id: 'triangle', label: 'Triangle' },
    { id: 'circle', label: 'Circle' },
    { id: 'parallelogram', label: 'Parallelogram' },
    { id: 'rhombus', label: 'Rhombus' },
    { id: 'trapezium', label: 'Trapezium' }
  ];

  const shapes3D: { id: ShapeType; label: string }[] = [
    { id: 'cube', label: 'Cube' },
    { id: 'cuboid', label: 'Cuboid' },
    { id: 'cylinder', label: 'Cylinder' },
    { id: 'cone', label: 'Cone' },
    { id: 'sphere', label: 'Sphere' },
    { id: 'prism', label: 'Prism' },
    { id: 'pyramid', label: 'Pyramid' }
  ];

  return (
    <div className="w-full bg-slate-900/95 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
      {/* Category Filter Switcher (2D vs 3D) */}
      <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          onClick={() => {
            setCategory('2D');
            setShape('rectangle');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
            category === '2D'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shapes size={14} />
          2D Figures
        </button>

        <button
          onClick={() => {
            setCategory('3D');
            setShape('cuboid');
          }}
          className={`px-4 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
            category === '3D'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box size={14} />
          3D Solids
        </button>
      </div>

      {/* Shape Selector Sub-Grid */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-hide">
        {(category === '2D' ? shapes2D : shapes3D).map((shape) => {
          const active = activeShape === shape.id;
          return (
            <button
              key={shape.id}
              onClick={() => setShape(shape.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                active
                  ? category === '2D'
                    ? 'bg-slate-800 text-blue-400 border border-blue-500/30'
                    : 'bg-slate-800 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {shape.label}
            </button>
          );
        })}
      </div>

      {/* Reset Engine Button */}
      <button
        onClick={resetParams}
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/50"
      >
        <RotateCcw size={13} />
        Reset Engine
      </button>
    </div>
  );
};
