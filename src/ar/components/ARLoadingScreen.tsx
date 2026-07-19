import { motion } from 'framer-motion';
import { Camera, Scan, Loader2 } from 'lucide-react';
import type { AREngineState } from '../engine/AREngine';

interface ARLoadingScreenProps {
  status: AREngineState['status'];
  onStart?: () => void;
}

export function ARLoadingScreen({ status, onStart }: ARLoadingScreenProps) {
  const isInitializing = status === 'initializing';
  const isIdle = status === 'idle';

  return (
    <div className="absolute inset-0 z-20 bg-slate-950 flex flex-col items-center justify-center text-white">
      {/* Scanning animation ring */}
      <div className="relative mb-8">
        <motion.div
          className="w-32 h-32 rounded-full border-2 border-blue-500/30"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-2 border-blue-400/50"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {isInitializing ? (
            <Loader2 size={36} className="text-blue-400 animate-spin" />
          ) : (
            <Camera size={36} className="text-blue-400" />
          )}
        </div>

        {/* Corner bracket decorations */}
        {[0, 90, 180, 270].map((deg) => (
          <motion.div
            key={deg}
            className="absolute w-6 h-6"
            style={{
              top: deg < 180 ? (deg === 90 ? '50%' : '2px') : 'auto',
              bottom: deg >= 180 ? (deg === 270 ? '50%' : '2px') : 'auto',
              left: deg === 0 || deg === 270 ? '2px' : 'auto',
              right: deg === 90 || deg === 180 ? '2px' : 'auto',
              transform: `translate(${deg === 90 || deg === 270 ? (deg === 90 ? '-50%' : '50%') : '0'}, ${deg === 0 || deg === 180 ? '0' : (deg === 270 ? '-50%' : '50%')}%) rotate(${deg}deg)`,
              borderTop: deg < 180 ? '2px solid #60a5fa' : 'none',
              borderLeft: deg === 0 || deg === 270 ? '2px solid #60a5fa' : 'none',
              borderBottom: deg >= 180 ? '2px solid #60a5fa' : 'none',
              borderRight: deg === 90 || deg === 180 ? '2px solid #60a5fa' : 'none',
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: deg / 360 }}
          />
        ))}
      </div>

      <motion.div
        className="text-center px-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isIdle && (
          <>
            <div className="flex items-center justify-center gap-2 mb-3">
              <Scan size={16} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Web AR</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Ready to Start AR</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
              Point your camera at the printed marker to see the 3D model appear in real space.
            </p>
            {onStart && (
              <motion.button
                onClick={onStart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-sm flex items-center gap-2 mx-auto transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Camera size={16} />
                Start AR Experience
              </motion.button>
            )}
          </>
        )}

        {isInitializing && (
          <>
            <h2 className="text-lg font-bold text-white mb-2">Initializing Camera</h2>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              Allow camera access when prompted. Ensure you're on HTTPS.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
