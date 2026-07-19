import { Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

export const StepComplete = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 p-1 mx-auto mb-8 shadow-[0_8px_30px_rgba(234,179,8,0.35)]">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            <Award size={64} className="text-yellow-500" />
          </div>
        </div>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="text-4xl font-extrabold text-slate-900 mb-4"
      >
        Lesson Completed!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-xl text-slate-600 mb-2"
      >
        You earned <span className="text-blue-600 font-bold">+150 XP</span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-slate-500 mb-12 font-medium"
      >
        Geometry Master Badge Unlocked
      </motion.p>
      
      <motion.button 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        onClick={() => navigate('/library')} 
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition text-lg shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:scale-105 active:scale-95"
      >
        Return to Library
      </motion.button>
    </div>
  );
};
