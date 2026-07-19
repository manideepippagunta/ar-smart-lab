import { useMemo } from 'react';
import * as THREE from 'three';
import { useGeometryStore } from '../store/useGeometryStore';
import { Line } from '@react-three/drei';

export const PolygonMesh = ({ polygonId }: { polygonId: string }) => {
  const polygon = useGeometryStore(state => state.data.polygons[polygonId]);
  const pointsData = useGeometryStore(state => state.data.points);
  const isSelected = useGeometryStore(state => state.selectedIds.includes(polygonId));

  const pts = useMemo(() => {
    if (!polygon || polygon.pointIds.length < 3) return [];
    return polygon.pointIds.map(id => pointsData[id]).filter(p => p !== undefined);
  }, [polygon, pointsData]);

  const geometry = useMemo(() => {
    if (pts.length < 3) return null;
    const geo = new THREE.BufferGeometry();
    const vertices = [];
    
    // Simple triangulation for convex polygons (triangle fan from first point)
    // Real shoelace triangulation (ear clipping) would be needed for complex concaves,
    // but for simple drag logic, triangle fan from centroid or point 0 is often okay for demo.
    // For educational geometry MVP, fan from p[0] works for convex.
    const p0 = pts[0].position;
    for (let i = 1; i < pts.length - 1; i++) {
      const p1 = pts[i].position;
      const p2 = pts[i+1].position;
      vertices.push(...p0, ...p1, ...p2);
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geo.computeVertexNormals();
    return geo;
  }, [pts]);

  if (!polygon || pts.length < 3 || !geometry) return null;

  const color = isSelected ? '#ffffff' : (polygon.color || '#10b981');
  
  // Closed loop of line segments for the border
  const linePoints = [...pts.map(p => p.position), pts[0].position];

  return (
    <group>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <Line points={linePoints} color={color} lineWidth={isSelected ? 4 : 2} />
    </group>
  );
};
