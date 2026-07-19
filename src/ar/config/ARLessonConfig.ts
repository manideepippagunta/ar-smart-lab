/**
 * ARLessonConfig — Lesson AR Configuration Type System
 *
 * Defines the complete, declarative configuration shape for any AR lesson.
 * The AR Engine interprets this configuration automatically —
 * adding new AR lessons requires only configuration + assets, not new code.
 */

export interface ARModelConfig {
  /** Path to .glb / .gltf asset (relative to /public) */
  src: string;
  /** [x, y, z] scale — 1 = natural size */
  scale: [number, number, number];
  /** [x, y, z] position offset from anchor origin */
  position: [number, number, number];
  /** [x, y, z] rotation in radians */
  rotation: [number, number, number];
  animations?: {
    /** Animation clip name to auto-play when marker is found */
    autoPlay?: string;
    /** Animation clip name triggered by tap gesture */
    onTap?: string;
    /** Loop mode: 'once' | 'repeat' | 'pingpong' */
    loopMode?: 'once' | 'repeat' | 'pingpong';
  };
  /** If no .glb, describe a procedural geometry instead */
  procedural?: {
    type: 'pyramid' | 'cube' | 'sphere' | 'cone' | 'triangle-prism';
    color: string;
    wireframe?: boolean;
  };
}

export interface ARAnnotation {
  /** Label text shown in the AR overlay */
  label: string;
  /** [x, y, z] position in model-local space */
  position: [number, number, number];
  /** Optional hex color for the label chip */
  color?: string;
  /** Short educational description (shown on tap) */
  description?: string;
}

export interface ARInteraction {
  type: 'tap' | 'drag' | 'pinch-zoom' | 'double-tap';
  /** Optional target mesh name within the GLTF scene */
  targetMesh?: string;
  action: 'toggle-animation' | 'highlight' | 'show-info' | 'rotate' | 'reset';
  /** Payload: animation name, info text, etc. */
  payload?: string;
}

export interface ARLessonConfig {
  /** Must match the lesson ID in LessonStore */
  lessonId: string;
  title: string;
  subtitle?: string;
  category: 'mathematics' | 'physics' | 'chemistry' | 'biology' | 'environment';
  /** Tracking strategy to use */
  trackingStrategy: 'marker' | 'surface' | 'webxr';
  /** Path to compiled .mind marker file (required for 'marker' strategy) */
  markerFile?: string;
  /** Image shown in the "Scan This" guide overlay */
  markerPreviewImage?: string;
  /** Printable SVG/PNG marker download URL */
  markerDownloadUrl?: string;
  /** 3D model or procedural geometry */
  model: ARModelConfig;
  /** Annotation labels rendered over the AR model */
  annotations: ARAnnotation[];
  /** Touch/gesture interactions */
  interactions: ARInteraction[];
  /** HUD information panel content */
  hudInfo?: {
    description: string;
    facts: string[];
    formula?: string;
  };
}
