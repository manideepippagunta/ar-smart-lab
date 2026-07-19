import { useGeometryStore } from '../store/useGeometryStore';
import { LayoutGrid, Eye, Ruler, Undo2, Redo2, RefreshCcw, MousePointer2 } from 'lucide-react';

export const GeometryToolbox = () => {
  const store = useGeometryStore();

  const controls = [
    { key: 'snapToGrid', label: 'Snap to Grid', icon: <LayoutGrid size={14} /> },
    { key: 'showMeasurements', label: 'Measurements', icon: <Ruler size={14} /> },
    { key: 'showLabels', label: 'Labels', icon: <Eye size={14} /> }
  ];

  return (
    <div className="absolute top-4 left-4 z-10 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-2xl p-2 flex flex-col gap-2">
      <div className="text-xs font-bold text-slate-400 uppercase px-2 py-1 mb-1 border-b border-white/10">Geometry Toolbox</div>
      
      {/* Settings */}
      <div className="space-y-1">
        {controls.map(c => {
          const active = store[c.key as keyof typeof store] as boolean;
          return (
            <button
              key={c.key}
              onClick={() => store.toggleSetting(c.key as any)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                active ? 'bg-blue-600 text-white' : 'bg-slate-900/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {c.icon}
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="h-px bg-white/10 my-1"></div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-1">
        <button 
          onClick={store.undo}
          disabled={store.historyIndex === 0}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Undo2 size={14} />
          <span className="text-[10px] mt-1 font-bold uppercase">Undo</span>
        </button>
        <button 
          onClick={store.redo}
          disabled={store.historyIndex === store.history.length - 1}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          <Redo2 size={14} />
          <span className="text-[10px] mt-1 font-bold uppercase">Redo</span>
        </button>
      </div>

      <button 
        onClick={() => store.reset()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-900/30 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold uppercase transition"
      >
        <RefreshCcw size={14} /> Reset
      </button>

      {/* Selection indicator */}
      {store.selectedIds.length > 0 && (
        <div className="mt-2 p-2 bg-blue-900/30 border border-blue-500/30 rounded-lg flex items-center gap-2">
          <MousePointer2 size={14} className="text-blue-400" />
          <span className="text-xs font-bold text-blue-400">{store.selectedIds.length} Selected</span>
        </div>
      )}
    </div>
  );
};
