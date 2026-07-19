import { Line, Html } from '@react-three/drei';
import { useGeometryStore } from '../store/useGeometryStore';
import { distance, midpoint } from '../math/mathUtils';

export const LineSegment = ({ segmentId }: { segmentId: string }) => {
  const segment = useGeometryStore(state => state.data.segments[segmentId]);
  const points = useGeometryStore(state => state.data.points);
  const showMeasurements = useGeometryStore(state => state.showMeasurements);
  const isSelected = useGeometryStore(state => state.selectedIds.includes(segmentId));

  if (!segment) return null;

  const p1 = points[segment.p1Id];
  const p2 = points[segment.p2Id];

  if (!p1 || !p2) return null;

  const color = isSelected ? '#ffffff' : (segment.color || '#3b82f6');
  const length = distance(p1.position, p2.position);
  const mid = midpoint(p1.position, p2.position);

  return (
    <group>
      <Line 
        points={[p1.position, p2.position]} 
        color={color} 
        lineWidth={isSelected ? 5 : 3} 
      />
      
      {showMeasurements && length > 0 && (
        <Html position={mid} center className="pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur px-2 py-1 rounded-md shadow-xl text-white text-xs border border-white/10 whitespace-nowrap">
            {segment.label ? `${segment.label} = ` : ''}{length.toFixed(1)}
          </div>
        </Html>
      )}
    </group>
  );
};
