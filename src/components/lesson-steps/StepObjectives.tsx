import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export const StepObjectives = ({ onNext }: any) => {
  const objectives = [
    "Identify different types of triangles based on side lengths.",
    "Identify different types of triangles based on internal angles.",
    "Understand how to calculate the area using Heron's Formula.",
    "Understand the centroid, incenter, and circumcenter."
  ];

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  
  const allChecked = objectives.every((_, i) => checked[i]);

  const toggle = (i: number) => setChecked(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="w-full h-full flex flex-col max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">Learning Objectives</h2>
      <p className="text-slate-500 mb-10 text-base font-medium leading-relaxed">
        By the end of this lesson, you will be able to master the following concepts. Check them off as you are ready to begin!
      </p>

      <div className="flex-1 space-y-4">
        {objectives.map((obj, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => toggle(i)}
            className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-200 flex items-center gap-5 ${
              checked[i]
                ? 'bg-blue-50 border-blue-300 shadow-sm'
                : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <div className="shrink-0 transition-transform group-hover:scale-110 group-active:scale-95">
              {checked[i] ? (
                <CheckCircle2 size={28} className="text-blue-600" />
              ) : (
                <Circle size={28} className="text-slate-300 group-hover:text-slate-400" />
              )}
            </div>
            <div className={`text-base font-medium transition-colors ${checked[i] ? 'text-slate-900' : 'text-slate-700'}`}>
              {obj}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={onNext}
          disabled={!allChecked}
          className={`px-8 py-3 rounded-2xl font-bold text-base shadow-sm transition-all ${
            allChecked 
              ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95 shadow-[0_4px_14px_rgba(37,99,235,0.25)]' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
          }`}
        >
          I am ready
        </button>
      </div>
    </div>
  );
};
