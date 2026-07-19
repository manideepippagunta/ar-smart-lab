import { useMemo } from 'react';
import { useTriangleStore } from '../store';
import * as THREE from 'three';
import { Line } from '@react-three/drei';

export const TriangleMesh = () => {
  const A = useTriangleStore(state => state.A);
  const B = useTriangleStore(state => state.B);
  const C = useTriangleStore(state => state.C);
  const wireframe = useTriangleStore(state => state.wireframe);

  // Rebuild geometry when vertices change
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      A[0], A[1], A[2],
      B[0], B[1], B[2],
      C[0], C[1], C[2]
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.setIndex([0, 1, 2]); // one face
    geo.computeVertexNormals();
    return geo;
  }, [A, B, C]);

  return (
    <group>
      {/* The solid face */}
      <mesh geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial 
          color="#3b82f6" 
          transparent 
          opacity={wireframe ? 0.1 : 0.6} 
          side={THREE.DoubleSide} 
          wireframe={wireframe}
        />
      </mesh>

      {/* The thick borders */}
      <Line points={[A, B, C, A]} color="#60a5fa" lineWidth={3} />
    </group>
  );
};
