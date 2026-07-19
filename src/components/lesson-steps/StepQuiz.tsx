import { useState, useEffect } from 'react';
import { useLessonStore } from '../../store/LessonStore';
import { HelpCircle } from 'lucide-react';

export const StepQuiz = ({ onNext }: any) => {
  const revealLevel = useLessonStore((state) => state.revealLevel);
  const [selected, setSelected] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSelect = (i: number) => { if (!submitted) setSelected(i); }
  const handleSubmit = () => setSubmitted(true);

  useEffect(() => {
    if (revealLevel === 3) {
      setSelected(2);
      setSubmitted(true);
    }
  }, [revealLevel]);
  
  return (
    <div className="w-full h-full flex flex-col max-w-3xl mx-auto py-12 px-4">
      <div className="text-sm text-blue-600 font-bold tracking-wider mb-2 uppercase">Question 1 of 1</div>
      <h2 className="text-2xl font-bold mb-8 text-slate-900">Which triangle has all three sides equal?</h2>
      
      {/* Dynamic Hints */}
      {revealLevel === 1 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-slate-700 text-sm">
          <HelpCircle size={18} className="text-blue-600 shrink-0" />
          <span><strong className="text-blue-700">Hint 1:</strong> Look at the prefix. "Equi" is Latin for equal or level.</span>
        </div>
      )}
      {revealLevel === 2 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-3 text-slate-700 text-sm">
          <HelpCircle size={18} className="text-blue-600 shrink-0" />
          <span><strong className="text-blue-700">Hint 2:</strong> In this triangle, all internal angles are exactly 60 degrees.</span>
        </div>
      )}

      <div className="space-y-4 flex-1">
        {['Isosceles', 'Scalene', 'Equilateral', 'Right'].map((opt, i) => {
          let stateClass = 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700';
          if (selected === i && !submitted) stateClass = 'bg-blue-50 border-blue-400 text-slate-900 font-semibold';
          if ((submitted || revealLevel === 3) && i === 2) {
            stateClass = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
          }
          if (submitted && selected === i && i !== 2) {
            stateClass = 'bg-red-50 border-red-400 text-red-700 font-semibold';
          }
          
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left p-5 rounded-2xl border-2 text-base transition-all duration-150 ${stateClass}`}
            >
              {opt}
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex justify-end gap-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selected === -1}
            className="px-8 py-3 bg-blue-600 disabled:bg-slate-100 disabled:text-slate-400 disabled:border disabled:border-slate-200 text-white rounded-xl font-bold transition-all shadow-sm"
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={onNext}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(37,99,235,0.25)]"
          >
            Finish Module
          </button>
        )}
      </div>
    </div>
  );
};
