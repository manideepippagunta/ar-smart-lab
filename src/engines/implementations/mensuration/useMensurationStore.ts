import { create } from 'zustand';
import type { ShapeType, MensurationParams } from './mensurationTypes';

const DEFAULT_PARAMS: MensurationParams = {
  length: 5,
  width: 4,
  height: 6,
  radius: 3,
  side: 4,
  base: 6,
  slantHeight: 5,
  d1: 6,
  d2: 8,
  baseA: 8,
  baseB: 5,
  angle: 60
};

interface MensurationStoreState {
  activeShape: ShapeType;
  params: MensurationParams;
  showWireframe: boolean;

  // Actions
  setShape: (shape: ShapeType) => void;
  updateParam: (key: keyof MensurationParams, value: number) => void;
  setParams: (params: Partial<MensurationParams>) => void;
  toggleWireframe: () => void;
  resetParams: () => void;
}

export const useMensurationStore = create<MensurationStoreState>((set) => ({
  activeShape: 'cuboid',
  params: { ...DEFAULT_PARAMS },
  showWireframe: false,

  setShape: (shape) => set({ activeShape: shape }),

  updateParam: (key, value) => set((s) => ({
    params: { ...s.params, [key]: value }
  })),

  setParams: (newParams) => set((s) => ({
    params: { ...s.params, ...newParams }
  })),

  toggleWireframe: () => set((s) => ({ showWireframe: !s.showWireframe })),

  resetParams: () => set({ params: { ...DEFAULT_PARAMS }, activeShape: 'cuboid' })
}));
