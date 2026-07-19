import { useEffect, useRef } from 'react';
import { useTriangleStore } from '../store';
import { InlineMath } from 'react-katex';
import { useVoiceAdapter } from '../../../hooks/adapters';

export const PropertiesPanel = () => {
  const math = useTriangleStore(state => state.math);
  const voice = useVoiceAdapter();
  
  const prevSides = useRef(math.classification.sides);
  const prevAngles = useRef(math.classification.angles);
  
  const changed = prevSides.current !== math.classification.sides || prevAngles.current !== math.classification.angles;

  useEffect(() => {
    prevSides.current = math.classification.sides;
    prevAngles.current = math.classification.angles;
  }, [math.classification.sides, math.classification.angles]);

  const handleExplain = () => {
    let explanation = `This is a ${math.classification.sides}, ${math.classification.angles} triangle. `;
    if (math.classification.sides === 'Equilateral') explanation += "All three sides are equal.";
    else if (math.classification.sides === 'Isosceles') explanation += "Two sides are equal.";
    else explanation += "All sides have different lengths.";
    
    if (math.classification.angles === 'Right') explanation += " It has one right angle of 90 degrees.";
    else if (math.classification.angles === 'Obtuse') explanation += " One angle is greater than 90 degrees.";
    else explanation += " All angles are less than 90 degrees.";
    
    voice.speak(explanation);
  };

  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-2xl p-4 text-white">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Properties</h3>
        {changed && (
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className={`p-2 rounded-lg transition-colors ${changed ? 'bg-blue-900/50 border border-blue-500/50' : 'bg-slate-900/50 border border-slate-700/50'}`}>
          <div className="text-xs text-slate-400 font-semibold mb-1">Classification</div>
          <div className="text-sm font-bold text-blue-400 flex flex-col gap-1">
            <span>{math.classification.sides}</span>
            <span>{math.classification.angles}</span>
          </div>
          <button 
            onClick={handleExplain}
            className="mt-2 w-full px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold transition"
          >
            Explain
          </button>
        </div>

        <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
          <div className="text-xs text-slate-400 font-semibold mb-1">Angles</div>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span>A: <InlineMath math={`${math.angleA.toFixed(1)}^\\circ`} /></span>
            <span>B: <InlineMath math={`${math.angleB.toFixed(1)}^\\circ`} /></span>
            <span className="col-span-2">C: <InlineMath math={`${math.angleC.toFixed(1)}^\\circ`} /></span>
          </div>
        </div>

        <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
          <div className="text-xs text-slate-400 font-semibold mb-1">Sides</div>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span>a: {math.a.toFixed(1)}</span>
            <span>b: {math.b.toFixed(1)}</span>
            <span className="col-span-2">c: {math.c.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
