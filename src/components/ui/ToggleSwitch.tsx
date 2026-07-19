import { motion } from 'framer-motion';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, label, disabled = false }: ToggleSwitchProps) {
  return (
    <label className={`inline-flex items-center gap-2.5 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-zinc-200'
        }`}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-white shadow-sm"
          animate={{ x: checked ? 16 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="text-xs font-medium text-zinc-700">{label}</span>}
    </label>
  );
}
