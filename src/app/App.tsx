import { lazy, Suspense, useEffect, useState } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navigation from '../shared/components/layout/Navigation';
import Footer from '../shared/components/layout/Footer';
import ScrollToTopButton from '../shared/components/effects/ScrollToTopButton';
import ScrollRestoration from '../shared/components/effects/ScrollRestoration';
import { ErrorBoundary } from '../shared/components/ui/ErrorBoundary';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';

const AiAssistant = lazy(() => import('../features/assistant/AiAssistant'));
const MouseParticles = lazy(() => import('../shared/components/effects/MouseParticles'));

/**
 * 首屏渲染完成后再挂载全局增强组件（AI 助手 / 鼠标粒子），
 * 避免它们的加载与执行挤占首帧渲染（LCP）的主线程。
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

/** Root composition: providers, shared shell, route outlet, and global overlays. */
export default function App() {
  const idleReady = useIdleMount();
  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          {/* 路由级错误边界：单个页面 chunk 挂掉时，导航栏 / 页脚仍可用 */}
          <main className="flex-1 pt-16">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </main>
          <Footer />
        </div>
        <ScrollRestoration />
        <ScrollToTopButton />
        {/* 可选增强：失败就静默降级，不能拖垮整站；空闲时再挂载，不与首屏抢主线程 */}
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
      </Router>
    </AppProviders>
  );
}
