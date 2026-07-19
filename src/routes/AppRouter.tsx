import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { SplashScreen } from '@/components/shared/SplashScreen';
import { ToastProvider } from '@/components/shared/ToastProvider';

// Lazy loading pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const ChooseRole = lazy(() => import('@/pages/ChooseRole'));
const StudentDashboard = lazy(() => import('@/pages/StudentDashboard'));
const TeacherDashboard = lazy(() => import('@/pages/TeacherDashboard'));
const MathDashboard = lazy(() => import('@/pages/MathDashboard'));
const ScienceDashboard = lazy(() => import('@/pages/ScienceDashboard'));
const LessonLibrary = lazy(() => import('@/pages/LessonLibrary'));
const LessonViewer = lazy(() => import('@/pages/LessonViewer'));
const ArExperience = lazy(() => import('@/pages/ArExperience'));
const Progress = lazy(() => import('@/pages/Progress'));
const Achievements = lazy(() => import('@/pages/Achievements'));
const Settings = lazy(() => import('@/pages/Settings'));
const HelpCenter = lazy(() => import('@/pages/HelpCenter'));

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SplashScreen>
          <Suspense fallback={
            <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              {/* Standalone Lesson Viewer */}
              <Route path="/lesson/:id" element={<LessonViewer />} />

              {/* Main Application Pages with Layout Sidebar */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/role" element={<ChooseRole />} />
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/math" element={<MathDashboard />} />
                <Route path="/science" element={<ScienceDashboard />} />
                <Route path="/library" element={<LessonLibrary />} />
                <Route path="/ar" element={<ArExperience />} />
                <Route path="/progress" element={<Progress />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/help" element={<HelpCenter />} />
              </Route>
            </Routes>
          </Suspense>
        </SplashScreen>
      </ToastProvider>
    </BrowserRouter>
  );
};
