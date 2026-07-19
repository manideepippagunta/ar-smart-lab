import { useNavigate } from 'react-router';
import { GraduationCap, BookOpen, Monitor, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChooseRole() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col">
      {/* Header */}
      <header className="max-w-5xl w-full mx-auto px-6 py-6 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <div className="text-[13px] font-semibold">AR Smart Lab</div>
          <div className="text-[10px] text-zinc-500 font-medium">Select Role</div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-10 tracking-tight"
          >
            How would you like to explore?
          </motion.h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              onClick={() => navigate('/student')}
              className="group cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 rounded-xl text-center transition-colors"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800 text-zinc-400 group-hover:text-blue-400 flex items-center justify-center mb-4 transition-colors">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Student</h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Follow step-by-step modules and solve interactive quizzes.</p>
              <span className="text-xs font-medium text-blue-400 flex items-center justify-center gap-1">
                Enter <ArrowRight size={13} />
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => navigate('/teacher')}
              className="group cursor-pointer bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 rounded-xl text-center transition-colors"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-zinc-800 text-zinc-400 group-hover:text-blue-400 flex items-center justify-center mb-4 transition-colors">
                <Monitor size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-1">Teacher</h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">Enable demonstration mode, unlock answers, manage labs.</p>
              <span className="text-xs font-medium text-blue-400 flex items-center justify-center gap-1">
                Enter <ArrowRight size={13} />
              </span>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-[11px] text-zinc-600 font-medium">
        AR Smart Lab v1.0
      </footer>
    </div>
  );
}
