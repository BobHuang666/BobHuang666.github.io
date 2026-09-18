import type { ReactNode } from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ErrorBoundary } from '../shared/components/ui/ErrorBoundary';

/** Application-wide providers and failure boundary. Route layout lives separately. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  );
}
