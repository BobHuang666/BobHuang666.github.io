import { TRANSPORT_META } from '../meta';
import { arcPath } from '../utils/projection';
import type { RouteSegment } from '../utils/footprint';

/**
 * 图标组挂载时，手动启动其 <animateMotion>。
 * 用 begin="indefinite" + beginElementAt 而非写死 begin="2s"：
 * SMIL 的 begin 时钟锚定在 SVG 文档时间轴上，页面开久了「2s」早已过去，
 * 关掉路线再打开时图标会瞬间出现、失去 2s+错峰的回放效果。
 * 这样每次图标组真正挂载（即路线被显示）时，都从「现在 + 2s + i*0.12s」重新算起，
 * 保证隐藏→显示能从头再播放一次。模块级常量保证 ref 身份稳定，hover 等重渲染不会误触发。
 */
function startMotion(node: SVGGElement | null) {
  if (!node) return;
  const motion = node.querySelector('animateMotion');
  if (!motion) return;
  const idx = Number(node.getAttribute('data-i') ?? '0');
  (motion as SVGAnimateMotionElement).beginElementAt(idx * 0.12);
}

interface Props {
  segments: RouteSegment[];
  project: (lng: number, lat: number) => [number, number];
  /** 是否播放生长动画与运动图标（prefers-reduced-motion 时为 false） */
  animate: boolean;
  /** 当前选中的年份：只显示落在这几个年份里的路径 */
  activeYears: Set<number>;
  /** 缩放补偿系数：叠加元素乘以它，屏幕尺寸才不随缩放变化 */
  scale: number;
  /** 高亮某次出行时，其余路径淡出 */
  highlightTripId?: string | null;
  /** 选中某次出行时，只显示该行程的路线（其余隐藏，忽略年份筛选） */
  selectedTripId?: string | null;
  /** 路线总开关（地图「路线」开关）：false 时整层不画出，切换时同样带 2s 生长动画 */
  visible?: boolean;
}

/**
 * 路径层：每段行程画一条弧线，并让交通方式图标沿线运动。
 *
 * 生长动画用 SVG 的 pathLength 归一化：pathLength=1 后
 * strokeDasharray=1 / strokeDashoffset 1→0 即为「从起点画到终点」，
 * 无需 JS 测量路径长度。
 *
 * 注意：这里不能用 vectorEffect="non-scaling-stroke" —— 它会让虚线长度在设备
 * 空间计算，与 pathLength 归一化后的 dasharray 失配，导致放大后轨迹错乱。
 * 改为把线宽和图标尺寸乘以缩放系数 scale，既保持视觉恒定，又不影响几何。
 */
export const RouteLayer = ({
  segments,
  project,
  animate,
  activeYears,
  scale,
  highlightTripId,
  selectedTripId,
  visible = true,
}: Props) => (
  <g>
    {segments.map((seg, i) => {
      const meta = TRANSPORT_META[seg.leg.transport];
      const d = arcPath(
        project(seg.from.lng, seg.from.lat),
        project(seg.to.lng, seg.to.lat),
        meta.curvature,
      );
      const Icon = meta.icon;
      const focused = Boolean(selectedTripId);
      const isSelected = focused && seg.tripId === selectedTripId;
      // 未选中行程时按年份筛选；选中某行程时只显示该行程（忽略年份）
      const shown = focused ? isSelected : activeYears.has(Number(seg.leg.date.slice(0, 4)));
      // 路线总开关与年份/行程筛选共同决定：visible 关掉则整层不画（仍走 2s 生长动画）
      const drawn = visible && shown;
      const dimmed = drawn && Boolean(highlightTripId) && seg.tripId !== highlightTripId;
      const opacity = drawn ? (dimmed ? 0.22 : 1) : 0;

      return (
        <g key={seg.id} opacity={opacity} style={{ transition: 'opacity .45s' }}>
          <path
            id={`route-${seg.id}`}
            d={d}
            fill="none"
            stroke={meta.color}
            strokeWidth={2 * scale}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={drawn ? 0 : 1}
            style={
              animate
                ? { transition: 'stroke-dashoffset 2s ease-out, opacity .45s' }
                : undefined
            }
          />

          {animate && drawn && (
            <g ref={startMotion} data-i={i}>
              {/* 不跟随路径旋转：保证图标始终正立，向左飞时不会倒过来 */}
              <animateMotion dur="4s" repeatCount="indefinite" begin="indefinite">
                <mpath href={`#route-${seg.id}`} />
              </animateMotion>
              <g transform={`scale(${scale})`}>
                {/* 白色底衬保证图标在深色底图上也能看清 */}
                <circle r="8" fill="#fff" opacity="0.92" />
                <g transform="translate(-7 -7)">
                  <Icon size={14} color={meta.color} strokeWidth={2.5} />
                </g>
              </g>
            </g>
          )}
        </g>
      );
    })}
  </g>
);
