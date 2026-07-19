import { useEffect, useRef, useState } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
import { PolygonMesh } from '../../../shared/geometry/components/PolygonMesh';
import { polygonArea, polygonPerimeter } from '../../../shared/geometry/math/mathUtils';
import { Html } from '@react-three/drei';

export default function PolygonViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);
  const [numSides, setNumSides] = useState(5);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      generateRegularPolygon(5);
      initRef.current = true;
    }
  }, [store]);

  const generateRegularPolygon = (n: number) => {
    store.reset();
    const ids = [];
    for (let i = 0; i < n; i++) {
      const theta = (i / n) * Math.PI * 2 - Math.PI/2;
      const id = `p${i}`;
      store.addPoint({ id, position: [Math.cos(theta)*3, Math.sin(theta)*3, 0], label: `V${i+1}` });
      ids.push(id);
    }
    store.addPolygon({ id: 'poly1', pointIds: ids });
  };

  const handleSidesChange = (change: number) => {
    const newN = Math.max(3, Math.min(10, numSides + change));
    if (newN !== numSides) {
      setNumSides(newN);
      generateRegularPolygon(newN);
    }
  };

  useEffect(() => {
    const poly = store.data.polygons['poly1'];
    if (poly) {
      const pts = poly.pointIds.map(id => store.data.points[id]?.position).filter(Boolean);
      if (pts.length === poly.pointIds.length) {
        const area = polygonArea(pts as any);
        const perim = polygonPerimeter(pts as any);
        const sumInterior = (pts.length - 2) * 180;

        store.setComputedStats([
          { label: 'Number of Sides (n)', answer: `n = ${pts.length}` },
          { label: 'Sum of Interior Angles', formula: '(n-2) \\times 180^\\circ', substitution: `(${pts.length}-2) \\times 180^\\circ`, answer: `${sumInterior}^\\circ` },
          { label: 'Perimeter (P)', answer: `P = ${perim.toFixed(1)}` },
          { label: 'Area (A) [Shoelace]', answer: `A = ${area.toFixed(1)}` }
        ]);
      }
    }
  }, [store.data.points, store.data.polygons, store.setComputedStats]);

  const points = Object.values(store.data.points);
  const polygons = Object.values(store.data.polygons);
  
  return (
    <>
      <Html position={[0, -4, 0]} center className="pointer-events-none z-20">
        <div className="bg-slate-900/90 backdrop-blur p-2 rounded-xl shadow-2xl border border-white/20 pointer-events-auto flex items-center gap-4">
          <div className="text-white text-sm font-bold">Sides: {numSides}</div>
          <div className="flex gap-2">
            <button onClick={() => handleSidesChange(-1)} className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold">-</button>
            <button onClick={() => handleSidesChange(1)} className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold">+</button>
          </div>
        </div>
      </Html>
      <group>
        {points.map(p => <DraggablePoint key={p.id} pointId={p.id} />)}
        {polygons.map(p => <PolygonMesh key={p.id} polygonId={p.id} />)}
      </group>
    </>
  );
}
