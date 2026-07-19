import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
import { RayMesh } from '../../../shared/geometry/components/RayMesh';


export default function RaysViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [0, 0, 0], label: 'Origin' });
      store.addPoint({ id: 'p2', position: [2, 2, 0], label: 'Direction' });
      store.addRay({ id: 'r1', originId: 'p1', directionPointId: 'p2' });
      initRef.current = true;
    }
  }, [store]);

  const points = Object.values(useGeometryStore(state => state.data.points));
  const rays = Object.values(useGeometryStore(state => state.data.rays));
  
  return (
    <group>
      {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
      {rays.map(r => <RayMesh key={r.id} rayId={r.id} />)}
    </group>
  );
}
