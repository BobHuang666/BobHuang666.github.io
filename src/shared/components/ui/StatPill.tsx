/** 统计胶囊：数值 + 标签的展示原子；配色由调用方传入，共享层不携带页面主题语义 */
import type { LucideIcon } from 'lucide-react';

interface StatPillProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  /** 图标颜色类，如 `text-rose-500` */
  textClass: string;
  /** 胶囊背景渐变片段，如 `from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40` */
  gradientClass: string;
}

export const StatPill = ({ icon: Icon, value, label, textClass, gradientClass }: StatPillProps) => (
  <div
    className={`rounded-2xl border border-white/60 dark:border-slate-800 bg-gradient-to-br ${gradientClass} p-3.5 flex items-center gap-3`}
  >
    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-900/60">
      <Icon className={`h-5 w-5 ${textClass}`} />
    </span>
    <div className="min-w-0">
      <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{label}</div>
    </div>
  </div>
);
