import { Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Experience } from '../../../types';

/** profile 各 Tab 共用的展示原子，避免每个 Tab 各写一份 */

export const SectionHeading = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center">
    <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2.5" />
    {title}
  </h3>
);

export const InfoLine = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</h4>
    <p className="text-slate-800 dark:text-slate-200">{value}</p>
  </div>
);

/** 5 星评分展示 */
export const Stars = ({ count }: { count: number }) => {
  const filled = Math.max(0, Math.min(5, count));
  return (
    <span className="inline-flex" aria-label={`${filled} 颗星`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
        />
      ))}
    </span>
  );
};

/** 时间线卡片：实习经历 / 学生工作共用 */
export const TimelineCard = ({
  item,
  accent = 'indigo',
}: {
  item: Experience;
  accent?: 'indigo' | 'green' | 'amber';
}) => {
  const color =
    accent === 'green'
      ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20'
      : accent === 'amber'
        ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20'
        : 'border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20';
  return (
    <div className={`pl-5 pr-4 py-4 border-l-4 ${color} rounded-r-lg`}>
      <div className="flex flex-wrap items-baseline gap-x-3 mb-1">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.role}</h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">@ {item.org}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{item.time}</p>
      {item.description && (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {item.description}
        </p>
      )}
    </div>
  );
};

/** Tab 内的「列表 / 雷达图」「卡片 / 时间线」视图切换器 */
export const ViewSwitch = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string; icon: LucideIcon }[];
  value: T;
  onChange: (id: T) => void;
}) => (
  <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
    {options.map((opt) => (
      <button
        key={opt.id}
        onClick={() => onChange(opt.id)}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${value === opt.id
          ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
          : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
      >
        <opt.icon className="h-3.5 w-3.5" />
        {opt.label}
      </button>
    ))}
  </div>
);
