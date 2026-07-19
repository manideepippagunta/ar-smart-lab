import { Camera } from 'lucide-react';
export const StepRealWorld = ({ onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8 px-4 md:px-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Real World Applications</h2>
      <div className="grid md:grid-cols-2 gap-5 flex-1">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-300">
            <Camera size={48} />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Truss Bridges</h3>
            <p className="text-slate-600 leading-relaxed">Triangles are the strongest shape in architecture because any applied force is evenly distributed through its three sides.</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">
          <div className="h-44 bg-slate-100 flex items-center justify-center text-slate-300">
            <Camera size={48} />
          </div>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Navigation</h3>
            <p className="text-slate-600 leading-relaxed">GPS systems use triangulation, measuring the distance between three satellites, to pinpoint your exact location on Earth.</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={onNext} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-[0_4px_14px_rgba(37,99,235,0.25)]">Continue</button>
      </div>
    </div>
  );
};
