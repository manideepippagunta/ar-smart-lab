/**
 * useARLesson — Loads and validates an AR lesson configuration
 */

import { useState, useEffect } from 'react';
import { getARConfig } from '../config/ARLessonRegistry';
import type { ARLessonConfig } from '../config/ARLessonConfig';

export interface UseARLessonResult {
  config: ARLessonConfig | null;
  loading: boolean;
  notFound: boolean;
}

export function useARLesson(lessonId: string | undefined): UseARLessonResult {
  const [config, setConfig] = useState<ARLessonConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!lessonId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const found = getARConfig(lessonId);
    if (found) {
      setConfig(found);
      setNotFound(false);
    } else {
      setNotFound(true);
    }
    setLoading(false);
  }, [lessonId]);

  return { config, loading, notFound };
}
