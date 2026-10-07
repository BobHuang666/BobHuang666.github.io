import { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { PlaceStatus } from '../../../types';
import { NEUTRAL_FILL, PLACE_STATUS_META } from '../meta';
import { createMapProjection, type WorldGeo } from '../utils/projection';
import type { FootprintPoint, RouteSegment } from '../utils/footprint';
import { RouteLayer } from './RouteLayer';

const VIEW_W = 1000;
/** 数据没给比例时的兜底（等距圆柱原始比例 2.56:1） */
const FALLBACK_ASPECT = 2.56;

const MIN_W = VIEW_W * 0.1;
const EDGE = VIEW_W * 0.1;

interface Props {
  geo: WorldGeo;
  points: FootprintPoint[];
  statusByName: Map<string, PlaceStatus>;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** 跨国行程路径 */
  segments: RouteSegment[];
  /** 是否播放生长动画与运动图标 */
  animate: boolean;
  /** 当前选中的年份：只显示落在这些年份里的路径 */
  activeYears: Set<number>;
  /** 需要聚焦的经纬度范围（点击行程时定位），null 表示不聚焦 */
  focusBbox?: [number, number, number, number] | null;
  highlightTripId?: string | null;
  /** 是否显示出行路线（false 时仅显示城市，不画路径） */
  showRoutes?: boolean;
  /** 选中某次出行时，只显示该行程的路线 */
  selectedTripId?: string | null;
}

interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(PLACE_STATUS_META).map(([k, v]) => [k, v.label]),
);

/**
 * 世界国家地图：按足迹状态给国家着色。
 * 交互与 ChinaMap 一致（滚轮缩放、拖拽平移、悬停提示、点选详情），
 * 但不含路径层——行程路径目前都是国内城市之间的。
 */
export const WorldMap = ({
  geo,
  points,
  statusByName,
  selectedId,
  onSelect,
  segments,
  animate,
  activeYears,
  focusBbox,
  highlightTripId,
  showRoutes = true,
  selectedTripId,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  const movedRef = useRef(false);
  /** 当前按下的指针（鼠标/触摸），用于识别双指缩放 */
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  /** 双指缩放的起始快照：初始视野、两指初始距离、视野锚点坐标 */
  const pinchRef = useRef<{ v0: ViewBox; dist0: number; aX: number; aY: number } | null>(null);
  /** 画布高度由数据比例决定：改脚本里的 stretch 重跑即可，无需改组件 */
  const viewH = useMemo(() => Math.round(VIEW_W / (geo.aspect || FALLBACK_ASPECT)), [geo.aspect]);
  const [view, setView] = useState<ViewBox>({ x: 0, y: 0, w: VIEW_W, h: viewH });
  const [hover, setHover] = useState<{ name: string; label: string; x: number; y: number; note?: string } | null>(null);

  const projection = useMemo(() => createMapProjection(geo, VIEW_W, viewH), [geo, viewH]);

  const shapes = useMemo(
    () => geo.countries.map((country) => ({ country, d: country.p.map((poly) => projection.toPath(poly)).join('') })),
    [geo, projection],
  );

  const pointByCountry = useMemo(() => {
    const map = new Map<string, FootprintPoint>();
    for (const p of points) if (p.city) map.set(p.city.n, p);
    return map;
  }, [points]);

  /** 滚轮缩放：必须 passive:false 才能 preventDefault，否则页面会跟着滚 */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = svg.getBoundingClientRect();
      setView((v) => {
        const ax = v.x + ((e.clientX - rect.left) / rect.width) * v.w;
        const ay = v.y + ((e.clientY - rect.top) / rect.height) * v.h;
        const nextW = clamp(v.w * (e.deltaY > 0 ? 1.18 : 1 / 1.18), MIN_W, VIEW_W);
        const k = nextW / v.w;
        const nextH = v.h * k;
        return {
          w: nextW,
          h: nextH,
          x: clamp(ax - (ax - v.x) * k, -EDGE, VIEW_W - nextW + EDGE),
          y: clamp(ay - (ay - v.y) * k, -EDGE, viewH - nextH + EDGE),
        };
      });
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, [viewH]);

  /** 点击行程时把视野移到该行程的经纬度范围 */
  useEffect(() => {
    if (!focusBbox) return;
    const [x1, y1] = projection.project(focusBbox[0], focusBbox[1]);
    const [x2, y2] = projection.project(focusBbox[2], focusBbox[3]);
    // 宽高都要能装下行程范围：只看经度差的话，南北向跨度大的行程会被截掉
    const w = Math.min(
      VIEW_W,
      Math.max(Math.abs(x2 - x1) * 1.6, Math.abs(y2 - y1) * 1.6 * (VIEW_W / viewH), MIN_W),
    );
    const h = w * (viewH / VIEW_W);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    setView({
      w,
      h,
      x: clamp(cx - w / 2, -EDGE, VIEW_W - w + EDGE),
      y: clamp(cy - h / 2, -EDGE, viewH - h + EDGE),
    });
  }, [focusBbox, projection, viewH]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // 第二根手指按下 → 进入双指缩放模式
    if (pointersRef.current.size === 2) {
      const [p1, p2] = [...pointersRef.current.values()];
      const dist0 = Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1;
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      // 两指中点当前对应的视野坐标，缩放时让它稳定停在原地
      const aX = view.x + ((midX - rect.left) / rect.width) * view.w;
      const aY = view.y + ((midY - rect.top) / rect.height) * view.h;
      pinchRef.current = { v0: view, dist0, aX, aY };
      movedRef.current = true; // 双指手势结束后不应触发点选
      return;
    }

    movedRef.current = false;
    dragRef.current = { px: e.clientX, py: e.clientY, vx: view.x, vy: view.y };
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const p = pointersRef.current.get(e.pointerId);
    if (p) pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // 双指缩放：以两指中点为锚点，按距离比值缩放，并跟随中点平移
    const pinch = pinchRef.current;
    if (pinch && pointersRef.current.size >= 2) {
      const [p1, p2] = [...pointersRef.current.values()];
      const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2;
      const rect = svg.getBoundingClientRect();
      const f = dist / pinch.dist0; // 手指张开 f>1 → 放大
      const newW = clamp(pinch.v0.w / Math.max(f, 1e-3), MIN_W, VIEW_W);
      const newH = newW * (pinch.v0.h / pinch.v0.w);
      setView({
        w: newW,
        h: newH,
        x: clamp(pinch.aX - ((midX - rect.left) / rect.width) * newW, -EDGE, VIEW_W - newW + EDGE),
        y: clamp(pinch.aY - ((midY - rect.top) / rect.height) * newH, -EDGE, viewH - newH + EDGE),
      });
      return;
    }

    const drag = dragRef.current;
    if (!drag) return;
    if (Math.hypot(e.clientX - drag.px, e.clientY - drag.py) > 4) movedRef.current = true;
    const rect = svg.getBoundingClientRect();
    const dx = ((e.clientX - drag.px) / rect.width) * view.w;
    const dy = ((e.clientY - drag.py) / rect.height) * view.h;
    setView((v) => ({
      ...v,
      x: clamp(drag.vx - dx, -EDGE, VIEW_W - v.w + EDGE),
      y: clamp(drag.vy - dy, -EDGE, viewH - v.h + EDGE),
    }));
  };

  /** 抬手/取消：清理指针，退出双指模式，若还剩一根手指则把拖拽权交给它 */
  const endPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size >= 2) return;
    pinchRef.current = null;
    if (pointersRef.current.size === 1) {
      const [, pos] = [...pointersRef.current.entries()][0];
      dragRef.current = { px: pos.x, py: pos.y, vx: view.x, vy: view.y };
    } else {
      dragRef.current = null;
    }
  };

  const select = (id: string | null) => {
    if (movedRef.current) return;
    onSelect(id);
  };

  const zoomed = view.w < VIEW_W - 1;
  const scale = view.w / VIEW_W;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        className="w-full h-auto touch-none select-none cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: `${VIEW_W} / ${viewH}` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onPointerLeave={() => {
          pointersRef.current.clear();
          pinchRef.current = null;
          dragRef.current = null;
          setHover(null);
        }}
        role="img"
        aria-label="世界旅行足迹地图"
      >
        <g>
          {shapes.map(({ country, d }) => {
            const status = statusByName.get(country.n);
            const meta = status ? PLACE_STATUS_META[status] : null;
            const [cx, cy] = projection.project(country.c[0], country.c[1]);
            return (
              <path
                key={country.n}
                d={d}
                className={`${meta ? meta.fill : NEUTRAL_FILL} stroke-slate-300/70 dark:stroke-slate-700/70 hover:brightness-95 dark:hover:brightness-110`}
                strokeWidth={0.5}
                vectorEffect="non-scaling-stroke"
                onMouseEnter={() =>
                  setHover({
                    name: country.n,
                    label: status ? STATUS_LABEL[status] : '未点亮',
                    x: cx,
                    y: cy,
                    note: pointByCountry.get(country.n)?.firstDate ?? undefined,
                  })
                }
                onClick={() => select(pointByCountry.get(country.n)?.place.id ?? null)}
              />
            );
          })}
        </g>

        <RouteLayer
          segments={segments}
          project={projection.project}
          animate={animate}
          activeYears={activeYears}
          scale={scale}
          highlightTripId={highlightTripId}
          selectedTripId={selectedTripId}
          visible={showRoutes}
        />

        {/* 国家标记 */}
        <g>
          {points.map((p) => {
            const meta = PLACE_STATUS_META[p.place.status];
            const [x, y] = projection.project(p.lng, p.lat);
            const active = selectedId === p.place.id;
            const radius = p.place.status === 'lived' ? 5 : p.place.status === 'wishlist' ? 3.5 : 4;
            return (
              <g
                key={p.place.id}
                transform={`translate(${x} ${y})`}
                className="cursor-pointer"
                onClick={() => select(active ? null : p.place.id)}
                onMouseEnter={() =>
                  setHover({
                    name: p.place.name,
                    label: STATUS_LABEL[p.place.status],
                    x,
                    y,
                    note: p.firstDate ?? undefined,
                  })
                }
              >
                <g transform={`scale(${scale})`}>
                  {active && <circle r={radius + 6} className="fill-indigo-500/25" />}
                  {p.place.status === 'wishlist' ? (
                    <circle
                      r={radius}
                      className="fill-transparent stroke-slate-400 dark:stroke-slate-500"
                      strokeWidth={1.4}
                      strokeDasharray="2 2"
                    />
                  ) : (
                    <circle
                      r={radius}
                      className={`${meta.fill} stroke-white dark:stroke-slate-950`}
                      strokeWidth={1.4}
                    />
                  )}
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[130%] whitespace-nowrap rounded-lg bg-slate-900/90 dark:bg-slate-800/95 text-white px-2.5 py-1.5 text-xs shadow-lg"
          style={{
            left: `${((hover.x - view.x) / view.w) * 100}%`,
            top: `${((hover.y - view.y) / view.h) * 100}%`,
          }}
        >
          <span className="font-medium">{hover.name}</span>
          <span className="ml-1.5 opacity-70">{hover.label}</span>
          {hover.note && <span className="ml-1.5 opacity-60">{hover.note}</span>}
        </div>
      )}

      {zoomed && (
        <button
          type="button"
          onClick={() => setView({ x: 0, y: 0, w: VIEW_W, h: viewH })}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors"
        >
          <Maximize2 className="h-3 w-3" />
          重置
        </button>
      )}
    </div>
  );
};
