import { create } from 'zustand';
import type { ChemistryTopic, ChemistryParams } from './chemistryTypes';

const DEFAULT_PARAMS: ChemistryParams = {
  atomicNumber: 11, // Sodium (Na)
  phValue: 7.0,
  coefA: 2,
  coefB: 1,
  coefC: 2,
  coefD: 1,
  reactionType: 'synthesis'
};

interface ChemistryStoreState {
  activeTopic: ChemistryTopic;
  params: ChemistryParams;

  // Actions
  setTopic: (topic: ChemistryTopic) => void;
  updateParam: (key: keyof ChemistryParams, value: any) => void;
  setParams: (newParams: Partial<ChemistryParams>) => void;
  resetAll: () => void;
}

export const useChemistryStore = create<ChemistryStoreState>((set) => ({
  activeTopic: 'atom_structure',
  params: { ...DEFAULT_PARAMS },

  setTopic: (topic) => set({ activeTopic: topic }),

  updateParam: (key, value) => set((s) => ({
    params: { ...s.params, [key]: value }
  })),

  setParams: (newParams) => set((s) => ({
    params: { ...s.params, ...newParams }
  })),

  resetAll: () => set({
    activeTopic: 'atom_structure',
    params: { ...DEFAULT_PARAMS }
  })
}));
