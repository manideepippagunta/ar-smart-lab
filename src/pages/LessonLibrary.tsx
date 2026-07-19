import { useEffect, useState, useMemo } from 'react';
import { useLessonStore } from '../store/LessonStore';
import type { FullLessonExperience } from '../types/lesson';
import { useNavigate } from 'react-router';
import { Search, Clock, ArrowRight, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmptyState } from '../components/shared/EmptyState';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { hasARSupport } from '@/ar';

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" }
} as const;

export default function LessonLibrary() {
  const { lessons, discoverLessons, setCurrentLesson } = useLessonStore();
  const navigate = useNavigate();
  
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    discoverLessons();
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [discoverLessons]);

  const classes = ['all', 'class-6', 'class-7', 'class-8', 'class-9', 'class-10'];

  const filteredLessons = useMemo(() => {
    return Object.values(lessons).filter((l) => {
      const matchesClass = selectedClass === 'all' || l.classId === selectedClass;
      const matchesQuery = searchQuery.trim() === '' || l.title.toLowerCase().includes(searchQuery.toLowerCase()) || l.engine.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesClass && matchesQuery;
    });
  }, [lessons, selectedClass, searchQuery]);

  // Group by Subject
  const groupedLessons = useMemo(() => {
    const groups: Record<string, FullLessonExperience[]> = {};
    filteredLessons.forEach((l) => {
      if (!groups[l.subject]) groups[l.subject] = [];
      groups[l.subject].push(l);
    });
    return groups;
  }, [filteredLessons]);

  const handleStart = (id: string) => { 
    setCurrentLesson(id); 
    navigate(`/lesson/${id}`); 
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* ─── HEADER & SEARCH BAR ─── */}
      <motion.div 
        {...fadeUp} 
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <h1 className="text-page-title text-slate-900">Lesson Library</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Browse 52 interactive laboratory experiments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Class Filter */}
          <div className="flex items-center gap-1 bg-white border border-slate-205 p-1 rounded-xl w-full sm:w-auto overflow-x-auto scrollbar-hide shadow-sm shrink-0">
            {classes.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  selectedClass === c 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-905'
                }`}
              >
                {c === 'all' ? 'All Classes' : c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64 shrink-0 shadow-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search concepts or engines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-205 rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/35 focus:border-blue-600/50 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* ─── CONTENT AREA ─── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : Object.keys(groupedLessons).length === 0 ? (
        <EmptyState title="No Lessons Found" description="Try adjusting your filters or search query." actionText="Clear Filters" actionRoute="/library" />
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedLessons).map(([subject, lessonsForSubject]) => (
            <div key={subject} className="space-y-6">
              <div className="flex items-center gap-3">
                <h2 className="text-section-title text-slate-900">{subject}</h2>
                <div className="h-px flex-1 bg-slate-200/60" />
                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-xl border border-slate-205">
                  {lessonsForSubject.length} Lessons
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {lessonsForSubject.map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (idx % 4) * 0.05, duration: 0.3 }}
                    className="group flex flex-col bg-white border border-slate-205 rounded-[20px] overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer"
                    onClick={() => handleStart(lesson.id)}
                  >
                    {/* Top Thumbnail Section */}
                    <div className="h-32 bg-slate-50 p-6 flex flex-col justify-between border-b border-slate-100 relative overflow-hidden">
                      <div className="flex justify-between items-start relative z-10">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-500/10">
                            {lesson.classId.replace('-', ' ')}
                          </span>
                          {hasARSupport(lesson.id) && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-500/10 flex items-center gap-0.5">
                              ⬡ AR
                            </span>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:text-blue-500 transition-transform">
                          <BookOpen size={14} />
                        </div>
                      </div>
                      
                      <div className="relative z-10">
                        <div className="text-[10px] font-mono font-bold text-slate-400 truncate">
                          {lesson.engine}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Info Section */}
                    <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                      <div className="space-y-2">
                        <h3 className="text-[15px] font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                          {lesson.title}
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                          {lesson.steps.intro.learningOutcomes[0]}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                          <Clock size={14} />
                          {lesson.steps.intro.duration}
                        </div>
                        <button className="flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                          Start <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
