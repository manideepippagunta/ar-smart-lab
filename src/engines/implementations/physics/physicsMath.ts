import type { PhysicsTopic, PhysicsParams, KaTeXStep } from './physicsTypes';

export function calculatePhysics(
  topic: PhysicsTopic,
  params: PhysicsParams,
  simTime: number = 2
): { steps: KaTeXStep[]; summaryText: string } {
  const {
    mass: m = 5,
    force: F = 20,
    initialVelocity: u = 0,
    gravity: g = 9.8,
    friction: mu = 0.1,
    voltage: V = 12,
    resistance: R = 4,
    switchClosed = true,
    incidentAngle: iDeg = 30,
    refractiveIndex: n2 = 1.5,
    focalLength: f = 10
  } = params;

  const steps: KaTeXStep[] = [];
  let summaryText = '';

  switch (topic) {
    case 'motion': {
      // Acceleration a = F / m (assuming Net Force = F)
      const a = F / m;
      const v = u + a * simTime;
      const s = u * simTime + 0.5 * a * simTime * simTime;

      steps.push({
        label: 'Acceleration (a)',
        formula: 'a = \\frac{F}{m}',
        substitution: `a = \\frac{${F}}{${m}}`,
        answer: `a = ${a.toFixed(2)} \\text{ m/s}^2`
      });
      steps.push({
        label: 'Final Velocity (v)',
        formula: 'v = u + a t',
        substitution: `v = ${u} + (${a.toFixed(2)}) \\times ${simTime}`,
        answer: `v = ${v.toFixed(2)} \\text{ m/s}`
      });
      steps.push({
        label: 'Displacement (s)',
        formula: 's = u t + \\frac{1}{2} a t^2',
        substitution: `s = ${u}(${simTime}) + \\frac{1}{2}(${a.toFixed(2)})(${simTime})^2`,
        answer: `s = ${s.toFixed(2)} \\text{ m}`
      });

      summaryText = `With mass ${m} kg and applied force ${F} N, acceleration is ${a.toFixed(1)} m/s². At t = ${simTime}s, velocity is ${v.toFixed(1)} m/s.`;
      break;
    }

    case 'force_laws': {
      const Fg = m * g;
      const N = Fg;
      const f_k = mu * N;
      const F_net = Math.max(0, F - f_k);
      const a = F_net / m;

      steps.push({
        label: "Gravity Force (F_g = m g)",
        formula: 'F_g = m g',
        substitution: `F_g = ${m} \\times ${g}`,
        answer: `F_g = ${Fg.toFixed(1)} \\text{ N}`
      });
      steps.push({
        label: 'Friction Force (f_k = \\mu N)',
        formula: 'f_k = \\mu F_g',
        substitution: `f_k = ${mu} \\times ${Fg.toFixed(1)}`,
        answer: `f_k = ${f_k.toFixed(1)} \\text{ N}`
      });
      steps.push({
        label: "Net Acceleration (Newton's 2nd Law)",
        formula: 'a = \\frac{F_{applied} - f_k}{m}',
        substitution: `a = \\frac{${F} - ${f_k.toFixed(1)}}{${m}}`,
        answer: `a = ${a.toFixed(2)} \\text{ m/s}^2`
      });

      summaryText = `Newton's second law gives net acceleration ${a.toFixed(1)} m/s² after opposing friction of ${f_k.toFixed(1)} N.`;
      break;
    }

    case 'work_energy': {
      const d = 10; // 10 meters reference displacement
      const W = F * d;
      const v = Math.sqrt((2 * W) / m);
      const KE = 0.5 * m * v * v;
      const h = 5;
      const PE = m * g * h;

      steps.push({
        label: 'Work Done (W = F d)',
        formula: 'W = F \\cdot d',
        substitution: `W = ${F} \\times ${d}`,
        answer: `W = ${W.toFixed(1)} \\text{ Joules (J)}`
      });
      steps.push({
        label: 'Kinetic Energy (KE)',
        formula: 'KE = \\frac{1}{2} m v^2',
        substitution: `KE = \\frac{1}{2}(${m})(${v.toFixed(1)})^2`,
        answer: `KE = ${KE.toFixed(1)} \\text{ J}`
      });
      steps.push({
        label: 'Potential Energy (PE at height h=5m)',
        formula: 'PE = m g h',
        substitution: `PE = ${m} \\times ${g} \\times ${h}`,
        answer: `PE = ${PE.toFixed(1)} \\text{ J}`
      });

      summaryText = `Work done by force ${F} N over ${d}m is ${W} Joules, converted into kinetic energy.`;
      break;
    }

    case 'optics': {
      const iRad = (iDeg * Math.PI) / 180;
      const sinR = Math.sin(iRad) / n2;
      const rRad = Math.asin(Math.min(1, Math.max(-1, sinR)));
      const rDeg = (rRad * 180) / Math.PI;

      steps.push({
        label: "Snell's Law of Refraction",
        formula: 'n_1 \\sin(i) = n_2 \\sin(r)',
        substitution: `1.0 \\times \\sin(${iDeg}^\\circ) = ${n2} \\times \\sin(r)`,
        answer: `\\sin(r) = ${sinR.toFixed(3)}`
      });
      steps.push({
        label: 'Angle of Refraction (r)',
        formula: 'r = \\arcsin\\left(\\frac{\\sin i}{n_2}\\right)',
        substitution: `r = \\arcsin(${sinR.toFixed(3)})`,
        answer: `r = ${rDeg.toFixed(1)}^\\circ`
      });
      steps.push({
        label: 'Lens Power (P = 1/f in meters)',
        formula: 'P = \\frac{100}{f_{\\text{cm}}}',
        substitution: `P = \\frac{100}{${f}}`,
        answer: `P = ${(100 / f).toFixed(1)} \\text{ Dioptres (D)}`
      });

      summaryText = `Light incident at ${iDeg}° refracts into medium with index ${n2} at an angle of ${rDeg.toFixed(1)}°.`;
      break;
    }

    case 'circuits': {
      const I = switchClosed && R > 0 ? V / R : 0;
      const P = V * I;

      steps.push({
        label: "Ohm's Law (I = V / R)",
        formula: 'I = \\frac{V}{R}',
        substitution: switchClosed ? `I = \\frac{${V}}{${R}}` : 'I = \\frac{V}{\\infty} \\text{ (Open Switch)}',
        answer: `I = ${I.toFixed(2)} \\text{ Amperes (A)}`
      });
      steps.push({
        label: 'Electrical Power (P = V I)',
        formula: 'P = V \\times I',
        substitution: `P = ${V} \\times ${I.toFixed(2)}`,
        answer: `P = ${P.toFixed(2)} \\text{ Watts (W)}`
      });

      summaryText = switchClosed
        ? `With voltage ${V}V and resistance ${R}Ω, electric current flowing is ${I.toFixed(2)} A.`
        : `Circuit switch is OPEN. Zero current flows.`;
      break;
    }

    case 'magnetism': {
      const B = params.magnetStrength || 1.2;
      steps.push({
        label: 'Magnetic Field Strength (B)',
        formula: 'B = \\frac{\\mu_0 I}{2 \\pi r}',
        substitution: `B = \\text{Bar Magnet Intensity}`,
        answer: `B = ${B.toFixed(2)} \\text{ Tesla (T)}`
      });
      summaryText = `Magnetic field lines extend from North pole to South pole with intensity ${B} T.`;
      break;
    }
  }

  return { steps, summaryText };
}
