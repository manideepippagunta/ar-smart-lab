import { useMemo } from 'react';
import { useTriangleStore } from '../store';
import * as THREE from 'three';

export const Circles = () => {
  const { math, showIncircle, showCircumcircle } = useTriangleStore();

  const incircleGeo = useMemo(() => new THREE.RingGeometry(math.incircleRadius - 0.05, math.incircleRadius, 64), [math.incircleRadius]);
  const circumcircleGeo = useMemo(() => new THREE.RingGeometry(math.circumcircleRadius - 0.05, math.circumcircleRadius, 64), [math.circumcircleRadius]);

  return (
    <group>
      {showIncircle && (
        <mesh position={math.incenter} geometry={incircleGeo}>
          <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}

      {showCircumcircle && (
        <mesh position={math.circumcenter} geometry={circumcircleGeo}>
          <meshBasicMaterial color="#8b5cf6" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};
