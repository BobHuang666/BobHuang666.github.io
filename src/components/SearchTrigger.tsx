import { useEffect, useState, lazy, Suspense } from 'react';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SearchPalette = lazy(() => import('./SearchPalette'));

/** 全局搜索触发器：按钮 + 全局 ⌘K / Ctrl+K 快捷键 */
export const SearchTrigger = ({ className = '' }: { className?: string }) => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const isEn = i18n.resolvedLanguage?.startsWith('en');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (meta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={isEn ? 'Search (Cmd+K)' : '搜索 (Cmd+K)'}
        title={isEn ? 'Search (⌘K)' : '搜索 (⌘K)'}
        className={`inline-flex h-9 items-center gap-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
      >
        <Search className="h-3.5 w-3.5" />
        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400">
          ⌘K
        </kbd>
      </button>

      <Suspense fallback={null}>
        <SearchPalette open={open} onClose={() => setOpen(false)} />
      </Suspense>
    </>
  );
};
