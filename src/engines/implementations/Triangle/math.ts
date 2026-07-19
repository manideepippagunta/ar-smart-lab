export type Vector3D = [number, number, number];

export interface TriangleMathState {
  a: number;
  b: number;
  c: number;
  angleA: number;
  angleB: number;
  angleC: number;
  perimeter: number;
  area: number;
  centroid: Vector3D;
  incenter: Vector3D;
  incircleRadius: number;
  circumcenter: Vector3D;
  circumcircleRadius: number;
  classification: {
    sides: 'Equilateral' | 'Isosceles' | 'Scalene';
    angles: 'Acute' | 'Right' | 'Obtuse';
  };
}

function dist(p1: Vector3D, p2: Vector3D): number {
  return Math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2 + (p1[2] - p2[2]) ** 2);
}

export function computeTriangleProperties(A: Vector3D, B: Vector3D, C: Vector3D): TriangleMathState {
  const c = dist(A, B);
  const a = dist(B, C);
  const b = dist(C, A);

  const perimeter = a + b + c;
  const s = perimeter / 2;
  const areaVal = s * (s - a) * (s - b) * (s - c);
  const area = areaVal > 0 ? Math.sqrt(areaVal) : 0;

  // Law of Cosines
  const cosA = Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c || 1)));
  const cosB = Math.max(-1, Math.min(1, (c * c + a * a - b * b) / (2 * c * a || 1)));
  const cosC = Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b || 1)));

  const angleA = Math.acos(cosA) * (180 / Math.PI);
  const angleB = Math.acos(cosB) * (180 / Math.PI);
  const angleC = Math.acos(cosC) * (180 / Math.PI);

  const centroid: Vector3D = [
    (A[0] + B[0] + C[0]) / 3,
    (A[1] + B[1] + C[1]) / 3,
    (A[2] + B[2] + C[2]) / 3
  ];

  // Incenter & Incircle Radius
  const incenter: Vector3D = [
    (a * A[0] + b * B[0] + c * C[0]) / (perimeter || 1),
    (a * A[1] + b * B[1] + c * C[1]) / (perimeter || 1),
    (a * A[2] + b * B[2] + c * C[2]) / (perimeter || 1)
  ];
  const incircleRadius = s > 0 ? area / s : 0;

  // Circumcenter & Circumcircle Radius
  const D = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  let circumcenter: Vector3D = [0, 0, 0];
  if (Math.abs(D) > 0.0001) {
    const sqA = A[0] * A[0] + A[1] * A[1];
    const sqB = B[0] * B[0] + B[1] * B[1];
    const sqC = C[0] * C[0] + C[1] * C[1];

    const ux = (sqA * (B[1] - C[1]) + sqB * (C[1] - A[1]) + sqC * (A[1] - B[1])) / D;
    const uy = (sqA * (C[0] - B[0]) + sqB * (A[0] - C[0]) + sqC * (B[0] - A[0])) / D;
    circumcenter = [ux, uy, 0];
  } else {
    // Collinear or degenerate, fallback to midpoint of longest side
    circumcenter = centroid;
  }
  const circumcircleRadius = area > 0 ? (a * b * c) / (4 * area) : 0;

  // Sides Classification
  let sides: 'Equilateral' | 'Isosceles' | 'Scalene' = 'Scalene';
  const tol = 0.15; // tolerance for floating point Snapping
  const diffAB = Math.abs(a - b);
  const diffBC = Math.abs(b - c);
  const diffCA = Math.abs(c - a);

  if (diffAB < tol && diffBC < tol && diffCA < tol) {
    sides = 'Equilateral';
  } else if (diffAB < tol || diffBC < tol || diffCA < tol) {
    sides = 'Isosceles';
  }

  // Angles Classification
  let angles: 'Acute' | 'Right' | 'Obtuse' = 'Acute';
  const rightAngleTol = 2.0;
  if (
    Math.abs(angleA - 90) < rightAngleTol ||
    Math.abs(angleB - 90) < rightAngleTol ||
    Math.abs(angleC - 90) < rightAngleTol
  ) {
    angles = 'Right';
  } else if (angleA > 90 + rightAngleTol || angleB > 90 + rightAngleTol || angleC > 90 + rightAngleTol) {
    angles = 'Obtuse';
  }

  return {
    a,
    b,
    c,
    angleA,
    angleB,
    angleC,
    perimeter,
    area,
    centroid,
    incenter,
    incircleRadius,
    circumcenter,
    circumcircleRadius,
    classification: {
      sides,
      angles
    }
  };
}
