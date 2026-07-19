import { Clock, BarChart, BookOpen, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

export const StepIntro = ({ lesson, onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col justify-center max-w-4xl mx-auto py-12 px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mb-8 text-center"
      >
        <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-bold tracking-widest uppercase mb-6 border border-blue-200">
          {lesson.subject}
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          {lesson.title}
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          {lesson.objective}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <StatCard icon={<Clock />} title="Duration" value="15 Mins" delay={0.2} />
        <StatCard icon={<BarChart />} title="Difficulty" value="Beginner" delay={0.3} />
        <StatCard icon={<BookOpen />} title="Subject" value="Geometry" delay={0.4} />
        <StatCard icon={<PenTool />} title="XP Reward" value="+150 XP" delay={0.5} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <button 
          onClick={onNext}
          className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95"
        >
          Start Lesson
        </button>
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, title, value, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm"
  >
    <div className="text-blue-600 mb-2">{icon}</div>
    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">{title}</div>
    <div className="text-lg font-bold text-slate-900">{value}</div>
  </motion.div>
);
