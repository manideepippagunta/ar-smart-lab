import type { SolverStep } from './useAlgebraStore';

export interface Term {
  coefficient: number;
  variable: string | null; // null = constant
  power: number;           // 0 = constant, 1 = linear, 2 = quadratic
}

/**
 * Parse a simple linear expression like "2x + 5" or "3x - 4 = 10"
 * Returns { left: Term[], right: Term[] }
 */
export function parseEquation(input: string): { left: Term[]; right: Term[] } {
  const [leftStr, rightStr = '0'] = input.split('=').map(s => s.trim());
  return {
    left: parseExpression(leftStr),
    right: parseExpression(rightStr),
  };
}

export function parseExpression(input: string): Term[] {
  // Normalize: convert "3x - 4" → "3x + -4"
  const normalized = input
    .replace(/\s+/g, '')
    .replace(/-/g, '+-');
  
  const parts = normalized.split('+').filter(p => p !== '');
  const terms: Term[] = [];

  for (const part of parts) {
    if (part === '') continue;

    // Match: coefficient, variable, power (e.g., 2x^2, -3x, 5)
    const match = part.match(/^(-?\d*\.?\d*)\s*([a-zA-Z]?)(?:\^(\d+))?$/);
    if (!match) continue;

    let coefStr = match[1];
    const varName = match[2] || null;
    const power = varName ? parseInt(match[3] || '1', 10) : 0;

    // Handle cases like "x" (coefficient = 1) or "-x" (coefficient = -1)
    let coefficient: number;
    if (coefStr === '' || coefStr === '+') coefficient = 1;
    else if (coefStr === '-') coefficient = -1;
    else coefficient = parseFloat(coefStr);

    if (!isNaN(coefficient)) {
      terms.push({ coefficient, variable: varName, power });
    }
  }

  return terms;
}

/**
 * Collect like terms and produce LaTeX steps
 */
export function simplifyExpression(terms: Term[]): { simplified: Term[]; latexSteps: string[] } {
  const steps: string[] = [];
  
  // Group by (variable + power)
  const groups: Record<string, Term[]> = {};
  for (const t of terms) {
    const key = t.variable ? `${t.variable}^${t.power}` : '__const';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
  }

  const simplified: Term[] = [];

  for (const [_, group] of Object.entries(groups)) {
    if (group.length > 1) {
      const total = group.reduce((sum, t) => sum + t.coefficient, 0);
      const latexTerms = group.map(t => termToLatex(t)).join(' + ');
      const t0 = group[0];
      const result: Term = { coefficient: total, variable: t0.variable, power: t0.power };
      steps.push(`${latexTerms} = ${termToLatex(result)}`);
      if (result.coefficient !== 0) simplified.push(result);
    } else if (group[0].coefficient !== 0) {
      simplified.push(group[0]);
    }
  }

  return { simplified, latexSteps: steps };
}

/**
 * Solve a linear equation ax + b = c, producing KaTeX step strings.
 */
export function solveLinear(equationStr: string): SolverStep[] {
  const { left, right } = parseEquation(equationStr);

  // Move all terms: left - right = 0
  // Collect x-terms and constants from left, subtract from right
  let xCoef = 0;
  let constant = 0;

  for (const t of left) {
    if (t.variable) xCoef += t.coefficient;
    else constant += t.coefficient;
  }

  for (const t of right) {
    if (t.variable) xCoef -= t.coefficient;
    else constant -= t.coefficient;
  }

  const rhs = -constant; // ax = rhs → x = rhs / a

  const steps: SolverStep[] = [];

  // Step 0: original
  steps.push({
    equation: equationStr,
    explanation: 'We start with the original equation.',
    operation: '',
    result: equationStr,
  });

  // Step 1: move constant to right
  if (constant !== 0) {
    const opLatex = constant > 0 ? `-${constant}` : `+${Math.abs(constant)}`;
    const newLeft = `${xCoef}x`;
    const newRight = rhs;
    steps.push({
      equation: `${termsToLatex(left)} = ${termsToLatex(right)}`,
      explanation: constant > 0
        ? `Subtract ${constant} from both sides to isolate the variable term.`
        : `Add ${Math.abs(constant)} to both sides to isolate the variable term.`,
      operation: `${opLatex} \\text{ to both sides}`,
      result: `${newLeft} = ${newRight}`,
    });
  }

  // Step 2: divide both sides
  if (xCoef !== 0 && xCoef !== 1) {
    const x = rhs / xCoef;
    steps.push({
      equation: `${xCoef}x = ${rhs}`,
      explanation: `Divide both sides by ${xCoef} to find the value of x.`,
      operation: `\\div ${xCoef}`,
      result: `x = ${x % 1 === 0 ? x : x.toFixed(2)}`,
    });
  }

  // Final step
  const x = xCoef !== 0 ? rhs / xCoef : NaN;
  steps.push({
    equation: `${xCoef}x = ${rhs}`,
    explanation: `The solution is x = ${isNaN(x) ? '?' : x}.`,
    operation: '',
    result: `x = ${isNaN(x) ? '\\text{No solution}' : (x % 1 === 0 ? x : x.toFixed(2))}`,
  });

  return steps;
}

export function termToLatex(t: Term): string {
  if (!t.variable) return t.coefficient.toString();
  const coef = t.coefficient === 1 ? '' : t.coefficient === -1 ? '-' : t.coefficient.toString();
  const power = t.power > 1 ? `^{${t.power}}` : '';
  return `${coef}${t.variable}${power}`;
}

export function termsToLatex(terms: Term[]): string {
  if (terms.length === 0) return '0';
  return terms.map((t, i) => {
    const latex = termToLatex(t);
    if (i === 0) return latex;
    return t.coefficient < 0 ? latex : `+ ${latex}`;
  }).join(' ');
}

/**
 * Mistake Engine: Generate an educational explanation for common mistakes.
 */
export function explainMistake(attempted: string, context: string): string {
  const lower = attempted.toLowerCase();

  if (lower.includes('wrong side')) {
    return 'Remember: whatever you do to one side of the equation, you must do the same to the other side. This is the Balance Principle.';
  }
  if (lower.includes('divide') && context.includes('multiply')) {
    return 'Be careful! The inverse operation of multiplication is division, not subtraction. If the equation has 2x, divide both sides by 2.';
  }
  if (lower.includes('subtract') && context.includes('add')) {
    return 'The inverse of addition is subtraction. If the equation adds a constant, subtract it from both sides to eliminate it.';
  }
  if (lower.includes('sign')) {
    return 'Watch the signs! A negative number moved to the other side of an equation becomes positive (and vice versa).';
  }

  // Default educational response
  return `That step is not quite right. When solving equations, always apply the same operation to BOTH sides. Try thinking: "What is the opposite of the operation applied to x?"`;
}
