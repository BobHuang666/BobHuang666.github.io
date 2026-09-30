import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, LayoutGrid, Star } from 'lucide-react';
import { copy } from '../../../data/copy';
import { awards } from '../../../data/awards';
import { gradient } from '../../../utils/gradients';
import { resolveIcon } from '../../../utils/iconMap';
import { GradientIcon } from '../../../shared/components/ui/GradientIcon';
import { ViewSwitch } from './primitives';

/** 获奖经历：卡片视图 + 按年份倒序的时间线视图 */
export const AwardsTab = () => {
  const [view, setView] = useState<'card' | 'timeline'>('card');

  // 按年份倒序分组
  const byYear = awards.reduce<Record<string, typeof awards>>((acc, a) => {
    (acc[a.year] ??= []).push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => +b - +a);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {copy.level.summary(awards.length)}
        </p>
        <ViewSwitch
          value={view}
          onChange={setView}
          options={[
            { id: 'card', label: copy.profile.cardView, icon: LayoutGrid },
            { id: 'timeline', label: copy.profile.timelineView, icon: AlignLeft },
          ]}
        />
      </div>

      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {awards.map((award) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start mb-3">
                <GradientIcon icon={resolveIcon(award.icon, Star)} tone={award.tone} className="mr-3 shadow" />
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                    {award.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {award.organization}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                {award.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                  {award.year} · {award.level}
                </span>
                {award.rank ? (
                  <span className="text-slate-500 dark:text-slate-400">{award.rank}</span>
                ) : (
                  <Star className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {year}
                </span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400">{byYear[year].length} 项</span>
              </div>
              <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-0 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-700">
                {byYear[year].map((award) => (
                  <div key={award.title} className="relative">
                    <div className={`absolute -left-5 top-3 w-3 h-3 rounded-full bg-gradient-to-br ${gradient(award.tone)} shadow`} />
                    <div className="ml-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <GradientIcon icon={resolveIcon(award.icon, Star)} tone={award.tone} size="sm" className="shadow" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {award.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {award.organization} · <span className="text-indigo-600 dark:text-indigo-400">{award.level}</span>
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                            {award.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

