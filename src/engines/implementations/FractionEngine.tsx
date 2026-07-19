import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { BaseEngine } from '../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../core/types';
import { useEngineAdapterStore } from '../core/EngineAdapterStore';
import { useGeometryStore } from '../shared/geometry/store/useGeometryStore';
import type { ComputedStat } from '../shared/geometry/store/useGeometryStore';
import { Line, Html, Box, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { PropertiesPanel } from '../shared/geometry/ui/PropertiesPanel';
import { FormulaPanel } from '../shared/geometry/ui/FormulaPanel';

type VisualizationType = 'Circle' | 'Bar' | 'NumberLine' | 'Area' | 'Set';

export const FractionEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((state) => state.setAdapter);
  const setComputedStats = useGeometryStore((state) => state.setComputedStats);

  // Read config from lesson JSON
  const config = (props.lesson as any).engineConfig || { mode: 'Beginner', initialNumerator: 2, initialDenominator: 5 };
  
  const isAdvanced = config.mode === 'Advanced';

  // Fraction state
  const [num, setNum] = useState(config.initialNumerator || 2);
  const [den, setDen] = useState(config.initialDenominator || 5);
  const [visType, setVisType] = useState<VisualizationType>('Circle');
  // Sector click states (Beginner mode helper)
  const [coloredSectors, setColoredSectors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Sync initial numerator selections
    const initialSectors: Record<number, boolean> = {};
    for (let i = 0; i < num; i++) {
      initialSectors[i] = true;
    }
    setColoredSectors(initialSectors);
  }, [den, num]);
  // Compute live calculations
  useEffect(() => {
    const val = num / den;
    const stats: ComputedStat[] = [
      {
        label: 'Fraction Representation',
        formula: '\\text{Fraction} = \\frac{\\text{Numerator}}{\\text{Denominator}}',
        answer: `\\frac{${num}}{${den}} = ${val.toFixed(2)}`
      }
    ];

    // Show simplifying fractions
    const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
    const divisor = gcd(num, den);
    if (divisor > 1) {
      stats.push({
        label: 'Simplified Form',
        formula: '\\frac{A \\div d}{B \\div d}',
        substitution: `\\frac{${num} \\div ${divisor}}{${den} \\div ${divisor}}`,
        answer: `= \\frac{${num/divisor}}{${den/divisor}}`
      });
    }

    // Equivalent Fractions examples
    stats.push({
      label: 'Equivalent Scale Example (x2)',
      formula: '\\frac{n \\times 2}{d \\times 2}',
      answer: `= \\frac{${num * 2}}{${den * 2}}`
    });

    // Mixed Fractions if improper
    if (num > den && den > 0) {
      const whole = Math.floor(num / den);
      const rem = num % den;
      stats.push({
        label: 'Mixed Fraction Format',
        formula: '\\text{Whole} \\frac{\\text{Remainder}}{\\text{Denominator}}',
        answer: `= ${whole} \\frac{${rem}}{${den}}`
      });
    }

    setComputedStats(stats);
  }, [num, den, setComputedStats]);

  // Set up Engine Adapter
  useEffect(() => {
    setAdapter({
      getState: () => ({ num, den }),
      getProgress: () => 100,
      isCompleted: (key: string) => {
        if (key === 'isEquivalent') return num / den === 0.5; // check if equivalent to 1/2
        if (key === 'isImproper') return num > den;
        return true;
      },
      reset: () => {
        setNum(config.initialNumerator || 2);
        setDen(config.initialDenominator || 5);
      },
      getMeasurements: () => ({}),
      getProperties: () => ({})
    });
    return () => setAdapter(null as any);
  }, [num, den, setAdapter, config.initialNumerator, config.initialDenominator]);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setNum(config.initialNumerator || 2);
      setDen(config.initialDenominator || 5);
    },
    focus: () => {},
    export: () => JSON.stringify({ num, den }),
    captureScreenshot: () => ''
  }));

  const handleSectorClick = (idx: number) => {
    if (isAdvanced) return; // Slider/direct input only in advanced mode
    setColoredSectors(prev => {
      const next = { ...prev, [idx]: !prev[idx] };
      // Count total true values to set numerator
      const activeCount = Object.values(next).filter(Boolean).length;
      setNum(activeCount);
      return next;
    });
  };

  // Render Circle Visualization
  const renderCircle = () => {
    const sectors = [];
    const radius = 2.5;

    for (let i = 0; i < den; i++) {
      const isColored = isAdvanced ? (i < num) : !!coloredSectors[i];
      const thetaStart = (i / den) * Math.PI * 2;
      const thetaLength = (1 / den) * Math.PI * 2;

      // Draw custom 3D pie slice mesh
      const pts = [new THREE.Vector2(0, 0)];
      const segments = 16;
      for (let j = 0; j <= segments; j++) {
        const theta = thetaStart + (j / segments) * thetaLength;
        pts.push(new THREE.Vector2(Math.cos(theta) * radius, Math.sin(theta) * radius));
      }
      const shape = new THREE.Shape(pts);

      sectors.push(
        <mesh 
          key={i} 
          onClick={() => handleSectorClick(i)}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <shapeGeometry args={[shape]} />
          <meshBasicMaterial 
            color={isColored ? '#3b82f6' : '#1e293b'} 
            transparent 
            opacity={0.8}
            side={THREE.DoubleSide} 
          />
        </mesh>
      );

      // Radial divider lines
      const endX = Math.cos(thetaStart) * radius;
      const endY = Math.sin(thetaStart) * radius;
      sectors.push(
        <Line key={`line-${i}`} points={[[0, 0, 0.01], [endX, endY, 0.01]]} color="#475569" lineWidth={2} />
      );
    }

    // Outer border ring
    const borderPts = [];
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2;
      borderPts.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0.02));
    }

    return (
      <group>
        {sectors}
        <Line points={borderPts} color="#94a3b8" lineWidth={3} />
      </group>
    );
  };

  // Render Bar Visualization
  const renderBar = () => {
    const bars = [];
    const totalWidth = 6;
    const barHeight = 1.2;
    const startX = -totalWidth / 2;
    const itemWidth = totalWidth / den;

    for (let i = 0; i < den; i++) {
      const isColored = isAdvanced ? (i < num) : !!coloredSectors[i];
      const x = startX + i * itemWidth + itemWidth / 2;

      bars.push(
        <Box 
          key={i} 
          position={[x, 0, 0]} 
          args={[itemWidth * 0.95, barHeight, 0.1]}
          onClick={() => handleSectorClick(i)}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <meshBasicMaterial color={isColored ? '#10b981' : '#1e293b'} />
        </Box>
      );
    }

    return (
      <group>
        {bars}
        {/* Draw containing box outline */}
        <Line 
          points={[
            [startX, barHeight/2, 0.06],
            [startX + totalWidth, barHeight/2, 0.06],
            [startX + totalWidth, -barHeight/2, 0.06],
            [startX, -barHeight/2, 0.06],
            [startX, barHeight/2, 0.06]
          ]} 
          color="#94a3b8" 
          lineWidth={2} 
        />
      </group>
    );
  };

  // Render Number Line Visualization
  const renderNumberLine = () => {
    const scale = 4; // Length of the line (from 0 to 1)
    const tickPoints = [];
    
    for (let i = 0; i <= den; i++) {
      const x = (i / den) * scale - scale/2;
      const isColored = i <= num;
      tickPoints.push(
        <group key={i} position={[x, 0, 0]}>
          <Line points={[[0, -0.2, 0], [0, 0.2, 0]]} color={isColored ? '#f59e0b' : '#475569'} lineWidth={2} />
          <Html position={[0, -0.5, 0]} center className="pointer-events-none">
            <span className="text-[10px] text-slate-400 font-semibold">{i}/{den}</span>
          </Html>
        </group>
      );
    }

    const valX = (num / den) * scale - scale/2;

    return (
      <group>
        <Line points={[[-scale/2 - 0.2, 0, 0], [scale/2 + 0.2, 0, 0]]} color="#475569" lineWidth={3} />
        {tickPoints}
        {/* Highlight range up to numerator */}
        <Line points={[[-scale/2, 0.05, 0], [valX, 0.05, 0]]} color="#f59e0b" lineWidth={5} />
        {/* Indicator Point */}
        <Sphere position={[valX, 0.05, 0.1]} args={[0.15, 16, 16]}>
          <meshBasicMaterial color="#ef4444" />
        </Sphere>
      </group>
    );
  };

  // Render Area Model Visualization
  const renderArea = () => {
    const grids = [];
    // Say a fixed 4x4 or 3x4 grid structure or grid based on denominator partitions
    // For general fractions, partition grid into W columns and H rows where W*H = den
    // Let's approximate closest factoring, or just draw a single row of bars (or dynamic columns)
    const rows = 2;
    const cols = Math.ceil(den / rows);
    const boxSize = 0.8;
    const gap = 0.1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (idx >= den) continue;
        
        const isColored = idx < num;
        const x = (c - (cols - 1) / 2) * (boxSize + gap);
        const y = -(r - (rows - 1) / 2) * (boxSize + gap);

        grids.push(
          <Box 
            key={idx}
            position={[x, y, 0]}
            args={[boxSize, boxSize, 0.1]}
            onClick={() => handleSectorClick(idx)}
            onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
            onPointerOut={() => { document.body.style.cursor = 'auto'; }}
          >
            <meshBasicMaterial color={isColored ? '#8b5cf6' : '#1e293b'} />
          </Box>
        );
      }
    }

    return <group>{grids}</group>;
  };

  // Render Set Model (Discrete Groups of Balls)
  const renderSet = () => {
    const items = [];
    const itemRadius = 0.25;
    const totalWidth = 5;
    const itemSpacing = totalWidth / Math.max(1, den - 1);
    const startX = den > 1 ? -totalWidth / 2 : 0;

    for (let i = 0; i < den; i++) {
      const isColored = i < num;
      const x = startX + i * itemSpacing;

      items.push(
        <Sphere 
          key={i} 
          position={[x, 0, 0]} 
          args={[itemRadius, 32, 32]}
          onClick={() => handleSectorClick(i)}
          onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { document.body.style.cursor = 'auto'; }}
        >
          <meshBasicMaterial color={isColored ? '#f43f5e' : '#334155'} />
        </Sphere>
      );
    }

    return <group>{items}</group>;
  };

  const renderActiveVisualization = () => {
    switch (visType) {
      case 'Bar': return renderBar();
      case 'NumberLine': return renderNumberLine();
      case 'Area': return renderArea();
      case 'Set': return renderSet();
      case 'Circle':
      default:
        return renderCircle();
    }
  };

  return (
    <>
      <PropertiesPanel />
      <FormulaPanel />

      {/* Visual representations switcher in R3F Overlay */}
      <Html position={[-6, 4, 0]} className="z-20 pointer-events-auto">
        <div className="bg-slate-900/90 backdrop-blur-xl p-3 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-2 w-48 text-white">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 pb-1.5 mb-1">
            Representation
          </div>
          {(['Circle', 'Bar', 'NumberLine', 'Area', 'Set'] as VisualizationType[]).map(t => (
            <button
              key={t}
              onClick={() => setVisType(t)}
              className={`px-3 py-1.5 rounded-lg text-left text-xs font-semibold transition ${
                visType === t ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              {t} Model
            </button>
          ))}

          <div className="h-px bg-white/10 my-1"></div>

          {/* Interactive controls */}
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1">
            Fraction Parameters
          </div>
          
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>Numerator (n)</span>
                <span>{num}</span>
              </div>
              {isAdvanced ? (
                <input 
                  type="number"
                  min={0}
                  max={20}
                  value={num}
                  onChange={(e) => setNum(Math.max(0, Math.min(20, parseInt(e.target.value) || 0)))}
                  className="w-full bg-slate-950 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <input 
                  type="range" min={0} max={den} value={num}
                  onChange={(e) => setNum(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              )}
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                <span>Denominator (d)</span>
                <span>{den}</span>
              </div>
              {isAdvanced ? (
                <input 
                  type="number"
                  min={1}
                  max={20}
                  value={den}
                  onChange={(e) => setDen(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-full bg-slate-950 border border-white/15 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <input 
                  type="range" min={1} max={16} value={den}
                  onChange={(e) => {
                    const newDen = parseInt(e.target.value);
                    setDen(newDen);
                    if (num > newDen) setNum(newDen);
                  }}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              )}
            </div>
          </div>
        </div>
      </Html>

      <BaseEngine {...props} ref={undefined}>
        {renderActiveVisualization()}
      </BaseEngine>
    </>
  );
});

FractionEngine.displayName = 'FractionEngine';
export default FractionEngine;
