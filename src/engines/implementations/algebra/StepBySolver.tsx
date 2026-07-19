import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgebraStore } from './useAlgebraStore';
import { BlockMath } from 'react-katex';
import { InlineMath } from 'react-katex';
import { solveLinear } from './algebraMath';
import { ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { explainMistake } from './algebraMath';

export const StepBySolver = () => {
  const { expression, steps, currentStep, isSolved, setSteps, nextStep, currentHint, advanceHint } = useAlgebraStore();
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const recordMistake = useAlgebraStore(store => store.recordMistake);

  useEffect(() => {
    // Auto-generate steps from the expression
    try {
      const generatedSteps = solveLinear(expression);
      setSteps(generatedSteps);
    } catch (e) {
      console.warn('Could not solve expression:', expression);
    }
  }, [expression, setSteps]);

  const handleCheckStep = () => {
    if (!steps[currentStep]) return;
    const expected = steps[currentStep].result.replace(/\s+/g, '');
    const answer = userInput.replace(/\s+/g, '');

    if (answer === expected || answer.toLowerCase().includes(expected.toLowerCase())) {
      setFeedback({ correct: true, message: 'Correct! Well done.' });
      setTimeout(() => {
        nextStep();
        setUserInput('');
        setFeedback(null);
      }, 1500);
    } else {
      const explanation = explainMistake(userInput, expression);
      recordMistake(userInput, explanation);
      setFeedback({ correct: false, message: explanation });
    }
  };

  if (steps.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
        Loading solver...
      </div>
    );
  }

  const step = steps[currentStep];

  return (
    <div className="flex h-full gap-6 p-6">
      {/* Steps Progress Sidebar */}
      <div className="w-56 shrink-0 space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Solution Steps</div>
        {steps.map((_, idx) => {
          const isDone = idx < currentStep;
          const isActive = idx === currentStep;
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                isActive ? 'bg-blue-600 text-white' :
                isDone ? 'bg-emerald-900/30 text-emerald-400' :
                'text-slate-500'
              }`}
            >
              {isDone ? <CheckCircle2 size={14} /> : <div className="w-4 h-4 rounded-full border-2 border-current shrink-0" />}
              <span className="truncate">Step {idx + 1}</span>
            </div>
          );
        })}
        {isSolved && (
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="mt-4 p-3 bg-emerald-900/30 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold text-center"
          >
            🎉 Solved!
          </motion.div>
        )}
      </div>

      {/* Active Step Content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Current equation */}
        <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-3">Current Equation</div>
          <div className="overflow-x-auto text-2xl">
            <BlockMath math={step.equation} />
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-slate-800/40 border border-white/5 rounded-2xl p-5">
          <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-2">What to Do</div>
          <p className="text-slate-300 font-medium leading-relaxed">{step.explanation}</p>
          {step.operation && (
            <div className="mt-3 text-sm text-blue-300 font-mono">
              Operation: <InlineMath math={step.operation} />
            </div>
          )}
        </div>

        {/* Hint Display */}
        {currentHint > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-4 text-indigo-300 text-sm"
          >
            <span className="font-bold text-indigo-400">Hint {currentHint}:</span>{' '}
            {currentHint === 1 ? 'Think about the inverse operation — what undoes the action applied to x?' :
             currentHint === 2 ? 'Apply the same operation to BOTH sides of the equation to keep it balanced.' :
             `The result is: ${step.result}`}
          </motion.div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className={`p-4 rounded-2xl flex items-start gap-3 text-sm font-medium ${
                feedback.correct
                  ? 'bg-emerald-900/40 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-900/30 border border-rose-500/30 text-rose-300'
              }`}
            >
              {feedback.correct ? <CheckCircle2 size={18} className="shrink-0 mt-0.5" /> : <AlertCircle size={18} className="shrink-0 mt-0.5" />}
              <span>{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer Input or Skip */}
        {!isSolved && (
          <div className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => { setUserInput(e.target.value); setFeedback(null); }}
              placeholder={`Enter the result after: ${step.operation || 'this operation'}`}
              className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition"
              onKeyDown={(e) => e.key === 'Enter' && handleCheckStep()}
            />
            <button
              onClick={handleCheckStep}
              disabled={!userInput}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-sm transition flex items-center gap-2"
            >
              Check <ChevronRight size={16} />
            </button>
            <button
              onClick={advanceHint}
              className="px-4 py-3 bg-indigo-900/40 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold text-sm transition"
            >
              Hint
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
