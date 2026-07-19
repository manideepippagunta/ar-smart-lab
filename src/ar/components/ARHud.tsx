import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Target, ChevronDown, X, Crosshair } from 'lucide-react';
import type { ARLessonConfig } from '../config/ARLessonConfig';
import type { AREngineState } from '../engine/AREngine';

interface ARHudProps {
  config: ARLessonConfig;
  engineState: AREngineState;
  onClose: () => void;
  onTap: () => void;
}

export function ARHud({ config, engineState, onClose, onTap }: ARHudProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <>
      {/* ── Top bar ── */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-safe-top pt-4">
        <div className="bg-black/60 backdrop-blur-md rounded-xl px-3 py-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            engineState.status === 'running'
              ? engineState.markerFound ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400 animate-pulse'
              : 'bg-slate-500'
          }`} />
          <span className="text-[11px] font-bold text-white">
            {engineState.status === 'running'
              ? engineState.markerFound ? 'Marker Detected' : 'Scanning...'
              : engineState.status === 'initializing' ? 'Starting Camera...'
              : 'AR Ready'}
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Scanning reticle (shown when no marker found) ── */}
      <AnimatePresence>
        {engineState.status === 'running' && !engineState.markerFound && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-48 h-48">
              {/* Corners */}
              {[
                'top-0 left-0 border-t-2 border-l-2',
                'top-0 right-0 border-t-2 border-r-2',
                'bottom-0 left-0 border-b-2 border-l-2',
                'bottom-0 right-0 border-b-2 border-r-2',
              ].map((cls, i) => (
                <div key={i} className={`absolute w-8 h-8 border-blue-400 rounded-sm ${cls}`} />
              ))}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Crosshair size={24} className="text-blue-400/60" />
              </motion.div>
              <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-white/70 whitespace-nowrap">
                Point at the marker
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Marker found pulse ring ── */}
      <AnimatePresence>
        {engineState.markerFound && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-24 h-24 border-2 border-emerald-400 rounded-full"
              animate={{ scale: [1, 2], opacity: [0.7, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom controls ── */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-4 pb-safe-bottom pb-6">

        {/* Info panel (expandable) */}
        {config.hudInfo && (
          <AnimatePresence>
            {infoOpen && (
              <motion.div
                className="bg-black/80 backdrop-blur-md rounded-2xl p-4 mb-3"
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: 20, height: 0 }}
              >
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {config.hudInfo.description}
                </p>
                {config.hudInfo.formula && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-2 mb-3">
                    <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-0.5">Formula</p>
                    <p className="text-sm font-mono font-bold text-white">{config.hudInfo.formula}</p>
                  </div>
                )}
                <div className="space-y-1.5">
                  {config.hudInfo.facts.map((fact, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <p className="text-[11px] text-slate-300 leading-relaxed">{fact}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Control bar */}
        <div className="bg-black/70 backdrop-blur-md rounded-2xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{config.category}</p>
            <p className="text-sm font-bold text-white">{config.title}</p>
            {config.subtitle && (
              <p className="text-[11px] text-slate-400">{config.subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Tap to toggle spin */}
            <motion.button
              onClick={onTap}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
              title="Tap to toggle spin"
              whileTap={{ scale: 0.9 }}
            >
              <Target size={18} />
            </motion.button>

            {/* Info toggle */}
            {config.hudInfo && (
              <motion.button
                onClick={() => setInfoOpen(!infoOpen)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  infoOpen ? 'bg-blue-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Lesson info"
                whileTap={{ scale: 0.9 }}
              >
                {infoOpen ? <ChevronDown size={18} /> : <Info size={18} />}
              </motion.button>
            )}
          </div>
        </div>

        {/* Annotation hints */}
        {engineState.markerFound && config.annotations.length > 0 && (
          <motion.div
            className="mt-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {config.annotations.map((ann, i) => (
              <div
                key={i}
                className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold text-white border border-white/20"
                style={{ backgroundColor: `${ann.color ?? '#4F8EF7'}40`, borderColor: `${ann.color ?? '#4F8EF7'}60` }}
              >
                {ann.label}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
