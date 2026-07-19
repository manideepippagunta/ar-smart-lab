import { Line } from '@react-three/drei';
import { useGeometryStore } from '../store/useGeometryStore';
import { extendRay } from '../math/mathUtils';

export const RayMesh = ({ rayId }: { rayId: string }) => {
  const ray = useGeometryStore(state => state.data.rays[rayId]);
  const points = useGeometryStore(state => state.data.points);
  const isSelected = useGeometryStore(state => state.selectedIds.includes(rayId));

  if (!ray) return null;
  const origin = points[ray.originId];
  const dir = points[ray.directionPointId];
  if (!origin || !dir) return null;

  const end = extendRay(origin.position, dir.position, 20); // extend far out
  const color = isSelected ? '#ffffff' : (ray.color || '#f59e0b');

  return (
    <Line points={[origin.position, end]} color={color} lineWidth={isSelected ? 5 : 3} />
  );
};
