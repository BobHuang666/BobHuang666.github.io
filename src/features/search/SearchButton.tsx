/** 唤起搜索面板的按钮 */
import { Search } from 'lucide-react';
import { useSearch } from './searchState';

export const SearchButton = ({ className = '' }: { className?: string }) => {
  const { setOpen } = useSearch();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="搜索 (Cmd+K)"
      title="搜索 (⌘K)"
      className={`inline-flex h-9 items-center gap-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
      <Search className="h-3.5 w-3.5" />
      <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono rounded border border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400">
        ⌘K
      </kbd>
    </button>
  );
};
