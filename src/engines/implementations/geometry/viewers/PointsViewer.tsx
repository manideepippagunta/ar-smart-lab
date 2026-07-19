import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';


export default function PointsViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [0, 1, 0], label: 'A' });
      store.addPoint({ id: 'p2', position: [-2, -1, 0], label: 'B' });
      store.addPoint({ id: 'p3', position: [2, -1, 0], label: 'C' });
      initRef.current = true;
    }
  }, [store]);

  const points = Object.values(useGeometryStore(state => state.data.points));
  return <group>{points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}</group>;
}
