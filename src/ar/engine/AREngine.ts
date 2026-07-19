/**
 * AREngine — Core AR Orchestrator (Strategy Pattern)
 *
 * The central coordinator for an AR experience. Uses the strategy pattern
 * to remain agnostic of the underlying tracking technology.
 *
 * Responsibilities:
 * - Select and configure the appropriate tracking strategy
 * - Build the Three.js scene (procedural geometry or loaded models)
 * - Manage annotation anchors
 * - Handle the full session lifecycle
 * - Coordinate with AssetManager and AREventEmitter
 */

import * as THREE from 'three';
import type { ARLessonConfig } from '../config/ARLessonConfig';
import type { IARTrackingStrategy, ARTrackingContext } from './ARTrackingStrategy';
import { MarkerTrackingStrategy } from './strategies/MarkerTrackingStrategy';
import { SurfaceTrackingStrategy } from './strategies/SurfaceTrackingStrategy';
import { AssetManager } from './AssetManager';
import { AREventEmitter } from './AREventEmitter';

export type AREngineStatus = 'idle' | 'initializing' | 'running' | 'paused' | 'stopped' | 'error';

export interface AREngineState {
  status: AREngineStatus;
  markerFound: boolean;
  modelLoaded: boolean;
  error: string | null;
}

const STRATEGY_MAP: Record<string, () => IARTrackingStrategy> = {
  marker: () => new MarkerTrackingStrategy(),
  surface: () => new SurfaceTrackingStrategy(),
  webxr: () => new SurfaceTrackingStrategy(), // Future: WebXRTrackingStrategy
};

export class AREngine {
  private strategy: IARTrackingStrategy | null = null;
  private context: ARTrackingContext = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: new THREE.WebGLRenderer(),
    container: document.createElement('div'),
  };
  private config: ARLessonConfig | null = null;
  private modelGroup: THREE.Group | null = null;
  private mixer: THREE.AnimationMixer | null = null;
  private clock = new THREE.Clock();
  private spinAnimation: { active: boolean; speed: number } = { active: true, speed: 0.8 };
  private animFrameId: number | null = null;

  public onStateChange?: (state: AREngineState) => void;

  private state: AREngineState = {
    status: 'idle',
    markerFound: false,
    modelLoaded: false,
    error: null,
  };

  private updateState(partial: Partial<AREngineState>): void {
    this.state = { ...this.state, ...partial };
    this.onStateChange?.(this.state);
  }

  async initialize(container: HTMLDivElement, config: ARLessonConfig): Promise<void> {
    this.config = config;
    this.context.container = container;
    this.updateState({ status: 'initializing', error: null });

    // Select tracking strategy
    const strategyFactory = STRATEGY_MAP[config.trackingStrategy] ?? STRATEGY_MAP.marker;
    this.strategy = strategyFactory();

    if (!this.strategy.isSupported()) {
      const msg = `Tracking strategy "${config.trackingStrategy}" is not supported on this device.`;
      AREventEmitter.emit('error:unsupported', { lessonId: config.lessonId, error: msg });
      this.updateState({ status: 'error', error: msg });
      throw new Error(msg);
    }

    try {
      await this.strategy.initialize(this.context, config);

      // After strategy initializes, context.scene/camera/renderer may be
      // replaced by strategy-specific implementations (e.g., MindARThree)
      const anchor = this.strategy.addAnchor(0);
      anchor.onFound = () => {
        this.updateState({ markerFound: true });
        if (this.modelGroup) this.modelGroup.visible = true;
      };
      anchor.onLost = () => {
        this.updateState({ markerFound: false });
        if (this.modelGroup) this.modelGroup.visible = false;
      };

      // Build and attach 3D content to anchor group
      await this.buildScene(anchor.group, config);

      this.updateState({ status: 'initializing' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.updateState({ status: 'error', error: msg });
      throw err;
    }
  }

  async start(): Promise<void> {
    if (!this.strategy) throw new Error('AREngine: Call initialize() first.');
    await this.strategy.start();
    this.updateState({ status: 'running' });
  }

  stop(): void {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    this.strategy?.stop();
    this.modelGroup?.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).geometry.dispose();
      }
    });
    this.updateState({ status: 'stopped', markerFound: false });
  }

  pause(): void {
    this.strategy?.pause();
    this.updateState({ status: 'paused' });
  }

  resume(): void {
    this.strategy?.resume();
    this.updateState({ status: 'running' });
  }

  /** Handles tap gesture — toggle spin or trigger animation */
  handleTap(): void {
    this.spinAnimation.active = !this.spinAnimation.active;
    AREventEmitter.emit('interaction:tap', { lessonId: this.config?.lessonId });
  }

  getState(): AREngineState {
    return { ...this.state };
  }

  private async buildScene(anchorGroup: THREE.Group, config: ARLessonConfig): Promise<void> {
    let group: THREE.Group;

    if (config.model.procedural) {
      // Build procedural geometry — no network request needed
      group = this.buildProceduralModel(config);
    } else if (config.model.src) {
      // Load GLTF/GLB model via AssetManager
      AREventEmitter.emit('model:loading', { lessonId: config.lessonId, modelSrc: config.model.src });
      try {
        const gltf = await AssetManager.loadModel(config.model.src);
        group = AssetManager.cloneModel(gltf);

        // Apply transform from config
        group.scale.set(...config.model.scale);
        group.position.set(...config.model.position);
        group.rotation.set(...config.model.rotation);

        // Set up animation mixer if needed
        if (gltf.animations.length > 0 && config.model.animations?.autoPlay) {
          this.mixer = new THREE.AnimationMixer(group);
          const clip = THREE.AnimationClip.findByName(gltf.animations, config.model.animations.autoPlay);
          if (clip) this.mixer.clipAction(clip).play();
        }

        AREventEmitter.emit('model:loaded', { lessonId: config.lessonId, modelSrc: config.model.src });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        AREventEmitter.emit('model:error', { lessonId: config.lessonId, error: msg });
        // Fallback to procedural geometry
        group = this.buildFallbackModel();
      }
    } else {
      group = this.buildFallbackModel();
    }

    group.visible = false; // Hidden until marker is found
    this.modelGroup = group;
    anchorGroup.add(group);

    // Start update loop for animations + spin
    this.startUpdateLoop();
    this.updateState({ modelLoaded: true });
  }

  private buildProceduralModel(config: ARLessonConfig): THREE.Group {
    const group = new THREE.Group();
    const proc = config.model.procedural!;

    let geometry: THREE.BufferGeometry;

    switch (proc.type) {
      case 'pyramid': {
        geometry = new THREE.ConeGeometry(0.5, 1, 4);
        break;
      }
      case 'cube': {
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        break;
      }
      case 'sphere': {
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      }
      case 'cone': {
        geometry = new THREE.ConeGeometry(0.4, 1, 32);
        break;
      }
      case 'triangle-prism': {
        geometry = new THREE.CylinderGeometry(0, 0.6, 1, 3);
        break;
      }
      default: {
        geometry = new THREE.ConeGeometry(0.5, 1, 4);
      }
    }

    const material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(proc.color),
      wireframe: proc.wireframe ?? false,
      transparent: true,
      opacity: 0.92,
      shininess: 80,
    });

    // Add a slightly larger wireframe overlay for clarity
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const wireframe = new THREE.Mesh(geometry, wireframeMat);

    mesh.scale.set(...config.model.scale);
    mesh.position.set(...config.model.position);
    mesh.rotation.set(...config.model.rotation);
    wireframe.scale.set(...config.model.scale);
    wireframe.position.set(...config.model.position);
    wireframe.rotation.set(...config.model.rotation);

    // Add edge lines for crisp triangle outline
    const edges = new THREE.EdgesGeometry(geometry);
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
    });
    const edgeLines = new THREE.LineSegments(edges, lineMat);
    edgeLines.scale.set(...config.model.scale);
    edgeLines.position.set(...config.model.position);
    edgeLines.rotation.set(...config.model.rotation);

    group.add(mesh, edgeLines);
    return group;
  }

  private buildFallbackModel(): THREE.Group {
    const group = new THREE.Group();
    const geo = new THREE.ConeGeometry(0.5, 1, 4);
    const mat = new THREE.MeshPhongMaterial({ color: 0x4f8ef7, opacity: 0.9, transparent: true });
    group.add(new THREE.Mesh(geo, mat));
    return group;
  }

  private startUpdateLoop(): void {
    const tick = () => {
      const delta = this.clock.getDelta();

      // Spin animation for procedural models
      if (this.modelGroup && this.spinAnimation.active) {
        this.modelGroup.rotation.y += delta * this.spinAnimation.speed;
      }

      // GLTF animation mixer
      if (this.mixer) {
        this.mixer.update(delta);
      }

      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }
}
