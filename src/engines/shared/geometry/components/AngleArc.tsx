import { useGeometryStore } from '../store/useGeometryStore';
import { angleBetween } from '../math/mathUtils';
import { Html } from '@react-three/drei';

export const AngleArc = ({ angleId }: { angleId: string }) => {
  const angle = useGeometryStore(state => state.data.angles[angleId]);
  const points = useGeometryStore(state => state.data.points);
  const showLabels = useGeometryStore(state => state.showLabels);
  
  if (!angle) return null;
  const p1 = points[angle.p1Id];
  const v = points[angle.vertexId];
  const p2 = points[angle.p2Id];
  if (!p1 || !v || !p2) return null;

  const deg = angleBetween(p1.position, v.position, p2.position);

  // Offset label position slightly towards the interior of the angle
  // Simple approximation: midpoint of the two vectors, normalized, scaled
  const v1 = [p1.position[0]-v.position[0], p1.position[1]-v.position[1]];
  const v2 = [p2.position[0]-v.position[0], p2.position[1]-v.position[1]];
  const m1 = Math.sqrt(v1[0]**2 + v1[1]**2) || 1;
  const m2 = Math.sqrt(v2[0]**2 + v2[1]**2) || 1;
  const u1 = [v1[0]/m1, v1[1]/m1];
  const u2 = [v2[0]/m2, v2[1]/m2];
  
  const mid = [u1[0]+u2[0], u1[1]+u2[1]];
  const mm = Math.sqrt(mid[0]**2 + mid[1]**2) || 1;
  const r = 0.6;
  const labelPos: [number, number, number] = [v.position[0] + (mid[0]/mm)*r, v.position[1] + (mid[1]/mm)*r, 0];

  return (
    <group>
      {showLabels && deg > 0 && (
        <Html position={labelPos} center className="pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur px-2 py-1 rounded shadow text-white text-[10px] font-bold border border-white/20 whitespace-nowrap">
            {angle.label ? `${angle.label} = ` : ''}{deg.toFixed(1)}°
          </div>
        </Html>
      )}
    </group>
  );
};
