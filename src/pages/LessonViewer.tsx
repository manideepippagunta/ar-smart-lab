import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useLessonStore } from '../store/LessonStore';
import { StepRenderer } from '../components/lesson-steps/StepRenderer';
import { STEP_TITLES } from '../components/lesson-steps/StepRegistry';
import { CheckCircle2, Menu, X, ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import { TeacherToolbar } from '../components/shared/TeacherToolbar';
import { useVoiceAdapter } from '../engines/hooks/adapters';
import { hasARSupport } from '@/ar';

export default function LessonViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentLesson = useLessonStore((state) => state.currentLesson);
  const setCurrentLesson = useLessonStore((state) => state.setCurrentLesson);
  const lessons = useLessonStore((state) => state.lessons);
  const discoverLessons = useLessonStore((state) => state.discoverLessons);
  const teacherMode = useLessonStore((state) => state.teacherMode);
  const presentationMode = useLessonStore((state) => state.presentationMode);

  const { speak } = useVoiceAdapter();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);

  useEffect(() => {
    if (id) discoverLessons();
  }, [id, discoverLessons]);

  useEffect(() => {
    if (id && Object.keys(lessons).length > 0) setCurrentLesson(id);
  }, [id, lessons, setCurrentLesson]);

  const handleNext = () => {
    setCompletedSteps((prev) => ({ ...prev, [currentStepIndex]: true }));
    if (currentStepIndex < STEP_TITLES.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleStepClick = (index: number) => {
    const isAccessible = index <= currentStepIndex || (index > 0 && completedSteps[index - 1]);
    if (isAccessible) {
      setCurrentStepIndex(index);
      setLeftSidebarOpen(false);
    }
  };

  if (!currentLesson) {
    return (
      <div className="h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans">
        <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin mb-4" />
        <span className="text-sm font-semibold text-slate-500">Loading lab environment...</span>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStepIndex + 1) / STEP_TITLES.length) * 100);

  return (
    <div className="w-full h-screen bg-[#F8FAFC] flex flex-col overflow-hidden font-sans text-slate-900">
      
      {/* ─── HEADER ─── */}
      <header className="h-14 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between shrink-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/library')}
            className="p-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg transition-colors group flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wider hidden sm:block">Exit</span>
          </button>
          
          <div className="h-5 w-px bg-slate-200 hidden sm:block" />
          
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <BookOpen size={14} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {currentLesson.subject} · {currentLesson.classId.replace('-', ' ')}
              </div>
              <h1 className="text-[13px] font-bold text-slate-900 truncate max-w-[200px] lg:max-w-md">{currentLesson.title}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5">
          <div className="hidden md:flex flex-col items-end mr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Progress</span>
              <span className="text-[10px] font-mono font-bold text-slate-800">{progressPercent}%</span>
            </div>
            <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => speak(`Step ${currentStepIndex + 1}: ${STEP_TITLES[currentStepIndex]}`)}
              className="p-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg transition-colors"
              title="Read aloud"
            >
              <Volume2 size={16} />
            </button>

            {/* Open in AR button — shown only for AR-supported lessons */}
            {currentLesson && hasARSupport(currentLesson.id) && (
              <button
                onClick={() => navigate(`/ar/lesson/${currentLesson.id}`)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-bold transition-colors"
                title="Open in AR"
              >
                <span>⬡</span> Open in AR
              </button>
            )}

            <button
              className="md:hidden p-2 hover:bg-slate-100 text-slate-700 hover:text-slate-900 rounded-lg transition-colors"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            >
              {leftSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── WORKSPACE ─── */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Step Navigation Sidebar */}
        <div
          className={`
            fixed md:relative inset-y-0 left-0 z-30 w-[260px] bg-white border-r border-slate-200
            transform transition-transform duration-300 ease-in-out flex flex-col pt-14 md:pt-0
            shadow-[2px_0_8px_rgba(0,0,0,0.04)]
            ${leftSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${presentationMode ? 'md:hidden' : 'md:flex'}
          `}
        >
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Lesson Steps</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-hide">
            {STEP_TITLES.map((title, idx) => {
              const isCurrent = idx === currentStepIndex;
              const isCompleted = completedSteps[idx];
              const isAccessible = idx <= currentStepIndex || (idx > 0 && completedSteps[idx - 1]);

              return (
                <button
                  key={idx}
                  onClick={() => handleStepClick(idx)}
                  disabled={!isAccessible}
                  className={`
                    w-full flex items-start gap-3 p-3.5 rounded-xl text-left transition-all duration-200
                    ${isCurrent ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'border border-transparent'}
                    ${!isCurrent && isAccessible ? 'hover:bg-slate-50' : ''}
                    ${!isAccessible ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="mt-0.5">
                    {isCompleted && !isCurrent ? (
                      <CheckCircle2 size={16} className="text-emerald-600" />
                    ) : (
                      <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center text-[9px] font-bold ${
                        isCurrent ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-slate-300 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={`text-[13px] ${isCurrent ? 'text-slate-900 font-extrabold' : isCompleted ? 'text-slate-800 font-bold' : 'text-slate-500 font-semibold'}`}>
                      {title}
                    </div>
                    {isCurrent && (
                      <div className="text-[10px] font-bold text-blue-600 mt-1">
                        In Progress
                      </div>
                    )}
                    {isCompleted && !isCurrent && (
                      <div className="text-[10px] font-bold text-emerald-600 mt-1">
                        Completed
                      </div>
                    )}
                    {!isAccessible && (
                      <div className="text-[10px] font-semibold text-slate-400 mt-1">
                        Locked
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Viewer */}
        <div
          className={`flex-1 relative flex flex-col min-w-0 bg-[#F8FAFC] ${
            presentationMode
              ? 'p-12 text-2xl [&_h1]:text-5xl [&_h2]:text-4xl [&_p]:text-xl [&_span]:text-xl [&_li]:text-xl [&_.katex]:text-3xl'
              : ''
          }`}
        >
          <StepRenderer
            currentStepIndex={currentStepIndex}
            lessonData={currentLesson}
            onNext={handleNext}
          />
        </div>
      </div>

      {teacherMode && <TeacherToolbar />}
    </div>
  );
}
