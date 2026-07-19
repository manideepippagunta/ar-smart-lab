import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMensurationStore } from './useMensurationStore';

export const MensurationCanvas3D: React.FC = () => {
  const meshRef = useRef<any>(null);
  const { activeShape, params, showWireframe } = useMensurationStore();

  const {
    length: l = 5,
    width: w = 4,
    height: h = 6,
    radius: r = 3,
    side: a = 4
  } = params;

  // Scale down units so 3D objects fit nicely in the viewport
  const sL = Math.max(0.5, l * 0.35);
  const sW = Math.max(0.5, w * 0.35);
  const sH = Math.max(0.5, h * 0.35);
  const sR = Math.max(0.4, r * 0.35);
  const sA = Math.max(0.5, a * 0.35);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={meshRef}>
      {/* CUBE */}
      {activeShape === 'cube' && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[sA, sA, sA]} />
          <meshStandardMaterial color="#8b5cf6" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* CUBOID */}
      {activeShape === 'cuboid' && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[sL, sH, sW]} />
          <meshStandardMaterial color="#3b82f6" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* CYLINDER */}
      {activeShape === 'cylinder' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[sR, sR, sH, 32]} />
          <meshStandardMaterial color="#10b981" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* CONE */}
      {activeShape === 'cone' && (
        <mesh castShadow receiveShadow position={[0, -sH / 4, 0]}>
          <coneGeometry args={[sR, sH, 32]} />
          <meshStandardMaterial color="#f59e0b" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* SPHERE */}
      {activeShape === 'sphere' && (
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[sR, 32, 32]} />
          <meshStandardMaterial color="#ec4899" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* PRISM (Triangular Base) */}
      {activeShape === 'prism' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[sR, sR, sH, 3]} />
          <meshStandardMaterial color="#06b6d4" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}

      {/* PYRAMID (Square Base) */}
      {activeShape === 'pyramid' && (
        <mesh castShadow receiveShadow position={[0, -sH / 4, 0]}>
          <coneGeometry args={[sA, sH, 4]} />
          <meshStandardMaterial color="#6366f1" wireframe={showWireframe} roughness={0.3} metalness={0.2} />
        </mesh>
      )}
    </group>
  );
};
