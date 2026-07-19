import { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useGeometryStore } from '../store/useGeometryStore';
import { Html } from '@react-three/drei';

export const DraggablePoint = ({ pointId }: { pointId: string }) => {
  const point = useGeometryStore(state => state.data.points[pointId]);
  const setPosition = useGeometryStore(state => state.setPointPosition);
  const selectedIds = useGeometryStore(state => state.selectedIds);
  const select = useGeometryStore(state => state.select);
  const showLabels = useGeometryStore(state => state.showLabels);

  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const bind = useDrag(({ active: isActive, event }) => {
    if (!point || point.fixed) return;
    setActive(isActive);
    
    // @ts-ignore
    if (event && event.ray) {
      // @ts-ignore
      const t = -event.ray.origin.z / event.ray.direction.z;
      // @ts-ignore
      const x = event.ray.origin.x + event.ray.direction.x * t;
      // @ts-ignore
      const y = event.ray.origin.y + event.ray.direction.y * t;
      setPosition(pointId, [x, y, 0]);
    }
  });

  if (!point) return null;
  const isSelected = selectedIds.includes(pointId);

  const color = isSelected ? '#ffffff' : (point.color || '#ef4444');

  return (
    <mesh 
      position={point.position} 
      {...(!point.fixed ? bind() : {})}
      onClick={(e) => {
        e.stopPropagation();
        select(pointId);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        if (!point.fixed) document.body.style.cursor = 'grab';
        setHovered(true);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHovered(false);
      }}
      onPointerDown={() => { if (!point.fixed) document.body.style.cursor = 'grabbing'; }}
      onPointerUp={() => { if (!point.fixed) document.body.style.cursor = hovered ? 'grab' : 'auto'; }}
    >
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color={hovered || active ? '#ffffff' : color} emissive={color} emissiveIntensity={0.5} />
      
      {showLabels && point.label && (
        <Html position={[0.2, 0.2, 0]} className="pointer-events-none">
          <div className="bg-slate-800/80 backdrop-blur px-2 py-1 rounded shadow text-white font-bold text-xs border border-white/20">
            {point.label}
          </div>
        </Html>
      )}
    </mesh>
  );
};
