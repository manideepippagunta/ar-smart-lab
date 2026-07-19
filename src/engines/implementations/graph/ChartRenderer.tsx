import React, { useRef, useState } from 'react';
import { useGraphStore } from './useGraphStore';
import type { ChartDataItem } from './useGraphStore';

interface ChartRendererProps {
  type: 'bar' | 'histogram' | 'pie' | 'scatter' | 'line' | 'frequency';
  data: ChartDataItem[];
  onValueChange: (idx: number, val: number) => void;
}

export const ChartRenderer = ({ type, data, onValueChange }: ChartRendererProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const { pushHistory } = useGraphStore();

  const width = 800;
  const height = 500;
  const padding = 60;

  // Axis ranges
  const maxY = 100;
  const chartHeight = height - padding * 2;
  const chartWidth = width - padding * 2;

  // Convert value to screen Y
  const toScreenY = (val: number) => {
    return height - padding - (val / maxY) * chartHeight;
  };

  // Convert screen Y to value
  const toValueY = (sy: number) => {
    const rawVal = ((height - padding - sy) / chartHeight) * maxY;
    return Math.max(0, Math.min(maxY, Math.round(rawVal)));
  };

  // Dragging interaction
  const handlePointerDown = (idx: number, e: React.PointerEvent) => {
    e.stopPropagation();
    const el = e.target as SVGElement;
    el.setPointerCapture(e.pointerId);
    setDraggingIdx(idx);
    pushHistory();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingIdx !== null && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const sy = e.clientY - rect.top;
      const newVal = toValueY(sy);
      onValueChange(draggingIdx, newVal);
    }
  };

  const handlePointerUp = (_: number, e: React.PointerEvent) => {
    e.stopPropagation();
    const el = e.target as SVGElement;
    el.releasePointerCapture(e.pointerId);
    setDraggingIdx(null);
  };

  // Helper polar calculation for Pie Chart
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  // Render Grid Lines for non-pie charts
  const renderBackgroundGrid = () => {
    const ticks = [0, 20, 40, 60, 80, 100];
    return (
      <g>
        {ticks.map((tick) => {
          const sy = toScreenY(tick);
          return (
            <g key={tick}>
              <line
                x1={padding}
                y1={sy}
                x2={width - padding}
                y2={sy}
                stroke="#1e293b"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <text
                x={padding - 12}
                y={sy + 4}
                fill="#94a3b8"
                fontSize={10}
                textAnchor="end"
                fontWeight="bold"
              >
                {tick}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // 1. BAR GRAPH RENDERER
  const renderBarGraph = () => {
    const numBars = data.length;
    const barWidth = (chartWidth / numBars) * 0.6;
    const spacing = (chartWidth / numBars) * 0.4;
    const startX = padding + spacing / 2;

    return data.map((item, idx) => {
      const x = startX + idx * (barWidth + spacing);
      const sy = toScreenY(item.value);
      const barHeight = height - padding - sy;
      const isDragging = draggingIdx === idx;

      return (
        <g key={idx}>
          {/* Main Bar Rectangle */}
          <rect
            x={x}
            y={sy}
            width={barWidth}
            height={Math.max(2, barHeight)}
            fill={isDragging ? '#60a5fa' : (item.color || '#3b82f6')}
            rx={4}
            opacity={0.85}
            className="transition-all duration-150"
          />

          {/* Interactive Drag Handle (top edge overlay) */}
          <rect
            x={x - 4}
            y={sy - 6}
            width={barWidth + 8}
            height={12}
            fill="transparent"
            className="cursor-ns-resize"
            onPointerDown={(e) => handlePointerDown(idx, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => handlePointerUp(idx, e)}
          />

          {/* Value Label */}
          <text
            x={x + barWidth / 2}
            y={sy - 10}
            fill="#ffffff"
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
          >
            {item.value}
          </text>

          {/* Category X Label */}
          <text
            x={x + barWidth / 2}
            y={height - padding + 20}
            fill="#94a3b8"
            fontSize={12}
            textAnchor="middle"
          >
            {item.label}
          </text>
        </g>
      );
    });
  };

  // 2. HISTOGRAM RENDERER (Continuous bars, no spacing)
  const renderHistogram = () => {
    const numBars = data.length;
    const barWidth = chartWidth / numBars;
    const startX = padding;

    return data.map((item, idx) => {
      const x = startX + idx * barWidth;
      const sy = toScreenY(item.value);
      const barHeight = height - padding - sy;
      const isDragging = draggingIdx === idx;

      return (
        <g key={idx}>
          <rect
            x={x}
            y={sy}
            width={barWidth}
            height={Math.max(2, barHeight)}
            fill={isDragging ? '#34d399' : (item.color || '#10b981')}
            stroke="#0f172a"
            strokeWidth={1}
            opacity={0.8}
          />
          <rect
            x={x}
            y={sy - 6}
            width={barWidth}
            height={12}
            fill="transparent"
            className="cursor-ns-resize"
            onPointerDown={(e) => handlePointerDown(idx, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => handlePointerUp(idx, e)}
          />
          <text
            x={x + barWidth / 2}
            y={sy - 10}
            fill="#ffffff"
            fontSize={11}
            fontWeight="bold"
            textAnchor="middle"
          >
            {item.value}
          </text>
          <text
            x={x + barWidth / 2}
            y={height - padding + 20}
            fill="#94a3b8"
            fontSize={10}
            textAnchor="middle"
          >
            {item.label}
          </text>
        </g>
      );
    });
  };

  // 3. PIE CHART RENDERER
  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
    const cx = width / 2;
    const cy = height / 2;
    const r = 160;

    let accumulatedPercent = 0;

    return data.map((item, idx) => {
      const percent = item.value / total;
      const [startX, startY] = getCoordinatesForPercent(accumulatedPercent);
      accumulatedPercent += percent;
      const [endX, endY] = getCoordinatesForPercent(accumulatedPercent);

      const x1 = cx + startX * r;
      const y1 = cy + startY * r;
      const x2 = cx + endX * r;
      const y2 = cy + endY * r;

      const largeArcFlag = percent > 0.5 ? 1 : 0;

      // Draw Pie wedge path
      const pathData = [
        `M ${cx} ${cy}`,
        `L ${x1} ${y1}`,
        `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      // Position for percentage value text labels
      const midPercent = accumulatedPercent - percent / 2;
      const [midX, midY] = getCoordinatesForPercent(midPercent);
      const labelX = cx + midX * (r * 0.6);
      const labelY = cy + midY * (r * 0.6);

      const colorPalette = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
      const sliceColor = item.color || colorPalette[idx % colorPalette.length];

      return (
        <g key={idx}>
          <path
            d={pathData}
            fill={sliceColor}
            opacity={0.8}
            className="hover:opacity-100 transition-opacity duration-150 cursor-pointer"
            onClick={() => {
              // Click wedge to trigger a mock/simulated drag increment
              pushHistory();
              onValueChange(idx, (item.value + 5) % 100);
            }}
          />
          <text
            x={labelX}
            y={labelY}
            fill="#ffffff"
            fontSize={12}
            fontWeight="bold"
            textAnchor="middle"
          >
            {((percent) * 100).toFixed(0)}%
          </text>
          
          {/* Pie legend items */}
          <g transform={`translate(${width - 150}, ${padding + idx * 25})`}>
            <rect width={15} height={15} fill={sliceColor} rx={3} />
            <text x={22} y={12} fill="#ffffff" fontSize={12} fontWeight="bold">
              {item.label} ({item.value})
            </text>
          </g>
        </g>
      );
    });
  };

  // 4. SCATTER PLOT RENDERER
  const renderScatterPlot = () => {
    const spacing = chartWidth / (data.length - 1 || 1);
    const startX = padding;

    return data.map((item, idx) => {
      const x = startX + idx * spacing;
      const sy = toScreenY(item.value);
      const isDragging = draggingIdx === idx;

      return (
        <g key={idx}>
          <circle
            cx={x}
            cy={sy}
            r={8}
            fill={isDragging ? '#ffffff' : (item.color || '#ef4444')}
            stroke="#0f172a"
            strokeWidth={2}
            className="cursor-ns-resize hover:scale-125 transition-transform"
            onPointerDown={(e) => handlePointerDown(idx, e)}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => handlePointerUp(idx, e)}
          />
          <text
            x={x}
            y={sy - 12}
            fill="#ffffff"
            fontSize={11}
            fontWeight="bold"
            textAnchor="middle"
          >
            ({idx}, {item.value})
          </text>
          <text
            x={x}
            y={height - padding + 20}
            fill="#94a3b8"
            fontSize={12}
            textAnchor="middle"
          >
            {item.label}
          </text>
        </g>
      );
    });
  };

  // 5. LINE GRAPH RENDERER
  const renderLineGraph = () => {
    const spacing = chartWidth / (data.length - 1 || 1);
    const startX = padding;

    // Build SVG Path points for segments
    const pointsList = data.map((item, idx) => ({
      x: startX + idx * spacing,
      y: toScreenY(item.value)
    }));

    const pathData = pointsList.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ');

    return (
      <g>
        {/* Connection segments */}
        <path d={pathData} fill="none" stroke="#8b5cf6" strokeWidth={3} />

        {/* Nodes and dragging handles */}
        {data.map((item, idx) => {
          const pt = pointsList[idx];
          const isDragging = draggingIdx === idx;

          return (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6}
                fill={isDragging ? '#ffffff' : '#8b5cf6'}
                stroke="#1e293b"
                strokeWidth={2}
                className="cursor-ns-resize hover:scale-125 transition-transform"
                onPointerDown={(e) => handlePointerDown(idx, e)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(idx, e)}
              />
              <text x={pt.x} y={pt.y - 12} fill="#ffffff" fontSize={11} fontWeight="bold" textAnchor="middle">
                {item.value}
              </text>
              <text x={pt.x} y={height - padding + 20} fill="#94a3b8" fontSize={12} textAnchor="middle">
                {item.label}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  // 6. FREQUENCY POLYGON RENDERER (Similar to line graph, but connects bounds to zero baseline)
  const renderFrequencyPolygon = () => {
    const spacing = chartWidth / (data.length - 1 || 1);
    const startX = padding;

    const pointsList = data.map((item, idx) => ({
      x: startX + idx * spacing,
      y: toScreenY(item.value)
    }));

    // Add baseline anchors to start and end
    const polygonPath = [
      `M ${startX} ${height - padding}`,
      ...pointsList.map(pt => `L ${pt.x} ${pt.y}`),
      `L ${startX + (data.length - 1) * spacing} ${height - padding}`,
      'Z'
    ].join(' ');

    return (
      <g>
        {/* Shaded area */}
        <path d={polygonPath} fill="#f59e0b" opacity={0.2} />
        
        {/* Outline segment */}
        <path 
          d={pointsList.map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' ')} 
          fill="none" 
          stroke="#f59e0b" 
          strokeWidth={3} 
        />

        {/* Nodes and labels */}
        {data.map((item, idx) => {
          const pt = pointsList[idx];
          const isDragging = draggingIdx === idx;

          return (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6}
                fill={isDragging ? '#ffffff' : '#f59e0b'}
                stroke="#1e293b"
                strokeWidth={2}
                className="cursor-ns-resize hover:scale-125 transition-transform"
                onPointerDown={(e) => handlePointerDown(idx, e)}
                onPointerMove={handlePointerMove}
                onPointerUp={(e) => handlePointerUp(idx, e)}
              />
              <text x={pt.x} y={pt.y - 12} fill="#ffffff" fontSize={11} fontWeight="bold" textAnchor="middle">
                {item.value}
              </text>
              <text x={pt.x} y={height - padding + 20} fill="#94a3b8" fontSize={12} textAnchor="middle">
                {item.label}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <svg
      ref={svgRef}
      className="w-full h-full bg-[#0b0f19]"
      onPointerMove={handlePointerMove}
    >
      {/* Grid line guidelines */}
      {type !== 'pie' && renderBackgroundGrid()}

      {/* Axis Lines for non-pie charts */}
      {type !== 'pie' && (
        <g stroke="#475569" strokeWidth={2}>
          {/* Y Axis */}
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} />
          {/* X Axis */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} />
        </g>
      )}

      {/* Specific Chart Renderers */}
      {type === 'bar' && renderBarGraph()}
      {type === 'histogram' && renderHistogram()}
      {type === 'pie' && renderPieChart()}
      {type === 'scatter' && renderScatterPlot()}
      {type === 'line' && renderLineGraph()}
      {type === 'frequency' && renderFrequencyPolygon()}
    </svg>
  );
};
