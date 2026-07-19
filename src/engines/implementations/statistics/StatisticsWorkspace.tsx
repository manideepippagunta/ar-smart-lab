import React, { useState, useRef } from 'react';
import { useStatisticsStore } from './useStatisticsStore';
import { Plus, Trash2, Shuffle, RefreshCw, BarChart2, Activity } from 'lucide-react';

export const StatisticsWorkspace: React.FC = () => {
  const {
    chartType,
    dataset,
    updateDataItem,
    addDataItem,
    removeDataItem,
    shuffleDataset,
    generateRandomDataset
  } = useStatisticsStore();

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const totalSum = dataset.reduce((sum, d) => sum + d.value, 0);
  const maxValue = Math.max(...dataset.map(d => d.value), 10);
  const svgWidth = 600;
  const svgHeight = 400;
  const padding = 50;
  const chartWidth = svgWidth - padding * 2;
  const chartHeight = svgHeight - padding * 2;

  // Handle Drag to adjust Bar / Histogram / Line / Scatter values
  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    (e.target as Element).setPointerCapture(e.pointerId);
    setDraggedId(id);
  };

  const handlePointerMove = (id: string, e: React.PointerEvent) => {
    if (draggedId !== id || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    
    // Normalize Y inside chart bounds
    const relativeY = Math.max(padding, Math.min(svgHeight - padding, mouseY));
    const valRatio = (svgHeight - padding - relativeY) / chartHeight;
    const newValue = Math.max(1, Math.round(valRatio * (maxValue * 1.2)));

    updateDataItem(id, { value: newValue, y: newValue });
  };

  const handlePointerUp = () => {
    if (draggedId) {
      setDraggedId(null);
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-4 p-4 overflow-auto">
      {/* Chart Canvas Area */}
      <div className="flex-1 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col items-center justify-center relative shadow-xl min-h-[420px]">
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1.5">
            <BarChart2 size={14} className="text-blue-400" />
            {chartType.replace('-', ' ').toUpperCase()} VIEW
          </span>
          <span className="text-xs font-semibold text-slate-500">
            (Drag bars/nodes to edit values)
          </span>
        </div>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-w-[650px] max-h-[450px] touch-none select-none"
          onPointerUp={handlePointerUp}
        >
          {/* Background Axes & Grid */}
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#475569" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={svgHeight - padding} stroke="#475569" strokeWidth="2" />

          {/* Y-Axis Ticks */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = svgHeight - padding - ratio * chartHeight;
            const val = Math.round(ratio * (maxValue * 1.2));
            return (
              <g key={idx}>
                <line x1={padding - 5} y1={y} x2={svgWidth - padding} y2={y} stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                <text x={padding - 10} y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="10" fontWeight="bold">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bar Graph / Histogram Mode */}
          {(chartType === 'bar' || chartType === 'histogram') && (
            <g>
              {dataset.map((item, idx) => {
                const count = dataset.length;
                const slotWidth = chartWidth / count;
                const barGap = chartType === 'histogram' ? 0 : Math.min(16, slotWidth * 0.2);
                const barWidth = slotWidth - barGap;
                const x = padding + idx * slotWidth + barGap / 2;
                
                const barHeight = (item.value / (maxValue * 1.2)) * chartHeight;
                const y = svgHeight - padding - barHeight;

                return (
                  <g key={item.id} className="group">
                    {/* Bar Rectangle */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(2, barHeight)}
                      fill={item.color || '#3b82f6'}
                      opacity={draggedId === item.id ? 0.9 : 0.75}
                      rx={chartType === 'histogram' ? 0 : 6}
                      className="transition-all hover:opacity-100 cursor-ns-resize"
                      onPointerDown={(e) => handlePointerDown(item.id, e)}
                      onPointerMove={(e) => handlePointerMove(item.id, e)}
                    />

                    {/* Value Badge on top */}
                    <text
                      x={x + barWidth / 2}
                      y={y - 8}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      {item.value}
                    </text>

                    {/* X-Axis Label */}
                    <text
                      x={x + barWidth / 2}
                      y={svgHeight - padding + 18}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {item.label}
                    </text>

                    {/* Drag Indicator Handle */}
                    <circle
                      cx={x + barWidth / 2}
                      cy={y}
                      r="5"
                      fill="#ffffff"
                      stroke={item.color || '#3b82f6'}
                      strokeWidth="2"
                      className="cursor-ns-resize opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Line Graph & Frequency Polygon Mode */}
          {(chartType === 'line' || chartType === 'frequency-polygon') && (
            <g>
              {(() => {
                const count = dataset.length;
                const pointsList = dataset.map((item, idx) => {
                  const x = padding + (idx + 0.5) * (chartWidth / count);
                  const y = svgHeight - padding - (item.value / (maxValue * 1.2)) * chartHeight;
                  return { x, y, item };
                });

                if (chartType === 'frequency-polygon' && pointsList.length > 0) {
                  const firstX = pointsList[0].x - chartWidth / count;
                  const lastX = pointsList[pointsList.length - 1].x + chartWidth / count;
                  const polyPoints = [
                    `${firstX},${svgHeight - padding}`,
                    ...pointsList.map(p => `${p.x},${p.y}`),
                    `${lastX},${svgHeight - padding}`
                  ].join(' ');

                  return (
                    <g>
                      <polygon points={polyPoints} fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="2.5" />
                      {pointsList.map(({ x, y, item }) => (
                        <g key={item.id} className="cursor-ns-resize">
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill={item.color || '#3b82f6'}
                            stroke="#ffffff"
                            strokeWidth="2"
                            onPointerDown={(e) => handlePointerDown(item.id, e)}
                            onPointerMove={(e) => handlePointerMove(item.id, e)}
                          />
                          <text x={x} y={y - 10} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                            {item.value}
                          </text>
                          <text x={x} y={svgHeight - padding + 18} textAnchor="middle" fill="#94a3b8" fontSize="10">
                            {item.label}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                }

                const pathData = pointsList.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

                return (
                  <g>
                    <path d={pathData} fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    {pointsList.map(({ x, y, item }) => (
                      <g key={item.id} className="cursor-ns-resize">
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill={item.color || '#6366f1'}
                          stroke="#ffffff"
                          strokeWidth="2"
                          onPointerDown={(e) => handlePointerDown(item.id, e)}
                          onPointerMove={(e) => handlePointerMove(item.id, e)}
                        />
                        <text x={x} y={y - 10} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                          {item.value}
                        </text>
                        <text x={x} y={svgHeight - padding + 18} textAnchor="middle" fill="#94a3b8" fontSize="10">
                          {item.label}
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </g>
          )}

          {/* Scatter Plot Mode */}
          {chartType === 'scatter' && (
            <g>
              {dataset.map((item) => {
                const posX = item.x ?? 1;
                const posY = item.value;
                const cx = padding + (posX / 10) * chartWidth;
                const cy = svgHeight - padding - (posY / (maxValue * 1.2)) * chartHeight;

                return (
                  <g key={item.id} className="group cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r="8"
                      fill={item.color || '#ec4899'}
                      opacity="0.8"
                      stroke="#ffffff"
                      strokeWidth="2"
                      onPointerDown={(e) => handlePointerDown(item.id, e)}
                      onPointerMove={(e) => handlePointerMove(item.id, e)}
                    />
                    <text x={cx} y={cy - 12} textAnchor="middle" fill="#f472b6" fontSize="11" fontWeight="bold">
                      ({posX}, {posY})
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Pie Chart Mode */}
          {chartType === 'pie' && (
            <g transform={`translate(${svgWidth / 2}, ${svgHeight / 2})`}>
              {(() => {
                const radius = 130;
                let startAngle = 0;

                return dataset.map((item) => {
                  const portion = totalSum > 0 ? item.value / totalSum : 0;
                  const sliceAngle = portion * 2 * Math.PI;
                  const endAngle = startAngle + sliceAngle;

                  const x1 = radius * Math.cos(startAngle);
                  const y1 = radius * Math.sin(startAngle);
                  const x2 = radius * Math.cos(endAngle);
                  const y2 = radius * Math.sin(endAngle);

                  const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
                  const pathData = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

                  // Angle bisector for text label positioning
                  const midAngle = startAngle + sliceAngle / 2;
                  const labelRadius = radius * 0.65;
                  const lx = labelRadius * Math.cos(midAngle);
                  const ly = labelRadius * Math.sin(midAngle);

                  startAngle = endAngle;

                  const percentage = (portion * 100).toFixed(1);

                  return (
                    <g key={item.id} className="group hover:scale-105 transition-transform origin-center">
                      <path d={pathData} fill={item.color || '#3b82f6'} opacity="0.85" stroke="#0f172a" strokeWidth="2" />
                      {portion > 0.05 && (
                        <text
                          x={lx}
                          y={ly}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                          fontSize="11"
                          fontWeight="bold"
                        >
                          {percentage}%
                        </text>
                      )}
                    </g>
                  );
                });
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Dataset Editor Table Panel */}
      <div className="w-full md:w-80 bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-blue-400" />
            Dataset Editor
          </h3>
          <div className="flex gap-1">
            <button
              onClick={shuffleDataset}
              title="Shuffle Data Order"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              <Shuffle size={14} />
            </button>
            <button
              onClick={() => generateRandomDataset('test_scores')}
              title="Generate Random Test Scores"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
            >
              <RefreshCw size={14} />
            </button>
            <button
              onClick={() => addDataItem()}
              title="Add Data Entry"
              className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition flex items-center gap-1 text-xs font-bold px-2"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Rows List */}
        <div className="flex-1 overflow-y-auto space-y-2 max-h-[340px] pr-1 scrollbar-hide">
          {dataset.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 hover:border-slate-700 transition"
            >
              <input
                type="color"
                value={item.color || '#3b82f6'}
                onChange={(e) => updateDataItem(item.id, { color: e.target.value })}
                className="w-6 h-6 rounded border-none cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateDataItem(item.id, { label: e.target.value })}
                className="flex-1 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                value={item.value}
                onChange={(e) => updateDataItem(item.id, { value: Number(e.target.value), y: Number(e.target.value) })}
                className="w-16 bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white text-right font-bold focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => removeDataItem(item.id)}
                className="text-slate-500 hover:text-red-400 p-1 transition"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
