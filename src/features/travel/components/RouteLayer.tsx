import { TRANSPORT_META } from '../meta';
import { arcPath } from '../utils/projection';
import type { RouteSegment } from '../utils/footprint';

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
export const RouteLayer = ({ segments, project, animate, activeYears, scale, highlightTripId }: Props) => (
  <g>
    {segments.map((seg, i) => {
      const meta = TRANSPORT_META[seg.leg.transport];
      const d = arcPath(
        project(seg.from.lng, seg.from.lat),
        project(seg.to.lng, seg.to.lat),
        meta.curvature,
      );
      const Icon = meta.icon;
      const dimmed = Boolean(highlightTripId) && seg.tripId !== highlightTripId;
      const revealed = activeYears.has(Number(seg.leg.date.slice(0, 4)));
      const opacity = revealed ? (dimmed ? 0.22 : 1) : 0;

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
            strokeDashoffset={revealed ? 0 : 1}
            style={
              animate
                ? { transition: `stroke-dashoffset 1.1s ease-out ${i * 0.16}s, opacity .45s` }
                : undefined
            }
          />

          {animate && revealed && (
            <g>
              {/* 不跟随路径旋转：保证图标始终正立，向左飞时不会倒过来 */}
              <animateMotion dur="4s" repeatCount="indefinite" begin={`${1.1 + i * 0.16}s`}>
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
