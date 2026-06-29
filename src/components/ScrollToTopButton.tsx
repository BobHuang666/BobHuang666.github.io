import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * 全局浮动「回到顶部」按钮
 * - 环形 SVG 进度指示器（实时跟随滚动位置）
 * - 玻璃拟态外观
 * - hover 时显示 tooltip
 * - 纯 CSS transition 出入场，无 framer-motion 依赖
 */
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0);
      setVisible(scrollY > window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashOffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50 group
        transition-all duration-250 ease-out
        ${visible
          ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 scale-75 translate-y-3 pointer-events-none'}
      `}
      aria-hidden={!visible}
    >
      {/* Tooltip */}
      <span
        className="
          absolute -top-9 left-1/2 -translate-x-1/2
          px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap
          bg-slate-900 dark:bg-slate-700 text-white
          opacity-0 group-hover:opacity-100 pointer-events-none
          transition-opacity duration-150
        "
      >
        回到顶部
        <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-slate-900 dark:border-t-slate-700" />
      </span>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="回到顶部"
        tabIndex={visible ? 0 : -1}
        className="
          relative w-12 h-12 flex items-center justify-center rounded-full
          bg-white/70 dark:bg-slate-900/70 backdrop-blur-md
          border border-white/60 dark:border-slate-700/60
          shadow-lg hover:shadow-xl
          hover:scale-105 active:scale-95
          transition-transform duration-150
        "
      >
        {/* 环形进度 SVG */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 44 44"
          aria-hidden="true"
        >
          {/* 轨道 */}
          <circle
            cx="22" cy="22" r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-slate-200 dark:text-slate-700"
          />
          {/* 进度 */}
          <circle
            cx="22" cy="22" r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className="text-indigo-500 dark:text-indigo-400 transition-[stroke-dashoffset] duration-100"
          />
        </svg>

        {/* 箭头图标 */}
        <ArrowUp className="relative h-4 w-4 text-indigo-600 dark:text-indigo-400" />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
