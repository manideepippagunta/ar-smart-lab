import { Keyboard, HelpCircle } from 'lucide-react';

export default function HelpCenter() {
  const shortcuts = [
    { key: 'Space', desc: 'Advance to next step in lesson' },
    { key: 'R', desc: 'Reset current active engine parameters' },
    { key: 'V', desc: 'Speak active step narration' },
    { key: 'T', desc: 'Toggle Teacher Control mode' }
  ];

  return (
    <div className="max-w-2xl space-y-8 font-sans">
      <div>
        <h1 className="text-page-title text-slate-900">Help & Guide</h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Keyboard shortcuts and interactive simulation instructions.</p>
      </div>

      <div className="premium-card bg-white space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <Keyboard size={18} className="text-blue-500" />
          <h2 className="text-[15px] font-extrabold text-slate-900">Keyboard Hotkeys</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shortcuts.map((sc, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100 hover:border-slate-200 transition-colors"
            >
              <span className="text-xs text-slate-600 font-bold leading-relaxed">{sc.desc}</span>
              <kbd className="px-2.5 py-1 bg-white border border-slate-205 rounded-lg text-[11px] font-mono font-extrabold text-slate-800 ml-3 shadow-sm select-none">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Premium User Help Card */}
      <div className="premium-card bg-white flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <HelpCircle size={18} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900">Need Additional Assistance?</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Our lab assistants and teachers are standing by. Send inquiries directly to support@arsmartlab.edu or view our online guides.
          </p>
        </div>
      </div>
    </div>
  );
}
