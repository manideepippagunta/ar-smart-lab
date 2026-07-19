/**
 * Geometry Triangle AR Lesson Configuration
 *
 * Proof-of-concept AR lesson for Phase 1.
 *
 * Uses a PROCEDURAL pyramid geometry (no external .glb required).
 * The Triangle/Pyramid demonstrates:
 * - Marker-based AR tracking
 * - Procedural 3D geometry
 * - Annotation labels (vertices, angle markers)
 * - Tap interaction to show educational info
 * - HUD with area/perimeter formulas
 *
 * To extend: swap procedural config for a real .glb model path.
 */

import type { ARLessonConfig } from '../ARLessonConfig';

export const geometryTriangleARConfig: ARLessonConfig = {
  lessonId: 'Mathematics-class-9-triangles',
  title: 'Triangle in AR',
  subtitle: 'Class 9 Mathematics — Geometry',
  category: 'mathematics',
  trackingStrategy: 'marker',
  markerFile: '/ar/markers/geometry-triangle.mind',
  markerPreviewImage: '/ar/targets/geometry-triangle-target.png',
  markerDownloadUrl: '/ar/targets/geometry-triangle-target.png',

  model: {
    // Procedural pyramid — no .glb needed for demo
    src: '',
    scale: [0.08, 0.08, 0.08],
    position: [0, 0.04, 0],
    rotation: [0, 0, 0],
    procedural: {
      type: 'pyramid',
      color: '#4F8EF7',
      wireframe: false,
    },
    animations: {
      autoPlay: 'spin',
      loopMode: 'repeat',
    },
  },

  annotations: [
    {
      label: 'Vertex A',
      position: [0, 1.2, 0],
      color: '#EF4444',
      description: 'Apex of the triangular pyramid. All three lateral edges meet here.',
    },
    {
      label: 'Base BC',
      position: [-0.5, 0, 0.5],
      color: '#10B981',
      description: 'The base edge of the triangle. Its length determines the base of the shape.',
    },
    {
      label: 'Height (h)',
      position: [0.6, 0.6, 0],
      color: '#F59E0B',
      description: 'Perpendicular distance from apex to base. Used in area formula: A = ½ × base × height.',
    },
    {
      label: 'Face',
      position: [0, 0.5, 0.7],
      color: '#8B5CF6',
      description: 'One of the three lateral triangular faces of the pyramid.',
    },
  ],

  interactions: [
    {
      type: 'tap',
      action: 'toggle-animation',
      payload: 'spin',
    },
    {
      type: 'pinch-zoom',
      action: 'reset',
    },
  ],

  hudInfo: {
    description: 'A triangular pyramid (tetrahedron) has 4 triangular faces, 4 vertices, and 6 edges.',
    facts: [
      'Area of a triangle = ½ × base × height',
      'Perimeter = sum of all three sides',
      'Angle sum of any triangle = 180°',
      'An equilateral triangle has all sides equal and all angles = 60°',
    ],
    formula: 'A = ½ × b × h',
  },
};
