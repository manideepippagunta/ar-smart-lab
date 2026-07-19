import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import { Volume2 } from 'lucide-react';
import { useVoiceAdapter } from '../../engines/hooks/adapters';

export const StepTheory = ({ onNext }: any) => {
  const voice = useVoiceAdapter();

  const handleRead = () => {
    voice.speak("A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry. A triangle with vertices A, B, and C is denoted as triangle ABC. In Euclidean geometry, any three points, when non-collinear, determine a unique triangle and simultaneously, a unique plane.");
  };

  return (
    <div className="w-full h-full flex flex-col max-w-4xl mx-auto py-8 px-4 md:px-8">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Theory &amp; Core Concepts</h2>
        <button 
          onClick={handleRead}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-blue-600 rounded-lg text-sm font-semibold transition border border-slate-200"
        >
          <Volume2 size={16} /> Listen
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-hide text-base text-slate-700 leading-relaxed">
        <p>
          A triangle is a polygon with three edges and three vertices. It is one of the basic shapes in geometry. A triangle with vertices A, B, and C is denoted as <span className="font-bold text-slate-900">△ABC</span>.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Classification by Sides</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Equilateral:</strong> All three sides are equal.</li>
              <li><strong className="text-slate-800">Isosceles:</strong> Two sides are equal in length.</li>
              <li><strong className="text-slate-800">Scalene:</strong> All sides have different lengths.</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Classification by Angles</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-600">
              <li><strong className="text-slate-800">Acute:</strong> All angles are less than 90°.</li>
              <li><strong className="text-slate-800">Right:</strong> One angle is exactly 90°.</li>
              <li><strong className="text-slate-800">Obtuse:</strong> One angle is greater than 90°.</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-blue-700 mb-4">Heron's Formula</h3>
          <p className="mb-4 text-slate-700">
            If you know the lengths of all three sides of a triangle, you can find its area using Heron's Formula. First, find the semi-perimeter (s):
          </p>
          <div className="bg-white p-4 rounded-xl mb-4 overflow-x-auto border border-blue-100 shadow-sm">
            <BlockMath math={`s = \\frac{a + b + c}{2}`} />
          </div>
          <p className="mb-4 text-slate-700">Then, use it to find the Area (A):</p>
          <div className="bg-white p-4 rounded-xl overflow-x-auto border border-blue-100 shadow-sm">
            <BlockMath math={`A = \\sqrt{s(s-a)(s-b)(s-c)}`} />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={onNext}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition hover:-translate-y-0.5"
        >
          Begin Exploration
        </button>
      </div>
    </div>
  );
};
