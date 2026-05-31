import { useEffect, useState } from 'react';

interface DayCell {
  date: string;
  count: number;
  /** 0-4，与 GitHub 配色一致 */
  level: 0 | 1 | 2 | 3 | 4;
}

interface Props {
  username: string;
  /** 主题色，默认 indigo */
  colorScheme?: 'indigo' | 'green' | 'amber' | 'rose';
}

const SCHEME_DARK: Record<string, [string, string, string, string, string]> = {
  indigo: ['rgb(30,41,59)', 'rgb(67,56,202,0.4)', 'rgb(79,70,229,0.7)', 'rgb(99,102,241,0.9)', 'rgb(165,180,252)'],
  green: ['rgb(30,41,59)', 'rgb(22,101,52,0.4)', 'rgb(22,163,74,0.7)', 'rgb(34,197,94,0.9)', 'rgb(134,239,172)'],
  amber: ['rgb(30,41,59)', 'rgb(146,64,14,0.4)', 'rgb(217,119,6,0.7)', 'rgb(245,158,11,0.9)', 'rgb(253,224,71)'],
  rose: ['rgb(30,41,59)', 'rgb(159,18,57,0.4)', 'rgb(225,29,72,0.7)', 'rgb(244,63,94,0.9)', 'rgb(251,113,133)'],
};
const SCHEME_LIGHT: Record<string, [string, string, string, string, string]> = {
  indigo: ['rgb(241,245,249)', 'rgb(199,210,254)', 'rgb(129,140,248)', 'rgb(79,70,229)', 'rgb(49,46,129)'],
  green: ['rgb(241,245,249)', 'rgb(187,247,208)', 'rgb(74,222,128)', 'rgb(22,163,74)', 'rgb(20,83,45)'],
  amber: ['rgb(241,245,249)', 'rgb(254,215,170)', 'rgb(251,191,36)', 'rgb(217,119,6)', 'rgb(146,64,14)'],
  rose: ['rgb(241,245,249)', 'rgb(254,205,211)', 'rgb(251,113,133)', 'rgb(225,29,72)', 'rgb(136,19,55)'],
};

/**
 * GitHub Contribution 热力图（53 周 × 7 天）
 * 数据来源：开源镜像 https://github-contributions-api.jogruber.de/v4/<user>
 * 该 API 无需 token，CORS 友好，免费
 */
const GitHubHeatmap = ({ username, colorScheme = 'indigo' }: Props) => {
  const [days, setDays] = useState<DayCell[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { contributions: DayCell[]; total: { lastYear: number } }) => {
        if (ignore) return;
        setDays(data.contributions);
        setTotal(data.total?.lastYear ?? 0);
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, [username]);

  if (loading) {
    return (
      <div className="card-base p-6 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-[repeat(53,minmax(0,1fr))] gap-[2px]">
          {Array.from({ length: 53 * 7 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-sm bg-slate-100 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  if (error || days.length === 0) {
    return (
      <div className="card-base p-6 text-center text-sm text-slate-500 dark:text-slate-400">
        <p className="mb-1">热力图加载失败</p>
        <p className="text-xs text-slate-400">{error}</p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          访问 GitHub 主页 →
        </a>
      </div>
    );
  }

  const palette = (isDark ? SCHEME_DARK : SCHEME_LIGHT)[colorScheme];

  // 按周分组：每 7 天一列
  const weeks: DayCell[][] = [];
  // 先填充第一周开头
  const firstDay = new Date(days[0].date);
  const firstWeekday = firstDay.getDay(); // 0=Sun
  let currentWeek: DayCell[] = Array(firstWeekday).fill({ date: '', count: 0, level: 0 });

  for (const d of days) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push({ date: '', count: 0, level: 0 });
    weeks.push(currentWeek);
  }

  const cellSize = 11;
  const cellGap = 2;
  const width = weeks.length * (cellSize + cellGap);
  const height = 7 * (cellSize + cellGap);

  return (
    <div className="card-base p-5 md:p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            过去一年的 GitHub 贡献
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <span className="font-mono text-indigo-600 dark:text-indigo-400">{total}</span> contributions
          </p>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          @{username}
        </a>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="GitHub contributions heatmap"
        >
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date) return null;
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * (cellSize + cellGap)}
                  y={di * (cellSize + cellGap)}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={palette[day.level]}
                >
                  <title>
                    {day.date}: {day.count} contribution{day.count !== 1 ? 's' : ''}
                  </title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      <div className="flex items-center justify-end gap-1.5 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <span>Less</span>
        {palette.map((c, i) => (
          <span
            key={i}
            className="inline-block rounded-sm"
            style={{ width: 11, height: 11, background: c }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
};

export default GitHubHeatmap;
