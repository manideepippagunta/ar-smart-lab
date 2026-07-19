import { ARViewer } from '@/ar/components/ARViewer';

/**
 * ARLessonPage — Full-screen, standalone AR experience page.
 * Route: /ar/lesson/:id
 *
 * Does NOT use AppLayout — AR requires the full screen.
 */
export default function ARLessonPage() {
  return <ARViewer />;
}
