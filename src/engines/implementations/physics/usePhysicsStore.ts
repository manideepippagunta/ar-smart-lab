import { create } from 'zustand';
import type { PhysicsTopic, PhysicsParams } from './physicsTypes';

const DEFAULT_PARAMS: PhysicsParams = {
  mass: 5,
  force: 25,
  initialVelocity: 0,
  rampAngle: 15,
  gravity: 9.8,
  friction: 0.1,
  voltage: 12,
  resistance: 4,
  switchClosed: true,
  incidentAngle: 35,
  refractiveIndex: 1.5,
  focalLength: 10,
  magnetStrength: 1.2
};

interface PhysicsStoreState {
  activeTopic: PhysicsTopic;
  params: PhysicsParams;
  isPlaying: boolean;
  simTime: number;
  position: number;

  // Actions
  setTopic: (topic: PhysicsTopic) => void;
  updateParam: (key: keyof PhysicsParams, value: any) => void;
  setParams: (newParams: Partial<PhysicsParams>) => void;
  togglePlay: () => void;
  tickSim: (delta: number) => void;
  resetSim: () => void;
  resetAll: () => void;
}

export const usePhysicsStore = create<PhysicsStoreState>((set) => ({
  activeTopic: 'motion',
  params: { ...DEFAULT_PARAMS },
  isPlaying: false,
  simTime: 0,
  position: 0,

  setTopic: (topic) => set({ activeTopic: topic, isPlaying: false, simTime: 0, position: 0 }),

  updateParam: (key, value) => set((s) => ({
    params: { ...s.params, [key]: value }
  })),

  setParams: (newParams) => set((s) => ({
    params: { ...s.params, ...newParams }
  })),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  tickSim: (delta) => set((s) => {
    if (!s.isPlaying) return {};
    const nextTime = s.simTime + delta;
    const a = s.params.force / s.params.mass;
    const nextPos = s.params.initialVelocity * nextTime + 0.5 * a * nextTime * nextTime;
    return {
      simTime: nextTime,
      position: nextPos % 50 // Wrap around continuous track
    };
  }),

  resetSim: () => set({ simTime: 0, position: 0, isPlaying: false }),

  resetAll: () => set({
    activeTopic: 'motion',
    params: { ...DEFAULT_PARAMS },
    isPlaying: false,
    simTime: 0,
    position: 0
  })
}));
