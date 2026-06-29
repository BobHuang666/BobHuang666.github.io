import { motion } from 'framer-motion';

interface RadarItem {
  label: string;
  value: number; // 0-100
}

interface Props {
  items: RadarItem[];
  size?: number;
}

/**
 * 纯 SVG 雷达图，无外部依赖
 */
const SkillRadar = ({ items, size = 280 }: Props) => {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = items.length;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos(angle(i)),
    y: cy + r * ratio * Math.sin(angle(i)),
  });
  const pStr = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x},${p.y}`).join(' ');

  // 背景蜘蛛网：5层
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const dataPoints = items.map((it, i) => point(i, it.value / 100));

  return (
    <div className="flex flex-col items-center gap-4">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        aria-label="技能雷达图"
      >
        {/* 背景层 */}
        {levels.map((lvl) => (
          <polygon
            key={lvl}
            points={pStr(items.map((_, i) => point(i, lvl)))}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-slate-200 dark:text-slate-700"
          />
        ))}

        {/* 轴线 */}
        {items.map((_, i) => {
          const outer = point(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outer.x}
              y2={outer.y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-slate-200 dark:text-slate-700"
            />
          );
        })}

        {/* 数据区域 */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
          points={pStr(dataPoints)}
          fill="rgb(99 102 241 / 0.2)"
          stroke="rgb(99 102 241)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* 数据点 */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            initial={{ r: 0 }}
            animate={{ r: 4 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.05 }}
            cx={p.x}
            cy={p.y}
            fill="white"
            stroke="rgb(99 102 241)"
            strokeWidth="2"
          />
        ))}

        {/* 标签 */}
        {items.map((it, i) => {
          const labelPt = point(i, 1.22);
          const textAnchor =
            Math.abs(labelPt.x - cx) < 5 ? 'middle' : labelPt.x < cx ? 'end' : 'start';
          return (
            <text
              key={i}
              x={labelPt.x}
              y={labelPt.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              fontSize="11"
              className="fill-slate-600 dark:fill-slate-400 font-medium"
            >
              {it.label}
            </text>
          );
        })}

        {/* 层级标注 */}
        {levels.slice(0, -1).map((lvl) => {
          const p = point(0, lvl);
          return (
            <text
              key={lvl}
              x={p.x + 3}
              y={p.y - 3}
              fontSize="8"
              className="fill-slate-400 dark:fill-slate-500"
            >
              {lvl * 100}
            </text>
          );
        })}
      </svg>

      {/* 图例 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 text-xs text-slate-600 dark:text-slate-400 max-w-xs">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
            <span className="truncate">{it.label}</span>
            <span className="ml-auto font-mono text-indigo-600 dark:text-indigo-400">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillRadar;
