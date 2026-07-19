import { useRef, useState } from 'react';
import { useGraphStore } from './useGraphStore';
import type { GraphElement } from './useGraphStore';

export const CoordinateWorkspace = () => {
  const {
    points,
    elements,
    tool,
    snapToGrid,
    selectedIds,
    pan,
    zoom,
    addPoint,
    updatePoint,
    addElement,
    selectId,
    setPan,
    pushHistory
  } = useGraphStore();

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [lineStartPointId, setLineStartPointId] = useState<string | null>(null);

  // Conversion: Math Coordinate -> Screen Pixel Coordinate (800x600 relative space)
  const unitPixels = 40 * zoom;

  const toScreen = (mx: number, my: number): [number, number] => {
    const sx = pan.x + mx * unitPixels;
    const sy = pan.y - my * unitPixels;
    return [sx, sy];
  };

  // Conversion: Screen Pixel Coordinate -> Math Coordinate
  const toMath = (sx: number, sy: number): [number, number] => {
    let mx = (sx - pan.x) / unitPixels;
    let my = (pan.y - sy) / unitPixels;

    if (snapToGrid) {
      mx = Math.round(mx);
      my = Math.round(my);
    } else {
      mx = Math.round(mx * 10) / 10;
      my = Math.round(my * 10) / 10;
    }

    return [mx, my];
  };

  // Dragging Points
  const handlePointPointerDown = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    const el = e.target as SVGElement;
    el.setPointerCapture(e.pointerId);
    setDraggingPointId(id);
    pushHistory();
  };

  const handlePointPointerMove = (e: React.PointerEvent) => {
    if (draggingPointId && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const sx = e.clientX - rect.left;
      const sy = e.clientY - rect.top;
      const [mx, my] = toMath(sx, sy);
      updatePoint(draggingPointId, mx, my);
    }
  };

  const handlePointPointerUp = (_: string, e: React.PointerEvent) => {
    e.stopPropagation();
    const el = e.target as SVGElement;
    el.releasePointerCapture(e.pointerId);
    setDraggingPointId(null);
  };

  // Viewport Panning
  const handleBgPointerDown = (e: React.PointerEvent) => {
    if (tool !== 'select') return;
    setIsPanning(true);
    setPanStart({ x: e.clientX, y: e.clientY });
  };

  const handleBgPointerMove = (e: React.PointerEvent) => {
    if (isPanning) {
      const dx = e.clientX - panStart.x;
      const dy = e.clientY - panStart.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleBgPointerUp = () => {
    setIsPanning(false);
  };

  // Workspace clicks (adding points or drawing lines)
  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning || draggingPointId || !svgRef.current) return;
    
    // Ignore click if clicking directly on a point circle
    const target = e.target as SVGElement;
    if (target.getAttribute('data-type') === 'point') return;

    const rect = svgRef.current.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const [mx, my] = toMath(sx, sy);

    if (tool === 'point') {
      addPoint(mx, my);
    } else {
      setLineStartPointId(null);
    }
  };

  const handlePointClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tool === 'select') {
      selectId(id, e.shiftKey || e.ctrlKey);
      return;
    }

    if (['segment', 'ray', 'line', 'vector'].includes(tool)) {
      if (!lineStartPointId) {
        setLineStartPointId(id);
      } else {
        if (lineStartPointId !== id) {
          addElement(tool as any, lineStartPointId, id);
        }
        setLineStartPointId(null);
      }
    }
  };

  // Dynamic grid lines computations for pan & zoom
  const renderGrid = () => {
    const gridLines = [];
    const width = 800;
    const height = 600;

    const startX = pan.x % unitPixels;
    const startY = pan.y % unitPixels;

    // Vertical lines
    for (let x = startX - unitPixels; x < width + unitPixels; x += unitPixels) {
      const mathVal = toMath(x, pan.y)[0];
      const isBold = mathVal === 0;
      gridLines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={height}
          stroke={isBold ? '#94a3b8' : '#334155'}
          strokeWidth={isBold ? 2.5 : 1}
        />
      );
    }

    // Horizontal lines
    for (let y = startY - unitPixels; y < height + unitPixels; y += unitPixels) {
      const mathVal = toMath(pan.x, y)[1];
      const isBold = mathVal === 0;
      gridLines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={width}
          y2={y}
          stroke={isBold ? '#94a3b8' : '#334155'}
          strokeWidth={isBold ? 2.5 : 1}
        />
      );
    }

    // Origin highlighter (0,0)
    const [origX, origY] = toScreen(0, 0);
    gridLines.push(
      <circle
        key="origin"
        cx={origX}
        cy={origY}
        r={6}
        fill="#f59e0b"
        opacity={0.6}
      />
    );

    return gridLines;
  };

  // Helper to draw infinite lines and rays
  const getLineCoordinates = (el: GraphElement) => {
    const p1 = points.find((p) => p.id === el.p1Id);
    const p2 = points.find((p) => p.id === el.p2Id);
    if (!p1 || !p2) return null;

    const [x1, y1] = toScreen(p1.x, p1.y);
    const [x2, y2] = toScreen(p2.x, p2.y);

    if (el.type === 'segment') {
      return { x1, y1, x2, y2 };
    }

    const angle = Math.atan2(y2 - y1, x2 - x1);

    if (el.type === 'ray') {
      // Ray: Starts at A (x1, y1), goes to infinity in B's direction
      const len = 1000;
      const ex = x1 + Math.cos(angle) * len;
      const ey = y1 + Math.sin(angle) * len;
      return { x1, y1, x2: ex, y2: ey };
    }

    // Infinite Line: goes to infinity in both directions
    const len = 1500;
    const ex1 = x1 - Math.cos(angle) * len;
    const ey1 = y1 - Math.sin(angle) * len;
    const ex2 = x1 + Math.cos(angle) * len;
    const ey2 = y1 + Math.sin(angle) * len;
    return { x1: ex1, y1: ey1, x2: ex2, y2: ey2 };
  };

  return (
    <div className="w-full h-full relative select-none">
      <svg
        ref={svgRef}
        className="w-full h-full bg-[#0b0f19]"
        onClick={handleSvgClick}
        onPointerDown={handleBgPointerDown}
        onPointerMove={handleBgPointerMove}
        onPointerUp={handleBgPointerUp}
      >
        <defs>
          {/* Defs for arrow markers used by Vectors */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="8"
            markerHeight="8"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
          </marker>
        </defs>

        {/* 1. Grid Lines */}
        {renderGrid()}

        {/* 2. Plotted Lines, Rays, Segments, Vectors */}
        {elements.map((el) => {
          const coords = getLineCoordinates(el);
          if (!coords) return null;
          const isSelected = selectedIds.includes(el.id);

          return (
            <line
              key={el.id}
              x1={coords.x1}
              y1={coords.y1}
              x2={coords.x2}
              y2={coords.y2}
              stroke={isSelected ? '#ef4444' : el.color}
              strokeWidth={isSelected ? 4 : 3}
              markerEnd={el.type === 'vector' ? 'url(#arrow)' : undefined}
              onClick={(e) => {
                e.stopPropagation();
                selectId(el.id, e.shiftKey);
              }}
              className="cursor-pointer transition-colors"
            />
          );
        })}

        {/* 3. Helper Line Drawing Indicator */}
        {lineStartPointId && (() => {
          const p = points.find((pt) => pt.id === lineStartPointId);
          if (!p) return null;
          const [sx, sy] = toScreen(p.x, p.y);
          return (
            <circle
              cx={sx}
              cy={sy}
              r={12}
              fill="none"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="4 2"
              className="animate-spin"
              style={{ transformOrigin: `${sx}px ${sy}px`, animationDuration: '3s' }}
            />
          );
        })()}

        {/* 4. Interactive Points & Labels */}
        {points.map((p) => {
          const [sx, sy] = toScreen(p.x, p.y);
          const isSelected = selectedIds.includes(p.id);
          const isLineStart = lineStartPointId === p.id;

          return (
            <g key={p.id} className="group">
              {/* Target glow ring */}
              <circle
                cx={sx}
                cy={sy}
                r={isSelected ? 16 : 10}
                fill={isSelected ? '#ef4444' : p.color}
                opacity={0.3}
                className="transition-all duration-150"
              />

              {/* Point Circle */}
              <circle
                cx={sx}
                cy={sy}
                r={isSelected ? 8 : 6}
                fill={isSelected ? '#ffffff' : (isLineStart ? '#f59e0b' : p.color)}
                stroke="#1e293b"
                strokeWidth={2}
                data-type="point"
                onPointerDown={(e) => handlePointPointerDown(p.id, e)}
                onPointerMove={handlePointPointerMove}
                onPointerUp={(e) => handlePointPointerUp(p.id, e)}
                onClick={(e) => handlePointClick(p.id, e)}
                className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
              />

              {/* Label: Point Name + Coordinates (e.g. A(2, 3)) */}
              <text
                x={sx + 12}
                y={sy - 12}
                fill="#ffffff"
                fontSize={12}
                fontWeight="bold"
                className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              >
                {p.label}({p.x.toFixed(0)}, {p.y.toFixed(0)})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
