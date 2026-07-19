import { Users, BookOpen, Activity, AlertCircle, Settings2, Shield, Eye, Lock } from 'lucide-react';
import { useLessonStore } from '../store/LessonStore';
import { ToggleSwitch } from '../components/ui/ToggleSwitch';
import { motion } from 'framer-motion';

export default function TeacherDashboard() {
  const { teacherMode, setTeacherMode } = useLessonStore();

  const activeStudents = [
    { name: 'Rahul Sharma', class: '9A', lesson: 'Reflection & Refraction', status: 'Active', progress: 65, alert: false },
    { name: 'Priya Patel', class: '9A', lesson: 'Linear Equations', status: 'Stuck', progress: 30, alert: true },
    { name: 'Amit Kumar', class: '10B', lesson: 'Chemical Reactions', status: 'Completed', progress: 100, alert: false },
    { name: 'Sneha Gupta', class: '10B', lesson: 'Plant Cells', status: 'Active', progress: 85, alert: false },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* ─── HEADER & MASTER CONTROL ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-page-title text-slate-900">Teacher Control Center</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold">Monitor students, manage lab configurations, and override lessons.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white px-5 py-3.5 rounded-[20px] border border-slate-200/80 shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${teacherMode ? 'bg-emerald-50 text-emerald-600 border-emerald-200/60' : 'bg-slate-50 text-slate-400 border-slate-200/60'}`}>
              <Shield size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-900 tracking-wider uppercase">Master Override</div>
              <div className="text-[10px] text-slate-500 font-medium">Reveal answers &amp; skip locks</div>
            </div>
          </div>
          <div className="w-px h-8 bg-slate-200 mx-2" />
          <ToggleSwitch checked={teacherMode} onChange={(c) => setTeacherMode(c)} />
        </div>
      </div>

      {/* ─── SYSTEM STATS ─── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Active Students', value: '42', icon: Users, color: 'blue' },
          { label: 'Lab Sessions', value: '18', icon: Activity, color: 'emerald' },
          { label: 'Pending Reviews', value: '7', icon: BookOpen, color: 'amber' },
          { label: 'System Alerts', value: '1', icon: AlertCircle, color: 'rose' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="metric-card bg-white flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight mb-0.5">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ─── LIVE STUDENT MONITORING (DATA TABLE) ─── */}
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-section-title text-slate-900 flex items-center gap-2">
              <Activity size={18} className="text-blue-500" /> Live Classroom Activity
            </h2>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl">
              <Settings2 size={14} /> Filter
            </button>
          </div>
          
          <div className="bg-white border border-slate-200/60 rounded-[20px] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200/60">
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Student</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Lesson</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Progress</th>
                  <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activeStudents.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-slate-900">{student.name}</div>
                          <div className="text-[10px] font-semibold text-slate-400">Class {student.class}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-[13px] font-medium text-slate-700">{student.lesson}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${student.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${student.progress}%` }} />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-455">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[9px] font-bold uppercase tracking-wider ${
                        student.alert ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        student.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                        'bg-blue-50 text-blue-600 border border-blue-105'
                      }`}>
                        {student.alert && <AlertCircle size={10} />}
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ─── LAB CONTROLS SIDEBAR ─── */}
        <section className="space-y-6">
          <h2 className="text-section-title text-slate-900">Lab Restrictions</h2>
          
          <div className="bg-white border border-slate-205 rounded-[20px] shadow-sm p-6 space-y-6">
            
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Lock size={16} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">Strict Sequencing</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5 max-w-[180px] leading-relaxed">Force students to complete modules in order.</p>
                </div>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Eye size={16} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">Hide Engine Parameters</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5 max-w-[180px] leading-relaxed">Lock UI sliders until the quiz is completed.</p>
                </div>
              </div>
              <ToggleSwitch checked={false} onChange={() => {}} />
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Shield size={16} />
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-slate-900">Safe Mode Simulation</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-0.5 max-w-[180px] leading-relaxed">Prevent explosive/extreme parameter combinations.</p>
                </div>
              </div>
              <ToggleSwitch checked={true} onChange={() => {}} />
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
