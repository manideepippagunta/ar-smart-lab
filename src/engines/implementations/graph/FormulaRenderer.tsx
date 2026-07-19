import { useGraphStore } from './useGraphStore';
import { BlockMath } from 'react-katex';
import {
  computeDistanceStep,
  computeMidpointStep,
  computeSlopeStep,
  computeEquationStep
} from './graphMath';
import type { CalculationStep } from './graphMath';

export const FormulaRenderer = () => {
  const { points, selectedIds, elements } = useGraphStore();

  // Find points to perform math on
  // 1. If points are explicitly selected, use those.
  // 2. Otherwise if an element (like a segment/line/vector) is selected, use its endpoints.
  // 3. Otherwise fall back to the first two points in the system.
  let p1 = points[0];
  let p2 = points[1];

  const selectedPoints = points.filter(p => selectedIds.includes(p.id));
  if (selectedPoints.length >= 2) {
    p1 = selectedPoints[0];
    p2 = selectedPoints[1];
  } else {
    const selectedEl = elements.find(el => selectedIds.includes(el.id));
    if (selectedEl) {
      const startPt = points.find(p => p.id === selectedEl.p1Id);
      const endPt = points.find(p => p.id === selectedEl.p2Id);
      if (startPt && endPt) {
        p1 = startPt;
        p2 = endPt;
      }
    }
  }

  if (!p1 || !p2) {
    return (
      <div className="bg-slate-800/90 border border-white/10 p-4 rounded-2xl shadow-xl text-center text-xs text-slate-400">
        Plot or select at least 2 points to view formula calculations.
      </div>
    );
  }

  // Calculate all steps
  const steps: CalculationStep[] = [
    computeDistanceStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y),
    computeMidpointStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y),
    computeSlopeStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y),
    computeEquationStep(p1.label, p1.x, p1.y, p2.label, p2.x, p2.y)
  ];

  return (
    <div className="bg-slate-900/95 border border-white/10 p-4 rounded-3xl shadow-2xl text-white flex flex-col gap-4 max-h-[60vh] overflow-y-auto scrollbar-hide">
      <div className="border-b border-white/10 pb-2 flex justify-between items-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Formula Analysis</h3>
        <span className="text-[10px] bg-blue-600/30 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
          Active: {p1.label}({p1.x.toFixed(0)}, {p1.y.toFixed(0)}) & {p2.label}({p2.x.toFixed(0)}, {p2.y.toFixed(0)})
        </span>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="p-3 bg-slate-950/60 border border-white/5 rounded-2xl">
            <div className="text-xs text-indigo-400 font-extrabold mb-2 uppercase tracking-wide">
              {step.label}
            </div>
            
            <div className="flex flex-col gap-3 font-mono text-xs text-slate-300">
              {/* Formula Step */}
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 w-16">Formula:</span>
                <div className="overflow-x-auto scrollbar-hide flex-1"><BlockMath math={step.formula} /></div>
              </div>

              {/* Substitution Step */}
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 w-16">Subst:</span>
                <div className="overflow-x-auto scrollbar-hide flex-1"><BlockMath math={step.substitution} /></div>
              </div>

              {/* Calculation Step */}
              <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-1.5 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0 w-16">Calc:</span>
                <div className="overflow-x-auto scrollbar-hide flex-1"><BlockMath math={step.calculation} /></div>
              </div>

              {/* Answer Step */}
              <div className="flex items-center gap-1.5 bg-blue-900/20 border border-blue-500/20 px-2 py-1.5 rounded-xl text-blue-400">
                <span className="text-[10px] text-blue-500 font-bold uppercase shrink-0 w-16">Answer:</span>
                <div className="overflow-x-auto scrollbar-hide flex-1 font-bold text-sm"><BlockMath math={step.answer} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
