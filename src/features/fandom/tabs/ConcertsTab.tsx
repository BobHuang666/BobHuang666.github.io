import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music, Quote, Ticket } from 'lucide-react';
import { concerts, type Concert } from '../../../data/fandom';
import { gradient } from '../../../utils/gradients';
import { fmtDate, daysUntil } from '../format';
import { FandomEmptyState } from '../components';

/** 按年份分组（倒序）；同一年内按日期倒序（最新在前） */
const groupByYear = (items: { date: string }[]) => {
  const m = new Map<number, Concert[]>();
  for (const it of items) {
    const y = new Date(it.date).getFullYear();
    if (!m.has(y)) m.set(y, []);
    m.get(y)!.push(it as Concert);
  }
  return [...m.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([y, list]) => [y, list.sort((a, b) => +new Date(b.date) - +new Date(a.date))] as [number, Concert[]]);
};

/** 单张演唱会卡片（已结束） */
const ConcertCard = ({ c, idx }: { c: Concert; idx: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: idx * 0.05 }}
    className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className={`h-1.5 w-full bg-gradient-to-r ${gradient(c.tone)}`} />
    <div className="p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* 艺人：中性浅底胶囊 + 渐变小圆点 */}
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
          <Music className="h-3 w-3 text-slate-400" />
          {c.idol}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Calendar className="h-3.5 w-3.5" />{fmtDate(c.date)}
        </span>
      </div>
      <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2">{c.tour}</h4>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />{c.city} · {c.venue}
        </span>
        {c.seat && (
          <span className="inline-flex items-center gap-1">
            <Ticket className="h-3 w-3" />{c.seat}
          </span>
        )}
      </div>
      {c.highlight && (
        <p className="text-sm mt-3 text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-rose-300 dark:border-rose-800 pl-3">
          {c.highlight}
        </p>
      )}
    </div>
  </motion.article>
);

/** 演唱会日历：待赴约（渐变卡 + 倒计时）置顶 + 按年份分组的「票根」卡片网格 */
export const ConcertsTab = () => {
  const upcoming = concerts
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date)); // 临近的在前
  const past = concerts.filter((c) => c.status !== 'upcoming');

  if (concerts.length === 0) {
    return <FandomEmptyState icon={Calendar} text="还没有演唱会记录 —— 期待下一场约定" />;
  }

  return (
    <div className="space-y-10">
      {/* 待赴约：恢复成之前的整张渐变填充白字 + 大号倒计时 */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-end gap-3 mb-5">
            <Clock className="h-7 w-7 text-rose-500 pb-1" />
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">即将赴约</span>
            <span className="pb-1 text-sm text-slate-400 dark:text-slate-500">{upcoming.length} 场</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((c, idx) => {
              const days = daysUntil(c.date);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${gradient(c.tone)} shadow-lg`}
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/25 text-xs font-medium backdrop-blur-sm">
                        <Music className="h-3 w-3" /> {c.idol}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold leading-none">
                          {days > 0 ? days : 0}
                        </div>
                        <div className="text-[10px] opacity-90">{days > 0 ? '天后' : '就在今天'}</div>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-1">{c.tour}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-95">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(c.date)}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.city} · {c.venue}</span>
                    </div>
                    {c.seat && (
                      <span className="inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-md bg-white/20 text-xs">
                        <Ticket className="h-3 w-3" />{c.seat}
                      </span>
                    )}
                    {c.highlight && (
                      <div className="mt-3 flex gap-2 rounded-lg bg-white/10 px-3 py-2 backdrop-blur-sm">
                        <Quote className="h-3.5 w-3.5 shrink-0 mt-0.5 text-white/70" />
                        <p className="text-sm leading-relaxed text-white/95">{c.highlight}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {/* 其余：按年份分组倒序 */}
      {groupByYear(past).map(([year, list]) => (
        <section key={year}>
          <div className="flex items-end gap-3 mb-5">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{year}</span>
            <span className="pb-1 text-sm text-slate-400 dark:text-slate-500">{list.length} 场</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {list.map((c, idx) => (
              <ConcertCard key={c.id} c={c} idx={idx} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
