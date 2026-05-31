import { lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';

// 首页常驻，详情页全部懒加载
import HomePage from './pages/HomePage';
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const NowPage = lazy(() => import('./pages/NowPage'));
const UsesPage = lazy(() => import('./pages/UsesPage'));
const SeriesIndexPage = lazy(() => import('./pages/SeriesIndexPage'));
const SeriesDetailPage = lazy(() => import('./pages/SeriesDetailPage'));
const FriendsPage = lazy(() => import('./pages/FriendsPage'));
const FandomPage = lazy(() => import('./pages/FandomPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const PageLoading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400">
      <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">载入副本中…</span>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 pt-16">
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:id" element={<BlogDetailPage />} />
                  <Route path="/now" element={<NowPage />} />
                  <Route path="/uses" element={<UsesPage />} />
                  <Route path="/series" element={<SeriesIndexPage />} />
                  <Route path="/series/:slug" element={<SeriesDetailPage />} />
                  <Route path="/friends" element={<FriendsPage />} />
                  <Route path="/fandom" element={<FandomPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
