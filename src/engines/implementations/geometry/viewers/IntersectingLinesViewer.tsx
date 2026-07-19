import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
;
;
import { InfiniteLine } from '../../../shared/geometry/components/InfiniteLine';
;


export default function IntersectingLinesViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [-2, -2, 0], label: 'A' });
      store.addPoint({ id: 'p2', position: [2, 2, 0], label: 'B' });
      store.addPoint({ id: 'p3', position: [-2, 2, 0], label: 'C' });
      store.addPoint({ id: 'p4', position: [2, -2, 0], label: 'D' });
      
      store.addLine({ id: 'l1', p1Id: 'p1', p2Id: 'p2' });
      store.addLine({ id: 'l2', p1Id: 'p3', p2Id: 'p4' });
      initRef.current = true;
    }
  }, [store]);

  const points = Object.values(useGeometryStore(state => state.data.points));
  const lines = Object.values(useGeometryStore(state => state.data.lines));
  
  return (
    <group>
      {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
      {lines.map(l => <InfiniteLine key={l.id} lineId={l.id} />)}
    </group>
  );
}
