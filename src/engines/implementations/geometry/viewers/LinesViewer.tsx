import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
;
;
import { InfiniteLine } from '../../../shared/geometry/components/InfiniteLine';
;


export default function LinesViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [-2, 0, 0], label: 'A' });
      store.addPoint({ id: 'p2', position: [2, 0, 0], label: 'B' });
      store.addLine({ id: 'l1', p1Id: 'p1', p2Id: 'p2', label: 'Line AB' });
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
