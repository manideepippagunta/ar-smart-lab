import { Introduction } from './Introduction';
import { InteractiveView } from './InteractiveView';
import { Controls } from './Controls';
import { Theory } from './Theory';

export function LessonLayout(_: { lessonData: unknown }) {
  return (
    <div className="flex flex-col h-full gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-2">
          <Introduction />
          <Theory />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex-1 relative rounded-2xl overflow-hidden glass-panel">
            <InteractiveView />
          </div>
          <div className="h-48">
            <Controls />
          </div>
        </div>
      </div>
    </div>
  );
}

