import type { Vector3D } from '../store/useGeometryStore';

export function distance(p1: Vector3D, p2: Vector3D): number {
  return Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
}

export function midpoint(p1: Vector3D, p2: Vector3D): Vector3D {
  return [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, 0];
}

export function angleBetween(p1: Vector3D, vertex: Vector3D, p2: Vector3D): number {
  const v1 = [p1[0] - vertex[0], p1[1] - vertex[1]];
  const v2 = [p2[0] - vertex[0], p2[1] - vertex[1]];
  
  const dot = v1[0] * v2[0] + v1[1] * v2[1];
  const mag1 = Math.sqrt(v1[0]**2 + v1[1]**2);
  const mag2 = Math.sqrt(v2[0]**2 + v2[1]**2);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  let cos = dot / (mag1 * mag2);
  cos = Math.max(-1, Math.min(1, cos));
  
  // Cross product to get signed angle if needed, but for simple geometry, 
  // we usually just want the interior angle (0 to 180).
  return Math.acos(cos) * (180 / Math.PI);
}

export function checkParallel(A1: Vector3D, A2: Vector3D, B1: Vector3D, B2: Vector3D, epsilon = 0.01): boolean {
  const dx1 = A2[0] - A1[0];
  const dy1 = A2[1] - A1[1];
  const dx2 = B2[0] - B1[0];
  const dy2 = B2[1] - B1[1];
  
  // Cross product of direction vectors
  const cross = dx1 * dy2 - dy1 * dx2;
  return Math.abs(cross) < epsilon;
}

export function lineIntersection(A1: Vector3D, A2: Vector3D, B1: Vector3D, B2: Vector3D): Vector3D | null {
  const x1 = A1[0], y1 = A1[1];
  const x2 = A2[0], y2 = A2[1];
  const x3 = B1[0], y3 = B1[1];
  const x4 = B2[0], y4 = B2[1];

  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 0.0001) return null; // Parallel or coincident

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  const x = x1 + t * (x2 - x1);
  const y = y1 + t * (y2 - y1);

  return [x, y, 0];
}

export function extendLine(p1: Vector3D, p2: Vector3D, length: number): [Vector3D, Vector3D] {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const mag = Math.sqrt(dx*dx + dy*dy);
  if (mag === 0) return [p1, p2];

  const ux = dx / mag;
  const uy = dy / mag;

  const start: Vector3D = [p1[0] - ux * length, p1[1] - uy * length, 0];
  const end: Vector3D = [p2[0] + ux * length, p2[1] + uy * length, 0];
  return [start, end];
}

export function extendRay(origin: Vector3D, dirPoint: Vector3D, length: number): Vector3D {
  const dx = dirPoint[0] - origin[0];
  const dy = dirPoint[1] - origin[1];
  const mag = Math.sqrt(dx*dx + dy*dy);
  if (mag === 0) return dirPoint;

  const ux = dx / mag;
  const uy = dy / mag;

  return [origin[0] + ux * length, origin[1] + uy * length, 0];
}

export function polygonArea(points: Vector3D[]): number {
  let area = 0;
  const n = points.length;
  if (n < 3) return 0;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    area += points[i][0] * points[j][1];
    area -= points[j][0] * points[i][1];
  }
  
  return Math.abs(area / 2);
}

export function polygonPerimeter(points: Vector3D[]): number {
  let perim = 0;
  const n = points.length;
  if (n < 2) return 0;
  
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    perim += distance(points[i], points[j]);
  }
  
  return perim;
}

export function lineEquation(p1: Vector3D, p2: Vector3D) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  
  if (Math.abs(dx) < 0.0001) {
    return { slope: Infinity, intercept: p1[0], text: `x = ${p1[0].toFixed(1)}` };
  }
  
  const m = dy / dx;
  const b = p1[1] - m * p1[0];
  
  let text = `y = ${m.toFixed(1)}x`;
  if (b > 0.01) text += ` + ${b.toFixed(1)}`;
  else if (b < -0.01) text += ` - ${Math.abs(b).toFixed(1)}`;
  
  return { slope: m, intercept: b, text };
}
