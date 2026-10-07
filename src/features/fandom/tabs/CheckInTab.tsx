import { motion } from 'framer-motion';
import { CalendarDays, MapPin } from 'lucide-react';
import { checkIns, type CheckIn } from '../../../data/fandom';
import { fmtDate } from '../format';
import { FandomEmptyState } from '../components';

/** 明星胶囊渐变配色（已按色相错开排列，相近颜色不相邻） */
const IDOL_GRADIENTS = [
  'from-fuchsia-500 to-rose-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-purple-500',
  'from-sky-500 to-indigo-500',
  'from-lime-500 to-green-500',
  'from-pink-500 to-rose-400',
  'from-cyan-500 to-blue-500',
  'from-red-500 to-rose-500',
  'from-indigo-500 to-blue-600',
];
/**
 * 为每个不同的明星名分配一个固定且互不相同的颜色：
 * 按首次出现顺序从调色板取色，避免哈希撞色导致多个明星同色/相近色。
 */
const idolColorCache = new Map<string, string>();
let idolColorCursor = 0;
const idolColor = (name: string) => {
  const key = name.trim();
  let c = idolColorCache.get(key);
  if (!c) {
    c = IDOL_GRADIENTS[idolColorCursor % IDOL_GRADIENTS.length];
    idolColorCache.set(key, c);
    idolColorCursor++;
  }
  return c;
};

/** 按年份分组（倒序）；同一年内按日期倒序 */
const groupByYear = (items: { date: string }[]) => {
  const m = new Map<number, CheckIn[]>();
  for (const it of items) {
    const y = new Date(it.date).getFullYear();
    if (!m.has(y)) m.set(y, []);
    m.get(y)!.push(it as CheckIn);
  }
  return [...m.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([y, list]) => [y, list.sort((a, b) => +new Date(b.date) - +new Date(a.date))] as [number, CheckIn[]]);
};

/** 线下打卡：按年份分组的时间线（竖向路径 + 打卡点） */
export const CheckInTab = () => {
  if (checkIns.length === 0) return <FandomEmptyState icon={MapPin} text="还没有线下打卡记录" />;

  return (
    <div className="space-y-10">
      {groupByYear(checkIns).map(([year, list]) => (
        <section key={year}>
          {/* 年份标记 */}
          <div className="flex items-center gap-3 mb-5">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-rose-500 text-white text-lg font-black shadow-sm">
              {String(year).slice(2)}
            </span>
            <div>
              <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{year}</div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">{list.length} 次打卡</div>
            </div>
          </div>

          {/* 时间线 */}
          <div className="space-y-1">
            {list.map((c, idx) => (
              <div key={c.id} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <span className="grid place-items-center w-5 h-5 rounded-full bg-white dark:bg-slate-950 ring-4 ring-white dark:ring-slate-950">
                    <MapPin className="h-3 w-3 text-rose-500" />
                  </span>
                  {idx < list.length - 1 && (
                    <span className="w-px flex-1 bg-gradient-to-b from-fuchsia-300 to-rose-300 dark:from-fuchsia-800 dark:to-rose-800 my-1" />
                  )}
                </div>
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="flex-1 pb-4"
                >
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`shrink-0 inline-flex items-center rounded-full bg-gradient-to-r ${idolColor(c.idol)} text-white text-xs font-semibold px-2.5 py-0.5 shadow-sm`}>
                        {c.idol}
                      </span>
                      <span className="shrink-0 ml-auto text-xs text-slate-400 dark:text-slate-500 inline-flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />{fmtDate(c.date)}
                      </span>
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100 leading-snug mb-1.5">{c.place}</h4>
                    {c.note && <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{c.note}</p>}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
