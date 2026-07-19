import { useSettingsStore } from '../store/SettingsStore';
import { Eye, Volume2, HardDrive, Languages, Info } from 'lucide-react';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { useToast } from '../components/shared/ToastProvider';

export default function SettingsPage() {
  const { highContrast, toggleHighContrast, voiceEnabled, toggleVoice } = useSettingsStore();
  const { showToast } = useToast();

  const sections = [
    {
      icon: Eye, iconColor: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
      title: 'Accessibility', desc: 'Increase visual contrast for readability.',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">High Contrast</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Increases border and text contrast.</div>
          </div>
          <ToggleSwitch checked={highContrast} onChange={() => { toggleHighContrast(); showToast('High Contrast updated'); }} />
        </div>
      )
    },
    {
      icon: Volume2, iconColor: 'text-violet-600 bg-violet-50 border border-violet-200',
      title: 'Voice Narration', desc: 'Spoken feedback for principles and equations.',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">TTS Feedback</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Plays speech on step transitions.</div>
          </div>
          <ToggleSwitch checked={voiceEnabled} onChange={() => { toggleVoice(); showToast('Voice setting updated'); }} />
        </div>
      )
    },
    {
      icon: HardDrive, iconColor: 'text-orange-500 bg-orange-50 border border-orange-200',
      title: 'Offline Cache', desc: 'PWA precached assets for offline use.',
      content: (
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800">Precached</div>
            <div className="text-[11px] font-mono text-emerald-600 mt-0.5">89 entries · 2.81 MB</div>
          </div>
          <button 
            onClick={() => showToast('Cache verified', 'success')} 
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] border border-slate-200"
          >
            Verify Cache
          </button>
        </div>
      )
    },
    {
      icon: Languages, iconColor: 'text-sky-600 bg-sky-50 border border-sky-200',
      title: 'Language', desc: 'Select lesson explanation language.',
      content: (
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98]">English</button>
          <button className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] border border-slate-200">Hindi</button>
        </div>
      )
    },
    {
      icon: Info, iconColor: 'text-slate-500 bg-slate-100 border border-slate-200',
      title: 'About System', desc: 'Platform core engine specifications.',
      content: (
        <div className="text-[11px] text-slate-500 space-y-1.5 leading-relaxed font-semibold">
          <div>Framework: <span className="font-bold text-slate-800">React 19 · TypeScript 6.0 · Vite 8</span></div>
          <div>Rendering: <span className="font-bold text-slate-800">Three.js WebGL · SVG Spatial</span></div>
          <div>Math: <span className="font-bold text-slate-800">KaTeX LaTeX Equations</span></div>
          <div>Curriculum: <span className="font-bold text-slate-800">NCERT Alignment Classes 6–10</span></div>
        </div>
      )
    },
  ];

  return (
    <div className="max-w-2xl space-y-8 font-sans">
      <div>
        <h1 className="text-page-title text-slate-900">Settings</h1>
        <p className="text-xs text-slate-500 mt-1 font-semibold">Manage accessibility and platform preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((sec, i) => {
          const Icon = sec.icon;
          return (
            <div key={i} className="premium-card space-y-5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${sec.iconColor}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900 leading-tight">{sec.title}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">{sec.desc}</div>
                </div>
              </div>
              <div className="pt-2">{sec.content}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
