import { EngineLoader } from '../../engines/core/EngineLoader';

export const StepExploration = ({ onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      {/* Immersive Fullscreen Engine */}
      <div className="flex-1 w-full h-full relative">
        <EngineLoader />
      </div>

      {/* Exploration Overlay */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-200 max-w-sm pointer-events-auto">
          <h3 className="text-base font-bold text-slate-900 mb-2">Exploration Mode</h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            Freely drag the vertices of the triangle to see how the properties change in real-time.
          </p>
          <div className="flex justify-between items-center">
            <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold uppercase">Show Hint</button>
            <button 
              onClick={onNext}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm transition"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
