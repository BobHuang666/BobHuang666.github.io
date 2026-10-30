/** 搜索面板的全局容器（快捷键监听 + Portal 挂载） */
import { lazy, Suspense, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary';
import { SearchContext } from './searchState';

const SearchPalette = lazy(() => import('./SearchPalette'));

function isEditable(el: Element | null): boolean {
  return el instanceof HTMLElement
    && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
}

/**
 * 唯一持有面板开关状态，单实例监听快捷键并 Portal 挂载命令面板。
 * 面板按需懒加载，加载失败静默降级。
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === '/' && !isEditable(document.activeElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
      {/* Portal 挂到 body：脱离导航栏的 transform stacking context，蒙层才能全屏覆盖 */}
      {createPortal(
        <ErrorBoundary fallback={null}>
          <Suspense fallback={null}>
            <SearchPalette open={open} onClose={() => setOpen(false)} />
          </Suspense>
        </ErrorBoundary>,
        document.body,
      )}
    </SearchContext.Provider>
  );
}
