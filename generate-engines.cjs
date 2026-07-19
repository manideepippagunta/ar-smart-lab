const fs = require('fs');
const path = require('path');

const engines = [
  "InteractiveEngine",
  "IntegerEngine",
  "TriangleEngine",
  "FractionEngine",
  "RotationEngine",
  "PolygonEngine",
  "LightEngine",
  "CubeEngine",
  "CuboidEngine",
  "CylinderEngine",
  "CircleEngine",
  "ConeEngine",
  "CoordinateEngine",
  "GraphEngine",
  "NumberLineEngine",
  "ProbabilityEngine",
  "MensurationEngine"
];

const dir = path.join(__dirname, 'src', 'engines', 'implementations');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

engines.forEach(engine => {
  const code = `import React, { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { BaseEngine } from '../core/BaseEngine';
import { EngineProps, EngineImperativeAPI } from '../core/types';
import { Box } from '@react-three/drei';

export const ${engine} = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const meshRef = useRef<any>(null);

  // Declarative animation loop
  useFrame((state, delta) => {
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

${engine}.displayName = '${engine}';
export default ${engine};
`;

  fs.writeFileSync(path.join(dir, `${engine}.tsx`), code);
});

console.log('Created 17 engine placeholders.');
