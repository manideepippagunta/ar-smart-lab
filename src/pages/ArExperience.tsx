import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Scan, ArrowRight, Download, Zap, Layers, CheckCircle2, Lock } from 'lucide-react';
import { getAllARLessons } from '@/ar';

const fade = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 } };

export default function ArExperience() {
  const navigate = useNavigate();
  const arLessons = getAllARLessons();

  const categoryColors: Record<string, string> = {
    mathematics: 'text-blue-600 bg-blue-50 border-blue-200',
    physics: 'text-amber-600 bg-amber-50 border-amber-200',
    chemistry: 'text-green-600 bg-green-50 border-green-200',
    biology: 'text-red-600 bg-red-50 border-red-200',
    environment: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  };

  const features = [
    { icon: Scan, label: 'Image Marker Tracking', desc: 'Point at printed or on-screen markers' },
    { icon: Layers, label: '3D Model Overlay', desc: 'Interactive models appear in real space' },
    { icon: Zap, label: 'Zero App Download', desc: 'Runs entirely in the browser' },
  ];

  return (
    <div className="space-y-8 pb-16 font-sans">

      {/* ── Hero ── */}
      <motion.div {...fade} className="relative bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl overflow-hidden p-6 text-white">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Scan size={15} />
            </div>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-widest">Phase 1 · Live</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">AR Experiences</h1>
          <p className="text-sm text-blue-100 leading-relaxed max-w-lg">
            Scan a printed marker and see 3D models appear in your space. No app download required —
            works in Chrome and Safari on any modern device.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2">
                <Icon size={14} className="text-blue-200" />
                <div>
                  <p className="text-[11px] font-bold text-white">{label}</p>
                  <p className="text-[10px] text-blue-200">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Available AR lessons ── */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Available AR Lessons</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {arLessons.map((lesson, idx) => (
            <motion.div
              key={lesson.lessonId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              {/* Category chip */}
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryColors[lesson.category] ?? 'text-slate-600 bg-slate-100 border-slate-200'} mb-3`}>
                <CheckCircle2 size={9} />
                {lesson.category.toUpperCase()}
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">{lesson.title}</h3>
              {lesson.subtitle && (
                <p className="text-xs text-slate-500 mb-3">{lesson.subtitle}</p>
              )}

              {/* Annotations preview */}
              {lesson.annotations.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {lesson.annotations.slice(0, 3).map((ann) => (
                    <span
                      key={ann.label}
                      className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: ann.color ?? '#4F8EF7' }}
                    >
                      {ann.label}
                    </span>
                  ))}
                  {lesson.annotations.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">
                      +{lesson.annotations.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/ar/lesson/${lesson.lessonId}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Scan size={13} /> Start AR
                </button>

                {lesson.markerDownloadUrl && (
                  <a
                    href={lesson.markerDownloadUrl}
                    download
                    className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors"
                    title="Download printable marker"
                  >
                    <Download size={14} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Coming Soon ── */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Coming in Phase 2</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { title: 'Human Heart', cat: 'biology', class: 'Class 10' },
            { title: 'Cube & Cuboid', cat: 'mathematics', class: 'Class 8' },
            { title: 'Refraction of Light', cat: 'physics', class: 'Class 10' },
            { title: 'Atom Structure', cat: 'chemistry', class: 'Class 9' },
          ].map(({ title, cat, class: cls }) => (
            <div key={title} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3 opacity-60">
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                <Lock size={14} className="text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{title}</p>
                <p className="text-[10px] text-slate-400">{cat} · {cls}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
        <h2 className="text-sm font-bold text-slate-900 mb-4">How it Works</h2>
        <div className="space-y-3">
          {[
            { n: 1, text: 'Download and print the AR marker for your lesson' },
            { n: 2, text: 'Open the AR experience on your phone or tablet' },
            { n: 3, text: 'Point the camera at the marker' },
            { n: 4, text: 'A 3D model appears — tap it to interact!' },
          ].map(({ n, text }) => (
            <div key={n} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                {n}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{text}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/ar/lesson/Mathematics-class-9-triangles')}
          className="mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors"
        >
          Try Triangle AR Demo <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
