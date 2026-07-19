import { forwardRef, useImperativeHandle, useEffect } from 'react';
import { BaseEngine } from '../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../core/types';
import { useEngineAdapterStore } from '../core/EngineAdapterStore';
import { useGeometryStore } from '../shared/geometry/store/useGeometryStore';
import { useLessonStore } from '../../store/LessonStore';
import { useGraphStore } from './graph/useGraphStore';
import type { GraphMode, ChartType } from './graph/useGraphStore';
import { CoordinateWorkspace } from './graph/CoordinateWorkspace';
import { StatisticsWorkspace } from './graph/StatisticsWorkspace';
import { GraphToolbar } from './graph/GraphToolbar';
import { FormulaRenderer } from './graph/FormulaRenderer';
import {
  computeDistanceStep,
  computeMidpointStep,
  computeSlopeStep,
  computeEquationStep
} from './graph/graphMath';

export const GraphEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore((s) => s.setAdapter);
  const setComputedStats = useGeometryStore((s) => s.setComputedStats);
  const revealLevel = useLessonStore((s) => s.revealLevel); // 0=none, 1=hint 1, 2=hint 2, 3=answer

  const {
    mode,
    points,
    elements,
    chartData,

    setMode,
    setChartType,
    reset,
    updatePoint,
    updateChartValue
  } = useGraphStore();

  // Read config from lesson JSON and apply on load
  const config = props.lesson.engineConfig || {};
  const initialMode: GraphMode = config.mode || 'coordinate';
  const initialChartType: ChartType = config.chartType || 'bar';

  useEffect(() => {
    setMode(initialMode);
    setChartType(initialChartType);
    
    // Apply initial coordinates or values if provided in config
    if (config.initialPoints && Array.isArray(config.initialPoints)) {
      useGraphStore.setState({ points: config.initialPoints });
    }
    if (config.initialChartData && Array.isArray(config.initialChartData)) {
      useGraphStore.setState({ chartData: config.initialChartData });
    }
  }, [initialMode, initialChartType, config, setMode, setChartType]);

  // Publish live stats to the generic sidebar Panels (FormulaPanel / PropertiesPanel)
  useEffect(() => {
    if (mode === 'coordinate') {
      let p1 = points[0];
      let p2 = points[1];
      
      if (p1 && p2) {
        const dStep = computeDistanceStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y);
        const mStep = computeMidpointStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y);
        const sStep = computeSlopeStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y);
        const eStep = computeEquationStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y);

        setComputedStats([
          { label: 'Distance', formula: dStep.formula, substitution: dStep.substitution, answer: dStep.answer },
          { label: 'Midpoint', formula: mStep.formula, substitution: mStep.substitution, answer: mStep.answer },
          { label: 'Slope', formula: sStep.formula, substitution: sStep.substitution, answer: sStep.answer },
          { label: 'Line Equation', formula: eStep.formula, substitution: eStep.substitution, answer: eStep.answer }
        ]);
      } else {
        setComputedStats([]);
      }
    } else {
      // Statistics values
      const stats = chartData.map((item) => ({
        label: `${item.label} Freq`,
        answer: `${item.value}%`
      }));
      setComputedStats(stats);
    }
  }, [mode, points, chartData, setComputedStats]);

  // Register the standard IEngineAdapter adapter triggers
  useEffect(() => {
    setAdapter({
      getState: () => ({
        points: useGraphStore.getState().points,
        elements: useGraphStore.getState().elements,
        chartData: useGraphStore.getState().chartData
      }),
      getProgress: () => 100,
      isCompleted: (validationKey: string) => {
        const currentPoints = useGraphStore.getState().points;
        const currentChart = useGraphStore.getState().chartData;

        // Perform CBSE/NCERT activities validation checks
        if (validationKey === 'plot_point_origin') {
          return currentPoints.some(p => Math.abs(p.x) < 0.05 && Math.abs(p.y) < 0.05);
        }
        if (validationKey === 'distance_is_5') {
          if (currentPoints.length < 2) return false;
          const p1 = currentPoints[0];
          const p2 = currentPoints[1];
          const d = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
          return Math.abs(d - 5) < 0.1;
        }
        if (validationKey === 'slope_is_1') {
          if (currentPoints.length < 2) return false;
          const p1 = currentPoints[0];
          const p2 = currentPoints[1];
          return Math.abs((p2.y - p1.y) / (p2.x - p1.x || 1) - 1.0) < 0.1;
        }
        if (validationKey === 'chart_max_value_80') {
          return currentChart.some(item => item.value >= 80);
        }
        return true;
      },
      reset: () => reset(),
      getMeasurements: () => ({}),
      getProperties: () => ({})
    });
    return () => setAdapter(null as any);
  }, [reset, setAdapter]);

  useImperativeHandle(ref, () => ({
    reset: () => reset(),
    focus: (id?: string) => {
      console.log(`Focusing on point ${id}`);
    },
    export: () => JSON.stringify({ points, elements, chartData }),
    captureScreenshot: () => ''
  }));

  // Handle Teacher Reveal Correct Answer helper
  useEffect(() => {
    if (revealLevel === 3) {
      if (mode === 'coordinate') {
        // Correct answer reveal: snaps first two points to nice NCERT solution coordinates (e.g. A(3,4), B(0,0))
        if (points[0]) updatePoint(points[0].id, 3, 4);
        if (points[1]) updatePoint(points[1].id, 0, 0);
      } else {
        // Correct answer reveal for charts: snaps first category to the target validation value (80)
        if (chartData[0]) updateChartValue(0, 80);
      }
    }
  }, [revealLevel, mode, points, chartData, updatePoint, updateChartValue]);

  return (
    <BaseEngine ref={ref} {...props} surface="html">
      <div className="w-full h-full flex flex-col xl:flex-row gap-6 p-6 overflow-hidden">
        {/* Left pane: Active Workspace (Coordinate Plane or Statistics) */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 min-h-0 relative">
            {mode === 'coordinate' ? (
              <CoordinateWorkspace />
            ) : (
              <StatisticsWorkspace />
            )}
          </div>
          
          {/* Floating controls toolbar */}
          <div className="shrink-0">
            <GraphToolbar />
          </div>
        </div>

        {/* Right pane: internal Formula Analysis renderer (Coordinate mode only) */}
        {mode === 'coordinate' && (
          <div className="w-full xl:w-80 shrink-0 self-start">
            <FormulaRenderer />
          </div>
        )}
      </div>
    </BaseEngine>
  );
});

GraphEngine.displayName = 'GraphEngine';
export default GraphEngine;
