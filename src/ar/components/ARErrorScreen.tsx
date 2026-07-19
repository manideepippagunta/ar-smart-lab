import { motion } from 'framer-motion';
import { AlertTriangle, Camera, WifiOff, Globe, RefreshCw } from 'lucide-react';
import type { CapabilityResult } from '../engine/CapabilityDetector';

interface ARErrorScreenProps {
  type: 'permission' | 'unsupported' | 'engine' | 'not-found';
  message?: string;
  capabilities?: CapabilityResult;
  onRetry?: () => void;
  onGoBack?: () => void;
}

const ERROR_CONFIG = {
  permission: {
    icon: Camera,
    color: 'amber',
    title: 'Camera Permission Denied',
    description: 'AR Smart Lab needs camera access to show 3D models in your space.',
    steps: [
      'Open your browser Settings',
      'Find "Site Permissions" → Camera',
      'Allow camera for this site',
      'Refresh the page and try again',
    ],
  },
  unsupported: {
    icon: Globe,
    color: 'red',
    title: 'Browser Not Supported',
    description: 'Web AR requires a modern browser with camera support.',
    steps: [
      'Use Chrome 79+ on Android',
      'Use Safari 14.1+ on iOS/iPadOS',
      'Ensure you are on HTTPS',
      'Enable hardware acceleration in browser settings',
    ],
  },
  engine: {
    icon: AlertTriangle,
    color: 'red',
    title: 'AR Engine Error',
    description: 'Something went wrong while starting the AR experience.',
    steps: [
      'Refresh the page and try again',
      'Ensure your device has a working camera',
      'Try a different browser',
    ],
  },
  'not-found': {
    icon: WifiOff,
    color: 'slate',
    title: 'AR Experience Not Available',
    description: 'This lesson does not have an AR experience configured yet.',
    steps: [
      'More AR lessons are coming in Phase 2',
      'Visit the Lesson Library for available content',
    ],
  },
};

const colorMap = {
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', chip: 'bg-amber-500' },
  red: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', chip: 'bg-red-500' },
  slate: { bg: 'bg-slate-800', border: 'border-slate-700', icon: 'text-slate-400', chip: 'bg-slate-600' },
};

export function ARErrorScreen({ type, message, capabilities, onRetry, onGoBack }: ARErrorScreenProps) {
  const cfg = ERROR_CONFIG[type] ?? ERROR_CONFIG.engine;
  const colors = colorMap[cfg.color as keyof typeof colorMap] ?? colorMap.slate;
  const Icon = cfg.icon;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        className={`w-full max-w-sm ${colors.bg} border ${colors.border} rounded-2xl p-6`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-4`}>
          <Icon size={28} className={colors.icon} />
        </div>

        <h2 className="text-lg font-bold text-white mb-1">{cfg.title}</h2>
        <p className="text-sm text-slate-400 mb-4 leading-relaxed">{message || cfg.description}</p>

        {/* Steps */}
        <div className="space-y-2 mb-6">
          {cfg.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full ${colors.chip} flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5`}>
                {i + 1}
              </div>
              <span className="text-xs text-slate-300 leading-relaxed">{step}</span>
            </div>
          ))}
        </div>

        {/* Capability details (for unsupported) */}
        {capabilities && type === 'unsupported' && (
          <div className="bg-slate-900 rounded-xl p-3 mb-4 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Device Check</p>
            {[
              { label: 'WebGL', ok: capabilities.webgl },
              { label: 'Camera API', ok: capabilities.camera },
              { label: 'Secure (HTTPS)', ok: capabilities.secureContext },
              { label: `Browser (${capabilities.browser.name} ${capabilities.browser.version})`, ok: capabilities.browser.compatible },
            ].map(({ label, ok }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{label}</span>
                <span className={`text-[11px] font-semibold ${ok ? 'text-emerald-400' : 'text-red-400'}`}>
                  {ok ? '✓ OK' : '✗ Fail'}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <RefreshCw size={13} /> Try Again
            </button>
          )}
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
