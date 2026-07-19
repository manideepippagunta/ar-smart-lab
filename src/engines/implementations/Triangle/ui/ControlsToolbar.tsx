import { useTriangleStore } from '../store';
import { Settings, Eye, LayoutGrid, Ruler, CheckCircle } from 'lucide-react';

export const ControlsToolbar = () => {
  const store = useTriangleStore();

  const controls = [
    { key: 'showMeasurements', label: 'Measurements', icon: <Ruler size={14} /> },
    { key: 'showLabels', label: 'Angle Labels', icon: <Eye size={14} /> },
    { key: 'wireframe', label: 'Wireframe', icon: <LayoutGrid size={14} /> },
    { key: 'showMedians', label: 'Medians', icon: <CheckCircle size={14} /> },
    { key: 'showAltitudes', label: 'Altitudes', icon: <Settings size={14} /> },
    { key: 'showIncircle', label: 'Incircle', icon: <Eye size={14} /> },
    { key: 'showCircumcircle', label: 'Circumcircle', icon: <Eye size={14} /> },
  ];

  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-2xl p-2 flex flex-col gap-2">
      <div className="text-xs font-bold text-slate-400 uppercase px-2 py-1 mb-1 border-b border-white/10">Controls</div>
      {controls.map(c => {
        const active = store[c.key as keyof typeof store] as boolean;
        return (
          <button
            key={c.key}
            onClick={() => store.toggleVisibility(c.key as any)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              active ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {c.icon}
            {c.label}
          </button>
        );
      })}
    </div>
  );
};
