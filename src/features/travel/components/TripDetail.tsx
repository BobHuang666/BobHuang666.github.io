import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Luggage, X } from 'lucide-react';
import { TRANSPORT_META } from '../meta';
import type { TravelTrip } from '../../../types';
import type { RouteSegment } from '../utils/footprint';

interface Props {
  trip: TravelTrip;
  /** 该行程包含的路径段（已算好里程） */
  segments: RouteSegment[];
  onClose: () => void;
}

/** 行程详情卡：逐段列出交通方式与里程，有游记时给出跳转入口 */
export const TripDetail = ({ trip, segments, onClose }: Props) => {
  const legs = segments.filter((s) => s.tripId === trip.id);
  const km = legs.reduce((sum, s) => sum + s.km, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
            <Luggage className="h-4 w-4 shrink-0 text-indigo-500" />
            <span className="truncate">{trip.title}</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {trip.dateRange[0]} ~ {trip.dateRange[1]} · {km.toLocaleString()} km · {legs.length} 段
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="关闭行程详情"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <ol className="mt-3 space-y-2.5">
        {legs.map((seg) => {
          const meta = TRANSPORT_META[seg.leg.transport];
          const Icon = meta.icon;
          return (
            <li key={seg.id} className="text-sm">
              <div className="flex flex-wrap items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span>{seg.from.place.region || seg.from.place.name}</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <ArrowRight className="h-3 w-3" />
                  <Icon className="h-3.5 w-3.5" color={meta.color} />
                </span>
                <span>{seg.to.place.region || seg.to.place.name}</span>
              </div>
              <div className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                {meta.label} · {seg.km.toLocaleString()} km · {seg.leg.date}
              </div>
              {seg.leg.note && (
                <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{seg.leg.note}</div>
              )}
            </li>
          );
        })}
      </ol>

      {trip.postId && (
        <Link
          to={`/blog/${trip.postId}`}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          读这篇游记
        </Link>
      )}
    </motion.div>
  );
};
