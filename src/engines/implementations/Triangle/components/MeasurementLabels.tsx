import { useTriangleStore } from '../store';
import { Html } from '@react-three/drei';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import type { Vector3D } from '../math';

export const MeasurementLabels = () => {
  const { A, B, C, math, showMeasurements, showLabels } = useTriangleStore();

  if (!showMeasurements && !showLabels) return null;

  // Midpoints for side lengths
  const midAB: Vector3D = [(A[0]+B[0])/2, (A[1]+B[1])/2, (A[2]+B[2])/2];
  const midBC: Vector3D = [(B[0]+C[0])/2, (B[1]+C[1])/2, (B[2]+C[2])/2];
  const midCA: Vector3D = [(C[0]+A[0])/2, (C[1]+A[1])/2, (C[2]+A[2])/2];

  // Offset angles slightly from vertices towards the centroid
  const offset = 0.4;
  const offA: Vector3D = [A[0] + (math.centroid[0]-A[0])*offset, A[1] + (math.centroid[1]-A[1])*offset, 0];
  const offB: Vector3D = [B[0] + (math.centroid[0]-B[0])*offset, B[1] + (math.centroid[1]-B[1])*offset, 0];
  const offC: Vector3D = [C[0] + (math.centroid[0]-C[0])*offset, C[1] + (math.centroid[1]-C[1])*offset, 0];

  return (
    <group>
      {/* Side Lengths */}
      {showMeasurements && (
        <>
          <Label pos={midBC} tex={`a = ${math.a.toFixed(1)}`} />
          <Label pos={midCA} tex={`b = ${math.b.toFixed(1)}`} />
          <Label pos={midAB} tex={`c = ${math.c.toFixed(1)}`} />
        </>
      )}

      {/* Angles */}
      {showLabels && (
        <>
          <Label pos={offA} tex={`\\angle A = ${math.angleA.toFixed(0)}^\\circ`} />
          <Label pos={offB} tex={`\\angle B = ${math.angleB.toFixed(0)}^\\circ`} />
          <Label pos={offC} tex={`\\angle C = ${math.angleC.toFixed(0)}^\\circ`} />
        </>
      )}
    </group>
  );
};

const Label = ({ pos, tex }: { pos: Vector3D; tex: string }) => (
  <Html position={pos} center className="pointer-events-none">
    <div className="bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md shadow-xl text-white text-xs border border-white/10 whitespace-nowrap">
      <InlineMath math={tex} />
    </div>
  </Html>
);
