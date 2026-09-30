import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Music, Ticket } from 'lucide-react';
import { concerts } from '../../../data/fandom';
import { gradient } from '../../../utils/gradients';
import { fmtDate, daysUntil } from '../format';
import { FandomEmptyState, SubHeading } from '../components';

/** 演唱会日历：即将赴约（含倒计时）+ 现场足迹 */
export const ConcertsTab = () => {
  const upcoming = concerts
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const attended = concerts
    .filter((c) => c.status === 'attended')
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  if (concerts.length === 0) {
    return <FandomEmptyState icon={Calendar} text="还没有演唱会记录 —— 期待下一场约定" />;
  }

  return (
    <div className="space-y-10">
      {upcoming.length > 0 && (
        <section>
          <SubHeading icon={Clock} text="即将赴约" />
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
                    {c.highlight && <p className="text-sm mt-3 opacity-95 leading-relaxed">"{c.highlight}"</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {attended.length > 0 && (
        <section>
          <SubHeading icon={Ticket} text="现场足迹" count={attended.length} />
          <div className="relative pl-6">
            <span className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-rose-300 via-pink-300 to-transparent dark:from-rose-700 dark:via-pink-800" />
            <div className="space-y-4">
              {attended.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="relative"
                >
                  <span className={`absolute -left-[18px] top-4 w-3 h-3 rounded-full bg-gradient-to-br ${gradient(c.tone)} ring-4 ring-white dark:ring-slate-950`} />
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{c.tour}</h4>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{fmtDate(c.date)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 text-rose-500"><Music className="h-3 w-3" />{c.idol}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city} · {c.venue}</span>
                      {c.seat && <span className="inline-flex items-center gap-1"><Ticket className="h-3 w-3" />{c.seat}</span>}
                    </div>
                    {c.highlight && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">"{c.highlight}"</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
