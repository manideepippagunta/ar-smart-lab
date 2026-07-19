import React from 'react';
import { useBiologyStore } from './useBiologyStore';
import { Layers } from 'lucide-react';

export const EcosystemWorkspace: React.FC = () => {
  const { params } = useBiologyStore();
  const { producerEnergy = 10000 } = params;

  const t1 = producerEnergy;
  const t2 = t1 * 0.10;
  const t3 = t2 * 0.10;
  const t4 = t3 * 0.10;

  return (
    <div className="w-full h-full bg-slate-950/90 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-between relative shadow-xl min-h-[380px]">
      <span className="w-full text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
        <Layers size={16} className="text-emerald-400" />
        LINDEMAN'S 10% ECOLOGICAL ENERGY PYRAMID
      </span>

      {/* SVG Energy Pyramid */}
      <div className="my-auto w-full max-w-md space-y-2 flex flex-col items-center">
        {/* Tier 4: Apex Predators */}
        <div className="w-28 bg-purple-900/80 border-2 border-purple-400 p-2 rounded-t-xl text-center text-xs font-bold text-purple-200 shadow-lg">
          <div>Apex Predators</div>
          <div className="font-black text-white">{t4.toFixed(1)} J (0.1%)</div>
        </div>

        {/* Tier 3: Carnivores */}
        <div className="w-48 bg-blue-900/80 border-2 border-blue-400 p-2.5 rounded-lg text-center text-xs font-bold text-blue-200 shadow-lg">
          <div>Secondary Consumers (Carnivores)</div>
          <div className="font-black text-white">{t3.toFixed(0)} J (1%)</div>
        </div>

        {/* Tier 2: Herbivores */}
        <div className="w-72 bg-amber-900/80 border-2 border-amber-400 p-3 rounded-lg text-center text-xs font-bold text-amber-200 shadow-lg">
          <div>Primary Consumers (Herbivores)</div>
          <div className="font-black text-white">{t2.toFixed(0)} J (10%)</div>
        </div>

        {/* Tier 1: Producers (Plants) */}
        <div className="w-full bg-emerald-900/80 border-2 border-emerald-400 p-3.5 rounded-b-xl text-center text-sm font-bold text-emerald-200 shadow-lg">
          <div>Primary Producers (Plants & Algae)</div>
          <div className="font-black text-white text-base">{t1.toFixed(0)} J (100% Base Energy)</div>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 italic text-center">
        Only ~10% of energy stored as biomass is passed to the next trophic level; 90% is lost as metabolic heat.
      </div>
    </div>
  );
};
