import React from 'react';
import { useMensurationStore } from './useMensurationStore';
import { Sliders, RotateCcw, Box } from 'lucide-react';
import type { MensurationParams } from './mensurationTypes';

export const MensurationControls: React.FC = () => {
  const { activeShape, params, updateParam, showWireframe, toggleWireframe, resetParams } = useMensurationStore();

  const is3D = ['cube', 'cuboid', 'cylinder', 'cone', 'sphere', 'prism', 'pyramid'].includes(activeShape);

  const renderSlider = (key: keyof MensurationParams, label: string, min: number = 1, max: number = 20, step: number = 0.5) => (
    <div key={key} className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-300">{label}</span>
        <span className="text-blue-400 font-mono">{params[key] ?? min}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={params[key] ?? min}
        onChange={(e) => updateParam(key, Number(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );

  return (
    <div className="w-full md:w-80 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
      <div>
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders size={16} className="text-blue-400" />
            Shape Parameters
          </h3>
          <div className="flex gap-1">
            {is3D && (
              <button
                onClick={toggleWireframe}
                title="Toggle Wireframe"
                className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  showWireframe ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Box size={14} />
              </button>
            )}
            <button
              onClick={resetParams}
              title="Reset Parameters"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Dynamic Sliders based on Active Shape */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto scrollbar-hide pr-1">
          {(activeShape === 'rectangle' || activeShape === 'cuboid') && (
            <>
              {renderSlider('length', 'Length (l)', 1, 25)}
              {renderSlider('width', activeShape === 'rectangle' ? 'Breadth (b)' : 'Width (w)', 1, 25)}
              {activeShape === 'cuboid' && renderSlider('height', 'Height (h)', 1, 25)}
            </>
          )}

          {(activeShape === 'square' || activeShape === 'cube') && (
            renderSlider('side', 'Side Edge (a)', 1, 20)
          )}

          {activeShape === 'triangle' && (
            <>
              {renderSlider('base', 'Base (b)', 1, 20)}
              {renderSlider('height', 'Height (h)', 1, 20)}
            </>
          )}

          {(activeShape === 'circle' || activeShape === 'sphere') && (
            renderSlider('radius', 'Radius (r)', 1, 15)
          )}

          {activeShape === 'cylinder' && (
            <>
              {renderSlider('radius', 'Radius (r)', 1, 15)}
              {renderSlider('height', 'Height (h)', 1, 25)}
            </>
          )}

          {activeShape === 'cone' && (
            <>
              {renderSlider('radius', 'Radius (r)', 1, 15)}
              {renderSlider('height', 'Height (h)', 1, 25)}
              {renderSlider('slantHeight', 'Slant Height (l)', 1, 30)}
            </>
          )}

          {activeShape === 'parallelogram' && (
            <>
              {renderSlider('base', 'Base (b)', 1, 20)}
              {renderSlider('height', 'Height (h)', 1, 20)}
              {renderSlider('side', 'Side (a)', 1, 20)}
            </>
          )}

          {activeShape === 'rhombus' && (
            <>
              {renderSlider('d1', 'Diagonal 1 (d1)', 1, 20)}
              {renderSlider('d2', 'Diagonal 2 (d2)', 1, 20)}
            </>
          )}

          {activeShape === 'trapezium' && (
            <>
              {renderSlider('baseA', 'Parallel Side A (a)', 1, 25)}
              {renderSlider('baseB', 'Parallel Side B (b)', 1, 25)}
              {renderSlider('height', 'Height (h)', 1, 20)}
            </>
          )}

          {activeShape === 'prism' && (
            <>
              {renderSlider('base', 'Triangular Base (b)', 1, 20)}
              {renderSlider('width', 'Base Height (w)', 1, 20)}
              {renderSlider('height', 'Prism Length (h)', 1, 25)}
            </>
          )}

          {activeShape === 'pyramid' && (
            <>
              {renderSlider('side', 'Base Side (a)', 1, 20)}
              {renderSlider('height', 'Pyramid Height (h)', 1, 25)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
