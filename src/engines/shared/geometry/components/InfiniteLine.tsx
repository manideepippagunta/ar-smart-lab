import { Line } from '@react-three/drei';
import { useGeometryStore } from '../store/useGeometryStore';
import { extendLine } from '../math/mathUtils';

export const InfiniteLine = ({ lineId }: { lineId: string }) => {
  const line = useGeometryStore(state => state.data.lines[lineId]);
  const points = useGeometryStore(state => state.data.points);
  const isSelected = useGeometryStore(state => state.selectedIds.includes(lineId));

  if (!line) return null;
  const p1 = points[line.p1Id];
  const p2 = points[line.p2Id];
  if (!p1 || !p2) return null;

  const [start, end] = extendLine(p1.position, p2.position, 20);
  const color = isSelected ? '#ffffff' : (line.color || '#ec4899');

  return (
    <Line points={[start, end]} color={color} lineWidth={isSelected ? 5 : 3} />
  );
};
