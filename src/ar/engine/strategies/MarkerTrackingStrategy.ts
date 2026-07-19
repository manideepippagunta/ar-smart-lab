/**
 * MarkerTrackingStrategy — MindAR Image Marker Implementation
 *
 * Implements IARTrackingStrategy using MindAR.js for image/marker tracking.
 * Handles the full MindARThree lifecycle and bridges it to Three.js.
 *
 * Responsible for:
 * - Loading MindAR runtime from the npm package
 * - Initializing camera feed + renderer
 * - Managing marker detection and Three.js anchor groups
 * - Emitting lifecycle events for analytics
 */

import * as THREE from 'three';
import type {
  IARTrackingStrategy,
  ARTrackingContext,
  ARTrackedObject,
  ARTrackingStrategyType,
} from '../ARTrackingStrategy';
import type { ARLessonConfig } from '../../config/ARLessonConfig';
import { AREventEmitter } from '../AREventEmitter';

// MindAR is imported as a module. The actual class is in the ESM build.
// We use dynamic import to keep it code-split from the main bundle.
type MindARThreeClass = {
  new (options: {
    container: HTMLElement;
    imageTargetSrc: string;
    maxTrack?: number;
    filterMinCF?: number;
    filterBeta?: number;
  }): {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    start(): Promise<void>;
    stop(): void;
    addAnchor(options: { targetIndex: number }): {
      group: THREE.Group;
      onTargetFound?: () => void;
      onTargetLost?: () => void;
    };
  };
};

export class MarkerTrackingStrategy implements IARTrackingStrategy {
  readonly type: ARTrackingStrategyType = 'marker';

  private mindarInstance: InstanceType<MindARThreeClass> | null = null;
  private config: ARLessonConfig | null = null;
  private anchors: ARTrackedObject[] = [];
  private animFrameId: number | null = null;

  isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      window.isSecureContext
    );
  }

  async initialize(_context: ARTrackingContext, config: ARLessonConfig): Promise<void> {
    this.config = config;

    // Dynamically import MindAR — keeps it out of the initial bundle
    const { MindARThree } = await import(
      /* webpackChunkName: "mindar" */
      'mind-ar/dist/mindar-image-three.prod.js'
    ) as { MindARThree: MindARThreeClass };

    this.mindarInstance = new MindARThree({
      container: _context.container,
      imageTargetSrc: config.markerFile ?? '',
      maxTrack: 1,
      filterMinCF: 0.001,
      filterBeta: 0.01,
    });

    // Use MindAR's managed renderer and scene
    _context.renderer = this.mindarInstance.renderer;
    _context.scene = this.mindarInstance.scene;
    _context.camera = this.mindarInstance.camera;
  }

  async start(): Promise<void> {
    if (!this.mindarInstance || !this.config) return;
    await this.mindarInstance.start();
    AREventEmitter.emit('session:start', { lessonId: this.config.lessonId });
    this.startRenderLoop();
  }

  stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.mindarInstance?.stop();
    if (this.config) {
      AREventEmitter.emit('session:end', { lessonId: this.config.lessonId });
    }
    this.mindarInstance = null;
    this.anchors = [];
  }

  pause(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  resume(): void {
    this.startRenderLoop();
  }

  addAnchor(targetIndex: number): ARTrackedObject {
    if (!this.mindarInstance || !this.config) {
      throw new Error('MarkerTrackingStrategy: Must call initialize() before addAnchor()');
    }

    const anchor = this.mindarInstance.addAnchor({ targetIndex });
    const trackedObj: ARTrackedObject = {
      group: anchor.group,
      targetIndex,
    };

    anchor.onTargetFound = () => {
      AREventEmitter.emit('marker:found', {
        lessonId: this.config!.lessonId,
        targetIndex,
      });
      trackedObj.onFound?.();
    };

    anchor.onTargetLost = () => {
      AREventEmitter.emit('marker:lost', {
        lessonId: this.config!.lessonId,
        targetIndex,
      });
      trackedObj.onLost?.();
    };

    this.anchors.push(trackedObj);
    return trackedObj;
  }

  private startRenderLoop(): void {
    if (!this.mindarInstance) return;
    const { renderer, scene, camera } = this.mindarInstance;

    const tick = () => {
      renderer.render(scene, camera);
      this.animFrameId = requestAnimationFrame(tick);
    };

    this.animFrameId = requestAnimationFrame(tick);
  }
}
