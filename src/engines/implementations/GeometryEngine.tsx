import React, { forwardRef, useImperativeHandle, useEffect, Suspense } from 'react';
import { BaseEngine } from '../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../core/types';
import { useGeometryStore } from '../shared/geometry/store/useGeometryStore';
import { useEngineAdapterStore } from '../core/EngineAdapterStore';
import { GeometryToolbox } from '../shared/geometry/ui/GeometryToolbox';
import { PropertiesPanel } from '../shared/geometry/ui/PropertiesPanel';
import { FormulaPanel } from '../shared/geometry/ui/FormulaPanel';

// Lazy load specific viewers based on lesson config
const Viewers: Record<string, React.LazyExoticComponent<any>> = {
  'Points': React.lazy(() => import('./geometry/viewers/PointsViewer')),
  'Lines': React.lazy(() => import('./geometry/viewers/LinesViewer')),
  'Segments': React.lazy(() => import('./geometry/viewers/SegmentsViewer')),
  'Rays': React.lazy(() => import('./geometry/viewers/RaysViewer')),
  'Angles': React.lazy(() => import('./geometry/viewers/AnglesViewer')),
  'ParallelLines': React.lazy(() => import('./geometry/viewers/ParallelLinesViewer')),
  'IntersectingLines': React.lazy(() => import('./geometry/viewers/IntersectingLinesViewer')),
  'Circle': React.lazy(() => import('./geometry/viewers/CircleViewer')),
  'Polygon': React.lazy(() => import('./geometry/viewers/PolygonViewer')),
  'CoordinateGeometry': React.lazy(() => import('./geometry/viewers/CoordinateViewer')),
};

export const GeometryEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const store = useGeometryStore();
  const setAdapter = useEngineAdapterStore((state) => state.setAdapter);

  const topic = props.lesson.engineConfig?.topic || 'Points';
  const SpecificViewer = Viewers[topic] || Viewers['Points'];

  useEffect(() => {
    setAdapter({
      getState: () => useGeometryStore.getState().data,
      getProgress: () => 100, // mock
      isCompleted: (validationKey: string) => {
        if (validationKey === 'intersecting') {
           // mock check
           return true; 
        }
        return false;
      },
      reset: () => useGeometryStore.getState().reset(),
      getMeasurements: () => ({}),
      getProperties: () => ({})
    });
    return () => setAdapter(null as any);
  }, [setAdapter]);

  useImperativeHandle(ref, () => ({
    reset: () => store.reset(),
    focus: () => console.log('Geometry Engine Focus'),
    export: () => JSON.stringify(useGeometryStore.getState().data),
    captureScreenshot: () => {
      const canvas = document.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : '';
    }
  }));

  // Bind pointer up to window to save history after drag ends
  useEffect(() => {
    const handleMouseUp = () => store.saveHistory();
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [store]);

  return (
    <>
      <GeometryToolbox />
      <PropertiesPanel />
      <FormulaPanel />

      <BaseEngine {...props} ref={undefined}>
        {/* Click on background to clear selection */}
        <mesh position={[0,0,-0.1]} onClick={() => store.clearSelection()} visible={false}>
          <planeGeometry args={[1000, 1000]} />
          <meshBasicMaterial />
        </mesh>

        <Suspense fallback={null}>
          <SpecificViewer />
        </Suspense>
      </BaseEngine>
    </>
  );
});

GeometryEngine.displayName = 'GeometryEngine';
export default GeometryEngine;
