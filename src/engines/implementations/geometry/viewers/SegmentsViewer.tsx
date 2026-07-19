import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
import { LineSegment } from '../../../shared/geometry/components/LineSegment';


export default function SegmentsViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [-2, 0, 0], label: 'A' });
      store.addPoint({ id: 'p2', position: [2, 0, 0], label: 'B' });
      store.addSegment({ id: 's1', p1Id: 'p1', p2Id: 'p2', label: 'AB' });
      initRef.current = true;
    }
  }, [store]);

  const points = Object.values(useGeometryStore(state => state.data.points));
  const segments = Object.values(useGeometryStore(state => state.data.segments));
  
  return (
    <group>
      {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
      {segments.map(s => <LineSegment key={s.id} segmentId={s.id} />)}
    </group>
  );
}
