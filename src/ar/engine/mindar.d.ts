/**
 * MindAR TypeScript Declaration File
 *
 * Provides type definitions for the mind-ar browser runtime.
 * The MindARThree class is the primary integration point with Three.js.
 *
 * @see https://hiukim.github.io/mind-ar-js-doc/
 */

declare module 'mind-ar/dist/mindar-image-three.prod.js' {
  import * as THREE from 'three';

  export interface MindARThreeOptions {
    container: HTMLElement;
    imageTargetSrc: string;
    maxTrack?: number;
    filterMinCF?: number;
    filterBeta?: number;
    missTolerance?: number;
    warmupTolerance?: number;
    showStats?: boolean;
    uiScanning?: string;
    uiLoading?: string;
  }

  export interface AnchorOptions {
    targetIndex: number;
  }

  export interface MindARThreeAnchor {
    group: THREE.Group;
    onTargetFound?: () => void;
    onTargetLost?: () => void;
    onTargetUpdate?: () => void;
  }

  export class MindARThree {
    constructor(options: MindARThreeOptions);
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    start(): Promise<void>;
    stop(): void;
    addAnchor(options: AnchorOptions): MindARThreeAnchor;
  }
}

/** Global browser runtime via CDN fallback */
declare global {
  interface Window {
    MINDAR?: {
      IMAGE: {
        MindARThree: import('mind-ar/dist/mindar-image-three.prod.js').MindARThree;
      };
    };
  }
}
