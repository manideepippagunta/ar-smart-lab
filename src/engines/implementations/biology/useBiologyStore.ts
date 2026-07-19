import { create } from 'zustand';
import type { BiologyTopic, BiologyParams, CellType, AnatomySystem } from './biologyTypes';

const DEFAULT_PARAMS: BiologyParams = {
  cellType: 'plant',
  systemType: 'circulatory',
  sunlightIntensity: 80,
  co2Level: 60,
  producerEnergy: 10000,
  selectedOrganelle: null
};

interface BiologyStoreState {
  activeTopic: BiologyTopic;
  params: BiologyParams;
  labelAssignments: Record<string, string>; // labelId -> zoneId

  // Actions
  setTopic: (topic: BiologyTopic) => void;
  setCellType: (cellType: CellType) => void;
  setSystemType: (systemType: AnatomySystem) => void;
  updateParam: (key: keyof BiologyParams, value: any) => void;
  assignLabel: (labelId: string, zoneId: string) => void;
  resetAll: () => void;
}

export const useBiologyStore = create<BiologyStoreState>((set) => ({
  activeTopic: 'cell_structure',
  params: { ...DEFAULT_PARAMS },
  labelAssignments: {},

  setTopic: (topic) => set({ activeTopic: topic }),

  setCellType: (cellType) => set((s) => ({
    params: { ...s.params, cellType }
  })),

  setSystemType: (systemType) => set((s) => ({
    params: { ...s.params, systemType }
  })),

  updateParam: (key, value) => set((s) => ({
    params: { ...s.params, [key]: value }
  })),

  assignLabel: (labelId, zoneId) => set((s) => ({
    labelAssignments: { ...s.labelAssignments, [labelId]: zoneId }
  })),

  resetAll: () => set({
    activeTopic: 'cell_structure',
    params: { ...DEFAULT_PARAMS },
    labelAssignments: {}
  })
}));
