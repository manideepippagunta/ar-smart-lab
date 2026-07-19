import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
import { CircleMesh } from '../../../shared/geometry/components/CircleMesh';
import { distance } from '../../../shared/geometry/math/mathUtils';

export default function CircleViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'c1', position: [0, 0, 0], label: 'Center' });
      store.addPoint({ id: 'r1', position: [3, 0, 0], label: 'Edge' });
      store.addCircle({ id: 'circ1', centerId: 'c1', radiusPointId: 'r1' });
      initRef.current = true;
    }
  }, [store]);

  // Compute live stats
  useEffect(() => {
    const pts = store.data.points;
    const c1 = pts['c1'];
    const r1 = pts['r1'];
    if (c1 && r1) {
      const r = distance(c1.position, r1.position);
      const d = 2 * r;
      const c = 2 * Math.PI * r;
      const a = Math.PI * r * r;
      
      store.setComputedStats([
        { label: 'Radius (r)', answer: `r = ${r.toFixed(1)}` },
        { label: 'Diameter (d)', formula: 'd = 2r', answer: `d = ${d.toFixed(1)}` },
        { label: 'Circumference (C)', formula: 'C = 2\\pi r', substitution: `C = 2\\pi (${r.toFixed(1)})`, answer: `C = ${c.toFixed(1)}` },
        { label: 'Area (A)', formula: 'A = \\pi r^2', substitution: `A = \\pi (${r.toFixed(1)})^2`, answer: `A = ${a.toFixed(1)}` }
      ]);
    }
  }, [store.data.points, store.setComputedStats]);

  const points = Object.values(store.data.points);
  const circles = Object.values(store.data.circles);
  
  return (
    <group>
      {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
      {circles.map(c => <CircleMesh key={c.id} circleId={c.id} />)}
    </group>
  );
}
