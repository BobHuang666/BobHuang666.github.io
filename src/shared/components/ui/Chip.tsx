/** 通用筛选/标签胶囊 */
import type { ReactNode } from 'react';

export type ChipTone = 'indigo' | 'rose';

const ACTIVE_CLASS: Record<ChipTone, string> = {
  indigo: 'bg-indigo-600 text-white shadow-md',
  rose: 'bg-rose-500 text-white shadow',
};

const IDLE_CLASS: Record<ChipTone, string> = {
  indigo:
    'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400',
  rose:
    'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700',
};

interface Props {
  active?: boolean;
  tone?: ChipTone;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

export const Chip = ({ active = false, tone = 'indigo', onClick, className = '', children }: Props) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={onClick ? active : undefined}
    className={`inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors ${
      active ? ACTIVE_CLASS[tone] : IDLE_CLASS[tone]
    } ${className}`}
  >
    {children}
  </button>
);
