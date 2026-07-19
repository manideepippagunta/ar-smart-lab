import React, { forwardRef, useImperativeHandle } from 'react';
import { BaseEngine } from '../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../core/types';
import { useTriangleStore } from './Triangle/store';
import { useEngineAdapterStore } from '../core/EngineAdapterStore';

// 3D Components
import { DraggableVertex } from './Triangle/components/DraggableVertex';
import { TriangleMesh } from './Triangle/components/TriangleMesh';
import { MeasurementLabels } from './Triangle/components/MeasurementLabels';
import { ConstructionLines } from './Triangle/components/ConstructionLines';
import { Circles } from './Triangle/components/Circles';

// UI
import { ControlsToolbar } from './Triangle/ui/ControlsToolbar';
import { PropertiesPanel } from './Triangle/ui/PropertiesPanel';
import { FormulaPanel } from './Triangle/ui/FormulaPanel';

export const TriangleEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const reset = useTriangleStore((state) => state.reset);
  const setAdapter = useEngineAdapterStore((state) => state.setAdapter);

  React.useEffect(() => {
    setAdapter({
      getState: () => useTriangleStore.getState(),
      getProgress: () => 100, // mock
      isCompleted: (validationKey: string) => {
        const math = useTriangleStore.getState().math;
        if (validationKey === 'isEquilateral') return math.classification.sides === 'Equilateral';
        if (validationKey === 'isRight') return math.classification.angles === 'Right';
        if (validationKey === 'isObtuse') return math.classification.angles === 'Obtuse';
        return false;
      },
      reset: () => useTriangleStore.getState().reset(),
      getMeasurements: () => useTriangleStore.getState().math,
      getProperties: () => useTriangleStore.getState().math.classification,
    });
    return () => setAdapter(null as any);
  }, [setAdapter]);

  useImperativeHandle(ref, () => ({
    reset: () => reset(),
    focus: () => console.log('Triangle Engine Focus'),
    export: () => JSON.stringify(useTriangleStore.getState().math),
    captureScreenshot: () => {
      const canvas = document.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : '';
    }
  }));

  return (
    <>
      {/* 2D UI Overlays rendered outside the Canvas */}
      <ControlsToolbar />
      <PropertiesPanel />
      <FormulaPanel />

      <BaseEngine {...props} ref={undefined}>
        {/* 3D Scene rendered inside the Canvas */}
        <DraggableVertex vertexId="A" color="#ef4444" />
        <DraggableVertex vertexId="B" color="#22c55e" />
        <DraggableVertex vertexId="C" color="#eab308" />

        <TriangleMesh />
        <MeasurementLabels />
        <ConstructionLines />
        <Circles />
      </BaseEngine>
    </>
  );
});

TriangleEngine.displayName = 'TriangleEngine';
export default TriangleEngine;
