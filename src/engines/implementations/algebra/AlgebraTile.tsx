import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TileType } from './useAlgebraStore';

interface TileProps {
  type: TileType;
  id?: string;
  onRemove?: (id: string) => void;
  draggable?: boolean;
  compact?: boolean;
}

const TILE_CONFIGS: Record<TileType, { label: string; color: string; textColor: string; border: string }> = {
  pos_x:  { label: 'x',   color: 'bg-blue-500',   textColor: 'text-white', border: 'border-blue-400' },
  neg_x:  { label: '-x',  color: 'bg-rose-600',   textColor: 'text-white', border: 'border-rose-500' },
  pos_x2: { label: 'x²',  color: 'bg-violet-600', textColor: 'text-white', border: 'border-violet-500' },
  neg_x2: { label: '-x²', color: 'bg-red-800',    textColor: 'text-white', border: 'border-red-700' },
  pos_1:  { label: '+1',  color: 'bg-emerald-500', textColor: 'text-white', border: 'border-emerald-400' },
  neg_1:  { label: '-1',  color: 'bg-slate-600',   textColor: 'text-slate-200', border: 'border-slate-500' },
};

export const AlgebraTileChip = ({ type, id, onRemove, draggable = false, compact = false }: TileProps) => {
  const [pressed, setPressed] = useState(false);
  const cfg = TILE_CONFIGS[type];
  const size = compact ? 'w-10 h-10 text-xs' : 'w-14 h-14 text-sm';

  return (
    <motion.div
      layout
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: pressed ? 0.92 : 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      whileHover={{ y: -2, boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}
      className={`
        ${size} ${cfg.color} ${cfg.textColor} ${cfg.border}
        border-b-4 rounded-xl flex items-center justify-center
        font-black select-none shadow-lg relative
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
    >
      {cfg.label}
      {onRemove && id && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          className="absolute -top-2 -right-2 w-5 h-5 bg-slate-900 rounded-full text-slate-400 hover:text-red-400 text-[10px] flex items-center justify-center border border-white/20 shadow"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

/**
 * Tile Picker — palette of all available tile types
 */
interface TilePickerProps {
  onPick: (type: TileType, side: 'left' | 'right') => void;
  activeSide: 'left' | 'right';
}

export const TilePicker = ({ onPick, activeSide }: TilePickerProps) => {
  const allTypes: TileType[] = ['pos_x', 'neg_x', 'pos_x2', 'neg_x2', 'pos_1', 'neg_1'];

  return (
    <div className="bg-slate-900/80 backdrop-blur border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
      <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Algebra Tiles</div>
      <div className="grid grid-cols-3 gap-2">
        {allTypes.map(type => (
          <button
            key={type}
            onClick={() => onPick(type, activeSide)}
            className="flex flex-col items-center gap-1"
            title={`Add ${TILE_CONFIGS[type].label} to ${activeSide} side`}
          >
            <AlgebraTileChip type={type} compact />
          </button>
        ))}
      </div>
      <div className="text-[10px] text-slate-500 text-center">
        Adding to <span className="font-bold text-blue-400">{activeSide}</span> side
      </div>
    </div>
  );
};
