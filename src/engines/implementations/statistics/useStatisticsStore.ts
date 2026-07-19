import { create } from 'zustand';
import type { DataItem } from './statisticsMath';

export type EngineTab = 'statistics' | 'probability';
export type ChartType = 'bar' | 'histogram' | 'pie' | 'line' | 'frequency-polygon' | 'scatter';
export type ProbabilityType = 'coin' | 'dice' | 'cards' | 'spinner';

export interface ProbabilityState {
  totalTrials: number;
  outcomes: Record<string, number>;
  lastOutcome: string | null;
  history: number[]; // Track experimental probability over time
}

const DEFAULT_DATASET: DataItem[] = [
  { id: 'd1', label: 'Class A', value: 35, color: '#3b82f6', x: 1, y: 35 },
  { id: 'd2', label: 'Class B', value: 48, color: '#8b5cf6', x: 2, y: 48 },
  { id: 'd3', label: 'Class C', value: 24, color: '#ec4899', x: 3, y: 24 },
  { id: 'd4', label: 'Class D', value: 52, color: '#10b981', x: 4, y: 52 },
  { id: 'd5', label: 'Class E', value: 41, color: '#f59e0b', x: 5, y: 41 }
];

const INITIAL_PROBABILITY_OUTCOMES: Record<ProbabilityType, Record<string, number>> = {
  coin: { Heads: 0, Tails: 0 },
  dice: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 },
  cards: { Hearts: 0, Diamonds: 0, Clubs: 0, Spades: 0 },
  spinner: { Red: 0, Blue: 0, Green: 0, Yellow: 0 }
};

interface StatisticsStoreState {
  activeTab: EngineTab;
  chartType: ChartType;
  probabilityType: ProbabilityType;
  dataset: DataItem[];
  probability: ProbabilityState;
  isSimulating: boolean;

  // Actions
  setActiveTab: (tab: EngineTab) => void;
  setChartType: (type: ChartType) => void;
  setProbabilityType: (type: ProbabilityType) => void;
  setDataset: (data: DataItem[]) => void;
  updateDataItem: (id: string, updates: Partial<DataItem>) => void;
  addDataItem: (label?: string, value?: number) => void;
  removeDataItem: (id: string) => void;
  shuffleDataset: () => void;
  generateRandomDataset: (preset?: 'test_scores' | 'dice_freq' | 'heights') => void;
  
  // Simulation Actions
  runTrials: (count: number) => void;
  resetProbability: () => void;
  resetAll: () => void;
}

export const useStatisticsStore = create<StatisticsStoreState>((set, get) => ({
  activeTab: 'statistics',
  chartType: 'bar',
  probabilityType: 'coin',
  dataset: DEFAULT_DATASET,
  probability: {
    totalTrials: 0,
    outcomes: { ...INITIAL_PROBABILITY_OUTCOMES.coin },
    lastOutcome: null,
    history: []
  },
  isSimulating: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setChartType: (type) => set({ chartType: type }),

  setProbabilityType: (type) => {
    const defaultOutcomes = { ...INITIAL_PROBABILITY_OUTCOMES[type] };
    set({
      probabilityType: type,
      probability: {
        totalTrials: 0,
        outcomes: defaultOutcomes,
        lastOutcome: null,
        history: []
      }
    });
  },

  setDataset: (data) => set({ dataset: data }),

  updateDataItem: (id, updates) => set((s) => ({
    dataset: s.dataset.map(item => item.id === id ? { ...item, ...updates } : item)
  })),

  addDataItem: (label, value) => set((s) => {
    const nextIdx = s.dataset.length + 1;
    const newLabel = label || `Data ${nextIdx}`;
    const newVal = value ?? Math.floor(Math.random() * 50) + 10;
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#f43f5e'];
    const color = colors[nextIdx % colors.length];

    const newItem: DataItem = {
      id: `d_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: newLabel,
      value: newVal,
      color,
      x: nextIdx,
      y: newVal
    };
    return { dataset: [...s.dataset, newItem] };
  }),

  removeDataItem: (id) => set((s) => ({
    dataset: s.dataset.filter(item => item.id !== id)
  })),

  shuffleDataset: () => set((s) => {
    const shuffled = [...s.dataset].sort(() => Math.random() - 0.5);
    return { dataset: shuffled };
  }),

  generateRandomDataset: (preset = 'test_scores') => set(() => {
    let newItems: DataItem[] = [];
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

    if (preset === 'test_scores') {
      const subjects = ['Math', 'Science', 'English', 'History', 'Art', 'Geography'];
      newItems = subjects.map((sub, i) => ({
        id: `d_score_${i}`,
        label: sub,
        value: Math.floor(Math.random() * 45) + 55,
        color: colors[i % colors.length],
        x: i + 1,
        y: Math.floor(Math.random() * 45) + 55
      }));
    } else if (preset === 'dice_freq') {
      for (let i = 1; i <= 6; i++) {
        const freq = Math.floor(Math.random() * 30) + 10;
        newItems.push({
          id: `d_dice_${i}`,
          label: `Side ${i}`,
          value: freq,
          color: colors[i % colors.length],
          x: i,
          y: freq
        });
      }
    } else {
      // heights
      const groups = ['140-145cm', '145-150cm', '150-155cm', '155-160cm', '160-165cm'];
      newItems = groups.map((grp, i) => ({
        id: `d_height_${i}`,
        label: grp,
        value: Math.floor(Math.random() * 25) + 5,
        color: colors[i % colors.length],
        x: i + 1,
        y: Math.floor(Math.random() * 25) + 5
      }));
    }

    return { dataset: newItems };
  }),

  runTrials: (count) => {
    const { probabilityType, probability } = get();
    set({ isSimulating: true });

    let outcomeKeys: string[] = [];
    if (probabilityType === 'coin') outcomeKeys = ['Heads', 'Tails'];
    else if (probabilityType === 'dice') outcomeKeys = ['1', '2', '3', '4', '5', '6'];
    else if (probabilityType === 'cards') outcomeKeys = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    else if (probabilityType === 'spinner') outcomeKeys = ['Red', 'Blue', 'Green', 'Yellow'];

    const newOutcomes = { ...probability.outcomes };
    let lastPicked = probability.lastOutcome;
    const history = [...probability.history];

    // High performance batch execution
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * outcomeKeys.length);
      lastPicked = outcomeKeys[idx];
      newOutcomes[lastPicked] = (newOutcomes[lastPicked] || 0) + 1;
    }

    const nextTotal = probability.totalTrials + count;
    // Favorable outcome for history tracking (e.g., Heads or '1' or 'Hearts' or 'Red')
    const primaryOutcome = outcomeKeys[0];
    const favCount = newOutcomes[primaryOutcome] || 0;
    const currentRate = nextTotal > 0 ? favCount / nextTotal : 0;
    history.push(currentRate);

    // Keep history compact (max 50 points)
    const trimmedHistory = history.length > 50 ? history.slice(history.length - 50) : history;

    set({
      isSimulating: false,
      probability: {
        totalTrials: nextTotal,
        outcomes: newOutcomes,
        lastOutcome: lastPicked,
        history: trimmedHistory
      }
    });
  },

  resetProbability: () => {
    const { probabilityType } = get();
    set({
      probability: {
        totalTrials: 0,
        outcomes: { ...INITIAL_PROBABILITY_OUTCOMES[probabilityType] },
        lastOutcome: null,
        history: []
      }
    });
  },

  resetAll: () => {
    set({
      activeTab: 'statistics',
      chartType: 'bar',
      probabilityType: 'coin',
      dataset: DEFAULT_DATASET,
      probability: {
        totalTrials: 0,
        outcomes: { ...INITIAL_PROBABILITY_OUTCOMES.coin },
        lastOutcome: null,
        history: []
      },
      isSimulating: false
    });
  }
}));
