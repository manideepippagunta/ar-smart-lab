/**
 * useARSession — Manages the full AR engine session lifecycle in React
 *
 * Handles: initialization → start → pause/resume → stop
 * Cleans up on unmount automatically.
 */

import { useRef, useState, useEffect, useCallback } from 'react';
import { AREngine, type AREngineState } from '../engine/AREngine';
import type { ARLessonConfig } from '../config/ARLessonConfig';

export interface UseARSessionResult {
  engineState: AREngineState;
  containerRef: React.RefObject<HTMLDivElement>;
  start: () => Promise<void>;
  stop: () => void;
  handleTap: () => void;
}

export function useARSession(config: ARLessonConfig | null): UseARSessionResult {
  const containerRef = useRef<HTMLDivElement>(null!);
  const engineRef = useRef<AREngine | null>(null);

  const [engineState, setEngineState] = useState<AREngineState>({
    status: 'idle',
    markerFound: false,
    modelLoaded: false,
    error: null,
  });

  const start = useCallback(async () => {
    if (!config || !containerRef.current) return;

    const engine = new AREngine();
    engine.onStateChange = setEngineState;
    engineRef.current = engine;

    try {
      await engine.initialize(containerRef.current, config);
      await engine.start();
    } catch (err) {
      console.error('[useARSession] Failed to start AR session:', err);
    }
  }, [config]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
    engineRef.current = null;
  }, []);

  const handleTap = useCallback(() => {
    engineRef.current?.handleTap();
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      engineRef.current?.stop();
      engineRef.current = null;
    };
  }, []);

  return { engineState, containerRef, start, stop, handleTap };
}
