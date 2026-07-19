import React from 'react';
import { useGraphStore } from './useGraphStore';
import type { GraphTool, ChartType } from './useGraphStore';
import {
  MousePointer, MapPin, Minimize2, Move,
  ZoomIn, ZoomOut, RotateCcw,
  Undo2, Redo2, Magnet,
  BarChart4, PieChart, Activity, LineChart
} from 'lucide-react';

export const GraphToolbar = () => {
  const {
    mode,
    tool,
    chartType,
    snapToGrid,
    zoom,
    setTool,
    setChartType,
    setSnapToGrid,
    setZoom,
    setPan,
    undo,
    redo,
    reset,
    past,
    future
  } = useGraphStore();

  const handleZoomIn = () => setZoom(z => z + 0.15);
  const handleZoomOut = () => setZoom(z => z - 0.15);
  const handleZoomReset = () => {
    setZoom(1.0);
    setPan({ x: 400, y: 300 });
  };

  const coordinateTools: { id: GraphTool; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Pan / Select', icon: <MousePointer size={15} /> },
    { id: 'point', label: 'Plotted Point', icon: <MapPin size={15} /> },
    { id: 'segment', label: 'Line Segment', icon: <Minimize2 size={15} /> },
    { id: 'ray', label: 'Ray Line', icon: <Move size={15} /> },
    { id: 'line', label: 'Infinite Line', icon: <Move size={15} /> },
    { id: 'vector', label: 'Vector (Arrow)', icon: <Move size={15} /> }
  ];

  const chartTypes: { id: ChartType; label: string; icon: React.ReactNode }[] = [
    { id: 'bar', label: 'Bar Graph', icon: <BarChart4 size={15} /> },
    { id: 'histogram', label: 'Histogram', icon: <BarChart4 size={15} /> },
    { id: 'pie', label: 'Pie Chart', icon: <PieChart size={15} /> },
    { id: 'scatter', label: 'Scatter Plot', icon: <Activity size={15} /> },
    { id: 'line', label: 'Line Graph', icon: <LineChart size={15} /> },
    { id: 'frequency', label: 'Freq Polygon', icon: <LineChart size={15} /> }
  ];

  return (
    <div className="flex flex-col gap-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl text-white">
      {/* 1. Primary Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        
        {/* Undo/Redo/Reset Operations */}
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-2 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg text-slate-300 transition"
            title="Undo Action"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-2 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg text-slate-300 transition"
            title="Redo Action"
          >
            <Redo2 size={16} />
          </button>
          <button
            onClick={reset}
            className="p-2 hover:bg-rose-900/30 hover:text-rose-400 rounded-lg text-slate-400 transition"
            title="Reset Board"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Viewport controls */}
        <div className="flex items-center gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/5">
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono px-1 font-bold text-slate-400 min-w-[32px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-300 transition"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleZoomReset}
            className="px-2.5 py-1.5 bg-slate-850 hover:bg-slate-700 text-xs font-bold rounded-lg transition"
            title="Reset Pan & Zoom"
          >
            Reset view
          </button>
        </div>

        {/* Coordinate plane helpers */}
        {mode === 'coordinate' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSnapToGrid(!snapToGrid)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-extrabold transition border ${
                snapToGrid
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-slate-800 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Magnet size={14} /> Snap Grid
            </button>
          </div>
        )}
      </div>

      <div className="h-px bg-white/5"></div>

      {/* 2. Tool / Chart selector tab list */}
      <div className="flex flex-wrap gap-2">
        {mode === 'coordinate' ? (
          // Render coordinate geometry drawing tools
          coordinateTools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
                tool === t.id
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25 scale-[1.03]'
                  : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))
        ) : (
          // Render statistics chart formats
          chartTypes.map((c) => (
            <button
              key={c.id}
              onClick={() => setChartType(c.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border ${
                chartType === c.id
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-[1.03]'
                  : 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
export default GraphToolbar;
