import { motion } from 'framer-motion';
import { MapPin, X, CalendarDays } from 'lucide-react';
import { PLACE_STATUS_META } from '../meta';
import type { FootprintPoint } from '../utils/footprint';

interface Props {
  point: FootprintPoint | null;
  onClose: () => void;
}

/** 选中地点后的详情卡：显示状态、所属省级行政区与到访记录 */
export const PlaceCard = ({ point, onClose }: Props) => {
  if (!point) return null;
  const meta = PLACE_STATUS_META[point.place.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className={`h-4 w-4 shrink-0 ${meta.marker}`} />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {point.place.name}
            </h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${meta.badge}`}>
              {meta.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {/* 世界国家没有省级行政区，展示 data/travel.ts 里手填的 region（如「济州」） */}
            {[point.place.region || point.province, point.visitCount > 0 ? `到访 ${point.visitCount} 次` : '']
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="关闭详情"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {point.place.visits.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {[...point.place.visits]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((v) => (
              <li key={v.date} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="shrink-0 tabular-nums text-slate-500 dark:text-slate-400">{v.date}</span>
                {v.note && <span className="min-w-0">{v.note}</span>}
              </li>
            ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">还没去过，先记在心愿单里 ✨</p>
      )}
    </motion.div>
  );
};
