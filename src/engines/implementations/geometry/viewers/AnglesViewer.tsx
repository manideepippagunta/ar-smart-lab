import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
;
import { RayMesh } from '../../../shared/geometry/components/RayMesh';
;
import { AngleArc } from '../../../shared/geometry/components/AngleArc';


export default function AnglesViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [0, 2, 0], label: 'A' });
      store.addPoint({ id: 'v', position: [0, 0, 0], label: 'Vertex' });
      store.addPoint({ id: 'p2', position: [2, 0, 0], label: 'B' });
      
      store.addRay({ id: 'r1', originId: 'v', directionPointId: 'p1' });
      store.addRay({ id: 'r2', originId: 'v', directionPointId: 'p2' });
      
      store.addAngle({ id: 'a1', p1Id: 'p1', vertexId: 'v', p2Id: 'p2', label: 'θ' });
      
      initRef.current = true;
    }
  }, [store]);

  const points = Object.values(useGeometryStore(state => state.data.points));
  const rays = Object.values(useGeometryStore(state => state.data.rays));
  const angles = Object.values(useGeometryStore(state => state.data.angles));
  
  return (
    <group>
      {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
      {rays.map(r => <RayMesh key={r.id} rayId={r.id} />)}
      {angles.map(a => <AngleArc key={a.id} angleId={a.id} />)}
    </group>
  );
}
