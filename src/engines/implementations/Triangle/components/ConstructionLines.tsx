import { useTriangleStore } from '../store';
import { Line } from '@react-three/drei';
import type { Vector3D } from '../math';

export const ConstructionLines = () => {
  const { A, B, C, showMedians, showAltitudes } = useTriangleStore();

  const midAB: Vector3D = [(A[0]+B[0])/2, (A[1]+B[1])/2, 0];
  const midBC: Vector3D = [(B[0]+C[0])/2, (B[1]+C[1])/2, 0];
  const midCA: Vector3D = [(C[0]+A[0])/2, (C[1]+A[1])/2, 0];

  // For altitudes, we can draw a line from Vertex to Orthocenter. 
  // Wait, orthocenter is the intersection, but the altitude itself goes from vertex to the opposite side.
  // We can just draw from Vertex to Orthocenter and extend it if needed, or compute the exact foot.
  // For visual simplicity, Vertex to Orthocenter is often enough for the educational demonstration, 
  // but if the orthocenter is outside, it shows the line extending.
  // Let's project the vertex onto the opposite side to get the exact foot of the altitude.
  const project = (V: Vector3D, P1: Vector3D, P2: Vector3D): Vector3D => {
    const l2 = (P2[0]-P1[0])**2 + (P2[1]-P1[1])**2;
    if (l2 === 0) return P1;
    const t = ((V[0]-P1[0])*(P2[0]-P1[0]) + (V[1]-P1[1])*(P2[1]-P1[1])) / l2;
    return [P1[0] + t*(P2[0]-P1[0]), P1[1] + t*(P2[1]-P1[1]), 0];
  };

  const footA = project(A, B, C);
  const footB = project(B, A, C);
  const footC = project(C, A, B);

  return (
    <group>
      {showMedians && (
        <>
          <Line points={[A, midBC]} color="#f59e0b" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[B, midCA]} color="#f59e0b" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[C, midAB]} color="#f59e0b" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
        </>
      )}

      {showAltitudes && (
        <>
          <Line points={[A, footA]} color="#ec4899" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[B, footB]} color="#ec4899" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
          <Line points={[C, footC]} color="#ec4899" lineWidth={2} dashed dashSize={0.2} gapSize={0.1} />
        </>
      )}
    </group>
  );
};
