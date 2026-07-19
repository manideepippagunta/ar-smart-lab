import { forwardRef, useImperativeHandle, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BaseEngine } from '../../core/BaseEngine';
import type { EngineProps, EngineImperativeAPI } from '../../core/types';
import { useEngineAdapterStore } from '../../core/EngineAdapterStore';
import { useAlgebraStore } from './useAlgebraStore';
import type { AlgebraMode } from './useAlgebraStore';
import { useGeometryStore } from '../../shared/geometry/store/useGeometryStore';
import { BalanceScale } from './BalanceScale';
import { StepBySolver } from './StepBySolver';
import { ExpressionWorkspace } from './ExpressionWorkspace';
import { PropertiesPanel } from '../../shared/geometry/ui/PropertiesPanel';
import { FormulaPanel } from '../../shared/geometry/ui/FormulaPanel';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Scale, Calculator, Layers } from 'lucide-react';

const MODE_TABS: { id: AlgebraMode; label: string; icon: ReactNode }[] = [
  { id: 'balance',    label: 'Balance Scale', icon: <Scale size={14} /> },
  { id: 'solve',      label: 'Step-by-Step',  icon: <Calculator size={14} /> },
  { id: 'simplify',   label: 'Simplify',      icon: <Layers size={14} /> },
  { id: 'variables',  label: 'Explore',       icon: <BookOpen size={14} /> },
];

export const AlgebraEngine = forwardRef<EngineImperativeAPI, EngineProps>((props, ref) => {
  const setAdapter = useEngineAdapterStore(s => s.setAdapter);
  const setComputedStats = useGeometryStore(s => s.setComputedStats);
  const {
    mode, setMode, expression, setExpression,
    steps, currentStep, isSolved, leftValue, rightValue,
    mistakeCount, attemptCount, currentHint, reset
  } = useAlgebraStore();

  // Read config from lesson JSON
  const config = (props.lesson as any)?.engineConfig || {};
  const initialMode: AlgebraMode = config.mode || 'balance';
  const initialExpression: string = config.expression || '2x + 4 = 10';

  useEffect(() => {
    setMode(initialMode);
    setExpression(initialExpression);
  }, [initialMode, initialExpression, setMode, setExpression]);

  // Publish live stats to Formula/Properties panels
  useEffect(() => {
    if (mode === 'balance') {
      setComputedStats([
        { label: 'Left Side',  answer: `L = ${leftValue}` },
        { label: 'Right Side', answer: `R = ${rightValue}` },
        { label: 'Difference', answer: `\\Delta = ${Math.abs(leftValue - rightValue)}` },
        { label: 'Balance',    answer: leftValue === rightValue ? '\\checkmark \\text{ Balanced}' : '\\times \\text{ Not balanced}' },
      ]);
    } else if (mode === 'solve') {
      const step = steps[currentStep];
      if (step) {
        setComputedStats([
          { label: 'Expression',  formula: expression, answer: expression },
          { label: 'Current Step', answer: step.result },
          { label: 'Attempt Count', answer: `\\text{${attemptCount} attempts}` },
          { label: 'Status', answer: isSolved ? '\\checkmark \\text{ Solved}' : `\\text{Step } ${currentStep + 1} \\text{ of } ${steps.length}` },
        ]);
      }
    } else {
      setComputedStats([
        { label: 'Expression', answer: expression.replace(/\s/g, '\\,') },
        { label: 'Mistakes',   answer: `\\text{${mistakeCount}}` },
        { label: 'Hints Used', answer: `\\text{${currentHint}}` },
      ]);
    }
  }, [mode, leftValue, rightValue, steps, currentStep, isSolved, expression, mistakeCount, attemptCount, currentHint, setComputedStats]);

  // Register engine adapter
  useEffect(() => {
    setAdapter({
      getState: () => useAlgebraStore.getState(),
      getProgress: () => isSolved ? 100 : Math.round((currentStep / Math.max(steps.length, 1)) * 100),
      isCompleted: (key: string) => {
        const state = useAlgebraStore.getState();
        if (key === 'isSolved') return state.isSolved;
        if (key === 'isBalanced') return state.leftValue === state.rightValue;
        if (key === 'noMistakes') return state.mistakeCount === 0;
        return false;
      },
      reset: () => reset(mode),
      getMeasurements: () => ({ leftValue, rightValue, expression }),
      getProperties: () => ({ mode, isSolved, mistakeCount, currentHint }),
    });
    return () => setAdapter(null as any);
  }, [setAdapter, mode, isSolved, leftValue, rightValue, steps.length, currentStep, mistakeCount, currentHint, expression, reset]);

  useImperativeHandle(ref, () => ({
    reset: () => reset(mode),
    focus: () => {},
    export: () => JSON.stringify(useAlgebraStore.getState()),
    captureScreenshot: () => {
      const canvas = document.querySelector('canvas');
      return canvas ? canvas.toDataURL('image/png') : '';
    },
  }));

  const renderActivePanel = () => {
    switch (mode) {
      case 'balance':    return <BalanceScale />;
      case 'solve':      return <StepBySolver />;
      case 'simplify':   return <ExpressionWorkspace />;
      case 'variables':  return <ExpressionWorkspace />;
      default:           return <BalanceScale />;
    }
  };

  return (
    <>
      <PropertiesPanel />
      <FormulaPanel />

      <BaseEngine {...props} surface="html" ref={undefined}>
        <div className="w-full h-full flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1 px-5 py-3 border-b border-white/5 bg-slate-900/60 backdrop-blur shrink-0">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mr-3">Algebra</div>
            {MODE_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setMode(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  mode === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}

            {/* Live expression editor */}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold">Equation:</span>
              <input
                type="text"
                value={expression}
                onChange={(e) => setExpression(e.target.value)}
                className="bg-slate-800/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-mono w-40 focus:outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          {/* Objective Banner */}
          <div className="px-5 py-2 border-b border-white/5 bg-indigo-900/20 text-indigo-300 text-xs font-semibold shrink-0">
            {useAlgebraStore(s => s.currentObjective)}
          </div>

          {/* Active Panel */}
          <div className="flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                {renderActivePanel()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </BaseEngine>
    </>
  );
});

AlgebraEngine.displayName = 'AlgebraEngine';
export default AlgebraEngine;
