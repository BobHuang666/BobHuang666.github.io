/** 应用根组件：Provider、路由、全局壳层与懒加载浮层的装配 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navigation from '@/shared/components/layout/Navigation';
import Footer from '@/shared/components/layout/Footer';
import ScrollToTopButton from '@/shared/components/effects/ScrollToTopButton';
import ScrollRestoration from '@/shared/components/effects/ScrollRestoration';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';
import { SearchProvider, SearchButton } from '@/features/search';

const AiAssistant = lazy(() => import('@/features/assistant/AiAssistant'));
const MouseParticles = lazy(() => import('@/shared/components/effects/MouseParticles'));

/**
 * 首屏渲染完成后再挂载全局增强组件，把 AI 助手与粒子效果的
 * 加载和执行让位给首帧渲染。
 */
function useIdleMount() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const start = () => setReady(true);
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 2000 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(start, 1500);
    return () => clearTimeout(timer);
  }, []);
  return ready;
}

export default function App() {
  const idleReady = useIdleMount();
  return (
    <AppProviders>
      <Router>
        <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation
            desktopExtra={<SearchButton />}
            mobileExtra={<SearchButton />}
          />
            <main className="flex-1 pt-16">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
        <ScrollRestoration />
        <ScrollToTopButton />
        {idleReady && (
          <>
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}><AiAssistant /></Suspense>
            </ErrorBoundary>
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}><MouseParticles /></Suspense>
            </ErrorBoundary>
          </>
        )}
        </SearchProvider>
      </Router>
    </AppProviders>
  );
}
