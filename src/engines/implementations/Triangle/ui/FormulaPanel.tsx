import { useTriangleStore } from '../store';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export const FormulaPanel = () => {
  const math = useTriangleStore(state => state.math);

  return (
    <div className="absolute top-4 right-72 z-10 w-80 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-2xl p-4 text-white">
      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
        Live Calculations
      </h3>
      
      <div className="space-y-4">
        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">Perimeter</div>
          <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
            <BlockMath math={`P = a + b + c`} />
            <BlockMath math={`P = ${math.a.toFixed(1)} + ${math.b.toFixed(1)} + ${math.c.toFixed(1)}`} />
            <BlockMath math={`P = ${math.perimeter.toFixed(1)}`} />
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-400 font-semibold mb-1">Area (Heron's Formula)</div>
          <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50 overflow-x-auto">
            <BlockMath math={`s = \\frac{P}{2} = ${(math.perimeter / 2).toFixed(1)}`} />
            <BlockMath math={`A = \\sqrt{s(s-a)(s-b)(s-c)}`} />
            <BlockMath math={`A = ${math.area.toFixed(1)}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
