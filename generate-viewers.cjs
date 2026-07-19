const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'engines', 'implementations', 'geometry', 'viewers');

const base = `import React, { useEffect, useRef } from 'react';
import { useGeometryStore } from '../../../shared/geometry/store/useGeometryStore';
import { DraggablePoint } from '../../../shared/geometry/components/DraggablePoint';
import { LineSegment } from '../../../shared/geometry/components/LineSegment';
import { RayMesh } from '../../../shared/geometry/components/RayMesh';
import { InfiniteLine } from '../../../shared/geometry/components/InfiniteLine';
import { AngleArc } from '../../../shared/geometry/components/AngleArc';

`;

const viewers = {
  'PointsViewer': `
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
`,

  'LinesViewer': `
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
`,

  'SegmentsViewer': `
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
`,

  'RaysViewer': `
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
`,

  'AnglesViewer': `
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
`,

  'ParallelLinesViewer': `
export default function ParallelLinesViewer() {
  const store = useGeometryStore();
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      store.reset();
      store.addPoint({ id: 'p1', position: [-2, 1, 0], label: 'A' });
      store.addPoint({ id: 'p2', position: [2, 1, 0], label: 'B' });
      store.addPoint({ id: 'p3', position: [-2, -1, 0], label: 'C' });
      store.addPoint({ id: 'p4', position: [2, -1, 0], label: 'D' });
      
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
`,

  'IntersectingLinesViewer': `
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
`
};

for (const [name, content] of Object.entries(viewers)) {
  fs.writeFileSync(path.join(dir, name + '.tsx'), base + content);
}
console.log('Generated all 7 viewers for Phase 6A.');
