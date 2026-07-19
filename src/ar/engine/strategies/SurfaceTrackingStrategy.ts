/**
 * SurfaceTrackingStrategy — Stub for Future WebXR Surface Tracking
 *
 * This strategy will be implemented when WebXR image tracking reaches
 * sufficient iOS Safari support (estimated 2025-2026).
 *
 * It satisfies the IARTrackingStrategy interface today so the
 * AREngine can reference it without modification in the future.
 */

import * as THREE from 'three';
import type {
  IARTrackingStrategy,
  ARTrackingContext,
  ARTrackedObject,
  ARTrackingStrategyType,
} from '../ARTrackingStrategy';
import type { ARLessonConfig } from '../../config/ARLessonConfig';

export class SurfaceTrackingStrategy implements IARTrackingStrategy {
  readonly type: ARTrackingStrategyType = 'surface';

  isSupported(): boolean {
    // WebXR AR session support check
    if (typeof navigator === 'undefined' || !('xr' in navigator)) return false;
    return typeof (navigator as any).xr?.isSessionSupported === 'function';
  }

  async initialize(_context: ARTrackingContext, _config: ARLessonConfig): Promise<void> {
    console.warn('[SurfaceTrackingStrategy] WebXR surface tracking is not yet implemented. Falling back to marker tracking.');
  }

  async start(): Promise<void> {}
  stop(): void {}
  pause(): void {}
  resume(): void {}

  addAnchor(targetIndex: number): ARTrackedObject {
    return {
      group: new THREE.Group(),
      targetIndex: targetIndex,
    };
  }
}
