import { create } from 'zustand';

export interface IEngineAdapter {
  getState: () => any;
  getProgress: () => number;
  isCompleted: (validationKey: string) => boolean;
  reset: () => void;
  getMeasurements: () => any;
  getProperties: () => any;
}

interface EngineAdapterState {
  adapter: IEngineAdapter | null;
  setAdapter: (adapter: IEngineAdapter) => void;
}

export const useEngineAdapterStore = create<EngineAdapterState>((set) => ({
  adapter: null,
  setAdapter: (adapter) => set({ adapter })
}));
