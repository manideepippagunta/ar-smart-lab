import type { BiologyTopic, BiologyParams, KaTeXStep } from './biologyTypes';

export function calculateBiology(
  topic: BiologyTopic,
  params: BiologyParams
): { steps: KaTeXStep[]; summaryText: string } {
  const {
    cellType = 'plant',
    systemType = 'circulatory',
    sunlightIntensity = 80,
    co2Level = 60,
    producerEnergy = 10000
  } = params;

  const steps: KaTeXStep[] = [];
  let summaryText = '';

  switch (topic) {
    case 'cell_structure': {
      steps.push({
        label: `Cell Biology: ${cellType === 'plant' ? 'Plant Cell' : 'Animal Cell'}`,
        formula: '\\text{Organelles} = \\text{Nucleus, Mitochondria, ER, Ribosomes}',
        substitution: cellType === 'plant' 
          ? '\\text{Includes Cell Wall, Chloroplasts, Large Central Vacuole}' 
          : '\\text{Includes Centrioles, Small Vacuoles, No Cell Wall}',
        answer: cellType === 'plant' ? '\\text{Autotrophic Plant Cell}' : '\\text{Heterotrophic Animal Cell}'
      });
      steps.push({
        label: 'Mitochondrial Cellular Respiration (ATP Yield)',
        formula: '\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\longrightarrow 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + 38\\text{ ATP}',
        substitution: '1 \\text{ Molecule Glucose} \\longrightarrow 38 \\text{ ATP Energy}',
        answer: '38 \\text{ ATP}'
      });

      summaryText = `${cellType === 'plant' ? 'Plant' : 'Animal'} cell structure contains active mitochondria generating 38 ATP per glucose molecule.`;
      break;
    }

    case 'anatomy': {
      if (systemType === 'circulatory') {
        const heartRate = 72; // bpm
        const strokeVolume = 70; // mL
        const cardiacOutput = (heartRate * strokeVolume) / 1000; // L/min

        steps.push({
          label: 'Cardiac Output (Circulatory System)',
          formula: 'CO = \\text{Heart Rate (HR)} \\times \\text{Stroke Volume (SV)}',
          substitution: `CO = ${heartRate} \\text{ bpm} \\times ${strokeVolume} \\text{ mL/beat}`,
          answer: `CO = ${cardiacOutput.toFixed(2)} \\text{ Litres/min}`
        });
        summaryText = `Circulatory System: 4-chamber heart pumps oxygenated and deoxygenated blood with a Cardiac Output of ${cardiacOutput.toFixed(1)} L/min.`;
      } else if (systemType === 'respiratory') {
        const respiratoryRate = 16; // breaths/min
        const tidalVolume = 500; // mL
        const minuteVentilation = (respiratoryRate * tidalVolume) / 1000; // L/min

        steps.push({
          label: 'Minute Ventilation (Respiratory System)',
          formula: 'V_E = \\text{Respiratory Rate (RR)} \\times \\text{Tidal Volume (TV)}',
          substitution: `V_E = ${respiratoryRate} \\text{ breaths/min} \\times ${tidalVolume} \\text{ mL}`,
          answer: `V_E = ${minuteVentilation.toFixed(1)} \\text{ Litres/min}`
        });
        summaryText = `Respiratory System: Alveoli gas exchange delivers oxygen to blood with ventilation rate of ${minuteVentilation.toFixed(1)} L/min.`;
      } else {
        steps.push({
          label: `Human Anatomy: ${systemType.toUpperCase()} SYSTEM`,
          formula: '\\text{Organ System Function}',
          substitution: '\\text{Maintains physiological homeostasis}',
          answer: '\\text{Homeostasis Active}'
        });
        summaryText = `Human ${systemType} system regulates physiological homeostasis.`;
      }
      break;
    }

    case 'photosynthesis': {
      const rate = (sunlightIntensity * co2Level) / 100;
      const glucoseProduced = rate * 0.12;

      steps.push({
        label: 'Balanced Photosynthesis Equation',
        formula: '6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{Light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2',
        substitution: `\\text{Sunlight: } ${sunlightIntensity}\\% \\quad \\text{CO}_2: ${co2Level}\\%`,
        answer: `\\text{Rate} = ${rate.toFixed(1)}\\%`
      });
      steps.push({
        label: 'Glucose Synthesis Rate',
        formula: '\\text{Glucose Rate} = f(\\text{Light}, \\text{CO}_2)',
        substitution: `\\text{Glucose} = ${rate.toFixed(1)} \\times 0.12`,
        answer: `\\text{Yield} = ${glucoseProduced.toFixed(2)} \\text{ g/hr}`
      });

      summaryText = `At ${sunlightIntensity}% sunlight and ${co2Level}% CO₂, chloroplasts synthesize glucose at ${glucoseProduced.toFixed(2)} g/hr with active O₂ gas release.`;
      break;
    }

    case 'ecosystem': {
      const primaryConsumer = producerEnergy * 0.10;
      const secondaryConsumer = primaryConsumer * 0.10;
      const tertiaryConsumer = secondaryConsumer * 0.10;

      steps.push({
        label: "Lindeman's 10% Ecological Energy Rule",
        formula: 'E_{n+1} = E_n \\times 0.10',
        substitution: `\\text{Producers (Plants)} = ${producerEnergy} \\text{ Joules (J)}`,
        answer: `E_1 = ${producerEnergy} \\text{ J}`
      });
      steps.push({
        label: 'Primary Consumers (Herbivores)',
        formula: 'E_2 = E_1 \\times 0.10',
        substitution: `E_2 = ${producerEnergy} \\times 0.10`,
        answer: `E_2 = ${primaryConsumer.toFixed(0)} \\text{ J}`
      });
      steps.push({
        label: 'Secondary Consumers (Carnivores)',
        formula: 'E_3 = E_2 \\times 0.10',
        substitution: `E_3 = ${primaryConsumer.toFixed(0)} \\times 0.10`,
        answer: `E_3 = ${secondaryConsumer.toFixed(0)} \\text{ J}`
      });
      steps.push({
        label: 'Apex Predators (Tertiary Consumers)',
        formula: 'E_4 = E_3 \\times 0.10',
        substitution: `E_4 = ${secondaryConsumer.toFixed(0)} \\times 0.10`,
        answer: `E_4 = ${tertiaryConsumer.toFixed(1)} \\text{ J}`
      });

      summaryText = `From ${producerEnergy} J solar energy captured by plants, 10% transfers to Herbivores (${primaryConsumer} J), Carnivores (${secondaryConsumer} J), and Apex Predators (${tertiaryConsumer} J).`;
      break;
    }

    case 'labeling': {
      steps.push({
        label: 'Interactive Organ & Organelle Labeling',
        formula: '\\text{Drag Labels to Target Drop Zones}',
        substitution: '\\text{Real-time accuracy validation}',
        answer: '\\text{Complete Labeling}'
      });
      summaryText = 'Drag organ labels to the correct anatomical target zones.';
      break;
    }
  }

  return { steps, summaryText };
}
