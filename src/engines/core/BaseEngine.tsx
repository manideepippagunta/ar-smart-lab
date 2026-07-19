import { forwardRef, useImperativeHandle, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import type { EngineProps, EngineImperativeAPI } from './types';

export type RenderSurface = 'threejs' | 'html' | 'svg';

interface BaseEngineProps extends EngineProps {
  children?: ReactNode;
  surface?: RenderSurface;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  showGrid?: boolean;
  showGizmo?: boolean;
}

/**
 * BaseEngine — Universal Render Surface.
 *
 * surface='threejs' → Renders children inside a @react-three/fiber Canvas (default).
 * surface='html'    → Renders children as a flat HTML panel (Algebra, Statistics, etc.).
 * surface='svg'     → Renders children inside an SVG element.
 *
 * Every engine chooses its own rendering technology while sharing
 * the same lifecycle, adapter registration, and lesson framework.
 */
export const BaseEngine = forwardRef<EngineImperativeAPI, BaseEngineProps>(
  ({ 
    children, lesson,
    surface = 'threejs',
    cameraPosition = [5, 5, 5],
    cameraFov = 50,
    showGrid = true,
    showGizmo = true,
  }, ref) => {

    useImperativeHandle(ref, () => ({
      reset: () => console.log('BaseEngine Reset'),
      focus: (objectId?: string) => console.log(`Focusing on ${objectId}`),
      export: () => JSON.stringify({ lessonId: lesson?.id, state: 'exported' }),
      captureScreenshot: () => {
        const canvas = document.querySelector('canvas');
        return canvas ? canvas.toDataURL('image/png') : '';
      }
    }));

    useEffect(() => {
      return () => {};
    }, [lesson]);

    return (
      <div className="relative w-full h-full bg-slate-900 overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col">
        {/* Surface: Three.js WebGL Canvas */}
        {surface === 'threejs' && (
          <Canvas shadows camera={{ position: cameraPosition, fov: cameraFov }} className="flex-1">
            <color attach="background" args={['#0f172a']} />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 10]}
              castShadow
              intensity={1.5}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Environment preset="city" />
            {showGrid && (
              <Grid
                infiniteGrid
                fadeDistance={40}
                fadeStrength={5}
                cellColor="#334155"
                sectionColor="#475569"
              />
            )}
            <OrbitControls makeDefault />
            {showGizmo && (
              <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
                <GizmoViewport axisColors={['#ef4444', '#22c55e', '#3b82f6']} labelColor="white" />
              </GizmoHelper>
            )}
            {children}
          </Canvas>
        )}

        {/* Surface: HTML Overlay */}
        {surface === 'html' && (
          <div className="flex-1 w-full h-full overflow-hidden relative">
            {children}
          </div>
        )}

        {/* Surface: SVG Canvas */}
        {surface === 'svg' && (
          <div className="flex-1 w-full h-full overflow-hidden relative">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
            >
              {children}
            </svg>
          </div>
        )}
      </div>
    );
  }
);

BaseEngine.displayName = 'BaseEngine';
