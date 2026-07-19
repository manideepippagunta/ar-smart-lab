const fs = require('fs');
const path = require('path');

const steps = [
  "StepIntro",
  "StepObjectives",
  "StepTheory",
  "StepExploration",
  "StepGuidedActivity",
  "StepObservation",
  "StepRealWorld",
  "StepPractice",
  "StepQuiz",
  "StepSummary",
  "StepComplete"
];

const dir = path.join(__dirname, 'src', 'components', 'lesson-steps');

steps.forEach(step => {
  const code = `import React from 'react';

export const ${step} = ({ lesson, onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">${step.replace('Step', '')}</h2>
      <div className="flex-1 bg-slate-900/50 rounded-2xl border border-white/10 p-6 backdrop-blur">
        <p className="text-slate-400">Content for ${step}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <button 
          onClick={onNext}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};
`;
  fs.writeFileSync(path.join(dir, `${step}.tsx`), code);
});

console.log('Created 11 step placeholders.');
