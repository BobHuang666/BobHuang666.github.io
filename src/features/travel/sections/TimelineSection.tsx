import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Luggage } from 'lucide-react';
import { TRANSPORT_META } from '../meta';
import type { TravelTrip } from '../../../types';
import type { RouteSegment } from '../utils/footprint';

interface Props {
  trips: TravelTrip[];
  segments: RouteSegment[];
  highlightTripId: string | null;
  onHighlight: (id: string | null) => void;
  /** 当前展开的行程（点击卡片切换） */
  selectedTripId: string | null;
  onSelectTrip: (id: string | null) => void;
}

/** 行程时间轴：列出每段路径的交通方式与里程；悬停高亮地图、点击展开详情并定位 */
export const TimelineSection = ({
  trips,
  segments,
  highlightTripId,
  onHighlight,
  selectedTripId,
  onSelectTrip,
}: Props) => {
  const segByTrip = new Map<string, RouteSegment[]>();
  for (const seg of segments) {
    segByTrip.set(seg.tripId, [...(segByTrip.get(seg.tripId) ?? []), seg]);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
        <Luggage className="h-4 w-4 text-indigo-500" />
        出行记录
        <span className="text-xs font-normal text-slate-400 dark:text-slate-500">× {trips.length}</span>
      </h2>

      <div className="space-y-3">
        {trips.map((trip) => {
          const legs = segByTrip.get(trip.id) ?? [];
          const km = legs.reduce((sum, s) => sum + s.km, 0);
          const active = highlightTripId === trip.id;
          const opened = selectedTripId === trip.id;

          return (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(opened ? null : trip.id)}
              onMouseEnter={() => onHighlight(trip.id)}
              onMouseLeave={() => onHighlight(null)}
              className={`cursor-pointer rounded-2xl border bg-white dark:bg-slate-900 p-4 transition-colors ${
                opened
                  ? 'border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-200 dark:ring-indigo-800'
                  : active
                    ? 'border-indigo-300 dark:border-indigo-700'
                    : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{trip.title}</h3>
                  <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                    {trip.scope === 'china' ? '中国' : '世界'}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {trip.dateRange[0]} ~ {trip.dateRange[1]} · {km.toLocaleString()} km
                </span>
              </div>

              <ol className="space-y-2">
                {legs.map((seg) => {
                  const meta = TRANSPORT_META[seg.leg.transport];
                  const Icon = meta.icon;
                  return (
                    <li key={seg.id} className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-slate-700 dark:text-slate-300">{seg.from.place.name}</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <ArrowRight className="h-3 w-3" />
                        <Icon className="h-3.5 w-3.5" color={meta.color} />
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">{seg.to.place.name}</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {meta.label} · {seg.km.toLocaleString()} km · {seg.leg.date}
                      </span>
                      {seg.leg.note && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">· {seg.leg.note}</span>
                      )}
                    </li>
                  );
                })}
              </ol>

              {trip.postId && (
                <Link
                  to={`/blog/${trip.postId}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  读这篇游记
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};
