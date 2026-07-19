import React from 'react';
import { FolderOpen, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionRoute?: string;
  icon?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  description = 'There is currently no activity recorded for this section.',
  actionText = 'Explore Library',
  actionRoute = '/library',
  icon: Icon = FolderOpen
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-[20px] border border-dashed border-slate-200 my-6 shadow-sm">
      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mb-4 shadow-inner">
        <Icon size={22} />
      </div>
      <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed font-semibold">
        {description}
      </p>
      {actionText && actionRoute && (
        <button
          onClick={() => navigate(actionRoute)}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all duration-150 active:scale-[0.98] flex items-center gap-1.5 shadow-sm"
        >
          {actionText} <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
};
