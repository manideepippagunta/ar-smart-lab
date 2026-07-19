import React from 'react';
import { useBiologyStore } from './useBiologyStore';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export const LabelingWorkspace: React.FC = () => {
  const { labelAssignments, assignLabel, resetAll } = useBiologyStore();

  const labels = [
    { id: 'l_nucleus', name: 'Nucleus', correctZone: 'z_nucleus' },
    { id: 'l_mitochondria', name: 'Mitochondria', correctZone: 'z_mitochondria' },
    { id: 'l_chloroplast', name: 'Chloroplast', correctZone: 'z_chloroplast' },
    { id: 'l_heart', name: 'Heart', correctZone: 'z_heart' }
  ];

  const zones = [
    { id: 'z_nucleus', name: 'Target Zone 1: Genetic DNA Control Center' },
    { id: 'z_mitochondria', name: 'Target Zone 2: Powerhouse 38 ATP Energy' },
    { id: 'z_chloroplast', name: 'Target Zone 3: Green Photosynthesis Organelle' },
    { id: 'z_heart', name: 'Target Zone 4: 4-Chamber Blood Pump' }
  ];

  const correctCount = labels.filter(l => labelAssignments[l.id] === l.correctZone).length;

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl min-h-[380px]">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          INTERACTIVE ORGAN & ORGANELLE LABELING
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Score: {correctCount} / {labels.length} Correct
          </span>
          <button
            onClick={resetAll}
            className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
            title="Reset Labeling"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Target Drop Zones */}
      <div className="my-auto space-y-3">
        {zones.map((zone) => {
          const assignedLabel = labels.find(l => labelAssignments[l.id] === zone.id);
          const isCorrect = assignedLabel && assignedLabel.correctZone === zone.id;

          return (
            <div
              key={zone.id}
              className={`p-3 rounded-xl border flex justify-between items-center transition ${
                isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                  : assignedLabel
                  ? 'bg-red-950/40 border-red-500/50 text-red-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-xs font-bold">{zone.name}</span>
              <div className="flex items-center gap-2">
                {assignedLabel ? (
                  <span className="px-3 py-1 bg-slate-950 rounded-lg text-xs font-black border border-slate-700">
                    {assignedLabel.name} {isCorrect ? '✓' : 'X'}
                  </span>
                ) : (
                  <span className="text-xs italic text-slate-500">Select label below</span>
                )}
                {isCorrect && <CheckCircle2 size={16} className="text-emerald-400" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Label Buttons Palette */}
      <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
        <span className="text-xs font-bold text-slate-400 self-center mr-2">Click to Assign Label:</span>
        {labels.map((lbl) => {
          const assignedZone = labelAssignments[lbl.id];
          return (
            <button
              key={lbl.id}
              onClick={() => {
                const availableZone = zones.find(z => !Object.values(labelAssignments).includes(z.id))?.id;
                if (availableZone) assignLabel(lbl.id, availableZone);
              }}
              disabled={!!assignedZone}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                assignedZone ? 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow'
              }`}
            >
              {lbl.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
