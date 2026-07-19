import { useGeometryStore } from '../store/useGeometryStore';
import { InlineMath } from 'react-katex';

export const PropertiesPanel = () => {
  const stats = useGeometryStore(state => state.computedStats);

  if (stats.length === 0) return null;

  return (
    <div className="absolute top-4 right-4 z-10 w-64 bg-slate-800/90 backdrop-blur rounded-xl border border-white/10 shadow-2xl p-4 text-white">
      <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Properties</h3>
      </div>

      <div className="space-y-3">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/50 p-2 rounded-lg border border-slate-700/50">
            <div className="text-xs text-slate-400 font-semibold mb-1">{stat.label}</div>
            <div className="text-sm font-bold text-blue-400">
              <InlineMath math={stat.answer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
