import { Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navigation from '../shared/components/layout/Navigation';
import Footer from '../shared/components/layout/Footer';
import ScrollToTopButton from '../shared/components/effects/ScrollToTopButton';
import ScrollRestoration from '../shared/components/effects/ScrollRestoration';
import { ErrorBoundary } from '../shared/components/ui/ErrorBoundary';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';
import { lazyWithRetry } from '../utils/lazyWithRetry';

const AiAssistant = lazyWithRetry(() => import('../features/assistant/AiAssistant'), 'AiAssistant');
const MouseParticles = lazyWithRetry(() => import('../shared/components/effects/MouseParticles'), 'MouseParticles');

/** Root composition: providers, shared shell, route outlet, and global overlays. */
export default function App() {
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
        {/* 可选增强：失败就静默降级，不能拖垮整站 */}
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}><AiAssistant /></Suspense>
        </ErrorBoundary>
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}><MouseParticles /></Suspense>
        </ErrorBoundary>
      </Router>
    </AppProviders>
  );
}
