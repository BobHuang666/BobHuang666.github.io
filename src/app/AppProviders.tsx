/** 全局 Provider 组合入口 */
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ThemeProvider>
  );
}
