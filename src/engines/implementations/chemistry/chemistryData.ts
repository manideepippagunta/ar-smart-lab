import type { ElementData } from './chemistryTypes';

export const ELEMENTS_DB: Record<number, ElementData> = {
  1: { z: 1, symbol: 'H', name: 'Hydrogen', mass: 1.008, group: 1, period: 1, category: 'nonmetal', shells: [1] },
  2: { z: 2, symbol: 'He', name: 'Helium', mass: 4.0026, group: 18, period: 1, category: 'noble', shells: [2] },
  3: { z: 3, symbol: 'Li', name: 'Lithium', mass: 6.94, group: 1, period: 2, category: 'alkali', shells: [2, 1] },
  4: { z: 4, symbol: 'Be', name: 'Beryllium', mass: 9.0122, group: 2, period: 2, category: 'alkaline', shells: [2, 2] },
  5: { z: 5, symbol: 'B', name: 'Boron', mass: 10.81, group: 13, period: 2, category: 'metalloid', shells: [2, 3] },
  6: { z: 6, symbol: 'C', name: 'Carbon', mass: 12.011, group: 14, period: 2, category: 'nonmetal', shells: [2, 4] },
  7: { z: 7, symbol: 'N', name: 'Nitrogen', mass: 14.007, group: 15, period: 2, category: 'nonmetal', shells: [2, 5] },
  8: { z: 8, symbol: 'O', name: 'Oxygen', mass: 15.999, group: 16, period: 2, category: 'nonmetal', shells: [2, 6] },
  9: { z: 9, symbol: 'F', name: 'Fluorine', mass: 18.998, group: 17, period: 2, category: 'halogen', shells: [2, 7] },
  10: { z: 10, symbol: 'Ne', name: 'Neon', mass: 20.180, group: 18, period: 2, category: 'noble', shells: [2, 8] },
  11: { z: 11, symbol: 'Na', name: 'Sodium', mass: 22.990, group: 1, period: 3, category: 'alkali', shells: [2, 8, 1] },
  12: { z: 12, symbol: 'Mg', name: 'Magnesium', mass: 24.305, group: 2, period: 3, category: 'alkaline', shells: [2, 8, 2] },
  13: { z: 13, symbol: 'Al', name: 'Aluminium', mass: 26.982, group: 13, period: 3, category: 'transition', shells: [2, 8, 3] },
  14: { z: 14, symbol: 'Si', name: 'Silicon', mass: 28.085, group: 14, period: 3, category: 'metalloid', shells: [2, 8, 4] },
  15: { z: 15, symbol: 'P', name: 'Phosphorus', mass: 30.974, group: 15, period: 3, category: 'nonmetal', shells: [2, 8, 5] },
  16: { z: 16, symbol: 'S', name: 'Sulfur', mass: 32.06, group: 16, period: 3, category: 'nonmetal', shells: [2, 8, 6] },
  17: { z: 17, symbol: 'Cl', name: 'Chlorine', mass: 35.45, group: 17, period: 3, category: 'halogen', shells: [2, 8, 7] },
  18: { z: 18, symbol: 'Ar', name: 'Argon', mass: 39.948, group: 18, period: 3, category: 'noble', shells: [2, 8, 8] },
  19: { z: 19, symbol: 'K', name: 'Potassium', mass: 39.098, group: 1, period: 4, category: 'alkali', shells: [2, 8, 8, 1] },
  20: { z: 20, symbol: 'Ca', name: 'Calcium', mass: 40.078, group: 2, period: 4, category: 'alkaline', shells: [2, 8, 8, 2] },
  26: { z: 26, symbol: 'Fe', name: 'Iron', mass: 55.845, group: 8, period: 4, category: 'transition', shells: [2, 8, 14, 2] },
  29: { z: 29, symbol: 'Cu', name: 'Copper', mass: 63.546, group: 11, period: 4, category: 'transition', shells: [2, 8, 18, 1] },
  30: { z: 30, symbol: 'Zn', name: 'Zinc', mass: 65.38, group: 12, period: 4, category: 'transition', shells: [2, 8, 18, 2] }
};
