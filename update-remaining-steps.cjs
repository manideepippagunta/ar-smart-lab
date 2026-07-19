const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'lesson-steps');

const observation = `import React, { useState } from 'react';
export const StepObservation = ({ lesson, onNext }: any) => {
  const [notes, setNotes] = useState('');
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-4 text-white">Record Observations</h2>
      <p className="text-slate-400 mb-6">What did you notice when dragging the triangle to become obtuse?</p>
      <div className="flex-1">
        <textarea 
          className="w-full h-64 bg-slate-900/50 border border-white/10 rounded-2xl p-6 text-white text-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
          placeholder="Type your observations here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition">Continue</button>
      </div>
    </div>
  );
};
`;

const realWorld = `import React from 'react';
import { Camera } from 'lucide-react';
export const StepRealWorld = ({ lesson, onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-white">Real World Applications</h2>
      <div className="grid md:grid-cols-2 gap-6 flex-1">
        <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="h-48 bg-slate-800 flex items-center justify-center text-slate-600"><Camera size={48} /></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">Truss Bridges</h3>
            <p className="text-slate-400">Triangles are the strongest shape in architecture because any applied force is evenly distributed through its three sides.</p>
          </div>
        </div>
        <div className="bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="h-48 bg-slate-800 flex items-center justify-center text-slate-600"><Camera size={48} /></div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2">Navigation</h3>
            <p className="text-slate-400">GPS systems use triangulation, measuring the distance between three satellites, to pinpoint your exact location on Earth.</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition">Continue</button>
      </div>
    </div>
  );
};
`;

const practice = `import React from 'react';
export const StepPractice = ({ lesson, onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8 text-center justify-center">
      <h2 className="text-4xl font-bold mb-4 text-white">Practice Mode</h2>
      <p className="text-xl text-slate-400 mb-8">Let's solidify what we've learned.</p>
      <div><button onClick={onNext} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition text-lg">Start Quiz</button></div>
    </div>
  );
};
`;

const quiz = `import React, { useState } from 'react';
export const StepQuiz = ({ lesson, onNext }: any) => {
  const [selected, setSelected] = useState(-1);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSelect = (i) => { if (!submitted) setSelected(i); }
  const handleSubmit = () => setSubmitted(true);
  
  return (
    <div className="w-full h-full flex flex-col max-w-3xl mx-auto py-12">
      <div className="text-sm text-blue-400 font-bold tracking-wider mb-2 uppercase">Question 1 of 1</div>
      <h2 className="text-3xl font-bold mb-8 text-white">Which triangle has all three sides equal?</h2>
      <div className="space-y-4 flex-1">
        {['Isosceles', 'Scalene', 'Equilateral', 'Right'].map((opt, i) => {
          let stateClass = 'bg-slate-900/50 border-white/10 hover:bg-slate-800 text-slate-300';
          if (selected === i) stateClass = 'bg-blue-600/20 border-blue-500/50 text-white';
          if (submitted && i === 2) stateClass = 'bg-green-900/50 border-green-500/50 text-green-400';
          if (submitted && selected === i && i !== 2) stateClass = 'bg-red-900/50 border-red-500/50 text-red-400';
          
          return (
            <button key={i} onClick={() => handleSelect(i)} className={\`w-full text-left p-6 rounded-2xl border font-medium text-lg transition \${stateClass}\`}>
              {opt}
            </button>
          )
        })}
      </div>
      <div className="mt-8 flex justify-end gap-4">
        {!submitted ? (
          <button onClick={handleSubmit} disabled={selected === -1} className="px-8 py-3 bg-blue-600 disabled:bg-slate-700 text-white rounded-xl font-bold transition">Submit Answer</button>
        ) : (
          <button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition">Finish Module</button>
        )}
      </div>
    </div>
  );
};
`;

const summary = `import React from 'react';
export const StepSummary = ({ lesson, onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-12">
      <h2 className="text-4xl font-bold mb-8 text-white text-center">Summary</h2>
      <div className="bg-slate-900/50 border border-white/10 p-8 rounded-3xl flex-1">
        <h3 className="text-xl font-bold text-blue-400 mb-4">Key Takeaways</h3>
        <ul className="list-disc pl-5 space-y-4 text-slate-300 text-lg">
          <li>Triangles are the strongest architectural shape.</li>
          <li>They are classified by sides (Equilateral, Isosceles, Scalene).</li>
          <li>They are classified by angles (Acute, Right, Obtuse).</li>
          <li>The sum of internal angles is always 180°.</li>
        </ul>
      </div>
      <div className="mt-8 flex justify-center">
        <button onClick={onNext} className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition text-xl shadow-lg hover:-translate-y-1">Claim Reward</button>
      </div>
    </div>
  );
};
`;

const complete = `import React from 'react';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export const StepComplete = ({ lesson }: any) => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-1 mx-auto mb-8 shadow-[0_0_50px_-10px_rgba(234,179,8,0.5)]">
          <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
            <Award size={64} className="text-yellow-400" />
          </div>
        </div>
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-5xl font-extrabold text-white mb-4">Lesson Complete!</motion.h2>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-2xl text-slate-400 mb-2">You earned <span className="text-blue-400 font-bold">+150 XP</span></Badge></motion.p>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-slate-500 mb-12">Geometry Master Badge Unlocked</motion.p>
      
      <motion.button 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        onClick={() => navigate('/library')} 
        className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition text-lg"
      >
        Return to Library
      </motion.button>
    </div>
  );
};
`;

fs.writeFileSync(path.join(dir, 'StepObservation.tsx'), observation);
fs.writeFileSync(path.join(dir, 'StepRealWorld.tsx'), realWorld);
fs.writeFileSync(path.join(dir, 'StepPractice.tsx'), practice);
fs.writeFileSync(path.join(dir, 'StepQuiz.tsx'), quiz);
fs.writeFileSync(path.join(dir, 'StepSummary.tsx'), summary);
fs.writeFileSync(path.join(dir, 'StepComplete.tsx'), complete);

console.log('Updated remaining steps.');
