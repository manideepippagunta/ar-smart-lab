import { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useTriangleStore } from '../store';
import { Html } from '@react-three/drei';

interface DraggableVertexProps {
  vertexId: 'A' | 'B' | 'C';
  color: string;
}

export const DraggableVertex = ({ vertexId, color }: DraggableVertexProps) => {
  const setVertex = useTriangleStore((state) => state.setVertex);
  const pos = useTriangleStore((state) => state[vertexId]);
  
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  // Use a plane strictly on Z=0 to calculate intersection
  const bind = useDrag(({ active: dragActive, event }) => {
    setActive(dragActive);
    
    // We get the pointer coordinates from the RTF event if possible, but @use-gesture 
    // provides client coordinates. We must project them to the 3D Z=0 plane.
    const rtfEvent = event as any;
    if (rtfEvent && rtfEvent.ray) {
       const t = -rtfEvent.ray.origin.z / rtfEvent.ray.direction.z;
       const x = rtfEvent.ray.origin.x + rtfEvent.ray.direction.x * t;
       const y = rtfEvent.ray.origin.y + rtfEvent.ray.direction.y * t;
       setVertex(vertexId, [x, y, 0]);
    }
  });

  return (
    <mesh 
      position={pos} 
      {...(bind() as any)}
      onPointerOver={() => {
        document.body.style.cursor = 'grab';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
      onPointerDown={() => { document.body.style.cursor = 'grabbing'; }}
      onPointerUp={() => { document.body.style.cursor = hovered ? 'grab' : 'auto'; }}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color={hovered || active ? '#ffffff' : color} emissive={color} emissiveIntensity={0.5} />
      
      <Html position={[0.2, 0.2, 0]} className="pointer-events-none">
        <div className="bg-slate-800/80 backdrop-blur px-2 py-1 rounded shadow text-white font-bold text-xs border border-white/20">
          {vertexId}
        </div>
      </Html>
    </mesh>
  );
};
