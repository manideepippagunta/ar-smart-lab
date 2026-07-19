/**
 * AR Module Public API
 *
 * Everything external code needs to use the AR module.
 * Internal engine details remain encapsulated.
 */

// Main component
export { ARViewer } from './components/ARViewer';

// Configuration types
export type { ARLessonConfig, ARModelConfig, ARAnnotation, ARInteraction } from './config/ARLessonConfig';

// Registry utilities
export { hasARSupport, getARConfig, getAllARLessons } from './config/ARLessonRegistry';

// Hooks (for custom integrations)
export { useARSession } from './hooks/useARSession';
export { useARLesson } from './hooks/useARLesson';
export { useCapabilityCheck } from './hooks/useCapabilityCheck';

// Analytics event bus (for external subscriptions)
export { AREventEmitter } from './engine/AREventEmitter';
export type { AREventType, AREventPayload } from './engine/AREventEmitter';
