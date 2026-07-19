import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BaseEngine } from '../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../core/types';
import { Box } from '@react-three/drei';

export const CoordinateEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const meshRef = useRef<any>(null);

  // Declarative animation loop
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <BaseEngine ref={ref} {...props}>
      <Box ref={meshRef} args={[1, 1, 1]} castShadow receiveShadow>
        <meshStandardMaterial color="#3b82f6" />
      </Box>
    </BaseEngine>
  );
});

CoordinateEngine.displayName = 'CoordinateEngine';
export default CoordinateEngine;
