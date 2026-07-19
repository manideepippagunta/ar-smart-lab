import { useMemo } from 'react';
import * as THREE from 'three';
import { useGeometryStore } from '../store/useGeometryStore';
import { distance } from '../math/mathUtils';
import { Html } from '@react-three/drei';

export const CircleMesh = ({ circleId }: { circleId: string }) => {
  const circle = useGeometryStore(state => state.data.circles[circleId]);
  const points = useGeometryStore(state => state.data.points);
  const showMeasurements = useGeometryStore(state => state.showMeasurements);
  const isSelected = useGeometryStore(state => state.selectedIds.includes(circleId));

  const center = circle ? points[circle.centerId] : null;

  const r = useMemo(() => {
    if (!circle || !center) return 1;
    let radius = circle.radius || 1;
    if (circle.radiusPointId && points[circle.radiusPointId]) {
      radius = distance(center.position, points[circle.radiusPointId].position);
    }
    return radius;
  }, [circle, center, points]);

  const linePoints = useMemo(() => {
    const pts = [];
    const segments = 64;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, Math.sin(theta) * r, 0));
    }
    return pts;
  }, [r]);

  if (!circle || !center) return null;

  const color = isSelected ? '#ffffff' : (circle.color || '#ec4899');

  return (
    <group position={center.position}>
      <mesh>
        <circleGeometry args={[r, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.1} />
      </mesh>
      {/* Use Line from drei instead of raw <line> to avoid SVG type conflicts */}
      <lineLoop>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(linePoints.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={color} linewidth={isSelected ? 3 : 2} />
      </lineLoop>

      {showMeasurements && r > 0 && (
        <Html position={[r * 0.7, r * 0.7, 0]} center className="pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur px-2 py-1 rounded shadow text-white text-[10px] font-bold border border-white/20">
            r = {r.toFixed(1)}
          </div>
        </Html>
      )}
    </group>
  );
};
