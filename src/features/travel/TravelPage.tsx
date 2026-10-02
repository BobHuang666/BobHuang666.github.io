import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, MapPinned } from 'lucide-react';
import { travelPlaces, travelTrips, worldPlaces } from '../../data/travel';
import { uiText } from '../../data/uiText';
import { Chip } from '../../shared/components/ui/Chip';
import { RelatedLink } from '../../shared/components/ui/RelatedLink';
import { EmptyState } from '../../shared/components/ui/EmptyState';
import { usePageMeta } from '../../hooks/usePageMeta';
import { scrollToId } from '../../utils/scroll';
import { useChinaGeo, useWorldGeo } from './hooks/useGeoData';
import { buildFootprints, buildRouteSegments, buildStats } from './utils/footprint';
import { StatsSection } from './sections/StatsSection';
import { MapSection, type MapMode } from './sections/MapSection';
import { TimelineSection } from './sections/TimelineSection';

/**
 * /travel —— 旅行足迹地图
 *
 * 页面只负责编排、地图模式切换与加载状态；
 * 地图渲染在 ./components，区块在 ./sections，足迹计算在 ./utils，
 * 展示元数据（交通方式 / 状态配色）在 ./meta。
 */
const TravelPage = () => {
  usePageMeta(uiText.nav.travel, uiText.travel.subtitle);
  const [mode, setMode] = useState<MapMode>('china');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [highlightTripId, setHighlightTripId] = useState<string | null>(null);

  const china = useChinaGeo();
  // 世界底图只在切到世界地图时才下载
  const world = useWorldGeo(mode === 'world');

  const chinaData = useMemo(() => buildFootprints(china.geo, travelPlaces), [china.geo]);
  const worldData = useMemo(() => buildFootprints(world.geo, worldPlaces), [world.geo]);
  // 国内外地点放一起解析路径：跨国行程（北京→曼谷）需要同时引用两边
  const allPoints = useMemo(
    () => [...chinaData.points, ...worldData.points],
    [chinaData.points, worldData.points],
  );
  const segments = useMemo(() => buildRouteSegments(allPoints, travelTrips), [allPoints]);
  const stats = useMemo(
    () => buildStats(chinaData.points, travelTrips, worldData.points),
    [chinaData.points, worldData.points],
  );

  const isChina = mode === 'china';
  const active = isChina ? china : world;

  const switchMode = (next: MapMode) => {
    setMode(next);
    setSelectedTripId(null);
    setHighlightTripId(null);
  };

  /** 点击行程：切到它所属的那张地图、选中定位，并把页面滚回地图 */
  const handleSelectTrip = (id: string | null) => {
    setSelectedTripId(id);
    const trip = id ? travelTrips.find((t) => t.id === id) : null;
    if (!trip) return;
    setMode(trip.scope);
    // 等 Tab 切换后的 DOM 更新完成再滚，否则目标节点还没渲染
    requestAnimationFrame(() => scrollToId('travel-map'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ===== Hero ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 text-sm text-emerald-500 mb-3">
            <MapPinned className="h-4 w-4" />
            Travel · {uiText.nav.travel}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {uiText.travel.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {uiText.travel.subtitle}
          </p>

          {/* 地图模式切换 */}
          <div className="flex gap-2 mt-5">
            <Chip active={isChina} onClick={() => switchMode('china')} className="px-4 py-2">
              {uiText.travel.tabChina}
            </Chip>
            <Chip active={!isChina} onClick={() => switchMode('world')} className="px-4 py-2">
              {uiText.travel.tabWorld}
            </Chip>
          </div>
        </motion.div>

        {active.loading && (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            {uiText.travel.loading}
          </div>
        )}

        {active.error && (
          <EmptyState
            icon={MapPinned}
            title={uiText.travel.errorTitle}
            description={uiText.travel.errorDesc}
            className="py-20"
          />
        )}

        {active.geo && (
          <div className="space-y-6">
            <StatsSection stats={stats} />
            <MapSection
              mode={mode}
              chinaGeo={china.geo}
              worldGeo={world.geo}
              points={isChina ? chinaData.points : worldData.points}
              segments={segments}
              stats={stats}
              trips={travelTrips}
              selectedTripId={selectedTripId}
              onSelectTrip={handleSelectTrip}
              highlightTripId={highlightTripId}
            />
            <TimelineSection
              trips={travelTrips}
              segments={segments}
              highlightTripId={highlightTripId}
              onHighlight={setHighlightTripId}
              selectedTripId={selectedTripId}
              onSelectTrip={handleSelectTrip}
            />
          </div>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RelatedLink to="/blog" emoji="📝" title={uiText.related.blog.title} desc={uiText.related.blog.desc} />
          <RelatedLink to="/" emoji="🏠" title={uiText.related.home.title} desc={uiText.related.home.desc} />
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-slate-400 dark:text-slate-500">
          {uiText.travel.dataSource}
        </p>
      </div>
    </div>
  );
};

export default TravelPage;
