import { useNavigate } from 'react-router';
import { Play, Cpu, BookOpen, Layers, GraduationCap, ArrowRight, ShieldCheck, Zap, Sparkles, CheckCircle2, BookOpenCheck, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: "easeOut" }
} as const;

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Interactive Engines', value: '17', desc: 'Real-time interactive 3D playgrounds', icon: Cpu },
    { label: 'NCERT Lessons', value: '52', desc: 'Fully curriculum-aligned chapters', icon: BookOpen },
    { label: 'Core Subjects', value: '5', desc: 'Comprehensive science & math courses', icon: Layers },
    { label: 'Classes Covered', value: '6–10', desc: 'Tailored school standards support', icon: GraduationCap }
  ];

  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      icon: '📐',
      desc: 'Master equations, spatial geometry, and complex algebraic concepts through interactive dynamic plotting.',
      lessons: '24 Interactive Lessons',
      progress: 65,
      color: 'blue'
    },
    {
      id: 'physics',
      name: 'Physics',
      icon: '⚛️',
      desc: 'Simulate light reflection, circuit currents, magnetic field lines, and mechanical gravity forces in real-time.',
      lessons: '10 Interactive Lessons',
      progress: 40,
      color: 'indigo'
    },
    {
      id: 'chemistry',
      name: 'Chemistry',
      icon: '🧪',
      desc: 'Explore molecular bonding, chemical reactions, balancing equations, and full pH scale color reactions.',
      lessons: '10 Interactive Lessons',
      progress: 0,
      color: 'cyan'
    }
  ];

  const features = [
    {
      title: '3D Simulation Engines',
      desc: 'Run real-time mathematics and physics calculations with live render response models built to scale.',
      icon: Zap
    },
    {
      title: 'NCERT Standard Syllabus',
      desc: 'Content crafted directly inline with class 6 to 10 curriculums, aiding classroom and home studies.',
      icon: BookOpenCheck
    },
    {
      title: 'Interactive Progress Badging',
      desc: 'Earn awards and track your simulation performance automatically through a gamified student portal.',
      icon: Sparkles
    }
  ];

  return (
    <div className="w-full bg-[#F8FAFC] text-slate-900 transition-colors duration-200 bg-dot-grid pb-24 overflow-hidden">
      
      {/* ─── 1. HERO SECTION ─── */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 max-w-[1440px] mx-auto px-6 md:px-8 xl:px-12 flex flex-col items-center text-center">
        <motion.div 
          {...fadeUp}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200/50 rounded-full text-xs font-bold text-blue-600 mb-8 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse"></span>
          AR Smart Lab Engine Live
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-hero tracking-tight text-slate-900 mb-6 max-w-4xl"
        >
          Interactive Learning <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">for Modern Science & Math.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="text-lg md:text-xl text-slate-500 max-w-2xl mb-10 font-medium leading-relaxed"
        >
          Experience 52 curriculum-aligned lessons with real-time 3D simulation engines, spatial models, and fully gamified student dashboards.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <button 
            onClick={() => navigate('/student')} 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3.5 font-bold shadow-md hover:shadow-lg transition-all duration-150 active:scale-[0.97]"
          >
            Start Learning
          </button>
          <button 
            onClick={() => navigate('/library')} 
            className="w-full sm:w-auto border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl px-8 py-3.5 font-semibold bg-white flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
          >
            Explore Library
          </button>
          <button 
            onClick={() => navigate('/library')} 
            className="w-full sm:w-auto border border-slate-250 text-slate-700 hover:bg-slate-50 rounded-xl px-8 py-3.5 font-semibold bg-transparent flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
          >
            <Play size={16} className="text-blue-600 fill-current" /> Watch Demo
          </button>
        </motion.div>
      </section>

      {/* ─── 2. STATISTICS SECTION ─── */}
      <section className="py-12 max-w-[1440px] mx-auto px-6 md:px-8 xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.05) }}
                className="metric-card bg-white"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                  <Icon size={18} />
                </div>
                <div className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm font-bold text-slate-800 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-500 font-medium">{stat.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── 3. CORE SUBJECTS ─── */}
      <section className="py-16 max-w-[1440px] mx-auto px-6 md:px-8 xl:px-12">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-slate-900 mb-3">Core Educational Modules</h2>
          <p className="text-slate-500 text-sm font-medium">Select a core branch to initiate dynamic visual curriculum sessions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <motion.div 
              key={subject.id} 
              onClick={() => navigate('/library')}
              className="premium-card bg-white flex flex-col justify-between cursor-pointer group"
            >
              {/* Illustration and Badging */}
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 bg-slate-50 rounded-xl border border-slate-200/50">
                    {subject.icon}
                  </span>
                  
                  {/* Progress ring at corner */}
                  <div className="relative w-[110px] h-[110px] flex items-center justify-center flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-105"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600"
                        strokeDasharray={`${subject.progress}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[12px] font-extrabold text-slate-900 leading-none">{subject.progress}%</span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">Done</span>
                    </div>
                  </div>
                </div>

                <h3 className="text-card-title text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed mb-6">
                  {subject.desc}
                </p>
              </div>

              {/* Bottom Row */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-bold">{subject.lessons}</span>
                <button className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-150 active:scale-[0.97]">
                  Continue Lesson <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 4. WHY AR SMART LAB ─── */}
      <section className="py-16 max-w-[1440px] mx-auto px-6 md:px-8 xl:px-12 bg-[#F1F5F9]/40 rounded-3xl border border-slate-200/50">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-section-title text-slate-900 mb-3">Why AR Smart Lab?</h2>
          <p className="text-slate-555 text-[15px] font-medium">Traditional study books tell; virtual smart labs let you interact, tweak, and discover scientific reactions visually.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Interactive Learning', desc: 'Change variables on-the-fly to test theories immediately in realtime.', icon: Zap },
            { title: 'Curriculum Coverage', desc: 'Directly follows the national school standards (NCERT, CBSE) for classes 6–10.', icon: BookOpenCheck },
            { title: 'Teacher Control Override', desc: 'Allow teachers to unlock solutions, check progress, and control the pace.', icon: ShieldCheck }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex gap-4 p-6 bg-white rounded-[20px] border border-slate-200/50">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 5. INTERACTIVE LEARNING FEATURES ─── */}
      <section className="py-16 max-w-[1440px] mx-auto px-6 md:px-8 xl:px-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-section-title text-slate-900">
              Transforming screen time into active simulation playgrounds.
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              We focus on premium presentation layout models built on core WebGL and canvas structures. Students interact with sliders, nodes, and toggles, creating custom scenarios.
            </p>
            <div className="space-y-3">
              {[
                'Real-time mathematics function plotting',
                'Optics refraction & reflection angles mapping',
                'Visual pH balancing and reactions log'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div key={i} className="premium-card bg-white flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-slate-900 mb-1">{feat.title}</h3>
                    <p className="text-[13px] text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 6. AR EXPERIENCE PREVIEW (COMING SOON) ─── */}
      <section className="py-16 max-w-[1440px] mx-auto px-6 md:px-8 xl:px-12 text-center relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-12 border border-zinc-800 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-[11px] font-bold tracking-wider text-blue-400 uppercase">
            <Globe size={12} /> Augmented Reality
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">AR Web Simulations (Preview)</h2>
          <p className="text-zinc-400 text-xs font-semibold leading-relaxed max-w-md mx-auto">
            Interactive spatial capabilities allowing students to load simulations directly into their physical room on mobile browser formats.
          </p>
          <div className="pt-4">
            <button onClick={() => navigate('/ar')} className="px-6 py-2.5 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold rounded-xl transition-colors">
              Access AR Showcase
            </button>
          </div>
        </div>
      </section>

      {/* ─── 7. CALL TO ACTION ─── */}
      <section className="py-20 text-center max-w-3xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Ready to raise your laboratory grades?
        </h2>
        <p className="text-slate-505 text-sm font-semibold mb-8">
          Gain free access to core simulation sets now. Perfect for classrooms, teachers, and home self-study.
        </p>
        <button 
          onClick={() => navigate('/student')} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 py-3.5 font-bold shadow-md hover:shadow-lg transition-transform active:scale-[0.97]"
        >
          Get Started For Free
        </button>
      </section>

    </div>
  );
}
