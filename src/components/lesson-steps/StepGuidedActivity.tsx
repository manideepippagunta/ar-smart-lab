import { useState, useEffect } from 'react';
import { EngineLoader } from '../../engines/core/EngineLoader';
import { useEngineAdapterStore } from '../../engines/core/EngineAdapterStore';
import { CheckCircle2, Circle } from 'lucide-react';

export const StepGuidedActivity = ({ lesson, onNext }: any) => {
  const adapter = useEngineAdapterStore(state => state.adapter);
  
  const defaultTasks = [
    { id: 't1', instruction: 'Create an Equilateral Triangle', validationKey: 'isEquilateral' },
    { id: 't2', instruction: 'Create a Right Triangle', validationKey: 'isRight' },
    { id: 't3', instruction: 'Create an Obtuse Triangle', validationKey: 'isObtuse' }
  ];
  
  const tasks = lesson?.steps?.guidedActivity?.tasks || defaultTasks;
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!adapter) return;
    
    const interval = setInterval(() => {
      let newCompleted = { ...completed };
      let changed = false;
      
      tasks.forEach((t: any) => {
        if (!newCompleted[t.id]) {
          if (adapter.isCompleted(t.validationKey)) {
            newCompleted[t.id] = true;
            changed = true;
          }
        }
      });
      
      if (changed) setCompleted(newCompleted);
    }, 500);

    return () => clearInterval(interval);
  }, [adapter, completed, tasks]);

  const allCompleted = tasks.every((t: any) => completed[t.id]);

  return (
    <div className="w-full h-full flex flex-col relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div className="flex-1 w-full h-full relative">
        <EngineLoader />
      </div>

      <div className="absolute top-4 left-4 z-20 w-80 pointer-events-none">
        <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 pointer-events-auto">
          <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">Guided Activity</h3>
          
          <div className="space-y-3">
            {tasks.map((t: any) => (
              <div key={t.id} className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${completed[t.id] ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'}`}>
                {completed[t.id]
                  ? <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
                  : <Circle className="text-slate-400 shrink-0" size={18} />
                }
                <span className={`text-sm font-medium ${completed[t.id] ? 'text-emerald-700 line-through opacity-70' : 'text-slate-700'}`}>
                  {t.instruction}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              onClick={onNext}
              disabled={!allCompleted}
              className={`px-4 py-2 rounded-lg font-bold shadow-sm transition text-sm ${
                allCompleted 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
