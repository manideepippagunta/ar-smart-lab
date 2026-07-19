import React from 'react';
import { usePhysicsStore } from './usePhysicsStore';
import type { PhysicsTopic } from './physicsTypes';
import { Activity, Zap, Sun, Compass, RotateCcw, ShieldAlert } from 'lucide-react';

export const PhysicsToolbar: React.FC = () => {
  const { activeTopic, setTopic, resetAll } = usePhysicsStore();

  const topicOptions: { id: PhysicsTopic; label: string; icon: any }[] = [
    { id: 'motion', label: 'Motion & Velocity', icon: Activity },
    { id: 'force_laws', label: "Force & Newton's Laws", icon: ShieldAlert },
    { id: 'work_energy', label: 'Work & Energy', icon: Zap },
    { id: 'optics', label: 'Optics & Light', icon: Sun },
    { id: 'circuits', label: 'Electric Circuits', icon: Zap },
    { id: 'magnetism', label: 'Magnetism', icon: Compass }
  ];

  return (
    <div className="w-full bg-slate-900/95 border-b border-slate-800 p-3 flex flex-wrap items-center justify-between gap-3 shadow-lg z-20">
      {/* Topic Selection Grid */}
      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-hide">
        {topicOptions.map((opt) => {
          const Icon = opt.icon;
          const active = activeTopic === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setTopic(opt.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition flex items-center gap-2 ${
                active
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={14} />
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Global Reset Button */}
      <button
        onClick={resetAll}
        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 border border-slate-700/50"
      >
        <RotateCcw size={13} />
        Reset Engine
      </button>
    </div>
  );
};
