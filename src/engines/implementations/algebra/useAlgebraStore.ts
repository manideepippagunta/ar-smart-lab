import { create } from 'zustand';

export type TileType = 'pos_x' | 'neg_x' | 'pos_x2' | 'neg_x2' | 'pos_1' | 'neg_1';
export type EquationSide = 'left' | 'right';
export type AlgebraMode = 'variables' | 'expressions' | 'balance' | 'solve' | 'simplify' | 'factorise';

export interface AlgebraTile {
  id: string;
  type: TileType;
  side: EquationSide;
  slot?: number;
}

export interface SolverStep {
  equation: string;       // LaTeX e.g. "2x + 5 = 13"
  explanation: string;    // Human explanation e.g. "Subtract 5 from both sides"
  operation: string;      // LaTeX operation e.g. "-5"
  result: string;         // LaTeX result e.g. "2x = 8"
}

export interface MistakeEvent {
  id: string;
  timestamp: number;
  attempted: string;
  explanation: string;
}

interface AlgebraState {
  // Lesson config
  mode: AlgebraMode;
  
  // Equation structure
  leftValue: number;   // "weight" on left side
  rightValue: number;  // "weight" on right side
  xValue: number;      // current value of x
  targetXValue: number; // value x should be (for solve mode)
  
  // Tiles
  tiles: AlgebraTile[];
  
  // Expression builder
  expression: string;      // e.g. "2x + 5"
  builtExpression: string; // assembled from tiles
  
  // Solver
  steps: SolverStep[];
  currentStep: number;
  isSolved: boolean;
  
  // Progress tracking
  currentObjective: string;
  currentHint: number;   // 0 = none, 1+ = progressive hints
  attemptCount: number;
  mistakeCount: number;
  mistakes: MistakeEvent[];
  
  // Mistake Engine
  lastMistake: MistakeEvent | null;
  
  // Actions
  setMode: (mode: AlgebraMode) => void;
  setXValue: (v: number) => void;
  addTile: (type: TileType, side: EquationSide) => void;
  removeTile: (id: string) => void;
  moveTile: (id: string, toSide: EquationSide) => void;
  setExpression: (expr: string) => void;
  recordMistake: (attempted: string, explanation: string) => void;
  advanceHint: () => void;
  nextStep: () => void;
  setSteps: (steps: SolverStep[]) => void;
  setSolved: (v: boolean) => void;
  reset: (mode?: AlgebraMode) => void;
}



const uuid = () => Math.random().toString(36).slice(2, 10);

export const useAlgebraStore = create<AlgebraState>((set, get) => ({
  mode: 'balance',
  leftValue: 6,
  rightValue: 6,
  xValue: 3,
  targetXValue: 4,
  tiles: [],
  expression: '2x + 4 = 10',
  builtExpression: '',
  steps: [],
  currentStep: 0,
  isSolved: false,
  currentObjective: 'Balance the equation by performing the same operation on both sides.',
  currentHint: 0,
  attemptCount: 0,
  mistakeCount: 0,
  mistakes: [],
  lastMistake: null,

  setMode: (mode) => set({ mode }),
  
  setXValue: (v) => set({ xValue: v }),
  
  addTile: (type, side) => {
    const tile: AlgebraTile = { id: uuid(), type, side };
    set(s => ({
      tiles: [...s.tiles, tile],
      leftValue: side === 'left' ? s.leftValue + (type === 'pos_1' ? 1 : type === 'neg_1' ? -1 : 0) : s.leftValue,
      rightValue: side === 'right' ? s.rightValue + (type === 'pos_1' ? 1 : type === 'neg_1' ? -1 : 0) : s.rightValue,
    }));
  },
  
  removeTile: (id) => {
    const tile = get().tiles.find(t => t.id === id);
    if (!tile) return;
    set(s => ({
      tiles: s.tiles.filter(t => t.id !== id),
      leftValue: tile.side === 'left' ? s.leftValue - (tile.type === 'pos_1' ? 1 : tile.type === 'neg_1' ? -1 : 0) : s.leftValue,
      rightValue: tile.side === 'right' ? s.rightValue - (tile.type === 'pos_1' ? 1 : tile.type === 'neg_1' ? -1 : 0) : s.rightValue,
    }));
  },

  moveTile: (id, toSide) => {
    set(s => ({
      tiles: s.tiles.map(t => t.id === id ? { ...t, side: toSide } : t)
    }));
  },
  
  setExpression: (expr) => set({ expression: expr }),
  
  recordMistake: (attempted, explanation) => {
    const event: MistakeEvent = {
      id: uuid(),
      timestamp: Date.now(),
      attempted,
      explanation,
    };
    set(s => ({
      mistakeCount: s.mistakeCount + 1,
      attemptCount: s.attemptCount + 1,
      mistakes: [...s.mistakes, event],
      lastMistake: event,
    }));
  },
  
  advanceHint: () => set(s => ({
    currentHint: Math.min(s.currentHint + 1, 3)
  })),
  
  setSteps: (steps) => set({ steps, currentStep: 0, isSolved: false }),
  
  nextStep: () => set(s => {
    const nextIdx = s.currentStep + 1;
    return {
      currentStep: Math.min(nextIdx, s.steps.length - 1),
      isSolved: nextIdx >= s.steps.length
    };
  }),
  
  setSolved: (v) => set({ isSolved: v }),

  reset: (mode) => set(s => ({
    mode: mode || s.mode,
    leftValue: 6,
    rightValue: 6,
    xValue: 3,
    targetXValue: 4,
    tiles: [],
    builtExpression: '',
    steps: [],
    currentStep: 0,
    isSolved: false,
    currentHint: 0,
    attemptCount: 0,
    mistakeCount: 0,
    mistakes: [],
    lastMistake: null,
  })),
}));
