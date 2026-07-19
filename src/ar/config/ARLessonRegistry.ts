/**
 * ARLessonRegistry — Maps lesson IDs to AR configurations
 *
 * Adding a new AR lesson requires only:
 * 1. Create a config in src/ar/config/lessons/
 * 2. Import it here and add an entry
 * 3. Place marker (.mind) and model (.glb) files in /public/ar/
 *
 * No engine code changes required.
 */

import type { ARLessonConfig } from './ARLessonConfig';
import { geometryTriangleARConfig } from './lessons/geometry-triangle';

/**
 * Registry: lesson ID → AR configuration
 *
 * Keys must match the lesson IDs in LessonStore.
 * Only lessons listed here show "Open in AR" buttons in the UI.
 */
export const ARLessonRegistry: Record<string, ARLessonConfig> = {
  // ── Phase 1: Geometry (Proof of Concept) ─────────────────────────────
  'Mathematics-class-9-triangles': geometryTriangleARConfig,

  // ── Phase 2: Future additions (add configs here) ──────────────────────
  // 'Mathematics-class-8-mensuration-cube': geometryCubeARConfig,
  // 'Science-class-10-biology-heart': biologyHeartARConfig,
  // 'Science-class-9-physics-light-optics': physicsOpticsARConfig,
};

/**
 * Get an AR config for a lesson. Returns undefined if not AR-enabled.
 */
export function getARConfig(lessonId: string): ARLessonConfig | undefined {
  return ARLessonRegistry[lessonId];
}

/**
 * Check if a lesson has an AR experience available.
 */
export function hasARSupport(lessonId: string): boolean {
  return lessonId in ARLessonRegistry;
}

/**
 * Get all lessons that have AR support.
 */
export function getAllARLessons(): ARLessonConfig[] {
  return Object.values(ARLessonRegistry);
}
