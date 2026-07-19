import { useState } from 'react';
export const StepObservation = ({ onNext }: any) => {
  const [notes, setNotes] = useState('');
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8 px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-3 text-slate-900">Record Observations</h2>
      <p className="text-slate-500 mb-6 text-base leading-relaxed">What did you notice when dragging the triangle to become obtuse?</p>
      <div className="flex-1">
        <textarea 
          className="w-full h-64 bg-white border border-slate-200 rounded-2xl p-5 text-slate-900 text-base placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none shadow-sm"
          placeholder="Type your observations here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-[0_4px_14px_rgba(37,99,235,0.25)]">Continue</button>
      </div>
    </div>
  );
};
