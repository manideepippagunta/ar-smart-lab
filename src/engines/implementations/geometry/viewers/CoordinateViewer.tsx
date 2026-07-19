import { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
import { LineSegment } from '../../../shared/geometry/components/LineSegment';
import { CartesianGrid } from '../../../shared/geometry/components/CartesianGrid';
import { lineEquation, distance } from '../../../shared/geometry/math/mathUtils';

export default function CoordinateViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.toggleSetting('snapToGrid'); // enable by default for coordinate geom
      store.addPoint({ id: 'p1', position: [-3, -2, 0], label: 'A' });
      store.addPoint({ id: 'p2', position: [3, 4, 0], label: 'B' });
      store.addSegment({ id: 's1', p1Id: 'p1', p2Id: 'p2', label: 'AB' });
      initRef.current = true;
    }
  }, [store]);

  // Compute live stats
  useEffect(() => {
    const pts = store.data.points;
    const p1 = pts['p1'];
    const p2 = pts['p2'];
    if (p1 && p2) {
      const eq = lineEquation(p1.position, p2.position);
      const d = distance(p1.position, p2.position);
      
      const p1Str = `(${p1.position[0].toFixed(1)}, ${p1.position[1].toFixed(1)})`;
      const p2Str = `(${p2.position[0].toFixed(1)}, ${p2.position[1].toFixed(1)})`;
      
      let slopeStr = 'm = \\infty';
      let subStr = '';
      if (eq.slope !== Infinity) {
        slopeStr = `m = ${eq.slope.toFixed(2)}`;
        subStr = `m = \\frac{${p2.position[1].toFixed(1)} - ${p1.position[1].toFixed(1)}}{${p2.position[0].toFixed(1)} - ${p1.position[0].toFixed(1)}}`;
      }
      
      store.setComputedStats([
        { label: 'Coordinates', answer: `A: ${p1Str}, B: ${p2Str}` },
        { label: 'Slope (m)', formula: 'm = \\frac{y_2 - y_1}{x_2 - x_1}', substitution: subStr, answer: slopeStr },
        { label: 'Equation of Line', formula: 'y = mx + b', answer: eq.text },
        { label: 'Distance', formula: 'd = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', answer: `d = ${d.toFixed(2)}` }
      ]);
    }
  }, [store.data.points, store.setComputedStats]);

  const points = Object.values(store.data.points);
  const segments = Object.values(store.data.segments);
  
  return (
    <group>
      <CartesianGrid />
      {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
      {segments.map(s => <LineSegment key={s.id} segmentId={s.id} />)}
    </group>
  );
}
