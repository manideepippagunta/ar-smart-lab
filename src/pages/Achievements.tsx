import { Award, Zap, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Achievements() {
  const badges = [
    { title: 'Math Wizard', desc: 'Completed 10 Mathematics lessons with >90% quiz score.', unlocked: true, icon: Award },
    { title: 'Physics Guru', desc: 'Simulated ramp vectors and built 5 DC electric circuits.', unlocked: true, icon: Zap },
    { title: 'Master Balancer', desc: 'Balanced 10 chemical reaction stoichiometry equations.', unlocked: true, icon: Sparkles },
    { title: 'Biology Explorer', desc: 'Inspected 100% of Plant and Animal Cell organelles.', unlocked: false, icon: Shield }
  ];

  return (
    <div className="space-y-8 font-sans">
      <div>
        <h1 className="text-page-title text-slate-900">Achievements</h1>
        <p className="text-xs text-slate-505 mt-1 font-semibold">Unlock badges by completing lab exercises and quizzes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {badges.map((bdg, idx) => {
          const Icon = bdg.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className={`premium-card bg-white flex items-start gap-4 ${
                !bdg.unlocked ? 'opacity-55' : ''
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                bdg.unlocked 
                  ? 'bg-amber-50 text-amber-500 border-amber-500/20 shadow-sm' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                <Icon size={20} />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[15px] font-extrabold text-slate-900 leading-tight">{bdg.title}</h3>
                  {bdg.unlocked && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{bdg.desc}</p>
                <div className="pt-1">
                  <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider ${
                    bdg.unlocked 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-500/10' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {bdg.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
