import { useEffect, useMemo, useRef, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { PlaceStatus } from '../../../types';
import { NEUTRAL_FILL, PLACE_STATUS_META } from '../meta';
import { createMapProjection, type ChinaGeo } from '../utils/projection';
import type { FootprintPoint, RouteSegment } from '../utils/footprint';
import { RouteLayer } from './RouteLayer';

/** viewBox 尺寸：与容器 aspect 保持一致，避免 letterbox */
const VIEW_W = 1000;
const VIEW_H = 820;

/** 最小缩放宽度与可拖出的边距 */
const MIN_W = VIEW_W * 0.18;
const EDGE = VIEW_W * 0.12;

interface Props {
  geo: ChinaGeo;
  points: FootprintPoint[];
  /** 城市全名 → 足迹状态，用于底图着色 */
  statusByName: Map<string, PlaceStatus>;
  segments: RouteSegment[];
  /** 当前选中的地点 id */
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** 是否播放动画 */
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

const INITIAL_VIEW: ViewBox = { x: 0, y: 0, w: VIEW_W, h: VIEW_H };

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const STATUS_LABEL: Record<string, string> = Object.fromEntries(
  Object.entries(PLACE_STATUS_META).map(([k, v]) => [k, v.label]),
);

/**
 * 中国地级行政区地图（含南海诸岛界线，按原始数据整体绘制）。
 *
 * - 底图：370 个行政区 path，按足迹状态着色（Tailwind fill-* 自动适配暗色）
 * - 交互：滚轮缩放、拖拽平移、悬停提示、点选详情
 * - 叠加：路径层（RouteLayer）与地点标记
 */
export const ChinaMap = ({
  geo,
  points,
  statusByName,
  segments,
  selectedId,
  onSelect,
  animate,
  activeYears,
  focusBbox,
  highlightTripId,
  showRoutes = true,
  selectedTripId,
}: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);
  /** 拖拽过就不再把 pointerup 当成点选，避免平移地图时误触 */
  const movedRef = useRef(false);
  /** 当前按下的指针（鼠标/触摸），用于识别双指缩放 */
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  /** 双指缩放的起始快照：初始视野、两指初始距离、视野锚点坐标 */
  const pinchRef = useRef<{ v0: ViewBox; dist0: number; aX: number; aY: number } | null>(null);
  const [view, setView] = useState<ViewBox>(INITIAL_VIEW);
  const [hover, setHover] = useState<{ name: string; label: string; x: number; y: number; note?: string } | null>(null);

  const projection = useMemo(() => createMapProjection(geo, VIEW_W, VIEW_H), [geo]);

  const shapes = useMemo(
    () => geo.cities.map((city) => ({ city, d: city.p.map((poly) => projection.toPath(poly)).join('') })),
    [geo, projection],
  );

  const boundary = useMemo(() => geo.lines.map((line) => projection.toLine(line)), [geo, projection]);

  const pointByCity = useMemo(() => {
    const map = new Map<string, FootprintPoint>();
    for (const p of points) if (p.city) map.set(p.city.n, p);
    return map;
  }, [points]);

  /**
   * 滚轮缩放：必须用原生监听 + passive:false 才能 preventDefault，
   * 否则事件冒泡到页面，缩放的同时页面也会跟着滚。
   */
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
          y: clamp(ay - (ay - v.y) * k, -EDGE, VIEW_H - nextH + EDGE),
        };
      });
    };

    svg.addEventListener('wheel', onWheel, { passive: false });
    return () => svg.removeEventListener('wheel', onWheel);
  }, []);

  /** 点击行程时把视野移到该行程的经纬度范围 */
  useEffect(() => {
    if (!focusBbox) return;
    const [x1, y1] = projection.project(focusBbox[0], focusBbox[1]);
    const [x2, y2] = projection.project(focusBbox[2], focusBbox[3]);
    // 宽高都要能装下行程范围：只看经度差的话，南北向跨度大的行程会被截掉
    const w = Math.min(
      VIEW_W,
      Math.max(Math.abs(x2 - x1) * 1.6, Math.abs(y2 - y1) * 1.6 * (VIEW_W / VIEW_H), MIN_W),
    );
    const h = w * (VIEW_H / VIEW_W);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    setView({
      w,
      h,
      x: clamp(cx - w / 2, -EDGE, VIEW_W - w + EDGE),
      y: clamp(cy - h / 2, -EDGE, VIEW_H - h + EDGE),
    });
  }, [focusBbox, projection]);

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
        y: clamp(pinch.aY - ((midY - rect.top) / rect.height) * newH, -EDGE, VIEW_H - newH + EDGE),
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
      y: clamp(drag.vy - dy, -EDGE, VIEW_H - v.h + EDGE),
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

  /** 拖拽结束后浏览器仍会派发 click，用 movedRef 过滤掉 */
  const select = (id: string | null) => {
    if (movedRef.current) return;
    onSelect(id);
  };

  const zoomed = view.w < VIEW_W - 1;
  /** 放大后叠加元素要同步放大，才能保持屏幕尺寸恒定 */
  const scale = view.w / VIEW_W;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`}
        className="w-full h-auto touch-none select-none cursor-grab active:cursor-grabbing"
        style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}
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
        aria-label="中国旅行足迹地图"
      >
        <g>
          {shapes.map(({ city, d }) => {
            const status = statusByName.get(city.n);
            const meta = status ? PLACE_STATUS_META[status] : null;
            const [cx, cy] = projection.project(city.c[0], city.c[1]);
            return (
              <path
                key={city.n}
                d={d}
                className={`${meta ? meta.fill : NEUTRAL_FILL} stroke-slate-300/70 dark:stroke-slate-700/70 hover:brightness-95 dark:hover:brightness-110`}
                strokeWidth={0.6}
                vectorEffect="non-scaling-stroke"
                onMouseEnter={() =>
                  setHover({
                    name: city.n,
                    label: status ? STATUS_LABEL[status] : '未点亮',
                    x: cx,
                    y: cy,
                    note: pointByCity.get(city.n)?.firstDate ?? undefined,
                  })
                }
                onClick={() => select(pointByCity.get(city.n)?.place.id ?? null)}
              />
            );
          })}
        </g>

        {/* 南海诸岛界线等线要素 */}
        <g fill="none" className="stroke-slate-400 dark:stroke-slate-600" strokeWidth={1}>
          {boundary.map((d, i) => (
            <path key={i} d={d} vectorEffect="non-scaling-stroke" />
          ))}
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

        {/* 地点标记 */}
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

      {/* 悬停提示：坐标换算到当前视图，缩放后依然跟随 */}
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
          onClick={() => setView(INITIAL_VIEW)}
          className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 px-2 py-1 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-colors"
        >
          <Maximize2 className="h-3 w-3" />
          重置
        </button>
      )}
    </div>
  );
};
