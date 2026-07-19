import { Grid, Line } from '@react-three/drei';

export const CartesianGrid = ({ showGrid = true }: { showGrid?: boolean }) => {
  if (!showGrid) return null;

  return (
    <group position={[0, 0, -0.01]}>
      <Grid 
        args={[100, 100]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#334155" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#475569" 
        fadeDistance={50} 
      />
      {/* Bold X Axis */}
      <Line points={[[-50, 0, 0.01], [50, 0, 0.01]]} color="#94a3b8" lineWidth={3} />
      {/* Bold Y Axis */}
      <Line points={[[0, -50, 0.01], [0, 50, 0.01]]} color="#94a3b8" lineWidth={3} />
    </group>
  );
};
