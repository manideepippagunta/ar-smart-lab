import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Printer, Scan, ChevronRight, X } from 'lucide-react';
import type { ARLessonConfig } from '../config/ARLessonConfig';

interface MarkerGuideProps {
  config: ARLessonConfig;
  onContinue: () => void;
  onClose?: () => void;
}

export function MarkerGuide({ config, onContinue, onClose }: MarkerGuideProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const steps = [
    {
      num: 1,
      icon: Download,
      title: 'Download Marker',
      description: 'Download the AR target image below. You can also use a digital display.',
      action: config.markerDownloadUrl ? (
        <a
          href={config.markerDownloadUrl}
          download={`ar-marker-${config.lessonId}.svg`}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
          onClick={() => setStep(2)}
        >
          <Download size={14} /> Download Marker
        </a>
      ) : null,
    },
    {
      num: 2,
      icon: Printer,
      title: 'Print or Display',
      description: 'Print the marker on A4 paper, or simply display it on another screen. Keep it flat and well-lit.',
      action: (
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Done, Continue <ChevronRight size={14} />
        </button>
      ),
    },
    {
      num: 3,
      icon: Scan,
      title: 'Scan with Camera',
      description: 'Hold your phone so the camera sees the marker. Keep steady and ensure good lighting.',
      action: (
        <button
          onClick={onContinue}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Start AR <ChevronRight size={14} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Scan size={15} className="text-white" />
              </div>
              <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">AR Setup</span>
            </div>
            {onClose && (
              <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                <X size={16} />
              </button>
            )}
          </div>
          <h2 className="text-lg font-bold text-white">{config.title}</h2>
          {config.subtitle && <p className="text-xs text-blue-200 mt-0.5">{config.subtitle}</p>}
        </div>

        {/* Step progress */}
        <div className="flex px-5 py-3 border-b border-slate-800 gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                n <= step ? 'bg-blue-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Marker preview */}
        {config.markerPreviewImage && (
          <div className="p-5 pb-0 flex justify-center">
            <div className="w-40 h-40 bg-white rounded-xl p-2 flex items-center justify-center border-4 border-dashed border-blue-500/40">
              <img
                src={config.markerPreviewImage}
                alt="AR Target Marker"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="p-5 space-y-4">
          {steps.map(({ num, icon: Icon, title, description, action }) => {
            const isActive = num === step;
            const isDone = num < step;

            return (
              <motion.div
                key={num}
                className={`flex items-start gap-3 transition-opacity duration-200 ${
                  isActive ? 'opacity-100' : isDone ? 'opacity-50' : 'opacity-30'
                }`}
                animate={{ opacity: isActive ? 1 : isDone ? 0.5 : 0.3 }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isDone ? 'bg-emerald-500' : isActive ? 'bg-blue-600' : 'bg-slate-700'
                  }`}
                >
                  {isDone ? (
                    <span className="text-white text-xs font-bold">✓</span>
                  ) : (
                    <Icon size={15} className="text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white mb-0.5">{title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
                  {isActive && action && <div className="mt-3">{action}</div>}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="px-5 pb-5">
          <p className="text-[10px] text-slate-600 text-center">
            📸 Camera access required · Works on iOS Safari & Android Chrome
          </p>
        </div>
      </motion.div>
    </div>
  );
}
