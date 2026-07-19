/**
 * AR Tracking Strategy — Abstract Base Interface
 *
 * Defines the contract for all tracking implementations.
 * New tracking methods (surface, WebXR, GPS) only need to implement this
 * interface — no changes required in AREngine or lesson configurations.
 *
 * Design Pattern: Strategy Pattern
 */

import * as THREE from 'three';
import type { ARLessonConfig } from '../config/ARLessonConfig';

export interface ARTrackingContext {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  container: HTMLDivElement;
}

export interface ARTrackedObject {
  group: THREE.Group;
  targetIndex: number;
  onFound?: () => void;
  onLost?: () => void;
}

export type ARTrackingStrategyType = 'marker' | 'surface' | 'webxr';

export interface IARTrackingStrategy {
  readonly type: ARTrackingStrategyType;

  /**
   * Initialize the tracking strategy with the given context.
   * Sets up camera feed, detection workers, scene linkage.
   */
  initialize(context: ARTrackingContext, config: ARLessonConfig): Promise<void>;

  /**
   * Start the tracking session (requests camera, begins detection).
   */
  start(): Promise<void>;

  /**
   * Stop and clean up the tracking session.
   */
  stop(): void;

  /**
   * Pause detection (does not release camera).
   */
  pause(): void;

  /**
   * Resume detection after a pause.
   */
  resume(): void;

  /**
   * Add a tracked anchor for a specific target.
   * Returns a Three.js Group that moves with the tracked object.
   */
  addAnchor(targetIndex: number): ARTrackedObject;

  /**
   * Check if this strategy is supported on the current device/browser.
   */
  isSupported(): boolean;
}
