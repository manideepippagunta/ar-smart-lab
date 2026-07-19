import type { ShapeType, MensurationParams, KaTeXStep } from './mensurationTypes';

export function calculateMensuration(
  shape: ShapeType,
  params: MensurationParams
): { steps: KaTeXStep[]; summaryText: string } {
  const {
    length: l = 5,
    width: w = 4,
    height: h = 6,
    radius: r = 3,
    side: a = 4,
    base: b = 6,
    slantHeight: slant = 5,
    d1 = 6,
    d2 = 8,
    baseA = 8,
    baseB = 5
  } = params;

  const steps: KaTeXStep[] = [];
  let summaryText = '';

  switch (shape) {
    case 'rectangle': {
      const area = l * w;
      const peri = 2 * (l + w);
      steps.push({
        label: 'Area of Rectangle',
        formula: 'A = l \\times b',
        substitution: `A = ${l} \\times ${w}`,
        answer: `A = ${area} \\text{ units}^2`
      });
      steps.push({
        label: 'Perimeter of Rectangle',
        formula: 'P = 2(l + b)',
        substitution: `P = 2(${l} + ${w}) = 2(${l + w})`,
        answer: `P = ${peri} \\text{ units}`
      });
      summaryText = `For rectangle with length ${l} and breadth ${w}, Area is ${area} and Perimeter is ${peri}.`;
      break;
    }

    case 'square': {
      const area = a * a;
      const peri = 4 * a;
      steps.push({
        label: 'Area of Square',
        formula: 'A = a^2',
        substitution: `A = ${a}^2`,
        answer: `A = ${area} \\text{ units}^2`
      });
      steps.push({
        label: 'Perimeter of Square',
        formula: 'P = 4a',
        substitution: `P = 4 \\times ${a}`,
        answer: `P = ${peri} \\text{ units}`
      });
      summaryText = `For square with side ${a}, Area is ${area} and Perimeter is ${peri}.`;
      break;
    }

    case 'triangle': {
      const area = 0.5 * b * h;
      const hypotenuse = Math.sqrt(b * b + h * h);
      const peri = Number((b + h + hypotenuse).toFixed(2));
      steps.push({
        label: 'Area of Triangle',
        formula: 'A = \\frac{1}{2} b h',
        substitution: `A = \\frac{1}{2} \\times ${b} \\times ${h}`,
        answer: `A = ${area.toFixed(2)} \\text{ units}^2`
      });
      steps.push({
        label: 'Perimeter of Right Triangle',
        formula: 'P = a + b + c',
        substitution: `P = ${b} + ${h} + \\sqrt{${b}^2 + ${h}^2}`,
        answer: `P = ${peri} \\text{ units}`
      });
      summaryText = `For triangle with base ${b} and height ${h}, Area is ${area.toFixed(1)}.`;
      break;
    }

    case 'circle': {
      const area = Math.PI * r * r;
      const circ = 2 * Math.PI * r;
      steps.push({
        label: 'Area of Circle',
        formula: 'A = \\pi r^2',
        substitution: `A = \\pi \\times ${r}^2 = 3.1416 \\times ${r * r}`,
        answer: `A = ${area.toFixed(2)} \\text{ units}^2`
      });
      steps.push({
        label: 'Circumference of Circle',
        formula: 'C = 2 \\pi r',
        substitution: `C = 2 \\times \\pi \\times ${r}`,
        answer: `C = ${circ.toFixed(2)} \\text{ units}`
      });
      summaryText = `For circle with radius ${r}, Area is ${area.toFixed(1)} and Circumference is ${circ.toFixed(1)}.`;
      break;
    }

    case 'parallelogram': {
      const area = b * h;
      const peri = 2 * (b + a);
      steps.push({
        label: 'Area of Parallelogram',
        formula: 'A = b \\times h',
        substitution: `A = ${b} \\times ${h}`,
        answer: `A = ${area} \\text{ units}^2`
      });
      steps.push({
        label: 'Perimeter of Parallelogram',
        formula: 'P = 2(a + b)',
        substitution: `P = 2(${a} + ${b})`,
        answer: `P = ${peri} \\text{ units}`
      });
      summaryText = `For parallelogram with base ${b} and height ${h}, Area is ${area}.`;
      break;
    }

    case 'rhombus': {
      const area = 0.5 * d1 * d2;
      const sideLength = Math.sqrt((d1 / 2) ** 2 + (d2 / 2) ** 2);
      const peri = 4 * sideLength;
      steps.push({
        label: 'Area of Rhombus',
        formula: 'A = \\frac{1}{2} d_1 d_2',
        substitution: `A = \\frac{1}{2} \\times ${d1} \\times ${d2}`,
        answer: `A = ${area} \\text{ units}^2`
      });
      steps.push({
        label: 'Perimeter of Rhombus',
        formula: 'P = 4a',
        substitution: `P = 4 \\times \\sqrt{(${d1}/2)^2 + (${d2}/2)^2}`,
        answer: `P = ${peri.toFixed(2)} \\text{ units}`
      });
      summaryText = `For rhombus with diagonals ${d1} and ${d2}, Area is ${area}.`;
      break;
    }

    case 'trapezium': {
      const area = 0.5 * (baseA + baseB) * h;
      steps.push({
        label: 'Area of Trapezium',
        formula: 'A = \\frac{1}{2} (a + b) h',
        substitution: `A = \\frac{1}{2} (${baseA} + ${baseB}) \\times ${h}`,
        answer: `A = ${area} \\text{ units}^2`
      });
      summaryText = `For trapezium with parallel sides ${baseA} and ${baseB} and height ${h}, Area is ${area}.`;
      break;
    }

    case 'cube': {
      const vol = a * a * a;
      const tsa = 6 * a * a;
      const lsa = 4 * a * a;
      steps.push({
        label: 'Volume of Cube',
        formula: 'V = a^3',
        substitution: `V = ${a}^3`,
        answer: `V = ${vol} \\text{ units}^3`
      });
      steps.push({
        label: 'Total Surface Area (TSA)',
        formula: 'TSA = 6a^2',
        substitution: `TSA = 6 \\times ${a}^2`,
        answer: `TSA = ${tsa} \\text{ units}^2`
      });
      steps.push({
        label: 'Lateral Surface Area (LSA)',
        formula: 'LSA = 4a^2',
        substitution: `LSA = 4 \\times ${a}^2`,
        answer: `LSA = ${lsa} \\text{ units}^2`
      });
      summaryText = `For cube with edge ${a}, Volume is ${vol} and Total Surface Area is ${tsa}.`;
      break;
    }

    case 'cuboid': {
      const vol = l * w * h;
      const tsa = 2 * (l * w + w * h + h * l);
      const lsa = 2 * h * (l + w);
      steps.push({
        label: 'Volume of Cuboid',
        formula: 'V = l \\times b \\times h',
        substitution: `V = ${l} \\times ${w} \\times ${h}`,
        answer: `V = ${vol} \\text{ units}^3`
      });
      steps.push({
        label: 'Total Surface Area (TSA)',
        formula: 'TSA = 2(lb + bh + hl)',
        substitution: `TSA = 2(${l}\\cdot${w} + ${w}\\cdot${h} + ${h}\\cdot${l})`,
        answer: `TSA = ${tsa} \\text{ units}^2`
      });
      steps.push({
        label: 'Lateral Surface Area (LSA)',
        formula: 'LSA = 2h(l + b)',
        substitution: `LSA = 2(${h})(${l} + ${w})`,
        answer: `LSA = ${lsa} \\text{ units}^2`
      });
      summaryText = `For cuboid of dimensions ${l} by ${w} by ${h}, Volume is ${vol} and TSA is ${tsa}.`;
      break;
    }

    case 'cylinder': {
      const vol = Math.PI * r * r * h;
      const csa = 2 * Math.PI * r * h;
      const tsa = 2 * Math.PI * r * (r + h);
      steps.push({
        label: 'Volume of Cylinder',
        formula: 'V = \\pi r^2 h',
        substitution: `V = \\pi \\times ${r}^2 \\times ${h}`,
        answer: `V = ${vol.toFixed(2)} \\text{ units}^3`
      });
      steps.push({
        label: 'Curved Surface Area (CSA)',
        formula: 'CSA = 2 \\pi r h',
        substitution: `CSA = 2 \\times \\pi \\times ${r} \\times ${h}`,
        answer: `CSA = ${csa.toFixed(2)} \\text{ units}^2`
      });
      steps.push({
        label: 'Total Surface Area (TSA)',
        formula: 'TSA = 2 \\pi r(r + h)',
        substitution: `TSA = 2 \\times \\pi \\times ${r}(${r} + ${h})`,
        answer: `TSA = ${tsa.toFixed(2)} \\text{ units}^2`
      });
      summaryText = `For cylinder with radius ${r} and height ${h}, Volume is ${vol.toFixed(1)} and TSA is ${tsa.toFixed(1)}.`;
      break;
    }

    case 'cone': {
      const calcSlant = Math.sqrt(r * r + h * h);
      const actualSlant = slant > 0 ? slant : calcSlant;
      const vol = (1 / 3) * Math.PI * r * r * h;
      const csa = Math.PI * r * actualSlant;
      const tsa = Math.PI * r * (r + actualSlant);
      steps.push({
        label: 'Slant Height (l)',
        formula: 'l = \\sqrt{r^2 + h^2}',
        substitution: `l = \\sqrt{${r}^2 + ${h}^2}`,
        answer: `l = ${actualSlant.toFixed(2)} \\text{ units}`
      });
      steps.push({
        label: 'Volume of Cone',
        formula: 'V = \\frac{1}{3} \\pi r^2 h',
        substitution: `V = \\frac{1}{3} \\times \\pi \\times ${r}^2 \\times ${h}`,
        answer: `V = ${vol.toFixed(2)} \\text{ units}^3`
      });
      steps.push({
        label: 'Curved Surface Area (CSA)',
        formula: 'CSA = \\pi r l',
        substitution: `CSA = \\pi \\times ${r} \\times ${actualSlant.toFixed(2)}`,
        answer: `CSA = ${csa.toFixed(2)} \\text{ units}^2`
      });
      steps.push({
        label: 'Total Surface Area (TSA)',
        formula: 'TSA = \\pi r(r + l)',
        substitution: `TSA = \\pi \\times ${r}(${r} + ${actualSlant.toFixed(2)})`,
        answer: `TSA = ${tsa.toFixed(2)} \\text{ units}^2`
      });
      summaryText = `For cone with radius ${r} and height ${h}, Volume is ${vol.toFixed(1)}.`;
      break;
    }

    case 'sphere': {
      const vol = (4 / 3) * Math.PI * r * r * r;
      const sa = 4 * Math.PI * r * r;
      steps.push({
        label: 'Volume of Sphere',
        formula: 'V = \\frac{4}{3} \\pi r^3',
        substitution: `V = \\frac{4}{3} \\times \\pi \\times ${r}^3`,
        answer: `V = ${vol.toFixed(2)} \\text{ units}^3`
      });
      steps.push({
        label: 'Surface Area of Sphere',
        formula: 'SA = 4 \\pi r^2',
        substitution: `SA = 4 \\times \\pi \\times ${r}^2`,
        answer: `SA = ${sa.toFixed(2)} \\text{ units}^2`
      });
      summaryText = `For sphere with radius ${r}, Volume is ${vol.toFixed(1)} and Surface Area is ${sa.toFixed(1)}.`;
      break;
    }

    case 'prism': {
      const baseArea = 0.5 * b * w; // Triangular base
      const vol = baseArea * h;
      const sa = 2 * baseArea + (3 * b * h);
      steps.push({
        label: 'Volume of Prism',
        formula: 'V = A_{base} \\times h',
        substitution: `V = (${baseArea.toFixed(1)}) \\times ${h}`,
        answer: `V = ${vol.toFixed(2)} \\text{ units}^3`
      });
      steps.push({
        label: 'Surface Area of Prism',
        formula: 'SA = 2 A_{base} + P_{base} h',
        substitution: `SA = 2(${baseArea.toFixed(1)}) + (${3 * b}) \\times ${h}`,
        answer: `SA = ${sa.toFixed(2)} \\text{ units}^2`
      });
      summaryText = `For prism with base area ${baseArea.toFixed(1)} and height ${h}, Volume is ${vol.toFixed(1)}.`;
      break;
    }

    case 'pyramid': {
      const baseArea = a * a; // Square base
      const vol = (1 / 3) * baseArea * h;
      const calcSlant = Math.sqrt((a / 2) ** 2 + h ** 2);
      const sa = baseArea + 2 * a * calcSlant;
      steps.push({
        label: 'Volume of Pyramid',
        formula: 'V = \\frac{1}{3} A_{base} \\times h',
        substitution: `V = \\frac{1}{3} \\times ${baseArea} \\times ${h}`,
        answer: `V = ${vol.toFixed(2)} \\text{ units}^3`
      });
      steps.push({
        label: 'Surface Area of Pyramid',
        formula: 'SA = A_{base} + \\frac{1}{2} P_{base} l',
        substitution: `SA = ${baseArea} + 2 \\times ${a} \\times ${calcSlant.toFixed(2)}`,
        answer: `SA = ${sa.toFixed(2)} \\text{ units}^2`
      });
      summaryText = `For pyramid with base side ${a} and height ${h}, Volume is ${vol.toFixed(1)}.`;
      break;
    }
  }

  return { steps, summaryText };
}
