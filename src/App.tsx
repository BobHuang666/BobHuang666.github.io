import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import ScrollToTopButton from './components/ScrollToTopButton';
import ScrollRestoration from './components/ScrollRestoration';
import { PageSkeleton } from './components/Skeleton';

// 首页常驻，浮层组件与详情页全部懒加载
import HomePage from './pages/HomePage';
const AiAssistant = lazy(() => import('./components/AiAssistant'));
const MouseParticles = lazy(() => import('./components/MouseParticles'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const FandomPage = lazy(() => import('./pages/FandomPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ServerErrorPage = lazy(() => import('./pages/ServerErrorPage'));

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 pt-16">
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/fandom" element={<FandomPage />} />
                  <Route path="/500" element={<ServerErrorPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
          <ScrollRestoration />
          <ScrollToTopButton />
          <Suspense fallback={null}><AiAssistant /></Suspense>
          <Suspense fallback={null}><MouseParticles /></Suspense>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
