import { Compass, Globe2, MapPin, Plane, Route } from 'lucide-react';
import { StatPill } from '../components';
import { TRANSPORT_META } from '../meta';
import type { FootprintStats } from '../utils/footprint';

/** 顶部统计：城市 / 省级行政区 / 国家 / 出行次数 / 累计里程，附交通方式分布 */
export const StatsSection = ({ stats }: { stats: FootprintStats }) => (
  <div className="space-y-3">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <StatPill icon={MapPin} value={stats.cityCount} label="城市" tone="emerald" />
      <StatPill icon={Compass} value={stats.provinceCount} label="省" tone="sky" />
      <StatPill icon={Globe2} value={stats.countryCount} label="国家" tone="indigo" />
      <StatPill icon={Route} value={stats.tripCount} label="出行记录" tone="violet" />
      <StatPill icon={Plane} value={stats.totalKm.toLocaleString()} label="累计里程 (km)" tone="amber" />
    </div>

    {stats.transports.length > 0 && (
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <span className="text-slate-400 dark:text-slate-500">交通方式</span>
        {stats.transports.map(({ mode, count }) => {
          const meta = TRANSPORT_META[mode];
          const Icon = meta.icon;
          return (
            <span
              key={mode}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-slate-700 px-2.5 py-1"
            >
              <Icon className="h-3.5 w-3.5" color={meta.color} />
              {meta.label}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{count}</span>
            </span>
          );
        })}
      </div>
    )}
  </div>
);
