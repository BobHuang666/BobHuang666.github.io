import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, CalendarRange, Map as MapIcon, Globe2, Trash2 } from 'lucide-react';
import { Chip } from '../../../shared/components/ui/Chip';
import type { PlaceStatus, TravelTrip } from '../../../types';
import { useInView } from '../../../hooks/useInView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ChinaMap } from '../components/ChinaMap';
import { WorldMap } from '../components/WorldMap';
import { MapLegend } from '../components';
import { PlaceCard } from '../components/PlaceCard';
import { TripDetail } from '../components/TripDetail';
import { segmentBounds } from '../utils/footprint';
import type { FootprintPoint, FootprintStats, RouteSegment } from '../utils/footprint';
import type { ChinaGeo, WorldGeo } from '../utils/projection';

export type MapMode = 'china' | 'world';

interface Props {
  mode: MapMode;
  chinaGeo: ChinaGeo | null;
  worldGeo: WorldGeo | null;
  /** 当前模式下的点位（国内城市 / 世界国家） */
  points: FootprintPoint[];
  /** 路径段，仅中国地图有 */
  segments: RouteSegment[];
  stats: FootprintStats;
  trips: TravelTrip[];
  selectedTripId: string | null;
  onSelectTrip: (id: string | null) => void;
  highlightTripId: string | null;
}

const PLAY_INTERVAL = 900;

/**
 * 地图区块：年份多选 + 播放控制 + 底图 + 详情侧栏。
 * 只有被选中的年份会被点亮；世界地图与国家共用同一套年份游标。
 */
export const MapSection = ({
  mode,
  chinaGeo,
  worldGeo,
  points,
  segments,
  stats,
  trips,
  selectedTripId,
  onSelectTrip,
  highlightTripId,
}: Props) => {
  const { ref, inView } = useInView();
  const reducedMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  /** 选中的年份集合，初始为全部年份 */
  const [activeYears, setActiveYears] = useState<Set<number>>(() => new Set(stats.years));
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);
  /** 是否显示出行路线（关闭则只显示城市，不画路径） */
  const [showRoutes, setShowRoutes] = useState(true);

  // 切换地图后旧的选中项已不属于当前数据
  useEffect(() => {
    setSelectedId(null);
  }, [mode]);

  useEffect(() => {
    if (!playing) return;
    if (playIndex >= stats.years.length) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => {
      setActiveYears(new Set(stats.years.slice(0, playIndex + 1)));
      setPlayIndex((i) => i + 1);
    }, PLAY_INTERVAL);
    return () => clearTimeout(timer);
  }, [playing, playIndex, stats.years]);

  // 选中行程时，仅点亮该行程的端点城市（与年份筛选互斥）；住过/想去仍常亮
  const selectedTripPlaceIds = useMemo(() => {
    if (!selectedTripId) return null;
    const ids = new Set<string>();
    for (const s of segments) {
      if (s.tripId === selectedTripId) {
        ids.add(s.from.place.id);
        ids.add(s.to.place.id);
      }
    }
    return ids;
  }, [selectedTripId, segments]);

  const visiblePoints = useMemo(
    () =>
      points.filter(
        (p) =>
          // 住过 / 想去 不受筛选影响，始终点亮
          p.place.status === 'wishlist' ||
          p.place.status === 'lived' ||
          // 选中行程时与年份筛选互斥：只亮该行程的端点城市，忽略年份
          (selectedTripPlaceIds
            ? selectedTripPlaceIds.has(p.place.id)
            : p.firstDate !== null && activeYears.has(Number(p.firstDate.slice(0, 4)))),
      ),
    [points, activeYears, selectedTripPlaceIds],
  );

  const statusByName = useMemo(() => {
    const map = new Map<string, PlaceStatus>();
    for (const p of visiblePoints) if (p.city) map.set(p.city.n, p.place.status);
    return map;
  }, [visiblePoints]);

  const selected = visiblePoints.find((p) => p.place.id === selectedId) ?? null;
  const selectedTrip = trips.find((t) => t.id === selectedTripId) ?? null;

  /** 只画归属当前地图的行程：国内行程画在中国图，跨国行程画在世界图 */
  const visibleSegments = useMemo(() => {
    const scopeById = new Map(trips.map((t) => [t.id, t.scope]));
    return segments.filter((s) => scopeById.get(s.tripId) === mode);
  }, [segments, trips, mode]);

  /**
   * 选中行程时聚焦到它的经纬度范围。
   * 用该行程的全部路径段（不受当前 Tab 过滤影响），切换 Tab 后也能正确定位。
   */
  const focusBbox = useMemo(
    () =>
      selectedTrip ? segmentBounds(segments.filter((s) => s.tripId === selectedTrip.id)) : null,
    [selectedTrip, segments],
  );

  const allActive = activeYears.size === stats.years.length && stats.years.length > 0;

  const toggleYear = (year: number) => {
    setPlaying(false);
    setActiveYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  };

  const toggleAll = () => {
    setPlaying(false);
    // 已全选时再点一次 → 全部取消
    setActiveYears(allActive ? new Set() : new Set(stats.years));
  };

  const togglePlay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    // 从头开始播：先清空，再逐年前进
    setActiveYears(new Set());
    setPlayIndex(0);
    setPlaying(true);
  };

  const isChina = mode === 'china';
  const geo = isChina ? chinaGeo : worldGeo;

  return (
    <motion.section
      id="travel-map"
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      // scroll-mt 给固定顶栏留位置，点击出行记录滚动过来时不会被遮住
      className="scroll-mt-20 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/50 p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
          {isChina ? (
            <MapIcon className="h-4 w-4 text-emerald-500" />
          ) : (
            <Globe2 className="h-4 w-4 text-sky-500" />
          )}
          {isChina ? '中国足迹地图' : '世界足迹地图'}
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          {stats.years.length > 0 && (
            <button
              type="button"
              onClick={togglePlay}
              disabled={reducedMotion}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-40 disabled:hover:border-slate-200 dark:disabled:hover:border-slate-700"
              title={reducedMotion ? '已跟随系统设置关闭动效' : '按年份播放足迹'}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {playing ? '暂停' : '播放'}
            </button>
          )}
          <button
            type="button"
            role="switch"
            aria-checked={showRoutes}
            onClick={() => setShowRoutes((v) => !v)}
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300 select-none"
            title="关闭则只显示城市，不画路径"
          >
            <span>路线</span>
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                showRoutes ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  showRoutes ? 'translate-x-[18px]' : 'translate-x-0.5'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 年份多选：只点亮选中年份的足迹；「全部」可反选。
          选中行程时与年份筛选互斥，年份控件禁用，仅显示该行程 */}
      {stats.years.length > 0 && (
        <div className={`flex flex-wrap items-center gap-2 mb-3 ${selectedTripId ? 'opacity-40 pointer-events-none' : ''}`}>
          <CalendarRange className="h-3.5 w-3.5 text-slate-400" />
          <Chip
            active={allActive}
            onClick={selectedTripId ? undefined : toggleAll}
            className="px-3 py-1.5"
          >
            全部
          </Chip>
          {stats.years.map((year) => (
            <Chip
              key={year}
              active={activeYears.has(year)}
              onClick={selectedTripId ? undefined : () => toggleYear(year)}
              className="px-3 py-1.5"
            >
              {year}
            </Chip>
          ))}
        </div>
      )}

      {!geo ? null : (
        <div className={selected || selectedTrip ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]' : ''}>
          <div className="min-w-0">
            {isChina ? (
              <ChinaMap
                geo={chinaGeo as ChinaGeo}
                points={visiblePoints}
                statusByName={statusByName}
                segments={visibleSegments}
                selectedId={selectedId}
                onSelect={setSelectedId}
                animate={inView && !reducedMotion}
                activeYears={activeYears}
                showRoutes={showRoutes}
                focusBbox={focusBbox}
                highlightTripId={highlightTripId}
                selectedTripId={selectedTripId}
              />
            ) : (
              <WorldMap
                geo={worldGeo as WorldGeo}
                points={visiblePoints}
                statusByName={statusByName}
                selectedId={selectedId}
                onSelect={setSelectedId}
                segments={visibleSegments}
                animate={inView && !reducedMotion}
                activeYears={activeYears}
                showRoutes={showRoutes}
                focusBbox={focusBbox}
                highlightTripId={highlightTripId}
                selectedTripId={selectedTripId}
              />
            )}
            <div className="mt-3">
              <MapLegend />
            </div>
          </div>

          {(selectedTrip || selected) && (
            <aside className="min-w-0 space-y-3">
              <button
                type="button"
                onClick={() => {
                  onSelectTrip(null);
                  setSelectedId(null);
                }}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-300 dark:border-rose-700 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 dark:hover:border-rose-500 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                清空
              </button>
              {selectedTrip && (
                <TripDetail
                  trip={selectedTrip}
                  segments={segments}
                  onClose={() => onSelectTrip(null)}
                />
              )}
              {selected && <PlaceCard point={selected} onClose={() => setSelectedId(null)} />}
            </aside>
          )}
        </div>
      )}
    </motion.section>
  );
};
