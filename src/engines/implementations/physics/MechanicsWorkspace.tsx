import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePhysicsStore } from './usePhysicsStore';

export const MechanicsWorkspace: React.FC = () => {
  const meshRef = useRef<any>(null);
  const { params, isPlaying, tickSim, position } = usePhysicsStore();
  const { force, friction, rampAngle } = params;

  useFrame((_, delta) => {
    if (isPlaying) {
      tickSim(delta);
    }
  });

  const posX = (position * 0.15) - 3;
  const radAngle = (rampAngle * Math.PI) / 180;
  const posY = Math.sin(radAngle) * (posX + 3);

  // Vector arrow lengths
  const forceScale = Math.min(2.5, force * 0.05);
  const fScale = Math.min(1.5, friction * 5);

  return (
    <group>
      {/* Moving Physical Block */}
      <mesh ref={meshRef} position={[posX, posY + 0.4, 0]} rotation={[0, 0, radAngle]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Applied Force Vector (Blue Arrow) */}
      <group position={[posX + 0.4, posY + 0.4, 0]} rotation={[0, 0, radAngle]}>
        <mesh position={[forceScale / 2, 0, 0]}>
          <boxGeometry args={[forceScale, 0.08, 0.08]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
        <mesh position={[forceScale, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.12, 0.3, 16]} />
          <meshBasicMaterial color="#60a5fa" />
        </mesh>
      </group>

      {/* Friction Force Vector (Red Arrow) */}
      <group position={[posX - 0.4, posY + 0.4, 0]} rotation={[0, 0, radAngle + Math.PI]}>
        <mesh position={[fScale / 2, 0, 0]}>
          <boxGeometry args={[fScale, 0.06, 0.06]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[fScale, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.25, 16]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Gravity Vector (Green Arrow pointing down) */}
      <group position={[posX, posY + 0.4, 0]}>
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <mesh position={[0, -1.0, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.1, 0.25, 16]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
      </group>

      {/* Surface / Inclined Ramp Floor */}
      <mesh position={[0, -0.1, 0]} rotation={[0, 0, radAngle]} receiveShadow>
        <boxGeometry args={[12, 0.2, 3]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
    </group>
  );
};
