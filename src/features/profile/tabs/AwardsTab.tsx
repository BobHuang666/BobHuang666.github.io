import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, LayoutGrid, Star, Tags } from 'lucide-react';
import { uiText } from '../../../data/uiText';
import { awards, awardCategoryMeta } from '../../../data/awards';
import { gradient } from '../../../utils/gradients';
import { resolveIcon } from '../../../utils/iconMap';
import { GradientIcon } from '../../../shared/components/ui/GradientIcon';
import { ViewSwitch } from './primitives';
import { AWARD_LEVELS, AWARD_CATEGORIES } from '../../../types';
import type { Award, AwardCategory } from '../../../types';
import { formatAwardDate, compareAwardDateDesc } from '../../../utils/awardDate';

/** 生成唯一 key，避免同名奖项（跨年份）造成的重复 key */
const awardKey = (a: { title: string; year: string; month?: string; day?: string }) =>
  `${a.title}__${a.year}__${a.month ?? ''}__${a.day ?? ''}`;

/** 五个奖项等级对应的文字颜色，便于一眼区分等级高低 */
const LEVEL_TEXT: Record<string, string> = {
  国际级: 'text-rose-600 dark:text-rose-400',
  国家级: 'text-amber-600 dark:text-amber-400',
  省级: 'text-sky-600 dark:text-sky-400',
  校级: 'text-emerald-600 dark:text-emerald-400',
  院系级: 'text-violet-600 dark:text-violet-400',
};
const levelText = (level: string) => LEVEL_TEXT[level] ?? 'text-slate-500 dark:text-slate-400';

/** 各分类对应的标题文字颜色，使分类视图中不同分类的标题呈不同颜色 */
const CATEGORY_TITLE_TEXT: Record<AwardCategory, string> = {
  程序设计: 'text-violet-600 dark:text-violet-400',
  学科竞赛: 'text-blue-600 dark:text-blue-400',
  荣誉称号: 'text-rose-600 dark:text-rose-400',
  奖学金: 'text-amber-600 dark:text-amber-400',
  其他: 'text-cyan-600 dark:text-cyan-400',
};

/** 单张奖项卡片：卡片视图（按等级）与分类视图（按类别）共用
 * - showLevel：是否在卡片上标注等级（分类视图开启，颜色同时间线视图） */
const AwardCard = ({
  award,
  showLevel = false,
}: {
  award: Award;
  showLevel?: boolean;
}) => {
  const meta = awardCategoryMeta(award.category);
  return (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
  >
    <div className="flex items-start mb-3">
      <GradientIcon icon={resolveIcon(meta.icon, Star)} tone={meta.tone} className="mr-3 shadow" />
      <div className="min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
          {award.title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
          {award.organization}
        </p>
      </div>
    </div>
    {award.description && (
      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mb-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 line-clamp-3">
        {award.description}
      </p>
    )}
    <div className="flex items-center justify-between text-xs gap-2">
      <div className="flex items-center gap-2 min-w-0">
        {showLevel && (
          <span className={`px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-medium shrink-0 ${levelText(award.level)}`}>
            {award.level}
          </span>
        )}
        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 tabular-nums">
          {formatAwardDate(award.year, award.month, award.day)}
        </span>
      </div>
      {award.rank ? (
        <span className="text-slate-500 dark:text-slate-400 shrink-0">{award.rank}</span>
      ) : (
        <Star className="h-4 w-4 text-yellow-500 shrink-0" />
      )}
    </div>
  </motion.div>
  );
};

/** 获奖经历：卡片视图（按等级分组）+ 时间线视图（按年份）+ 分类视图（按类别） */
export const AwardsTab = () => {
  const [view, setView] = useState<'card' | 'timeline' | 'category'>('card');

  // 卡片视图：按等级分组（高 → 低），组内按时间降序
  const levelGroups = AWARD_LEVELS
    .map((level) => ({
      level,
      items: awards.filter((a) => a.level === level).sort(compareAwardDateDesc),
    }))
    .filter((g) => g.items.length > 0);

  // 时间线：按年份倒序分组，组内按「月份、日期」降序（仅有月份无日期者排在同月最前）
  const byYear = awards.reduce<Record<string, Award[]>>((acc, a) => {
    (acc[a.year] ??= []).push(a);
    return acc;
  }, {});
  Object.values(byYear).forEach((list) => list.sort(compareAwardDateDesc));
  const years = Object.keys(byYear).sort((a, b) => +b - +a);

  // 分类视图：按 AWARD_CATEGORIES 顺序分组，组内「先按等级（高→低），再按时间倒序」
  const compareByLevelThenDate = (a: Award, b: Award) => {
    const la = AWARD_LEVELS.indexOf(a.level);
    const lb = AWARD_LEVELS.indexOf(b.level);
    if (la !== lb) return la - lb; // 等级 index 越小等级越高，故升序即高→低
    return compareAwardDateDesc(a, b);
  };
  const categoryGroups = AWARD_CATEGORIES
    .map((cat) => ({
      cat,
      items: awards.filter((a) => a.category === cat).sort(compareByLevelThenDate),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {uiText.awards.summary(awards.length)}
        </p>
        <ViewSwitch
          value={view}
          onChange={setView}
          options={[
            { id: 'card', label: uiText.profile.cardView, icon: LayoutGrid },
            { id: 'timeline', label: uiText.profile.timelineView, icon: AlignLeft },
            { id: 'category', label: uiText.profile.categoryView, icon: Tags },
          ]}
        />
      </div>

      {view === 'card' ? (
        <div className="space-y-8">
          {levelGroups.map(({ level, items }) => (
            <div key={level}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-base font-bold ${levelText(level)}`}>{level}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400">{items.length} 项</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((award) => (
                  <AwardCard key={awardKey(award)} award={award} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : view === 'timeline' ? (
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
                  <div key={awardKey(award)} className="relative">
                    <div className={`absolute -left-5 top-3 w-3 h-3 rounded-full bg-gradient-to-br ${gradient(awardCategoryMeta(award.category).tone)} shadow`} />
                    <div className="ml-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <GradientIcon icon={resolveIcon(awardCategoryMeta(award.category).icon, Star)} tone={awardCategoryMeta(award.category).tone} size="sm" className="shadow" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {award.title}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className={levelText(award.level)}>{award.level}</span>
                            {' · '}
                            {award.organization}
                            {' · '}
                            <span className="text-slate-400 dark:text-slate-500 tabular-nums">{formatAwardDate(award.year, award.month, award.day)}</span>
                          </p>
                          {award.description && (
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 mt-2 pl-3 border-l-2 border-slate-200 dark:border-slate-700 line-clamp-3">
                              {award.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {categoryGroups.map(({ cat, items }) => (
            <div key={cat}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-base font-bold ${CATEGORY_TITLE_TEXT[cat]}`}>{cat}</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400">{items.length} 项</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((award) => (
                  <AwardCard
                    key={awardKey(award)}
                    award={award}
                    showLevel
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
