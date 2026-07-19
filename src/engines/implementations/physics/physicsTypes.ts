export type PhysicsTopic =
  | 'motion'
  | 'force_laws'
  | 'work_energy'
  | 'optics'
  | 'circuits'
  | 'magnetism';

export interface PhysicsParams {
  mass: number;             // kg
  force: number;            // N
  initialVelocity: number;  // m/s
  rampAngle: number;        // degrees
  gravity: number;          // m/s^2
  friction: number;         // coefficient mu
  voltage: number;          // Volts
  resistance: number;       // Ohms
  switchClosed: boolean;
  incidentAngle: number;    // degrees
  refractiveIndex: number;  // n2
  focalLength: number;      // cm
  magnetStrength: number;   // Tesla / arbitrary
}

export interface KaTeXStep {
  label: string;
  formula: string;
  substitution: string;
  answer: string;
}
