import type { LucideIcon } from 'lucide-react';
import { PLACE_STATUS_META, TRANSPORT_META } from './meta';
import { PLACE_STATUSES, TRANSPORT_MODES } from '../../types';

/** travel 页面共用的展示原子 */

const TONE_MAP: Record<string, string> = {
  indigo: 'text-indigo-500 from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40',
  emerald: 'text-emerald-500 from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40',
  sky: 'text-sky-500 from-sky-100 to-blue-100 dark:from-sky-950/40 dark:to-blue-950/40',
  amber: 'text-amber-500 from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40',
  violet: 'text-violet-500 from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40',
};

/** 统计胶囊：与 profile / fandom 保持同一视觉语言 */
export const StatPill = ({
  icon: Icon, value, label, tone,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone: keyof typeof TONE_MAP;
}) => (
  <div className={`rounded-2xl border border-white/60 dark:border-slate-800 bg-gradient-to-br ${TONE_MAP[tone]} p-3.5 flex items-center gap-3`}>
    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-900/60">
      <Icon className={`h-5 w-5 ${TONE_MAP[tone].split(' ')[0]}`} />
    </span>
    <div className="min-w-0">
      <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{label}</div>
    </div>
  </div>
);

/** 地图图例：足迹状态色块 + 交通方式图标，分两组。
 *  窄屏：两组各自成行（flex-col）左对齐；宽屏：左组居左、右组居右（justify-between）。 */
export const MapLegend = () => (
  <div className="flex flex-col gap-y-2 text-[11px] text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {PLACE_STATUSES.map((status) => (
        <span key={status} className="inline-flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect width="12" height="12" rx="2" className={PLACE_STATUS_META[status].fill} />
          </svg>
          {PLACE_STATUS_META[status].label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <rect width="12" height="12" rx="2" className="fill-slate-100 dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />
        </svg>
        未点亮
      </span>
    </div>

    <span className="hidden h-3 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      {TRANSPORT_MODES.map((mode) => {
        const meta = TRANSPORT_META[mode];
        const Icon = meta.icon;
        return (
          <span key={mode} className="inline-flex items-center gap-1">
            <Icon className="h-3.5 w-3.5" color={meta.color} />
            {meta.label}
          </span>
        );
      })}
    </div>
  </div>
);
