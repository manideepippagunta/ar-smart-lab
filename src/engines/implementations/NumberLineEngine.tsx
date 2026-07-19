import { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { BaseEngine } from '../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../core/types';
import { useEngineAdapterStore } from '../core/EngineAdapterStore';
import { useGeometryStore } from '../shared/geometry/store/useGeometryStore';
import type { ComputedStat } from '../shared/geometry/store/useGeometryStore';
import { Line, Html } from '@react-three/drei';
import { useDrag } from '@use-gesture/react';
import * as THREE from 'three';

// We reuse the GeometryStore's state structure or local state for calculations,
// and publish computed stats to useGeometryStore so that FormulaPanel and PropertiesPanel can display them!
// This is extremely elegant and doesn't require modifying the panels.
import { PropertiesPanel } from '../shared/geometry/ui/PropertiesPanel';
import { FormulaPanel } from '../shared/geometry/ui/FormulaPanel';

interface DraggablePointNL {
  id: string;
  value: number;
  label: string;
  color: string;
  fixed?: boolean;
}

export const NumberLineEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((state) => state.setAdapter);
  const setComputedStats = useGeometryStore((state) => state.setComputedStats);

  // Lesson configuration
  const config = props.lesson.steps.exploration?.hints?.[0] 
    ? { mode: 'operations', operation: 'add', val1: 2, val2: 3 } // default fallback
    : (props.lesson as any).engineConfig || { mode: 'operations', operation: 'add', val1: 2, val2: 3 };

  const mode = config.mode || 'operations'; // 'absolute-value' | 'comparison' | 'ordering' | 'operations'
  const operation = config.operation || 'add'; // 'add' | 'subtract' | 'multiply' | 'divide'

  // Points state on the number line
  const [points, setPoints] = useState<DraggablePointNL[]>([]);

  // Initialize points based on mode
  useEffect(() => {
    if (mode === 'absolute-value') {
      setPoints([
        { id: 'a', value: 3, label: 'A', color: '#3b82f6' }
      ]);
    } else if (mode === 'comparison') {
      setPoints([
        { id: 'a', value: -2, label: 'A', color: '#3b82f6' },
        { id: 'b', value: 3, label: 'B', color: '#10b981' }
      ]);
    } else if (mode === 'ordering') {
      setPoints([
        { id: 'a', value: 2, label: 'A', color: '#3b82f6' },
        { id: 'b', value: -4, label: 'B', color: '#10b981' },
        { id: 'c', value: 5, label: 'C', color: '#f59e0b' }
      ]);
    } else {
      // Operations: A + B, A - B, A * B, A / B
      const v1 = config.val1 !== undefined ? config.val1 : 2;
      const v2 = config.val2 !== undefined ? config.val2 : 3;
      setPoints([
        { id: 'v1', value: v1, label: 'Value 1', color: '#3b82f6' },
        { id: 'v2', value: v2, label: 'Value 2', color: '#10b981' }
      ]);
    }
  }, [mode, operation, config.val1, config.val2]);

  // Compute live calculations and publish to GeometryStore
  useEffect(() => {
    if (points.length === 0) return;

    const stats: ComputedStat[] = [];

    if (mode === 'absolute-value') {
      const a = points[0].value;
      const absA = Math.abs(a);
      stats.push({
        label: 'Absolute Value |A|',
        formula: '|x| = \\begin{cases} x & \\text{if } x \\ge 0 \\\\ -x & \\text{if } x < 0 \\end{cases}',
        substitution: `|${a.toFixed(0)}|`,
        answer: `|${a.toFixed(0)}| = ${absA.toFixed(0)}`
      });
    } else if (mode === 'comparison') {
      const a = points[0].value;
      const b = points[1].value;
      let symbol = '=';
      if (a < b) symbol = '<';
      else if (a > b) symbol = '>';
      
      stats.push({
        label: 'Comparison',
        formula: 'A \\text{ vs } B',
        substitution: `${a.toFixed(0)} \\text{ vs } ${b.toFixed(0)}`,
        answer: `A ${symbol} B \\implies ${a.toFixed(0)} ${symbol} ${b.toFixed(0)}`
      });
    } else if (mode === 'ordering') {
      // Sort points
      const sorted = [...points].sort((x, y) => x.value - y.value);
      const str = sorted.map(p => `${p.label} (${p.value.toFixed(0)})`).join(' < ');
      const rawStr = sorted.map(p => p.value.toFixed(0)).join(' < ');
      
      stats.push({
        label: 'Ascending Order',
        formula: 'x_1 < x_2 < x_3',
        answer: `${str} \\implies ${rawStr}`
      });
    } else if (mode === 'operations') {
      const a = points[0].value;
      const b = points[1].value;

      if (operation === 'add') {
        stats.push({
          label: 'Addition',
          formula: 'A + B = C',
          substitution: `${a.toFixed(0)} + ${b.toFixed(0)}`,
          answer: `= ${(a + b).toFixed(0)}`
        });
      } else if (operation === 'subtract') {
        stats.push({
          label: 'Subtraction',
          formula: 'A - B = C',
          substitution: `${a.toFixed(0)} - ${b.toFixed(0)}`,
          answer: `= ${(a - b).toFixed(0)}`
        });
      } else if (operation === 'multiply') {
        stats.push({
          label: 'Multiplication (Repeated Addition)',
          formula: 'A \\times B = C',
          substitution: `${a.toFixed(0)} \\times ${b.toFixed(0)}`,
          answer: `= ${(a * b).toFixed(0)}`
        });
      } else if (operation === 'divide') {
        if (b === 0) {
          stats.push({
            label: 'Division',
            formula: 'A \\div B',
            answer: '\\text{Undefined (Division by 0)}'
          });
        } else {
          stats.push({
            label: 'Division (Partitions)',
            formula: 'A \\div B = C',
            substitution: `${a.toFixed(0)} \\div ${b.toFixed(0)}`,
            answer: `= ${(a / b).toFixed(2)}`
          });
        }
      }
    }

    setComputedStats(stats);
  }, [points, mode, operation, setComputedStats]);

  // Set up Engine Adapter
  useEffect(() => {
    setAdapter({
      getState: () => ({ points }),
      getProgress: () => 100,
      isCompleted: (key: string) => {
        if (key === 'isNegative') return points.some(p => p.value < 0);
        if (key === 'isAbsolute') return true;
        if (key === 'isOrdered') {
          return points[0].value < points[1].value;
        }
        return true;
      },
      reset: () => {},
      getMeasurements: () => ({}),
      getProperties: () => ({})
    });
    return () => setAdapter(null as any);
  }, [points, setAdapter]);

  useImperativeHandle(ref, () => ({
    reset: () => {},
    focus: () => {},
    export: () => JSON.stringify({ points }),
    captureScreenshot: () => ''
  }));

  // Render ticks on the number line
  const minVal = -10;
  const maxVal = 10;
  const scale = 0.6; // x distance per unit

  const ticks = [];
  for (let i = minVal; i <= maxVal; i++) {
    ticks.push(i);
  }

  // Draggable point component inside NumberLineEngine
  const DraggableNLPoint = ({ pt, index }: { pt: DraggablePointNL, index: number }) => {
    const bind = useDrag(({ event }) => {
      // @ts-ignore
      if (event && event.ray) {
        // @ts-ignore
        const t = -event.ray.origin.z / event.ray.direction.z;
        // @ts-ignore
        const x = event.ray.origin.x + event.ray.direction.x * t;
        // Snap to nearest integer for school-level math
        const val = Math.max(minVal, Math.min(maxVal, Math.round(x / scale)));
        
        setPoints(prev => {
          const next = [...prev];
          next[index] = { ...next[index], value: val };
          return next;
        });
      }
    });

    const xPos = pt.value * scale;

    return (
      <mesh 
        position={[xPos, 0, 0.05]} 
        {...bind()}
        onPointerOver={() => { document.body.style.cursor = 'grab'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={pt.color} emissive={pt.color} emissiveIntensity={0.5} />
        <Html position={[0, 0.4, 0]} center className="pointer-events-none">
          <div className="bg-slate-900/95 text-white font-bold text-xs px-2 py-0.5 rounded border border-white/20 whitespace-nowrap shadow-xl">
            {pt.label}: {pt.value}
          </div>
        </Html>
      </mesh>
    );
  };

  // Generate arches/jumps for operations visualization
  const renderJumps = () => {
    if (points.length < 2) return null;
    const v1 = points[0].value;
    const v2 = points[1].value;

    if (mode === 'operations') {
      if (operation === 'add' || operation === 'subtract') {
        const start = v1;
        const pts = [];
        const numSteps = Math.abs(v2);
        
        for (let step = 0; step < numSteps; step++) {
          const dir = operation === 'add' ? (v2 > 0 ? 1 : -1) : (v2 > 0 ? -1 : 1);
          const s = start + step * dir;
          const e = s + dir;
          
          // Generate arc points
          const arcPoints = [];
          const segments = 16;
          for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI;
            const x = (s * scale) + (dir * scale * 0.5) - Math.cos(theta) * (scale * 0.5);
            const y = Math.sin(theta) * 0.5;
            arcPoints.push(new THREE.Vector3(x, y, 0));
          }

          pts.push(
            <group key={step}>
              <Line points={arcPoints} color="#ef4444" lineWidth={3} />
              {/* Arrowhead */}
              <mesh position={[e * scale, 0, 0]} rotation={[0, 0, dir > 0 ? -Math.PI/4 : Math.PI/4]}>
                <coneGeometry args={[0.08, 0.2, 4]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          );
        }
        return pts;
      }

      if (operation === 'multiply') {
        const pts = [];
        const count = Math.abs(v2);
        const stepSize = v1;
        for (let i = 0; i < count; i++) {
          const s = i * stepSize;
          const e = (i + 1) * stepSize;
          
          const arcPoints = [];
          const segments = 32;
          for (let j = 0; j <= segments; j++) {
            const theta = (j / segments) * Math.PI;
            const x = (s * scale) + (stepSize * scale * 0.5) - Math.cos(theta) * (stepSize * scale * 0.5);
            const y = Math.sin(theta) * 0.8;
            arcPoints.push(new THREE.Vector3(x, y, 0));
          }

          pts.push(
            <group key={i}>
              <Line points={arcPoints} color="#ef4444" lineWidth={3} />
              <mesh position={[e * scale, 0, 0]} rotation={[0, 0, stepSize > 0 ? -Math.PI/4 : Math.PI/4]}>
                <coneGeometry args={[0.1, 0.25, 4]} />
                <meshBasicMaterial color="#ef4444" />
              </mesh>
            </group>
          );
        }
        return pts;
      }
    }

    if (mode === 'absolute-value') {
      const val = points[0].value;
      // Absolute value is distance from 0. Highlight the span [0, val]
      const startX = 0;
      const endX = val * scale;
      const midX = (startX + endX) / 2;

      return (
        <group>
          {/* visual bar showing distance */}
          <Line points={[[0, 0.1, 0], [val * scale, 0.1, 0]]} color="#f59e0b" lineWidth={5} />
          <Html position={[midX, 0.4, 0]} center className="pointer-events-none">
            <div className="bg-amber-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded shadow border border-amber-400 whitespace-nowrap uppercase tracking-wider">
              Distance = {Math.abs(val)}
            </div>
          </Html>
        </group>
      );
    }

    return null;
  };

  return (
    <>
      <PropertiesPanel />
      <FormulaPanel />

      <BaseEngine {...props} ref={undefined}>
        {/* Central Number Line Shaft */}
        <Line points={[[minVal * scale - 0.5, 0, 0], [maxVal * scale + 0.5, 0, 0]]} color="#64748b" lineWidth={4} />
        
        {/* Left Arrowhead */}
        <mesh position={[minVal * scale - 0.5, 0, 0]} rotation={[0, 0, Math.PI/2]}>
          <coneGeometry args={[0.12, 0.3, 4]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>

        {/* Right Arrowhead */}
        <mesh position={[maxVal * scale + 0.5, 0, 0]} rotation={[0, 0, -Math.PI/2]}>
          <coneGeometry args={[0.12, 0.3, 4]} />
          <meshBasicMaterial color="#64748b" />
        </mesh>

        {/* Render Ticks */}
        {ticks.map((tick) => {
          const x = tick * scale;
          const isZero = tick === 0;
          return (
            <group key={tick} position={[x, 0, 0]}>
              <Line points={[[0, -0.15, 0], [0, 0.15, 0]]} color={isZero ? '#f43f5e' : '#475569'} lineWidth={isZero ? 3 : 1.5} />
              <Html position={[0, -0.4, 0]} center className="pointer-events-none select-none">
                <span className={`text-[10px] font-bold ${isZero ? 'text-rose-400 font-extrabold' : 'text-slate-400'}`}>
                  {tick}
                </span>
              </Html>
            </group>
          );
        })}

        {/* Render Jumps / Operations Graphics */}
        {renderJumps()}

        {/* Render Draggable Points */}
        {points.map((pt, idx) => (
          <DraggableNLPoint key={pt.id} pt={pt} index={idx} />
        ))}
      </BaseEngine>
    </>
  );
});

NumberLineEngine.displayName = 'NumberLineEngine';
export default NumberLineEngine;
