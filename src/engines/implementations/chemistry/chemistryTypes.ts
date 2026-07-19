export type ChemistryTopic =
  | 'atom_structure'
  | 'periodic_table'
  | 'reactions'
  | 'balancing'
  | 'acids_bases';

export interface ElementData {
  z: number;               // Atomic Number
  symbol: string;
  name: string;
  mass: number;            // Atomic Mass (u)
  group: number;
  period: number;
  category: 'alkali' | 'alkaline' | 'transition' | 'nonmetal' | 'halogen' | 'noble' | 'metalloid';
  shells: number[];        // e.g. [2, 8, 1] for Sodium
}

export interface ChemistryParams {
  atomicNumber: number;
  phValue: number;
  coefA: number;
  coefB: number;
  coefC: number;
  coefD: number;
  reactionType: 'synthesis' | 'neutralisation' | 'displacement';
}

export interface KaTeXStep {
  label: string;
  formula: string;
  substitution: string;
  answer: string;
}
