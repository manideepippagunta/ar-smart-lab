export const StepSummary = ({ onNext }: any) => {
  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-12 px-4 md:px-8">
      <h2 className="text-3xl font-bold mb-8 text-slate-900 text-center">Summary</h2>
      <div className="bg-white border border-slate-200 p-8 rounded-3xl flex-1 shadow-sm">
        <h3 className="text-lg font-bold text-blue-700 mb-4">Key Takeaways</h3>
        <ul className="list-disc pl-5 space-y-4 text-slate-700 text-base leading-relaxed">
          <li>Triangles are the strongest architectural shape.</li>
          <li>They are classified by sides (Equilateral, Isosceles, Scalene).</li>
          <li>They are classified by angles (Acute, Right, Obtuse).</li>
          <li>The sum of internal angles is always 180°.</li>
        </ul>
      </div>
      <div className="mt-8 flex justify-center">
        <button
          onClick={onNext}
          className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition text-lg shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5"
        >
          Claim Reward
        </button>
      </div>
    </div>
  );
};
