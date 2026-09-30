import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description?: string;
  hint?: ReactNode;
  className?: string;
}

/** 列表/分区为空时的统一占位，避免每个页面各写一份空态 */
export const EmptyState = ({ icon: Icon, title, description, hint, className = '' }: Props) => (
  <div
    className={`flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 ${className}`}
  >
    <Icon className="h-10 w-10 mb-3 opacity-50" />
    <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
    {description && <p className="text-xs mt-1">{description}</p>}
    {hint && <span className="inline-flex items-center gap-1 mt-2 text-xs">{hint}</span>}
  </div>
);
