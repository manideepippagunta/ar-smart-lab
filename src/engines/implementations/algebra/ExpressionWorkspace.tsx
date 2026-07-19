import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgebraStore } from './useAlgebraStore';
import { AlgebraTileChip, TilePicker } from './AlgebraTile';
import { BlockMath } from 'react-katex';
import { InlineMath } from 'react-katex';
import { simplifyExpression, termsToLatex } from './algebraMath';
import { Trash2, Play } from 'lucide-react';

export const ExpressionWorkspace = () => {
  const { tiles, addTile, removeTile } = useAlgebraStore();
  const [simplified, setSimplified] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  const workspaceTiles = tiles.filter(t => t.side === 'left');

  const handleSimplify = () => {
    const terms = workspaceTiles.map(t => {
      if (t.type === 'pos_x') return { coefficient: 1, variable: 'x', power: 1 };
      if (t.type === 'neg_x') return { coefficient: -1, variable: 'x', power: 1 };
      if (t.type === 'pos_x2') return { coefficient: 1, variable: 'x', power: 2 };
      if (t.type === 'neg_x2') return { coefficient: -1, variable: 'x', power: 2 };
      if (t.type === 'pos_1') return { coefficient: 1, variable: null, power: 0 };
      return { coefficient: -1, variable: null, power: 0 };
    });

    const { simplified: result, latexSteps } = simplifyExpression(terms as any);
    setSimplified(termsToLatex(result));
    setSteps(latexSteps);
  };

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Tile Picker */}
      <div className="shrink-0">
        <TilePicker onPick={(type) => addTile(type, 'left')} activeSide="left" />
      </div>

      {/* Workspace */}
      <div className="flex-1 flex flex-col gap-5">
        <div className="text-sm font-bold text-slate-300">Expression Workspace</div>
        
        {/* Tile Drop Area */}
        <div className="min-h-32 border-2 border-dashed border-white/10 hover:border-blue-500/40 rounded-2xl p-4 flex flex-wrap gap-3 bg-slate-900/30 transition">
          <AnimatePresence>
            {workspaceTiles.map(t => (
              <AlgebraTileChip key={t.id} type={t.type} id={t.id} onRemove={removeTile} />
            ))}
          </AnimatePresence>
          {workspaceTiles.length === 0 && (
            <div className="text-slate-600 text-sm font-medium m-auto text-center">
              Click tiles from the picker to build an expression
            </div>
          )}
        </div>

        {/* Expression Display */}
        {workspaceTiles.length > 0 && (
          <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4">
            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Your Expression</div>
            <div className="text-xl overflow-x-auto">
              <InlineMath
                math={workspaceTiles.map(t => {
                  if (t.type === 'pos_x') return 'x';
                  if (t.type === 'neg_x') return '-x';
                  if (t.type === 'pos_x2') return 'x^2';
                  if (t.type === 'neg_x2') return '-x^2';
                  if (t.type === 'pos_1') return '+1';
                  return '-1';
                }).join(' ')}
              />
            </div>
          </div>
        )}

        {/* Simplify Button */}
        <div className="flex gap-3">
          <button
            onClick={handleSimplify}
            disabled={workspaceTiles.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-sm transition"
          >
            <Play size={14} /> Simplify
          </button>
          <button
            onClick={() => workspaceTiles.forEach(t => removeTile(t.id))}
            className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition"
          >
            <Trash2 size={14} /> Clear
          </button>
        </div>

        {/* Simplification Result */}
        <AnimatePresence>
          {steps.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Simplification Steps</div>
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                  className="bg-slate-900/60 border border-white/5 rounded-xl p-3 overflow-x-auto"
                >
                  <BlockMath math={step} />
                </motion.div>
              ))}

              {simplified && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: steps.length * 0.15 }}
                  className="bg-emerald-900/30 border border-emerald-500/30 rounded-xl p-4 overflow-x-auto"
                >
                  <div className="text-xs text-emerald-400 font-bold mb-2">Simplified Result</div>
                  <BlockMath math={`= ${simplified}`} />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
