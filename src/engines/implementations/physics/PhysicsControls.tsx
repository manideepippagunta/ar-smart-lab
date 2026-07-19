import React from 'react';
import { usePhysicsStore } from './usePhysicsStore';
import { Sliders, RotateCcw, Play, Pause } from 'lucide-react';
import type { PhysicsParams } from './physicsTypes';

export const PhysicsControls: React.FC = () => {
  const { activeTopic, params, updateParam, isPlaying, togglePlay, resetSim, resetAll } = usePhysicsStore();

  const renderSlider = (key: keyof PhysicsParams, label: string, min: number, max: number, step: number = 1, unit: string = '') => (
    <div key={key} className="space-y-1 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-300">{label}</span>
        <span className="text-blue-400 font-mono">{params[key]} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={params[key] as number}
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
            Physics Parameters
          </h3>
          <button
            onClick={resetAll}
            title="Reset Parameters"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {/* Play / Pause / Reset Simulation Controls for Motion */}
        {(activeTopic === 'motion' || activeTopic === 'force_laws' || activeTopic === 'work_energy') && (
          <div className="flex gap-2 mb-3">
            <button
              onClick={togglePlay}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg ${
                isPlaying ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              {isPlaying ? 'Pause Motion' : 'Play Motion'}
            </button>
            <button
              onClick={resetSim}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
            >
              Reset
            </button>
          </div>
        )}

        {/* Contextual Sliders */}
        <div className="space-y-2 max-h-[340px] overflow-y-auto scrollbar-hide pr-1">
          {(activeTopic === 'motion' || activeTopic === 'force_laws' || activeTopic === 'work_energy') && (
            <>
              {renderSlider('mass', 'Mass (m)', 1, 20, 0.5, 'kg')}
              {renderSlider('force', 'Applied Force (F)', 0, 100, 1, 'N')}
              {renderSlider('rampAngle', 'Ramp Angle (θ)', 0, 45, 1, '°')}
              {renderSlider('friction', 'Friction Coeff (μ)', 0, 0.8, 0.05, '')}
            </>
          )}

          {activeTopic === 'optics' && (
            <>
              {renderSlider('incidentAngle', 'Incident Angle (i)', 0, 75, 1, '°')}
              {renderSlider('refractiveIndex', 'Refractive Index (n2)', 1.0, 2.5, 0.05, '')}
              {renderSlider('focalLength', 'Focal Length (f)', 5, 30, 1, 'cm')}
            </>
          )}

          {activeTopic === 'circuits' && (
            <>
              {renderSlider('voltage', 'Voltage (V)', 1, 24, 1, 'V')}
              {renderSlider('resistance', 'Resistance (R)', 1, 20, 0.5, 'Ω')}
              <button
                onClick={() => updateParam('switchClosed', !params.switchClosed)}
                className={`w-full py-2 mt-2 rounded-xl text-xs font-bold transition border ${
                  params.switchClosed
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-600/20 text-red-400 border-red-500/40'
                }`}
              >
                Switch Status: {params.switchClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
              </button>
            </>
          )}

          {activeTopic === 'magnetism' && (
            renderSlider('magnetStrength', 'Bar Magnet Strength (B)', 0.2, 3.0, 0.1, 'T')
          )}
        </div>
      </div>
    </div>
  );
};
