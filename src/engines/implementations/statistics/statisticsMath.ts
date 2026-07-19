export interface DataItem {
  id: string;
  label: string;
  value: number;
  color?: string;
  x?: number;
  y?: number;
}

export interface KaTeXStep {
  label: string;
  formula: string;
  substitution: string;
  answer: string;
}

/**
 * Compute Mean with KaTeX formula breakdown
 */
export function calculateMean(data: DataItem[]): { mean: number; step: KaTeXStep } {
  if (!data || data.length === 0) {
    return {
      mean: 0,
      step: {
        label: 'Mean (Average)',
        formula: '\\bar{x} = \\frac{\\sum x_i}{n}',
        substitution: '\\bar{x} = \\frac{0}{0}',
        answer: '\\bar{x} = 0'
      }
    };
  }

  const values = data.map(d => d.value);
  const sum = values.reduce((acc, v) => acc + v, 0);
  const n = values.length;
  const mean = sum / n;

  const sumString = values.length > 5 
    ? `${values.slice(0, 4).join(' + ')} + \\dots + ${values[values.length - 1]}`
    : values.join(' + ');

  return {
    mean,
    step: {
      label: 'Mean (Average)',
      formula: '\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}',
      substitution: `\\bar{x} = \\frac{${sumString}}{${n}} = \\frac{${sum}}{${n}}`,
      answer: `\\bar{x} = ${Number.isInteger(mean) ? mean : mean.toFixed(2)}`
    }
  };
}

/**
 * Compute Median with KaTeX formula breakdown
 */
export function calculateMedian(data: DataItem[]): { median: number; sorted: number[]; step: KaTeXStep } {
  if (!data || data.length === 0) {
    return {
      median: 0,
      sorted: [],
      step: {
        label: 'Median (Middle Value)',
        formula: 'M = \\text{Middle position}',
        substitution: 'M = \\text{N/A}',
        answer: 'M = 0'
      }
    };
  }

  const sorted = data.map(d => d.value).sort((a, b) => a - b);
  const n = sorted.length;
  let median = 0;
  let subText = '';

  if (n % 2 === 1) {
    const midIdx = Math.floor(n / 2);
    median = sorted[midIdx];
    subText = `M = x_{\\frac{${n}+1}{2}} = x_{${midIdx + 1}} = ${median}`;
  } else {
    const mid1 = sorted[n / 2 - 1];
    const mid2 = sorted[n / 2];
    median = (mid1 + mid2) / 2;
    subText = `M = \\frac{x_{${n / 2}} + x_{${n / 2 + 1}}}{2} = \\frac{${mid1} + ${mid2}}{2}`;
  }

  return {
    median,
    sorted,
    step: {
      label: 'Median (Middle Value)',
      formula: n % 2 === 1 ? 'M = x_{\\frac{n+1}{2}}' : 'M = \\frac{x_{n/2} + x_{n/2+1}}{2}',
      substitution: subText,
      answer: `M = ${Number.isInteger(median) ? median : median.toFixed(2)}`
    }
  };
}

/**
 * Compute Mode with KaTeX formula breakdown
 */
export function calculateMode(data: DataItem[]): { mode: number[]; step: KaTeXStep } {
  if (!data || data.length === 0) {
    return {
      mode: [],
      step: {
        label: 'Mode (Most Frequent)',
        formula: '\\text{Mode} = \\operatorname*{arg\\,max}_x f(x)',
        substitution: '\\text{No data points}',
        answer: '\\text{Mode} = \\emptyset'
      }
    };
  }

  const freqMap: Record<number, number> = {};
  let maxFreq = 0;

  data.forEach(d => {
    const v = d.value;
    freqMap[v] = (freqMap[v] || 0) + 1;
    if (freqMap[v] > maxFreq) maxFreq = freqMap[v];
  });

  const modes = Object.keys(freqMap)
    .map(Number)
    .filter(val => freqMap[val] === maxFreq);

  const isAllSame = modes.length === Object.keys(freqMap).length && data.length > 1;
  const finalModes = isAllSame || maxFreq === 1 ? [] : modes;

  const modeString = finalModes.length === 0 
    ? '\\text{No unique mode}' 
    : finalModes.join(', ');

  return {
    mode: finalModes,
    step: {
      label: 'Mode (Most Frequent Value)',
      formula: '\\text{Mode} = \\text{Value with maximum frequency } f_{\\max}',
      substitution: `f_{\\max} = ${maxFreq} \\text{ occurrence(s)}`,
      answer: `\\text{Mode} = ${modeString}`
    }
  };
}

/**
 * Compute Range with KaTeX formula breakdown
 */
export function calculateRange(data: DataItem[]): { range: number; min: number; max: number; step: KaTeXStep } {
  if (!data || data.length === 0) {
    return {
      range: 0,
      min: 0,
      max: 0,
      step: {
        label: 'Range (Max - Min)',
        formula: 'R = x_{\\max} - x_{\\min}',
        substitution: 'R = 0 - 0',
        answer: 'R = 0'
      }
    };
  }

  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  return {
    range,
    min,
    max,
    step: {
      label: 'Range (Spread of Data)',
      formula: 'R = x_{\\max} - x_{\\min}',
      substitution: `R = ${max} - ${min}`,
      answer: `R = ${range}`
    }
  };
}

/**
 * Calculate Theoretical vs Experimental Probability
 */
export function calculateProbabilityStats(
  eventLabel: string,
  observedCount: number,
  totalTrials: number,
  theoreticalProb: number
): { expProb: number; steps: KaTeXStep[] } {
  const expProb = totalTrials > 0 ? observedCount / totalTrials : 0;

  const theoStep: KaTeXStep = {
    label: `Theoretical P(${eventLabel})`,
    formula: `P(E) = \\frac{\\text{Number of Favorable Outcomes}}{\\text{Total Possible Outcomes}}`,
    substitution: `P(${eventLabel}) = ${theoreticalProb.toFixed(3)}`,
    answer: `P(${eventLabel}) = ${(theoreticalProb * 100).toFixed(1)}\\%`
  };

  const expStep: KaTeXStep = {
    label: `Experimental P_{exp}(${eventLabel})`,
    formula: `P_{exp}(E) = \\frac{\\text{Observed Favorable Trials}}{\\text{Total Experiments Run}}`,
    substitution: `P_{exp}(${eventLabel}) = \\frac{${observedCount}}{${totalTrials}}`,
    answer: `P_{exp}(${eventLabel}) = ${expProb.toFixed(3)} \\, (${(expProb * 100).toFixed(1)}\\%)`
  };

  return {
    expProb,
    steps: [theoStep, expStep]
  };
}
