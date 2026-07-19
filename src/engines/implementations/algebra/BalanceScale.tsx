import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlgebraStore } from './useAlgebraStore';
import { AlgebraTileChip, TilePicker } from './AlgebraTile';

export const BalanceScale = () => {
  const { leftValue, rightValue, tiles, addTile, removeTile } = useAlgebraStore();
  const [activeSide, setActiveSide] = useState<'left' | 'right'>('left');

  // Compute tilt angle. Max ±25 degrees.
  const diff = leftValue - rightValue;
  const tiltAngle = Math.max(-25, Math.min(25, diff * 3));
  const isBalanced = leftValue === rightValue;

  const leftTiles = tiles.filter(t => t.side === 'left');
  const rightTiles = tiles.filter(t => t.side === 'right');

  return (
    <div className="flex h-full gap-6 p-6 items-start">
      {/* Tile Picker */}
      <div className="shrink-0">
        <TilePicker onPick={addTile} activeSide={activeSide} />
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setActiveSide('left')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${activeSide === 'left' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            ← Left
          </button>
          <button
            onClick={() => setActiveSide('right')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${activeSide === 'right' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
          >
            Right →
          </button>
        </div>
      </div>

      {/* Scale Visualization */}
      <div className="flex-1 flex flex-col items-center justify-between h-full gap-6">

        {/* Balance Status */}
        <AnimatePresence>
          {isBalanced && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="px-6 py-2 bg-emerald-900/40 border border-emerald-500/40 rounded-full text-emerald-400 font-bold text-sm"
            >
              ✓ Balanced! Left = Right
            </motion.div>
          )}
          {!isBalanced && (
            <motion.div
              key="unbalanced"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="px-6 py-2 bg-rose-900/30 border border-rose-500/30 rounded-full text-rose-400 font-bold text-sm"
            >
              ↕ Unbalanced: Left={leftValue}, Right={rightValue}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SVG Balance Beam */}
        <div className="relative w-full flex flex-col items-center">
          <svg viewBox="0 0 500 220" className="w-full max-w-xl" style={{ overflow: 'visible' }}>
            {/* Fulcrum */}
            <polygon points="250,190 230,210 270,210" fill="#64748b" />
            <rect x="220" y="205" width="60" height="8" rx="4" fill="#475569" />

            {/* Animated Beam */}
            <motion.g
              animate={{ rotate: tiltAngle }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ originX: '250px', originY: '120px' }}
            >
              {/* Beam bar */}
              <rect x="60" y="118" width="380" height="8" rx="4" fill="#94a3b8" />

              {/* Left pan chain */}
              <line x1="100" y1="122" x2="100" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />
              {/* Right pan chain */}
              <line x1="400" y1="122" x2="400" y2="160" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 2" />

              {/* Left Pan */}
              <rect x="60" y="160" width="80" height="10" rx="5" fill="#64748b" />
              {/* Right Pan */}
              <rect x="360" y="160" width="80" height="10" rx="5" fill="#64748b" />

              {/* Left Value */}
              <text x="100" y="155" textAnchor="middle" fill={leftValue > rightValue ? '#f87171' : '#34d399'} fontSize="16" fontWeight="bold">
                {leftValue}
              </text>
              {/* Right Value */}
              <text x="400" y="155" textAnchor="middle" fill={rightValue > leftValue ? '#f87171' : '#34d399'} fontSize="16" fontWeight="bold">
                {rightValue}
              </text>
            </motion.g>
          </svg>
        </div>

        {/* Tile Areas */}
        <div className="w-full grid grid-cols-2 gap-6">
          {/* Left Tiles */}
          <div
            onClick={() => setActiveSide('left')}
            className={`min-h-24 border-2 rounded-2xl p-4 flex flex-wrap gap-2 cursor-pointer transition ${
              activeSide === 'left' ? 'border-blue-500/50 bg-blue-900/10' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <AnimatePresence>
              {leftTiles.map(t => (
                <AlgebraTileChip key={t.id} type={t.type} id={t.id} onRemove={removeTile} />
              ))}
            </AnimatePresence>
            {leftTiles.length === 0 && (
              <div className="text-slate-600 text-xs font-semibold m-auto">Click to add tiles here</div>
            )}
          </div>

          {/* Right Tiles */}
          <div
            onClick={() => setActiveSide('right')}
            className={`min-h-24 border-2 rounded-2xl p-4 flex flex-wrap gap-2 cursor-pointer transition ${
              activeSide === 'right' ? 'border-blue-500/50 bg-blue-900/10' : 'border-white/10 hover:border-white/20'
            }`}
          >
            <AnimatePresence>
              {rightTiles.map(t => (
                <AlgebraTileChip key={t.id} type={t.type} id={t.id} onRemove={removeTile} />
              ))}
            </AnimatePresence>
            {rightTiles.length === 0 && (
              <div className="text-slate-600 text-xs font-semibold m-auto">Click to add tiles here</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
