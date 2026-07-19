export interface CalculationStep {
  label: string;
  formula: string;
  substitution: string;
  calculation: string;
  answer: string;
}

export function computeDistanceStep(
  name1: string, x1: number, y1: number,
  name2: string, x2: number, y2: number
): CalculationStep {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Format coordinates cleanly
  const x1Str = x1 < 0 ? `(${x1})` : `${x1}`;
  const y1Str = y1 < 0 ? `(${y1})` : `${y1}`;
  const x2Str = x2 < 0 ? `(${x2})` : `${x2}`;
  const y2Str = y2 < 0 ? `(${y2})` : `${y2}`;

  return {
    label: `Distance between ${name1} and ${name2}`,
    formula: `d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}`,
    substitution: `d = \\sqrt{(${x2Str} - ${x1Str})^2 + (${y2Str} - ${y1Str})^2}`,
    calculation: `d = \\sqrt{(${dx.toFixed(1)})^2 + (${dy.toFixed(1)})^2} = \\sqrt{${(dx * dx).toFixed(1)} + ${(dy * dy).toFixed(1)}}`,
    answer: `d \\approx ${dist.toFixed(2)} \\text{ units}`
  };
}

export function computeMidpointStep(
  name1: string, x1: number, y1: number,
  name2: string, x2: number, y2: number
): CalculationStep {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  
  const x1Str = x1 < 0 ? `(${x1})` : `${x1}`;
  const y1Str = y1 < 0 ? `(${y1})` : `${y1}`;
  const x2Str = x2 < 0 ? `(${x2})` : `${x2}`;
  const y2Str = y2 < 0 ? `(${y2})` : `${y2}`;

  return {
    label: `Midpoint of ${name1}${name2}`,
    formula: `M = \\left( \\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2} \\right)`,
    substitution: `M = \\left( \\frac{${x1Str} + ${x2Str}}{2}, \\frac{${y1Str} + ${y2Str}}{2} \\right)`,
    calculation: `M = \\left( \\frac{${(x1 + x2).toFixed(1)}}{2}, \\frac{${(y1 + y2).toFixed(1)}}{2} \\right)`,
    answer: `M = (${mx.toFixed(1)}, ${my.toFixed(1)})`
  };
}

export function computeSlopeStep(
  name1: string, x1: number, y1: number,
  name2: string, x2: number, y2: number
): CalculationStep {
  const dx = x2 - x1;
  const dy = y2 - y1;

  const x1Str = x1 < 0 ? `(${x1})` : `${x1}`;
  const y1Str = y1 < 0 ? `(${y1})` : `${y1}`;
  const x2Str = x2 < 0 ? `(${x2})` : `${x2}`;
  const y2Str = y2 < 0 ? `(${y2})` : `${y2}`;

  if (Math.abs(dx) < 0.0001) {
    return {
      label: `Slope of line ${name1}${name2}`,
      formula: `m = \\frac{y_2 - y_1}{x_2 - x_1}`,
      substitution: `m = \\frac{${y2Str} - ${y1Str}}{${x2Str} - ${x1Str}}`,
      calculation: `m = \\frac{${dy.toFixed(1)}}{0}`,
      answer: `m = \\infty \\text{ (Vertical line)}`
    };
  }

  const slope = dy / dx;

  return {
    label: `Slope of line ${name1}${name2}`,
    formula: `m = \\frac{y_2 - y_1}{x_2 - x_1}`,
    substitution: `m = \\frac{${y2Str} - ${y1Str}}{${x2Str} - ${x1Str}}`,
    calculation: `m = \\frac{${dy.toFixed(1)}}{${dx.toFixed(1)}}`,
    answer: `m = ${slope.toFixed(2)}`
  };
}

export function computeEquationStep(
  name1: string, x1: number, y1: number,
  name2: string, x2: number, y2: number
): CalculationStep {
  const dx = x2 - x1;
  const dy = y2 - y1;

  if (Math.abs(dx) < 0.0001) {
    return {
      label: `Equation of line ${name1}${name2}`,
      formula: `x = c`,
      substitution: `x = x_1`,
      calculation: `x = ${x1.toFixed(1)}`,
      answer: `L: x = ${x1.toFixed(1)}`
    };
  }

  const m = dy / dx;
  const c = y1 - m * x1;
  
  const mStr = m.toFixed(2);
  const cStr = c >= 0 ? `+ ${c.toFixed(2)}` : `- ${Math.abs(c).toFixed(2)}`;
  
  const x1Str = x1 < 0 ? `(${x1})` : `${x1}`;
  const y1Str = y1 < 0 ? `(${y1})` : `${y1}`;

  return {
    label: `Equation of line ${name1}${name2}`,
    formula: `y - y_1 = m(x - x_1)`,
    substitution: `y - ${y1Str} = ${mStr}(x - ${x1Str})`,
    calculation: `y = ${mStr}x - (${mStr} \\cdot ${x1Str}) + ${y1Str}`,
    answer: `L: y = ${mStr}x ${cStr}`
  };
}

export function computeVectorStep(
  name1: string, x1: number, y1: number,
  name2: string, x2: number, y2: number
): CalculationStep {
  const vx = x2 - x1;
  const vy = y2 - y1;
  const mag = Math.sqrt(vx * vx + vy * vy);
  const angleRad = Math.atan2(vy, vx);
  let angleDeg = angleRad * (180 / Math.PI);
  if (angleDeg < 0) angleDeg += 360;

  return {
    label: `Vector \\vec{v} from ${name1} to ${name2}`,
    formula: `\\vec{v} = \\langle v_x, v_y \\rangle, \\quad |\\vec{v}| = \\sqrt{v_x^2 + v_y^2}`,
    substitution: `\\vec{v} = \\langle ${vx.toFixed(1)}, ${vy.toFixed(1)} \\rangle`,
    calculation: `|\\vec{v}| = \\sqrt{(${(vx).toFixed(1)})^2 + (${(vy).toFixed(1)})^2}`,
    answer: `|\\vec{v}| \\approx ${mag.toFixed(2)}, \\quad \\theta \\approx ${angleDeg.toFixed(1)}^\\circ`
  };
}
