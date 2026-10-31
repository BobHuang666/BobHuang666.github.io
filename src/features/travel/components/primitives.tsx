/** travel 区块共用的展示原子 */
import type { LucideIcon } from 'lucide-react';
import { PLACE_STATUS_META, TRANSPORT_META } from '../meta';
import { PLACE_STATUSES, TRANSPORT_MODES } from '@/types';
import { StatPill as SharedStatPill } from '@/shared/components/ui/StatPill';


const TONE_MAP: Record<string, { text: string; gradient: string }> = {
  indigo: { text: 'text-indigo-500', gradient: 'from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40' },
  emerald: { text: 'text-emerald-500', gradient: 'from-emerald-100 to-teal-100 dark:from-emerald-950/40 dark:to-teal-950/40' },
  sky: { text: 'text-sky-500', gradient: 'from-sky-100 to-blue-100 dark:from-sky-950/40 dark:to-blue-950/40' },
  amber: { text: 'text-amber-500', gradient: 'from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40' },
  violet: { text: 'text-violet-500', gradient: 'from-violet-100 to-purple-100 dark:from-violet-950/40 dark:to-purple-950/40' },
};

/** 统计胶囊：视觉实现在共享层，这里只负责页面主题色映射 */
export const StatPill = ({
  icon, value, label, tone,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone: keyof typeof TONE_MAP;
}) => (
  <SharedStatPill
    icon={icon}
    value={value}
    label={label}
    textClass={TONE_MAP[tone].text}
    gradientClass={TONE_MAP[tone].gradient}
  />
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
