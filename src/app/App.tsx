import { lazy, Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Navigation from '../shared/components/layout/Navigation';
import Footer from '../shared/components/layout/Footer';
import ScrollToTopButton from '../shared/components/effects/ScrollToTopButton';
import ScrollRestoration from '../shared/components/effects/ScrollRestoration';
import { AppProviders } from './AppProviders';
import { AppRoutes } from './routes';

const AiAssistant = lazy(() => import('../features/assistant/AiAssistant'));
const MouseParticles = lazy(() => import('../shared/components/effects/MouseParticles'));

/** Root composition: providers, shared shell, route outlet, and global overlays. */
export default function App() {
  return (
    <AppProviders>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 pt-16"><AppRoutes /></main>
          <Footer />
        </div>
        <ScrollRestoration />
        <ScrollToTopButton />
        <Suspense fallback={null}><AiAssistant /></Suspense>
        <Suspense fallback={null}><MouseParticles /></Suspense>
      </Router>
    </AppProviders>
  );
}
