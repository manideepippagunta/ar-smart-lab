import React, { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 200);
          return 100;
        }
        return prev + 12;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#09090B] flex flex-col items-center justify-center text-white select-none"
          >
            <div className="flex flex-col items-center max-w-xs w-full px-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-5"
              >
                <GraduationCap size={28} className="text-white" />
              </motion.div>

              <motion.h1
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-lg font-bold tracking-tight text-white mb-1"
              >
                AR Smart Lab
              </motion.h1>

              <motion.p
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-[11px] text-zinc-500 font-medium mb-8"
              >
                Loading interactive platform...
              </motion.p>

              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!loading && children}
    </>
  );
};
