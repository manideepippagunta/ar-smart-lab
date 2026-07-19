const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'engines', 'implementations', 'geometry', 'viewers');

const circleViewer = `import React, { useEffect, useRef } from 'react';
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
        { label: 'Radius (r)', answer: \`r = \${r.toFixed(1)}\` },
        { label: 'Diameter (d)', formula: 'd = 2r', answer: \`d = \${d.toFixed(1)}\` },
        { label: 'Circumference (C)', formula: 'C = 2\\\\pi r', substitution: \`C = 2\\\\pi (\${r.toFixed(1)})\`, answer: \`C = \${c.toFixed(1)}\` },
        { label: 'Area (A)', formula: 'A = \\\\pi r^2', substitution: \`A = \\\\pi (\${r.toFixed(1)})^2\`, answer: \`A = \${a.toFixed(1)}\` }
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
`;

const polygonViewer = `import React, { useEffect, useRef, useState } from 'react';
import { useGeometryStore, GeoPoint } from '../../../shared/geometry/store/useGeometryStore';
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
      const id = \`p\${i}\`;
      store.addPoint({ id, position: [Math.cos(theta)*3, Math.sin(theta)*3, 0], label: \`V\${i+1}\` });
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
          { label: 'Number of Sides (n)', answer: \`n = \${pts.length}\` },
          { label: 'Sum of Interior Angles', formula: '(n-2) \\\\times 180^\\\\circ', substitution: \`(\${pts.length}-2) \\\\times 180^\\\\circ\`, answer: \`\${sumInterior}^\\\\circ\` },
          { label: 'Perimeter (P)', answer: \`P = \${perim.toFixed(1)}\` },
          { label: 'Area (A) [Shoelace]', answer: \`A = \${area.toFixed(1)}\` }
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
`;

const coordinateViewer = `import React, { useEffect, useRef } from 'react';
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
      
      const p1Str = \`(\${p1.position[0].toFixed(1)}, \${p1.position[1].toFixed(1)})\`;
      const p2Str = \`(\${p2.position[0].toFixed(1)}, \${p2.position[1].toFixed(1)})\`;
      
      let slopeStr = 'm = \\\\infty';
      let subStr = '';
      if (eq.slope !== Infinity) {
        slopeStr = \`m = \${eq.slope.toFixed(2)}\`;
        subStr = \`m = \\\\frac{\${p2.position[1].toFixed(1)} - \${p1.position[1].toFixed(1)}}{\${p2.position[0].toFixed(1)} - \${p1.position[0].toFixed(1)}}\`;
      }
      
      store.setComputedStats([
        { label: 'Coordinates', answer: \`A: \${p1Str}, B: \${p2Str}\` },
        { label: 'Slope (m)', formula: 'm = \\\\frac{y_2 - y_1}{x_2 - x_1}', substitution: subStr, answer: slopeStr },
        { label: 'Equation of Line', formula: 'y = mx + b', answer: eq.text },
        { label: 'Distance', formula: 'd = \\\\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}', answer: \`d = \${d.toFixed(2)}\` }
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
`;

fs.writeFileSync(path.join(dir, 'CircleViewer.tsx'), circleViewer);
fs.writeFileSync(path.join(dir, 'PolygonViewer.tsx'), polygonViewer);
fs.writeFileSync(path.join(dir, 'CoordinateViewer.tsx'), coordinateViewer);

console.log('Created 6B Viewers.');
