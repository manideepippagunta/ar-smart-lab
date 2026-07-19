import { StepRegistry } from './StepRegistry';
import { motion, AnimatePresence } from 'framer-motion';

export const StepRenderer = ({ currentStepIndex, lessonData, onNext }: any) => {
  const StepComponent = StepRegistry[currentStepIndex];

  if (!StepComponent) return <div className="text-zinc-500">Unknown Step</div>;

  return (
    <div className="flex-1 w-full h-full relative overflow-hidden bg-[#F8FAFC] text-slate-700">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full flex justify-center"
        >
          {/* Constrain max width for readability if not explicitly a full-width engine component */}
          <div className="w-full max-w-7xl px-4 md:px-8 py-6 h-full flex flex-col">
            <StepComponent lesson={lessonData} onNext={onNext} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
