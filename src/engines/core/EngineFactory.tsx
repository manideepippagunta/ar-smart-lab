import { Suspense, forwardRef } from 'react';
import { EngineRegistry } from './EngineRegistry';
import type { EngineProps, EngineImperativeAPI } from './types';

interface EngineFactoryProps extends EngineProps {
  engineName: string;
}

export const EngineFactory = forwardRef<EngineImperativeAPI, EngineFactoryProps>(
  ({ engineName, ...props }, ref) => {
    const EngineComponent = EngineRegistry[engineName] || EngineRegistry['Interactive Engine'];
    const Comp = EngineComponent as any;

    return (
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-mono animate-pulse">Loading {engineName}...</div>}>
        <Comp ref={ref} {...props} />
      </Suspense>
    );
  }
);

EngineFactory.displayName = 'EngineFactory';
