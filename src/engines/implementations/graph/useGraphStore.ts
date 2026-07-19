import { create } from 'zustand';

export interface GraphPoint {
  id: string;
  x: number; // coordinate value (e.g. -10 to 10)
  y: number; // coordinate value
  label: string;
  color: string;
}

export interface GraphElement {
  id: string;
  type: 'segment' | 'ray' | 'line' | 'vector';
  p1Id: string;
  p2Id: string;
  color: string;
  label?: string;
}

export interface ChartDataItem {
  label: string;
  value: number;
  color?: string;
}

export type GraphMode = 'coordinate' | 'statistics';
export type GraphTool = 'select' | 'point' | 'segment' | 'ray' | 'line' | 'vector' | 'distance' | 'midpoint' | 'slope';
export type ChartType = 'bar' | 'histogram' | 'pie' | 'scatter' | 'line' | 'frequency';

interface HistoryState {
  points: GraphPoint[];
  elements: GraphElement[];
  chartData: ChartDataItem[];
}

interface GraphStoreState {
  // Mode & Tools
  mode: GraphMode;
  tool: GraphTool;
  chartType: ChartType;
  
  // Data
  points: GraphPoint[];
  elements: GraphElement[];
  chartData: ChartDataItem[];
  selectedIds: string[];
  
  // Viewport Settings
  pan: { x: number; y: number };
  zoom: number;
  snapToGrid: boolean;

  // History for Undo/Redo
  past: HistoryState[];
  future: HistoryState[];

  // Setters
  setMode: (mode: GraphMode) => void;
  setTool: (tool: GraphTool) => void;
  setChartType: (type: ChartType) => void;
  
  // Interactions
  addPoint: (x: number, y: number, label?: string, color?: string) => string;
  updatePoint: (id: string, x: number, y: number) => void;
  removePoint: (id: string) => void;
  
  addElement: (type: GraphElement['type'], p1Id: string, p2Id: string, label?: string, color?: string) => string;
  removeElement: (id: string) => void;
  
  // Charts
  setChartData: (data: ChartDataItem[]) => void;
  updateChartValue: (index: number, value: number) => void;
  updateChartLabel: (index: number, label: string) => void;

  // Selections
  selectId: (id: string, multi?: boolean) => void;
  clearSelection: () => void;

  // Viewport Actions
  setPan: (pan: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setSnapToGrid: (snap: boolean) => void;

  // History Actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const INITIAL_POINTS: GraphPoint[] = [
  { id: 'p1', x: 2, y: 3, label: 'A', color: '#3b82f6' },
  { id: 'p2', x: -4, y: -2, label: 'B', color: '#ef4444' }
];

const INITIAL_CHART_DATA: ChartDataItem[] = [
  { label: 'Jan', value: 35, color: '#3b82f6' },
  { label: 'Feb', value: 48, color: '#ef4444' },
  { label: 'Mar', value: 62, color: '#10b981' },
  { label: 'Apr', value: 25, color: '#f59e0b' },
  { label: 'May', value: 55, color: '#8b5cf6' }
];

const getHistorySnapshot = (state: GraphStoreState): HistoryState => ({
  points: JSON.parse(JSON.stringify(state.points)),
  elements: JSON.parse(JSON.stringify(state.elements)),
  chartData: JSON.parse(JSON.stringify(state.chartData))
});

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  mode: 'coordinate',
  tool: 'select',
  chartType: 'bar',
  
  points: INITIAL_POINTS,
  elements: [],
  chartData: INITIAL_CHART_DATA,
  selectedIds: [],
  
  pan: { x: 400, y: 300 }, // Default center of SVG canvas (800x600 grid)
  zoom: 1.0,
  snapToGrid: true,
  
  past: [],
  future: [],

  setMode: (mode) => set({ mode, selectedIds: [] }),
  setTool: (tool) => set({ tool }),
  setChartType: (chartType) => set({ chartType }),

  pushHistory: () => {
    const current = getHistorySnapshot(get());
    set((state) => ({
      past: [...state.past, current],
      future: []
    }));
  },

  undo: () => {
    const { past, future } = get();
    if (past.length === 0) return;
    
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    const current = getHistorySnapshot(get());
    
    set({
      past: newPast,
      future: [current, ...future],
      points: previous.points,
      elements: previous.elements,
      chartData: previous.chartData,
      selectedIds: []
    });
  },

  redo: () => {
    const { past, future } = get();
    if (future.length === 0) return;
    
    const next = future[0];
    const newFuture = future.slice(1);
    const current = getHistorySnapshot(get());
    
    set({
      past: [...past, current],
      future: newFuture,
      points: next.points,
      elements: next.elements,
      chartData: next.chartData,
      selectedIds: []
    });
  },

  addPoint: (x, y, label, color) => {
    get().pushHistory();
    const id = `pt-${Math.random().toString(36).substring(2, 9)}`;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const currentLabels = get().points.map(p => p.label);
    const nextLabel = label || alphabet.split('').find(char => !currentLabels.includes(char)) || `P${get().points.length + 1}`;
    
    const newPoint: GraphPoint = {
      id,
      x,
      y,
      label: nextLabel,
      color: color || '#3b82f6'
    };
    
    set((state) => ({
      points: [...state.points, newPoint]
    }));
    return id;
  },

  updatePoint: (id, x, y) => {
    // Note: To avoid saturating history on every drag tick,
    // pushHistory should be called onPointerDown/DragStart, not inside updatePoint.
    set((state) => ({
      points: state.points.map(p => p.id === id ? { ...p, x, y } : p)
    }));
  },

  removePoint: (id) => {
    get().pushHistory();
    set((state) => ({
      points: state.points.filter(p => p.id !== id),
      elements: state.elements.filter(el => el.p1Id !== id && el.p2Id !== id),
      selectedIds: state.selectedIds.filter(selId => selId !== id)
    }));
  },

  addElement: (type, p1Id, p2Id, label, color) => {
    get().pushHistory();
    const id = `el-${Math.random().toString(36).substring(2, 9)}`;
    const newElement: GraphElement = {
      id,
      type,
      p1Id,
      p2Id,
      color: color || '#8b5cf6',
      label
    };
    set((state) => ({
      elements: [...state.elements, newElement]
    }));
    return id;
  },

  removeElement: (id) => {
    get().pushHistory();
    set((state) => ({
      elements: state.elements.filter(el => el.id !== id),
      selectedIds: state.selectedIds.filter(selId => selId !== id)
    }));
  },

  setChartData: (chartData) => {
    get().pushHistory();
    set({ chartData });
  },

  updateChartValue: (index, value) => {
    set((state) => {
      const nextData = [...state.chartData];
      if (nextData[index]) {
        nextData[index] = { ...nextData[index], value };
      }
      return { chartData: nextData };
    });
  },

  updateChartLabel: (index, label) => {
    get().pushHistory();
    set((state) => {
      const nextData = [...state.chartData];
      if (nextData[index]) {
        nextData[index] = { ...nextData[index], label };
      }
      return { chartData: nextData };
    });
  },

  selectId: (id, multi = false) => {
    set((state) => {
      if (multi) {
        const exists = state.selectedIds.includes(id);
        const nextSelected = exists
          ? state.selectedIds.filter(selId => selId !== id)
          : [...state.selectedIds, id];
        return { selectedIds: nextSelected };
      } else {
        return { selectedIds: [id] };
      }
    });
  },

  clearSelection: () => set({ selectedIds: [] }),

  setPan: (panUpdate) => {
    set((state) => ({
      pan: typeof panUpdate === 'function' ? panUpdate(state.pan) : panUpdate
    }));
  },

  setZoom: (zoomUpdate) => {
    set((state) => {
      const targetZoom = typeof zoomUpdate === 'function' ? zoomUpdate(state.zoom) : zoomUpdate;
      const boundedZoom = Math.max(0.4, Math.min(4.0, targetZoom));
      return { zoom: boundedZoom };
    });
  },

  setSnapToGrid: (snapToGrid) => set({ snapToGrid }),

  reset: () => set({
    points: INITIAL_POINTS,
    elements: [],
    chartData: INITIAL_CHART_DATA,
    selectedIds: [],
    pan: { x: 400, y: 300 },
    zoom: 1.0,
    snapToGrid: true,
    past: [],
    future: []
  })
}));
