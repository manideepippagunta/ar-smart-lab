import { useLocation, useNavigate } from 'react-router';
import { Search, Bell, Menu, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface AppHeaderProps {
  onToggleMobileDrawer: () => void;
}

export function AppHeader({ onToggleMobileDrawer }: AppHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Home Overview';
      case '/math': return 'Mathematics Laboratory';
      case '/science': return 'Science Laboratory';
      case '/library': return 'Lesson Library';
      case '/ar': return 'AR Showcase';
      case '/teacher': return 'Teacher Control Portal';
      case '/student': return 'Student Portal';
      case '/progress': return 'Progress & Analytics';
      case '/achievements': return 'Achievements & Badges';
      case '/settings': return 'Platform Settings';
      case '/help': return 'Help & Guide';
      default:
        if (path.startsWith('/lesson/')) return 'Interactive Lesson';
        return 'Dashboard';
    }
  };

  const pageTitle = getPageTitle(location.pathname);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/library');
    }
  };

  return (
    <header className="h-16 px-8 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileDrawer}
          className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700"
        >
          <Menu size={18} />
        </button>

        <div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
            <span onClick={() => navigate('/')} className="hover:text-blue-500 cursor-pointer">AR Smart Lab</span>
            <ChevronRight size={12} />
            <span className="text-slate-600">{pageTitle}</span>
          </div>
          <h2 className="text-base font-black text-slate-900 leading-none mt-0.5">
            {pageTitle}
          </h2>
        </div>
      </div>

      {/* Right: Search, Notifications & User Avatar */}
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:flex relative max-w-xs w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search lessons & topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </form>

        {/* Notifications Icon */}
        <button className="relative p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="relative w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-md">
            S
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div className="hidden lg:block text-left leading-tight">
            <div className="text-xs font-extrabold text-slate-900">Student Account</div>
            <div className="text-[10px] font-semibold text-slate-400">Class 9 • CBSE</div>
          </div>
        </div>
      </div>
    </header>
  );
}
