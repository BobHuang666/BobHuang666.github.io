import { useRef } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * 暗色模式切换按钮
 * 支持 document.startViewTransition() 圆形擦除动画（不支持时降级）
 */
export const ThemeToggle = ({ className = '' }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    const vt = (document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } })
      .startViewTransition;

    if (!vt || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      toggleTheme();
      return;
    }

    const btn = btnRef.current;
    const x = btn ? btn.getBoundingClientRect().left + btn.offsetWidth / 2 : window.innerWidth / 2;
    const y = btn ? btn.getBoundingClientRect().top + btn.offsetHeight / 2 : window.innerHeight / 2;
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = vt.call(document, toggleTheme);

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 420,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        },
      );
    }).catch(() => { /* Safari / 旧版浏览器无 startViewTransition，已降级 */ });
  };

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      aria-label={isDark ? '切换到日间模式' : '切换到夜间模式'}
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
