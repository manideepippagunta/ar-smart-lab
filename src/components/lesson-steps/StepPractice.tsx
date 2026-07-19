export const StepPractice = ({ onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8 text-center justify-center font-sans">
      <h2 className="text-4xl font-extrabold mb-4 text-slate-900">Practice Mode</h2>
      <p className="text-lg text-slate-500 mb-8 font-semibold">Let's solidify what we've learned.</p>
      <div>
        <button
          onClick={onNext}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition text-lg shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:scale-105 active:scale-95"
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};
