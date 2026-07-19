import React from 'react';
import { usePhysicsStore } from './usePhysicsStore';
import { calculatePhysics } from './physicsMath';
import { BlockMath } from 'react-katex';

interface PhysicsFormulaPanelProps {
  presentationMode?: boolean;
}

export const PhysicsFormulaPanel: React.FC<PhysicsFormulaPanelProps> = ({ presentationMode = false }) => {
  const { activeTopic, params, simTime } = usePhysicsStore();
  const { steps } = calculatePhysics(activeTopic, params, simTime > 0 ? simTime : 2);

  if (steps.length === 0) return null;

  return (
    <div className={`w-full max-w-md bg-slate-900/90 backdrop-blur rounded-2xl border border-slate-800 p-4 shadow-2xl ${presentationMode ? 'scale-105 border-blue-500/40' : ''}`}>
      <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 mb-3 flex items-center justify-between">
        <span>Physics KaTeX Step Solver</span>
        <span className="text-[10px] text-blue-400 font-mono">Formula → Substitution → Answer</span>
      </h3>

      <div className="space-y-4 max-h-[380px] overflow-y-auto scrollbar-hide pr-1">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{step.label}</span>
            </div>

            {/* Formula */}
            {step.formula && (
              <div className="text-xs text-blue-300 bg-slate-900/60 p-1.5 rounded border border-slate-800 overflow-x-auto">
                <BlockMath math={step.formula} />
              </div>
            )}

            {/* Substitution */}
            {step.substitution && (
              <div className="text-xs text-amber-300 bg-slate-900/60 p-1.5 rounded border border-slate-800 overflow-x-auto">
                <BlockMath math={step.substitution} />
              </div>
            )}

            {/* Answer */}
            <div className="text-sm font-bold text-emerald-400 bg-slate-900/80 p-2 rounded border border-emerald-500/20 overflow-x-auto">
              <BlockMath math={step.answer} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
