import { create } from 'zustand';
import { computeTriangleProperties } from './math';
import type { TriangleMathState, Vector3D } from './math';

interface TriangleStoreState {
  // Vertices
  A: Vector3D;
  B: Vector3D;
  C: Vector3D;
  
  // Computed Math
  math: TriangleMathState;

  // Visibility Toggles
  showMeasurements: boolean;
  showLabels: boolean;
  showConstructionLines: boolean;
  showIncircle: boolean;
  showCircumcircle: boolean;
  showMedians: boolean;
  showAltitudes: boolean;
  wireframe: boolean;

  // Setters
  setVertex: (vertex: 'A' | 'B' | 'C', position: Vector3D) => void;
  toggleVisibility: (key: keyof Omit<TriangleStoreState, 'A'|'B'|'C'|'math'|'setVertex'|'toggleVisibility'|'reset'>) => void;
  reset: () => void;
}

const INITIAL_A: Vector3D = [0, 2, 0];
const INITIAL_B: Vector3D = [-2, -1, 0];
const INITIAL_C: Vector3D = [3, -1, 0];

export const useTriangleStore = create<TriangleStoreState>((set) => ({
  A: INITIAL_A,
  B: INITIAL_B,
  C: INITIAL_C,
  
  math: computeTriangleProperties(INITIAL_A, INITIAL_B, INITIAL_C),

  showMeasurements: true,
  showLabels: true,
  showConstructionLines: false,
  showIncircle: false,
  showCircumcircle: false,
  showMedians: false,
  showAltitudes: false,
  wireframe: false,

  setVertex: (vertex, position) => set((state) => {
    const newState = { ...state, [vertex]: position };
    return {
      [vertex]: position,
      math: computeTriangleProperties(newState.A, newState.B, newState.C)
    };
  }),

  toggleVisibility: (key) => set((state) => ({ [key]: !state[key as keyof TriangleStoreState] })),
  
  reset: () => set({
    A: INITIAL_A,
    B: INITIAL_B,
    C: INITIAL_C,
    math: computeTriangleProperties(INITIAL_A, INITIAL_B, INITIAL_C)
  })
}));
