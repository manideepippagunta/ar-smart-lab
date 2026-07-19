export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-[20px] animate-pulse space-y-4 shadow-sm">
      <div className="flex gap-2">
        <div className="w-14 h-4 bg-slate-100 rounded-lg" />
        <div className="w-12 h-4 bg-slate-100 rounded-lg" />
      </div>
      <div className="w-3/4 h-5 bg-slate-100 rounded-lg" />
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-100 rounded-md" />
        <div className="w-5/6 h-3 bg-slate-100 rounded-md" />
      </div>
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="w-20 h-3.5 bg-slate-100 rounded-md" />
        <div className="w-16 h-6 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}
