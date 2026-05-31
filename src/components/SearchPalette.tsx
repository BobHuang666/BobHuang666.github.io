import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Fuse from 'fuse.js';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { searchCorpus, KIND_META, type SearchItem } from '../data/searchIndex';

interface Props {
  open: boolean;
  onClose: () => void;
}

const SearchPalette = ({ open, onClose }: Props) => {
  const { i18n } = useTranslation();
  const isEn = i18n.resolvedLanguage?.startsWith('en');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(searchCorpus, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'description', weight: 1 },
          { name: 'tags', weight: 2 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 1,
      }),
    [],
  );

  // 默认列表：项目 + 页面（无搜索词时）
  const defaultList = useMemo(
    () => searchCorpus.filter((i) => i.kind === 'page' || i.kind === 'project').slice(0, 8),
    [],
  );

  const results = useMemo<SearchItem[]>(() => {
    const kw = query.trim();
    if (!kw) return defaultList;
    return fuse.search(kw, { limit: 12 }).map((r) => r.item);
  }, [query, fuse, defaultList]);

  // 打开时聚焦输入框；关闭时清空状态
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // 等待 DOM 渲染
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // 锁滚 + Esc 关闭
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  // active 变化时滚动到可见
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const jump = useCallback(
    (item: SearchItem) => {
      // HashRouter 直接改 location.hash
      window.location.hash = item.href.replace(/^#/, '');
      onClose();
    },
    [onClose],
  );

  if (!open) return null;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = results[active];
      if (item) jump(item);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      role="dialog"
      aria-modal="true"
      aria-label={isEn ? 'Search' : '搜索'}
    >
      {/* 遮罩 */}
      <button
        type="button"
        aria-label="close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      />

      <div className="relative w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-up">
        {/* 输入框 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={handleKey}
            placeholder={
              isEn
                ? 'Search projects, posts, awards, skills…'
                : '搜索项目、博客、奖项、技能…'
            }
            className="flex-1 bg-transparent outline-none text-base placeholder-slate-400 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={onClose}
            aria-label="close"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 结果列表 */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto scrollbar-thin">
          {results.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
              {isEn ? 'No results' : '没有找到匹配的内容'}
            </div>
          ) : (
            <ul role="listbox" className="py-2">
              {results.map((item, i) => {
                const meta = KIND_META[item.kind];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-idx={i}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => jump(item)}
                      className={`w-full text-left px-4 py-2.5 flex items-start gap-3 transition-colors ${
                        active === i
                          ? 'bg-indigo-50 dark:bg-indigo-950/40'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span
                        className={`shrink-0 mt-0.5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider rounded ${meta.color}`}
                      >
                        {isEn ? meta.labelEn : meta.label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item.description}
                        </div>
                      </div>
                      <ArrowRight className="shrink-0 h-4 w-4 text-slate-400 mt-1.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* 底栏快捷键提示 */}
        <div className="flex items-center justify-between gap-2 px-4 py-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Kbd>↑↓</Kbd> {isEn ? 'Navigate' : '上下导航'}
            <Kbd>
              <CornerDownLeft className="h-3 w-3" />
            </Kbd>{' '}
            {isEn ? 'Open' : '打开'}
            <Kbd>esc</Kbd> {isEn ? 'Close' : '关闭'}
          </div>
          <span>{results.length} {isEn ? 'results' : '项'}</span>
        </div>
      </div>
    </div>
  );
};

const Kbd = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] leading-none">
    {children}
  </kbd>
);

export default SearchPalette;
