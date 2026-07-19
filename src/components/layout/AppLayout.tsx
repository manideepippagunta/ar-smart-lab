import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  GraduationCap, Home, Calculator, Atom, BookOpen, Box, UserCheck, User,
  BarChart3, Award, Settings, HelpCircle, X, Search, Bell, ChevronRight, Menu,
  Info, FileText, Mail
} from 'lucide-react';

const GithubIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const learnNav = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Mathematics', path: '/math', icon: Calculator },
    { label: 'Science', path: '/science', icon: Atom },
    { label: 'Library', path: '/library', icon: BookOpen },
    { label: 'AR Showcase', path: '/ar', icon: Box },
  ];

  const dashboardNav = [
    { label: 'Student Dashboard', path: '/student', icon: User },
    { label: 'Teacher Dashboard', path: '/teacher', icon: UserCheck },
    { label: 'Progress', path: '/progress', icon: BarChart3 },
    { label: 'Achievements', path: '/achievements', icon: Award },
  ];

  const systemNav = [
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Help', path: '/help', icon: HelpCircle },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    return path !== '/' && location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/') return 'Home';
    if (p === '/math') return 'Mathematics';
    if (p === '/science') return 'Science';
    if (p === '/library') return 'Library';
    if (p === '/ar') return 'AR Showcase';
    if (p === '/teacher') return 'Teacher Dashboard';
    if (p === '/student') return 'Student Dashboard';
    if (p === '/progress') return 'Progress';
    if (p === '/achievements') return 'Achievements';
    if (p === '/settings') return 'Settings';
    if (p === '/help') return 'Help';
    return 'Dashboard';
  };

  const renderNavGroup = (title: string, items: typeof learnNav) => (
    <div className="mb-6">
      {title && <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">{title}</div>}
      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileDrawerOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.2)]'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-slate-500'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden font-sans text-slate-900">
      
      {/* ─── DESKTOP FLOATING SIDEBAR ─── */}
      <aside className="hidden md:flex w-[280px] m-4 mr-0 rounded-2xl bg-white border border-slate-200/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)] flex-shrink-0 flex-col justify-between p-6 z-30">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 mb-8 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105">
              <GraduationCap size={20} className="text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold text-slate-900 tracking-tight">AR Smart Lab</div>
              <div className="text-[10px] font-semibold text-slate-400">Class 6–10 Premium</div>
            </div>
          </div>

          {renderNavGroup('Learn', learnNav)}
          {renderNavGroup('Dashboards', dashboardNav)}
          {renderNavGroup('System', systemNav)}
        </div>

        {/* Bottom Profile Section */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200/70 bg-slate-50 cursor-pointer hover:border-slate-300 transition-colors">
            <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white text-[12px] font-bold flex items-center justify-center shadow-inner shrink-0">
              S
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div className="leading-tight overflow-hidden">
              <div className="text-[13px] font-bold text-slate-900 truncate">Student Account</div>
              <div className="text-[10px] text-slate-500 font-medium">Class 9 · CBSE</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── MOBILE DRAWER ─── */}
      {mobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setMobileDrawerOpen(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white p-6 flex flex-col shadow-2xl border-r border-slate-200/70" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                  <GraduationCap size={18} className="text-white" />
                </div>
                <span className="text-[14px] font-semibold text-slate-900">AR Smart Lab</span>
              </div>
              <button onClick={() => setMobileDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {renderNavGroup('Learn', learnNav)}
              {renderNavGroup('Dashboards', dashboardNav)}
              {renderNavGroup('System', systemNav)}
            </div>
          </div>
        </div>
      )}

      {/* ─── MAIN CONTENT AREA ─── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Sticky Premium Header */}
        <header className="h-16 px-6 lg:px-10 border-b border-slate-200/70 flex items-center justify-between shrink-0 z-20 bg-white/90 backdrop-blur-md sticky top-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileDrawerOpen(true)} className="md:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600">
              <Menu size={18} />
            </button>
            
            <div className="hidden sm:flex items-center text-[12px] font-semibold text-slate-400">
              <span className="hover:text-slate-900 cursor-pointer transition-colors" onClick={() => navigate('/')}>AR Smart Lab</span>
              <ChevronRight size={14} className="mx-1.5 text-slate-300" />
              <span className="text-slate-700">{getPageTitle()}</span>
            </div>
            <div className="sm:hidden text-[14px] font-bold text-slate-900">
              {getPageTitle()}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 gap-2 w-64 hover:border-slate-300 transition-all cursor-text focus-within:ring-2 focus-within:ring-blue-600/30">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="bg-transparent text-[13px] font-medium text-slate-900 placeholder-slate-400 outline-none w-full border-none"
              />
              <kbd className="text-[9px] font-mono text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">⌘K</kbd>
            </div>
            
            <div className="w-px h-6 bg-slate-200 hidden sm:block" />

            <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto relative bg-[#F8FAFC]">
          <div className="w-full min-h-full flex flex-col justify-between">
            <div className={location.pathname === '/' ? "w-full" : "max-w-[1440px] mx-auto w-full px-6 py-8 lg:px-10 lg:py-12"}>
              <Outlet />
            </div>

            {/* Footer */}
            <footer className="w-full bg-white border-t border-slate-200/70 mt-auto py-12 px-6 lg:px-12">
              <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                      <GraduationCap size={16} className="text-white" />
                    </div>
                    <span className="text-[15px] font-extrabold text-slate-900 tracking-tight">AR Smart Lab</span>
                  </div>
                  <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-xs">
                    Transforming curriculum science and mathematics into interactive, spatial 3D playgrounds.
                  </p>
                </div>
                
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Resources</div>
                  <ul className="space-y-2 text-[13px] font-medium text-slate-600">
                    <li><a href="#lessons" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"><FileText size={14} /> Lesson Library</a></li>
                    <li><a href="#docs" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"><Info size={14} /> Platform Guide</a></li>
                  </ul>
                </div>

                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Connect</div>
                  <ul className="space-y-2 text-[13px] font-medium text-slate-600">
                    <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"><GithubIcon size={14} /> GitHub Repository</a></li>
                    <li><a href="mailto:support@arsmartlab.edu" className="hover:text-blue-600 flex items-center gap-1.5 transition-colors"><Mail size={14} /> Contact Support</a></li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Integrity</div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full text-[11px] font-bold text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    All Engines Operational
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    Version 2.4.0 (Latest Release)
                  </div>
                </div>
              </div>

              <div className="max-w-[1440px] mx-auto border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-medium">
                <div>© {new Date().getFullYear()} AR Smart Lab. All rights reserved. Built for Next-Gen Science &amp; Maths.</div>
                <div className="flex gap-4 mt-2 sm:mt-0">
                  <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                  <a href="#terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                </div>
              </div>
            </footer>

          </div>
        </main>
      </div>

    </div>
  );
}
