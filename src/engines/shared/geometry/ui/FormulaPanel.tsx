import { useGeometryStore } from '../store/useGeometryStore';
import { BlockMath } from 'react-katex';

export const FormulaPanel = () => {
  const stats = useGeometryStore(state => state.computedStats);

  if (stats.length === 0) return null;

  return (
    <div className="absolute top-4 right-72 z-10 w-80 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-2xl p-4 text-white">
      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider border-b border-white/10 pb-2">
        Live Calculations
      </h3>
      
      <div className="space-y-4 max-h-[60vh] overflow-y-auto scrollbar-hide pr-2">
        {stats.map((stat, idx) => (
          <div key={idx}>
            <div className="text-xs text-slate-400 font-semibold mb-1">{stat.label}</div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 overflow-x-auto text-sm">
              {stat.formula && <BlockMath math={stat.formula} />}
              {stat.substitution && <BlockMath math={stat.substitution} />}
              <BlockMath math={stat.answer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
