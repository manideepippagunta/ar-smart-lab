import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useARSession } from '../hooks/useARSession';
import { useARLesson } from '../hooks/useARLesson';
import { useCapabilityCheck } from '../hooks/useCapabilityCheck';
import { ARHud } from './ARHud';
import { ARLoadingScreen } from './ARLoadingScreen';
import { ARErrorScreen } from './ARErrorScreen';
import { MarkerGuide } from './MarkerGuide';

type ViewState = 'capability-check' | 'guide' | 'ar' | 'error';

interface ARViewerProps {
  lessonId?: string;
}

export function ARViewer({ lessonId: propLessonId }: ARViewerProps) {
  const { id: routeLessonId } = useParams<{ id: string }>();
  const lessonId = propLessonId ?? routeLessonId;
  const navigate = useNavigate();

  const { result: capabilities, loading: capsLoading } = useCapabilityCheck();
  const { config, loading: configLoading, notFound } = useARLesson(lessonId);

  const [viewState, setViewState] = useState<ViewState>('capability-check');
  const [errorType, setErrorType] = useState<'permission' | 'unsupported' | 'engine' | 'not-found'>('engine');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const { engineState, containerRef, start, stop, handleTap } = useARSession(config);

  // Determine initial view state after checks complete
  useEffect(() => {
    if (capsLoading || configLoading) return;

    if (notFound) {
      setErrorType('not-found');
      setViewState('error');
      return;
    }

    if (!capabilities?.supported) {
      setErrorType('unsupported');
      setViewState('error');
      return;
    }

    // Capabilities OK → show marker guide first
    setViewState('guide');
  }, [capsLoading, configLoading, capabilities, notFound]);

  // Watch for engine errors
  useEffect(() => {
    if (engineState.status === 'error' && engineState.error) {
      const isPermission = engineState.error.toLowerCase().includes('permission') ||
        engineState.error.toLowerCase().includes('notallowed');
      setErrorType(isPermission ? 'permission' : 'engine');
      setErrorMessage(engineState.error);
      setViewState('error');
    }
  }, [engineState.status, engineState.error]);

  const handleStartAR = async () => {
    setViewState('ar');
    try {
      await start();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      const isPermission = msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('notallowed');
      setErrorType(isPermission ? 'permission' : 'engine');
      setErrorMessage(msg);
      setViewState('error');
    }
  };

  const handleClose = () => {
    stop();
    navigate(-1);
  };

  const handleRetry = () => {
    stop();
    setViewState('guide');
  };

  // Loading state
  if (capsLoading || configLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-400">Loading AR experience...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black font-sans overflow-hidden">
      <AnimatePresence mode="wait">

        {/* Marker Setup Guide */}
        {viewState === 'guide' && config && (
          <motion.div
            key="guide"
            className="absolute inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MarkerGuide
              config={config}
              onContinue={handleStartAR}
              onClose={handleClose}
            />
          </motion.div>
        )}

        {/* Error screen */}
        {viewState === 'error' && (
          <motion.div
            key="error"
            className="absolute inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ARErrorScreen
              type={errorType}
              message={errorMessage}
              capabilities={capabilities ?? undefined}
              onRetry={errorType !== 'not-found' ? handleRetry : undefined}
              onGoBack={handleClose}
            />
          </motion.div>
        )}

        {/* AR viewport */}
        {viewState === 'ar' && config && (
          <motion.div
            key="ar"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* MindAR attaches its canvas + video inside this div */}
            <div
              ref={containerRef}
              className="w-full h-full"
              onClick={handleTap}
              style={{ position: 'relative' }}
            />

            {/* AR HUD overlay */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="pointer-events-auto">
                <ARHud
                  config={config}
                  engineState={engineState}
                  onClose={handleClose}
                  onTap={handleTap}
                />
              </div>
            </div>

            {/* Loading overlay (while initializing) */}
            <AnimatePresence>
              {(engineState.status === 'idle' || engineState.status === 'initializing') && (
                <motion.div
                  className="absolute inset-0 z-30"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ARLoadingScreen status={engineState.status} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
