export type ShapeCategory = '2D' | '3D';

export type ShapeType =
  | 'rectangle'
  | 'square'
  | 'triangle'
  | 'circle'
  | 'parallelogram'
  | 'rhombus'
  | 'trapezium'
  | 'cube'
  | 'cuboid'
  | 'cylinder'
  | 'cone'
  | 'sphere'
  | 'prism'
  | 'pyramid';

export interface MensurationParams {
  length: number;
  width: number;
  height: number;
  radius: number;
  side: number;
  base: number;
  slantHeight: number;
  d1: number;
  d2: number;
  baseA: number;
  baseB: number;
  angle: number;
}

export interface KaTeXStep {
  label: string;
  formula: string;
  substitution: string;
  answer: string;
}

export interface ShapeConfig {
  id: ShapeType;
  name: string;
  category: ShapeCategory;
  defaultParams: Partial<MensurationParams>;
}
