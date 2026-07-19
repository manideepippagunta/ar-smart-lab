import type { ChemistryTopic, ChemistryParams, KaTeXStep } from './chemistryTypes';
import { ELEMENTS_DB } from './chemistryData';

export function calculateChemistry(
  topic: ChemistryTopic,
  params: ChemistryParams
): { steps: KaTeXStep[]; summaryText: string } {
  const {
    atomicNumber = 11,
    phValue = 7.0,
    coefA = 2,
    coefB = 1,
    coefC = 2,
    reactionType = 'synthesis'
  } = params;

  const steps: KaTeXStep[] = [];
  let summaryText = '';

  switch (topic) {
    case 'atom_structure': {
      const element = ELEMENTS_DB[atomicNumber] || ELEMENTS_DB[11]; // Default Sodium
      const shellsStr = element.shells.join(', ');
      const valenceE = element.shells[element.shells.length - 1];

      steps.push({
        label: `Bohr Model: ${element.name} (${element.symbol})`,
        formula: '\\text{Atomic Number } Z = p^+ = e^-',
        substitution: `Z = ${element.z} \\text{ protons, } ${element.z} \\text{ electrons}`,
        answer: `Z = ${element.z}`
      });
      steps.push({
        label: 'Electronic Configuration (K, L, M, N)',
        formula: '2n^2 \\text{ max capacity per shell } (n=1,2,3)',
        substitution: `\\text{Shell Distribution} = [${shellsStr}]`,
        answer: `\\text{Config: } ${shellsStr}`
      });
      steps.push({
        label: 'Valence Electrons',
        formula: '\\text{Valence} = \\text{Outermost shell electrons}',
        substitution: `\\text{Outermost shell contains } ${valenceE} \\text{ electron(s)}`,
        answer: `v_e = ${valenceE}`
      });

      summaryText = `${element.name} (Z=${element.z}) has electronic configuration [${shellsStr}] with ${valenceE} valence electron(s).`;
      break;
    }

    case 'periodic_table': {
      const element = ELEMENTS_DB[atomicNumber] || ELEMENTS_DB[6]; // Carbon
      steps.push({
        label: `Element Inspection: ${element.name}`,
        formula: '\\text{Symbol: } ' + element.symbol + ', \\quad Z = ' + element.z,
        substitution: `\\text{Atomic Mass: } ${element.mass} \\text{ u}`,
        answer: `\\text{Group } ${element.group}, \\text{ Period } ${element.period}`
      });
      steps.push({
        label: 'Chemical Family Category',
        formula: '\\text{Classification}',
        substitution: `\\text{Category: } ${element.category.toUpperCase()}`,
        answer: `\\text{Family: } ${element.category}`
      });

      summaryText = `${element.name} (${element.symbol}) belongs to Group ${element.group}, Period ${element.period} with atomic mass ${element.mass} u.`;
      break;
    }

    case 'balancing': {
      // Equation: a H2 + b O2 -> c H2O
      const hReactants = coefA * 2;
      const oReactants = coefB * 2;
      const hProducts = coefC * 2;
      const oProducts = coefC * 1;

      const isBalanced = hReactants === hProducts && oReactants === oProducts;

      steps.push({
        label: 'Hydrogen Atom Tally (H)',
        formula: '\\sum \\text{H}_{\\text{reactants}} = \\sum \\text{H}_{\\text{products}}',
        substitution: `${coefA} \\times 2 = ${hReactants} \\quad \\text{vs} \\quad ${coefC} \\times 2 = ${hProducts}`,
        answer: hReactants === hProducts ? `\\text{H: } ${hReactants} = ${hProducts} \\quad \\checkmark` : `\\text{H: } ${hReactants} \\neq ${hProducts} \\quad \\mathbf{X}`
      });
      steps.push({
        label: 'Oxygen Atom Tally (O)',
        formula: '\\sum \\text{O}_{\\text{reactants}} = \\sum \\text{O}_{\\text{products}}',
        substitution: `${coefB} \\times 2 = ${oReactants} \\quad \\text{vs} \\quad ${coefC} \\times 1 = ${oProducts}`,
        answer: oReactants === oProducts ? `\\text{O: } ${oReactants} = ${oProducts} \\quad \\checkmark` : `\\text{O: } ${oReactants} \\neq ${oProducts} \\quad \\mathbf{X}`
      });
      steps.push({
        label: 'Chemical Equation Status',
        formula: `${coefA}\\text{H}_2 + ${coefB}\\text{O}_2 \\longrightarrow ${coefC}\\text{H}_2\\text{O}`,
        substitution: isBalanced ? '\\text{Law of Conservation of Mass Satisfied}' : '\\text{Unbalanced Equation}',
        answer: isBalanced ? '\\mathbf{BALANCED \\quad \\checkmark}' : '\\mathbf{UNBALANCED \\quad X}'
      });

      summaryText = isBalanced
        ? `Equation ${coefA}H₂ + ${coefB}O₂ → ${coefC}H₂O is BALANCED!`
        : `Equation is UNBALANCED. H: ${hReactants} vs ${hProducts}, O: ${oReactants} vs ${oProducts}.`;
      break;
    }

    case 'reactions': {
      if (reactionType === 'synthesis') {
        steps.push({
          label: 'Combination Reaction',
          formula: 'A + B \\longrightarrow AB',
          substitution: '2\\text{H}_2 + \\text{O}_2 \\longrightarrow 2\\text{H}_2\\text{O}',
          answer: '\\text{Water Formation}'
        });
        summaryText = 'Combination Reaction: Two hydrogen molecules combine with one oxygen molecule to form water.';
      } else if (reactionType === 'neutralisation') {
        steps.push({
          label: 'Acid-Base Neutralisation',
          formula: '\\text{Acid} + \\text{Base} \\longrightarrow \\text{Salt} + \\text{Water}',
          substitution: '\\text{HCl} + \\text{NaOH} \\longrightarrow \\text{NaCl} + \\text{H}_2\\text{O}',
          answer: '\\text{Neutral Salt Solution}'
        });
        summaryText = 'Neutralisation Reaction: Hydrochloric acid reacts with Sodium hydroxide to form Sodium chloride and water.';
      } else {
        steps.push({
          label: 'Displacement Reaction',
          formula: 'A + BC \\longrightarrow AC + B',
          substitution: '\\text{Fe} + \\text{CuSO}_4 \\longrightarrow \\text{FeSO}_4 + \\text{Cu}',
          answer: '\\text{Iron Displaces Copper}'
        });
        summaryText = 'Displacement Reaction: Iron displaces Copper from Copper Sulfate solution due to higher reactivity.';
      }
      break;
    }

    case 'acids_bases': {
      const hConc = Math.pow(10, -phValue);
      let classification = 'Neutral';
      if (phValue < 6.5) classification = 'Acidic (High [H⁺])';
      else if (phValue > 7.5) classification = 'Basic / Alkaline (Low [H⁺])';

      steps.push({
        label: 'pH Scale & Hydrogen Ion Concentration',
        formula: '\\text{pH} = -\\log_{10}[H^+]',
        substitution: `[H^+] = 10^{-\\text{pH}} = 10^{-${phValue.toFixed(1)}}`,
        answer: `[H^+] = ${hConc.toExponential(2)} \\text{ M}`
      });
      steps.push({
        label: 'Solution Acidity Classification',
        formula: '\\text{pH } < 7 \\implies \\text{Acid}, \\quad \\text{pH } = 7 \\implies \\text{Neutral}, \\quad \\text{pH } > 7 \\implies \\text{Base}',
        substitution: `\\text{Current pH } = ${phValue.toFixed(1)}`,
        answer: `\\mathbf{${classification}}`
      });

      summaryText = `At pH ${phValue.toFixed(1)}, the solution is ${classification} with [H⁺] = ${hConc.toExponential(1)} M.`;
      break;
    }
  }

  return { steps, summaryText };
}
