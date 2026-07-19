import { useLessonStore } from '../../store/LessonStore';
import { Eye, Camera, Play, Pause, Volume2, VolumeX, Monitor, RotateCcw } from 'lucide-react';

export const TeacherToolbar = () => {
  const {
    presentationMode, setPresentationMode,
    revealLevel, setRevealLevel,
    animationPaused, toggleAnimationPause,
    voiceEnabled, toggleVoiceEnabled,
    resetProgress
  } = useLessonStore();

  const handleCapture = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'screenshot.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleResetSim = () => {
    window.dispatchEvent(new CustomEvent('engine:reset'));
  };

  const Btn = ({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${active ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#18181B] border border-zinc-800 p-2.5 rounded-2xl shadow-2xl flex items-center gap-1.5 text-white">
      <div className="px-2">
        <div className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">Presenter</div>
      </div>
      <div className="h-6 w-px bg-zinc-800" />

      <Btn active={presentationMode} onClick={() => setPresentationMode(!presentationMode)} title="Presentation Mode"><Monitor size={15} /></Btn>
      <Btn active={revealLevel > 0} onClick={() => setRevealLevel((revealLevel + 1) % 4)} title="Reveal Level">
        <div className="flex items-center gap-0.5"><Eye size={15} />{revealLevel > 0 && <span className="text-[9px] font-bold">L{revealLevel}</span>}</div>
      </Btn>
      <Btn active={voiceEnabled} onClick={toggleVoiceEnabled} title="Voice">{voiceEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}</Btn>
      <Btn active={animationPaused} onClick={toggleAnimationPause} title="Pause">{animationPaused ? <Play size={15} /> : <Pause size={15} />}</Btn>
      <Btn onClick={handleCapture} title="Screenshot"><Camera size={15} /></Btn>

      <div className="h-6 w-px bg-zinc-800" />
      <button onClick={handleResetSim} className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[10px] font-medium transition-colors" title="Reset Simulation">
        <RotateCcw size={13} />
      </button>
      <button onClick={resetProgress} className="px-2.5 py-1.5 hover:bg-red-900/40 text-red-400 rounded-lg text-[10px] font-medium transition-colors" title="Reset Progress">
        Reset
      </button>
    </div>
  );
};
