export type BiologyTopic =
  | 'cell_structure'
  | 'anatomy'
  | 'photosynthesis'
  | 'ecosystem'
  | 'labeling';

export type CellType = 'plant' | 'animal';

export type AnatomySystem = 'circulatory' | 'digestive' | 'respiratory' | 'nervous';

export interface BiologyParams {
  cellType: CellType;
  systemType: AnatomySystem;
  sunlightIntensity: number;   // 0 - 100%
  co2Level: number;            // ppm / arbitrary 0 - 100
  producerEnergy: number;      // Joules (e.g. 10000 J)
  selectedOrganelle: string | null;
}

export interface KaTeXStep {
  label: string;
  formula: string;
  substitution: string;
  answer: string;
}
