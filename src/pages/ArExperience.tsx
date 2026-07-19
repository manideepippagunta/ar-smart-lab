import { useNavigate } from 'react-router';
import { Box, Layers, Smartphone, ArrowRight, ShieldCheck, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 } };

export default function ArExperience() {
  const navigate = useNavigate();

  const features = [
    { icon: Box, title: 'Multi-Marker Camera Tracking', description: 'Align physical NCERT textbook diagrams with real-time WebGL 3D overlays using camera tracking tags.' },
    { icon: Layers, title: 'Interactive 3D Physical Kits', description: 'Manipulate virtual gears, prisms, molecular bonds, and electric circuits projected into real space.' },
    { icon: Smartphone, title: 'Zero App Download WebAR', description: 'Runs directly inside modern Web browsers on laptops, tablets, and smartphones via WebXR APIs.' },
    { icon: ShieldCheck, title: 'Curriculum-Aligned Overlays', description: 'Directly linked to CBSE & NCERT Class 6–10 Mathematics and Science textbook activities.' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Roadmap Banner */}
      <motion.div
        {...fade}
        className="bg-[#18181B] border border-zinc-800 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-400 flex items-center justify-center shrink-0">
            <Rocket size={20} />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-0.5">Roadmap · v2.0</div>
            <h2 className="text-sm font-semibold text-white">AR Experience Coming Soon</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Marker-based augmented reality learning will be available in Version 2.0.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/library')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
        >
          Explore Library <ArrowRight size={13} />
        </button>
      </motion.div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">AR Showcase</h1>
        <p className="text-sm text-zinc-500 mt-1">Upcoming spatial manipulation tools and textbook marker overlays.</p>
      </div>

      {/* Feature Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * idx }}
              className="bg-white border border-zinc-200 p-5 rounded-xl flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-0.5">{feat.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{feat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
