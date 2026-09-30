import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { supportRecords } from '../../../data/fandom';
import { supportIcons, supportTypeMeta } from '../meta';
import { fmtDate } from '../format';
import { FandomEmptyState } from '../components';

/** 应援记录：按日期倒序的时间线 */
export const SupportTab = () => {
  const sorted = [...supportRecords].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (sorted.length === 0) return <FandomEmptyState icon={Sparkles} text="还没有应援记录" />;
  return (
    <div className="relative pl-6">
      <span className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-fuchsia-300 via-rose-300 to-transparent dark:from-fuchsia-800 dark:via-rose-800" />
      <div className="space-y-4">
        {sorted.map((s, idx) => {
          const meta = supportTypeMeta[s.type];
          const Icon = supportIcons[s.type];
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[20px] top-4 grid place-items-center w-4 h-4 rounded-full bg-white dark:bg-slate-950 ring-4 ring-white dark:ring-slate-950">
                <Icon className="h-3.5 w-3.5 text-rose-500" />
              </span>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${meta.badgeClass}`}>
                      {meta.label}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{s.title}</h4>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{fmtDate(s.date)}</span>
                </div>
                <p className="text-xs text-rose-500 mb-1">For {s.idol}</p>
                {s.detail && <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.detail}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
