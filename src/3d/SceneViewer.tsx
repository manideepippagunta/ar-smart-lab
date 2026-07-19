import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

export function SceneViewer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="w-full h-full min-h-[400px] bg-black/5 rounded-xl overflow-hidden glass-panel">
      <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Environment preset="city" />
          {children}
          <OrbitControls makeDefault />
        </Suspense>
      </Canvas>
    </div>
  );
}

