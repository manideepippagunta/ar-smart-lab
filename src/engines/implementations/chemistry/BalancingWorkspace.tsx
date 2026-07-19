import React from 'react';
import { useChemistryStore } from './useChemistryStore';
import { CheckCircle, AlertCircle, Plus, Minus } from 'lucide-react';

export const BalancingWorkspace: React.FC = () => {
  const { params, updateParam } = useChemistryStore();
  const { coefA = 2, coefB = 1, coefC = 2 } = params;

  const hReactants = coefA * 2;
  const oReactants = coefB * 2;
  const hProducts = coefC * 2;
  const oProducts = coefC * 1;

  const isBalanced = hReactants === hProducts && oReactants === oProducts;

  const renderStepper = (key: 'coefA' | 'coefB' | 'coefC', label: string, val: number) => (
    <div key={key} className="flex flex-col items-center bg-slate-900 p-3 rounded-xl border border-slate-800">
      <span className="text-xs font-bold text-slate-400 mb-1">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateParam(key, Math.max(1, val - 1))}
          className="p-1 bg-slate-800 hover:bg-slate-700 text-white rounded transition"
        >
          <Minus size={14} />
        </button>
        <span className="text-xl font-black text-blue-400 font-mono w-6 text-center">{val}</span>
        <button
          onClick={() => updateParam(key, Math.min(10, val + 1))}
          className="p-1 bg-slate-800 hover:bg-slate-700 text-white rounded transition"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
      {/* Header Status */}
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          STOICHIOMETRIC EQUATION BALANCER
        </span>
        <div className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 border ${
          isBalanced ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
        }`}>
          {isBalanced ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {isBalanced ? 'EQUATION BALANCED' : 'UNBALANCED'}
        </div>
      </div>

      {/* Main Chemical Equation Stepper Display */}
      <div className="my-auto bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-center gap-4 text-center">
        <div className="flex items-center gap-2">
          {renderStepper('coefA', 'a (H₂)', coefA)}
          <span className="text-2xl font-black text-slate-200">H₂</span>
        </div>

        <span className="text-2xl font-black text-slate-400">+</span>

        <div className="flex items-center gap-2">
          {renderStepper('coefB', 'b (O₂)', coefB)}
          <span className="text-2xl font-black text-slate-200">O₂</span>
        </div>

        <span className="text-2xl font-black text-slate-400">⟶</span>

        <div className="flex items-center gap-2">
          {renderStepper('coefC', 'c (H₂O)', coefC)}
          <span className="text-2xl font-black text-slate-200">H₂O</span>
        </div>
      </div>

      {/* Live Atom Count Tally Comparison */}
      <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Reactant Side (Left)</div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-sky-400">Hydrogen (H):</span>
            <span className="font-mono text-white">{hReactants} atoms</span>
          </div>
          <div className="flex justify-between text-xs font-bold mt-1">
            <span className="text-red-400">Oxygen (O):</span>
            <span className="font-mono text-white">{oReactants} atoms</span>
          </div>
        </div>

        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Product Side (Right)</div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-sky-400">Hydrogen (H):</span>
            <span className="font-mono text-white">{hProducts} atoms</span>
          </div>
          <div className="flex justify-between text-xs font-bold mt-1">
            <span className="text-red-400">Oxygen (O):</span>
            <span className="font-mono text-white">{oProducts} atoms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
