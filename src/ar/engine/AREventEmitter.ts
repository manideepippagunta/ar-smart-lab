/**
 * AREventEmitter — Analytics & Lifecycle Event Bus
 *
 * Exposes well-defined lifecycle events for future analytics integration.
 * Lessons and external systems subscribe to these events without coupling
 * to AR engine internals.
 *
 * Events emitted:
 *  - session:start     — AR session successfully started
 *  - session:end       — AR session ended (by user or error)
 *  - marker:found      — Target marker detected in camera feed
 *  - marker:lost       — Target marker lost from camera feed
 *  - model:loading     — 3D model began loading
 *  - model:loaded      — 3D model finished loading and is visible
 *  - model:error       — 3D model failed to load
 *  - interaction:tap   — User tapped an AR object
 *  - annotation:show   — An annotation label became visible
 *  - error:camera      — Camera permission denied or unavailable
 *  - error:unsupported — Device/browser does not support AR
 */

export type AREventType =
  | 'session:start'
  | 'session:end'
  | 'marker:found'
  | 'marker:lost'
  | 'model:loading'
  | 'model:loaded'
  | 'model:error'
  | 'interaction:tap'
  | 'annotation:show'
  | 'error:camera'
  | 'error:unsupported';

export interface AREventPayload {
  timestamp: number;
  lessonId?: string;
  targetIndex?: number;
  modelSrc?: string;
  annotationLabel?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

type AREventHandler = (payload: AREventPayload) => void;

class AREventEmitterClass {
  private readonly listeners = new Map<AREventType, Set<AREventHandler>>();

  on(event: AREventType, handler: AREventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    // Return unsubscribe function
    return () => this.off(event, handler);
  }

  off(event: AREventType, handler: AREventHandler): void {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: AREventType, payload: Omit<AREventPayload, 'timestamp'>): void {
    const fullPayload: AREventPayload = {
      ...payload,
      timestamp: Date.now(),
    };

    if (import.meta.env.DEV) {
      console.debug(`[AR Event] ${event}`, fullPayload);
    }

    this.listeners.get(event)?.forEach((handler) => {
      try {
        handler(fullPayload);
      } catch (err) {
        console.error(`[AREventEmitter] Handler error for "${event}":`, err);
      }
    });
  }

  /** Remove all listeners (call on app unmount) */
  clear(): void {
    this.listeners.clear();
  }
}

/** Singleton event bus — shared across all AR components */
export const AREventEmitter = new AREventEmitterClass();
