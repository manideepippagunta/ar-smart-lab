import { BarChart3, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Progress() {
  const subjectProgress = [
    { subject: 'Mathematics', percent: 65, color: 'from-blue-600 to-indigo-650' },
    { subject: 'Physics', percent: 50, color: 'from-indigo-500 to-cyan-500' },
    { subject: 'Chemistry', percent: 40, color: 'from-cyan-500 to-teal-500' },
    { subject: 'Biology', percent: 30, color: 'from-emerald-500 to-teal-500' }
  ];

  return (
    <div className="max-w-2xl space-y-8 font-sans">
      <div>
        <h1 className="text-page-title text-slate-900">Progress Overview</h1>
        <p className="text-xs text-slate-505 mt-1 font-semibold">Subject mastery across completed lessons and quizzes.</p>
      </div>

      <div className="premium-card bg-white space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <BarChart3 size={18} className="text-blue-500" />
          <h2 className="text-[15px] font-extrabold text-slate-900">Subject Mastery</h2>
        </div>
        
        <div className="space-y-6">
          {subjectProgress.map((sp, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">{sp.subject}</span>
                <span className="font-mono text-slate-500">{sp.percent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${sp.percent}%` }}
                  transition={{ delay: idx * 0.05, duration: 0.4, ease: "easeOut" }}
                  className={`bg-gradient-to-r ${sp.color} h-full rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting details card */}
      <div className="premium-card bg-white flex gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <GraduationCap size={18} />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-slate-900">Syllabus Milestones</h3>
          <p className="text-xs text-slate-505 leading-relaxed font-semibold">
            Track milestones across all 52 modules. You are on track to complete Class 9 physics curriculum by the end of this semester.
          </p>
        </div>
      </div>
    </div>
  );
}
