import { create } from 'zustand';

export type Vector3D = [number, number, number];

export interface GeoPoint {
  id: string;
  position: Vector3D;
  label?: string;
  color?: string;
  fixed?: boolean; // If true, cannot be dragged
}

export interface GeoSegment {
  id: string;
  p1Id: string;
  p2Id: string;
  label?: string;
  color?: string;
}

export interface GeoRay {
  id: string;
  originId: string;
  directionPointId: string;
  label?: string;
  color?: string;
}

export interface GeoLine {
  id: string;
  p1Id: string;
  p2Id: string;
  label?: string;
  color?: string;
}

export interface GeoAngle {
  id: string;
  p1Id: string;
  vertexId: string;
  p2Id: string;
  label?: string;
  color?: string;
}

export interface GeoCircle {
  id: string;
  centerId: string;
  radiusPointId?: string; // Point on the edge
  radius?: number; // Fixed radius if radiusPointId not provided
  label?: string;
  color?: string;
  showCenter?: boolean;
}

export interface GeoPolygon {
  id: string;
  pointIds: string[]; // Ordered list of vertices
  label?: string;
  color?: string;
  isRegular?: boolean;
}

export interface ComputedStat {
  label: string;
  formula?: string;
  substitution?: string;
  answer: string;
}

export interface GeometryStateData {
  points: Record<string, GeoPoint>;
  segments: Record<string, GeoSegment>;
  rays: Record<string, GeoRay>;
  lines: Record<string, GeoLine>;
  angles: Record<string, GeoAngle>;
  circles: Record<string, GeoCircle>;
  polygons: Record<string, GeoPolygon>;
}

interface GeometryStoreState {
  data: GeometryStateData;
  
  // UI & Settings
  showGrid: boolean;
  showLabels: boolean;
  showMeasurements: boolean;
  snapToGrid: boolean;
  selectedIds: string[];

  // Data-Driven UI
  computedStats: ComputedStat[];
  engineParams: Record<string, number>;
  
  // History
  history: GeometryStateData[];
  historyIndex: number;

  // Actions
  setPointPosition: (id: string, position: Vector3D) => void;
  addPoint: (point: GeoPoint) => void;
  removePoint: (id: string) => void;
  addSegment: (segment: GeoSegment) => void;
  addLine: (line: GeoLine) => void;
  addRay: (ray: GeoRay) => void;
  addAngle: (angle: GeoAngle) => void;
  addCircle: (circle: GeoCircle) => void;
  addPolygon: (polygon: GeoPolygon) => void;
  
  setComputedStats: (stats: ComputedStat[]) => void;
  setEngineParam: (key: string, value: number) => void;
  
  toggleSetting: (key: 'showGrid' | 'showLabels' | 'showMeasurements' | 'snapToGrid') => void;
  select: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
  reset: (initialData?: GeometryStateData) => void;
}

const emptyData: GeometryStateData = {
  points: {}, segments: {}, rays: {}, lines: {}, angles: {}, circles: {}, polygons: {}
};

export const useGeometryStore = create<GeometryStoreState>((set, get) => ({
  data: emptyData,
  showGrid: true,
  showLabels: true,
  showMeasurements: true,
  snapToGrid: false,
  selectedIds: [],
  computedStats: [],
  engineParams: {},
  history: [emptyData],
  historyIndex: 0,

  setPointPosition: (id, position) => {
    const { snapToGrid } = get();
    let finalPos = position;
    if (snapToGrid) {
      finalPos = [Math.round(position[0]), Math.round(position[1]), position[2]];
    }

    set((state) => {
      const newData = {
        ...state.data,
        points: {
          ...state.data.points,
          [id]: { ...state.data.points[id], position: finalPos }
        }
      };
      return { data: newData };
    });
  },

  addPoint: (p) => set(s => ({ data: { ...s.data, points: { ...s.data.points, [p.id]: p } } })),
  removePoint: (id) => set(s => {
    const newPoints = { ...s.data.points };
    delete newPoints[id];
    return { data: { ...s.data, points: newPoints } };
  }),
  addSegment: (seg) => set(s => ({ data: { ...s.data, segments: { ...s.data.segments, [seg.id]: seg } } })),
  addLine: (line) => set(s => ({ data: { ...s.data, lines: { ...s.data.lines, [line.id]: line } } })),
  addRay: (ray) => set(s => ({ data: { ...s.data, rays: { ...s.data.rays, [ray.id]: ray } } })),
  addAngle: (angle) => set(s => ({ data: { ...s.data, angles: { ...s.data.angles, [angle.id]: angle } } })),
  addCircle: (circle) => set(s => ({ data: { ...s.data, circles: { ...s.data.circles, [circle.id]: circle } } })),
  addPolygon: (polygon) => set(s => ({ data: { ...s.data, polygons: { ...s.data.polygons, [polygon.id]: polygon } } })),

  setComputedStats: (stats) => set({ computedStats: stats }),
  setEngineParam: (key, value) => set(s => ({ engineParams: { ...s.engineParams, [key]: value } })),

  toggleSetting: (key) => set(s => ({ [key]: !s[key] })),
  
  select: (id, multi = false) => set(s => ({
    selectedIds: multi ? [...s.selectedIds, id] : [id]
  })),
  clearSelection: () => set({ selectedIds: [] }),

  saveHistory: () => set(s => {
    const newHistory = s.history.slice(0, s.historyIndex + 1);
    newHistory.push(s.data);
    return { history: newHistory, historyIndex: newHistory.length - 1 };
  }),

  undo: () => set(s => {
    if (s.historyIndex > 0) {
      const newIdx = s.historyIndex - 1;
      return { data: s.history[newIdx], historyIndex: newIdx };
    }
    return {};
  }),

  redo: () => set(s => {
    if (s.historyIndex < s.history.length - 1) {
      const newIdx = s.historyIndex + 1;
      return { data: s.history[newIdx], historyIndex: newIdx };
    }
    return {};
  }),

  reset: (initialData = emptyData) => set({
    data: initialData,
    history: [initialData],
    historyIndex: 0,
    selectedIds: []
  })
}));
