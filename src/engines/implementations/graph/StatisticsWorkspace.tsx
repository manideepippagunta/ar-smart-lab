
import { useGraphStore } from './useGraphStore';
import { ChartRenderer } from './ChartRenderer';
import { Plus, Trash2 } from 'lucide-react';

export const StatisticsWorkspace = () => {
  const {
    chartData,
    chartType,
    updateChartValue,
    updateChartLabel,
    setChartData
  } = useGraphStore();

  const handleAddRow = () => {
    const nextColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    const newRow = {
      label: `Item ${chartData.length + 1}`,
      value: 30,
      color: nextColors[chartData.length % nextColors.length]
    };
    setChartData([...chartData, newRow]);
  };

  const handleRemoveRow = (index: number) => {
    if (chartData.length <= 2) return; // Keep at least two data points
    const nextData = chartData.filter((_, idx) => idx !== index);
    setChartData(nextData);
  };

  return (
    <div className="w-full h-full flex flex-col lg:flex-row relative">
      {/* 1. Main SVG Chart Viewport */}
      <div className="flex-1 min-h-[400px] relative rounded-2xl overflow-hidden glass-panel border border-white/5">
        <ChartRenderer
          type={chartType}
          data={chartData}
          onValueChange={updateChartValue}
        />
      </div>

      {/* 2. Interactive Dataset Editor Sidebar */}
      <div className="w-full lg:w-72 shrink-0 glass-panel border-t lg:border-t-0 lg:border-l border-white/10 p-4 bg-slate-900/60 backdrop-blur-md flex flex-col gap-4 overflow-y-auto">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Dataset Editor</h3>
          <button
            onClick={handleAddRow}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600 hover:bg-blue-500 rounded-lg text-xs font-extrabold text-white transition shadow-lg shadow-blue-500/20"
          >
            <Plus size={12} /> Add
          </button>
        </div>

        {/* Dataset Table Rows */}
        <div className="space-y-2 flex-1 max-h-[300px] lg:max-h-none overflow-y-auto pr-1">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-white/5 shadow-inner group"
            >
              {/* Color swatch marker */}
              <div
                className="w-3.5 h-3.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color || '#3b82f6' }}
              />

              {/* Label Field */}
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateChartLabel(idx, e.target.value)}
                className="w-20 bg-transparent border-0 focus:ring-0 focus:outline-none text-white text-xs font-semibold"
                placeholder="Label"
              />

              {/* Value Input slider indicator */}
              <input
                type="number"
                value={item.value}
                min={0}
                max={100}
                onChange={(e) => updateChartValue(idx, Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-14 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-center text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />

              {/* Delete button */}
              <button
                onClick={() => handleRemoveRow(idx)}
                disabled={chartData.length <= 2}
                className="ml-auto p-1.5 text-slate-500 hover:text-rose-400 disabled:opacity-30 disabled:hover:text-slate-500 transition"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-auto border-t border-white/5 pt-2">
          * Drag columns/markers directly on the chart, or edit input values above. Changes synchronize instantly.
        </div>
      </div>
    </div>
  );
};
