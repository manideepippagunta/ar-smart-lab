import { useNavigate } from 'react-router';
import { BookOpen, Clock, Award, Flame, Calculator, Atom, FlaskConical, Dna, PlayCircle, Trophy, Inbox } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" }
} as const;

export default function StudentDashboard() {
  const navigate = useNavigate();

  const subjects = [
    { name: 'Mathematics', icon: Calculator, desc: 'Numbers, Algebra, Mensuration', progress: 65, color: 'blue' },
    { name: 'Physics', icon: Atom, desc: 'Mechanics, Optics, Circuits', progress: 40, color: 'indigo' },
    { name: 'Chemistry', icon: FlaskConical, desc: 'Atoms, Reactions, pH Scale', progress: 0, color: 'cyan' },
    { name: 'Biology', icon: Dna, desc: 'Cells, Heart, Photosynthesis', progress: 0, color: 'emerald' },
  ];

  const recent = [
    { id: 'class-10-physics-optics-reflection-refraction', title: 'Light — Reflection and Refraction', subject: 'Physics', progress: 80 },
    { id: 'class-9-math-algebra-linear-equations', title: 'Linear Equations in Two Variables', subject: 'Mathematics', progress: 100 },
  ];

  // For testing/demonstrating empty states when needed (e.g. notifications/recent activity empty state if they completed everything)
  const hasNotifications = false; 

  return (
    <div className="space-y-12 pb-16">
      
      {/* ─── WELCOME HERO ─── */}
      <motion.section 
        {...fadeUp} 
        className="relative flex flex-col md:flex-row items-center justify-between gap-8 bg-white text-slate-900 rounded-[20px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/80 overflow-hidden"
      >
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative z-10 w-full md:w-2/3 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-[11px] font-bold text-amber-700 uppercase tracking-wider">
            <Trophy size={12} /> Class 9 Scholar
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
            Welcome back, Student.
          </h1>
          <p className="text-[14px] text-slate-500 font-semibold max-w-lg leading-relaxed">
            You've completed 14 lessons this month and maintained a 5-day learning streak. Keep up the momentum!
          </p>
        </div>

        <div className="relative z-10 w-full md:w-1/3 flex md:justify-end">
          <div className="bg-slate-50 border border-slate-200/80 backdrop-blur-md rounded-[20px] p-6 w-full max-w-xs shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Progress</span>
              <span className="text-sm font-extrabold text-slate-900">27%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[27%]" />
            </div>
            <button 
              onClick={() => navigate('/library')} 
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-150 active:scale-[0.98]"
            >
              Continue Journey
            </button>
          </div>
        </div>
      </motion.section>

      {/* ─── QUICK STATS ─── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Completed', value: '14/52', icon: BookOpen },
          { label: 'Study Time', value: '4.2h', icon: Clock },
          { label: 'Quizzes', value: '12', icon: Award },
          { label: 'Streak', value: '5d', icon: Flame },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="metric-card bg-white flex items-center justify-between"
            >
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{s.label}</div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">{s.value}</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                <Icon size={18} />
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* ─── SUBJECTS & CONTINUE LEARNING GRID ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Subjects */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-section-title text-slate-900 mb-4">Your Enrolled Subjects</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {subjects.map((sub, i) => {
              const Icon = sub.icon;
              return (
                <div 
                  key={i} 
                  onClick={() => navigate(sub.name === 'Mathematics' ? '/math' : '/science')}
                  className="group cursor-pointer bg-white border border-slate-205 p-6 rounded-[20px] shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-[16px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{sub.name}</h3>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">{sub.desc}</p>
                    </div>
                  </div>
                  
                  {sub.progress > 0 ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${sub.progress}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">{sub.progress}%</span>
                    </div>
                  ) : (
                    <div className="text-xs font-bold text-slate-400">Not started</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pick Up / Notifications Empty State demonstration */}
        <div className="space-y-6">
          <h2 className="text-section-title text-slate-900 mb-4">Activity Log</h2>
          <div className="space-y-6">
            
            {/* Recent Activity List */}
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Activity</div>
              {recent.map((les) => (
                <div 
                  key={les.id} 
                  onClick={() => navigate(`/lesson/${les.id}`)}
                  className="group cursor-pointer bg-white border border-slate-205 p-5 rounded-[20px] flex flex-col gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <PlayCircle size={18} />
                    </div>
                    <div>
                      <h4 className="text-[13px] font-bold text-slate-905 leading-snug line-clamp-2 mb-1">{les.title}</h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{les.subject}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${les.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">{les.progress}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Notifications Empty State */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Platform Alerts</div>
              {!hasNotifications && (
                <div className="p-6 bg-slate-50 border border-slate-200/50 rounded-[20px] flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <Inbox size={18} />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-slate-900">No new alerts</h5>
                    <p className="text-[11px] text-slate-450 mt-1">We will notify you here when assignments are posted.</p>
                  </div>
                  <button 
                    onClick={() => navigate('/library')}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl shadow-sm transition-all"
                  >
                    View Lessons
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}
