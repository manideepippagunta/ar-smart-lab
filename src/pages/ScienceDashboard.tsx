import { useNavigate } from 'react-router';
import { Atom, FlaskConical, Dna, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScienceDashboard() {
  const navigate = useNavigate();

  const topics = [
    { title: 'Physics', icon: Atom, count: 10, color: 'indigo', lessons: ['Mechanics', 'Optics', 'Electricity'] },
    { title: 'Chemistry', icon: FlaskConical, count: 10, color: 'cyan', lessons: ['Atomic Structure', 'Reactions', 'Acids & Bases'] },
    { title: 'Biology', icon: Dna, count: 8, color: 'emerald', lessons: ['Cell Biology', 'Life Processes', 'Ecosystems'] },
  ];

  return (
    <div className="font-sans space-y-12 pb-16">
      
      {/* ─── SUBJECT HERO ─── */}
      <section className="bg-white border border-slate-200/80 rounded-[20px] p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-6">
            <Atom size={12} /> Science Lab
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Explore the Natural World.
          </h1>
          <p className="text-slate-600 font-medium text-base leading-relaxed max-w-lg">
            Discover 28 interactive science experiments featuring real-time collision physics, chemical reaction balancers, and biological cell inspection.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-1/3 flex md:justify-end">
          <div className="bg-slate-50 border border-slate-200/60 p-6 rounded-2xl w-full max-w-xs">
            <div className="text-emerald-600 font-semibold tracking-wider text-xs uppercase mb-2">SUBJECT MASTERY</div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black text-slate-900 leading-none">25%</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full w-[25%]" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOPICS GRID ─── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Scientific Disciplines</h2>
          <button onClick={() => navigate('/library')} className="text-sm font-semibold text-emerald-600 hover:text-emerald-500 transition-colors">
            View All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {topics.map((topic, i) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate('/library')}
                className="group cursor-pointer bg-white border border-slate-200/80 rounded-[20px] p-6 hover:shadow-sm hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-56"
              >
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors border border-slate-100">
                    <Icon size={24} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {topic.count} Lessons
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">{topic.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {topic.lessons.map(l => (
                      <span key={l} className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200/60">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── QUICK START ─── */}
      <section className="bg-zinc-50 border border-zinc-200 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
            <Zap size={24} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-zinc-900">Next Lesson: Electric Circuits</h4>
            <p className="text-sm font-medium text-zinc-500 mt-0.5">Build a DC circuit and measure voltage and current.</p>
          </div>
        </div>
        <button onClick={() => navigate('/lesson/class-10-physics-electricity-circuits')} className="px-6 py-3 bg-zinc-900 text-white text-sm font-bold rounded-xl shadow-md hover:scale-105 transition-transform flex items-center gap-2 shrink-0">
          Start Now <ArrowRight size={16} />
        </button>
      </section>

    </div>
  );
}
