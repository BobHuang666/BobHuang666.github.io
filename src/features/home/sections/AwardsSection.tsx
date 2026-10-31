/** 首页奖项区：级别筛选 + 荣誉统计 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy } from 'lucide-react';
import { uiText } from '@/data/uiText';
import { awards, awardCategoryMeta } from '@/data/awards';
import { AWARD_LEVELS, type AwardLevel } from '@/types';
import { resolveIcon } from '@/shared/components/ui/iconMap';
import { formatAwardDate } from '@/utils/awardDate';
import { SectionReveal } from '@/shared/components/effects/SectionReveal';
import { Chip } from '@/shared/components/ui/Chip';
import { GradientIcon } from '@/shared/components/ui/GradientIcon';
import { SectionShell } from '@/shared/components/layout/SectionShell';

type AwardFilter = 'all' | AwardLevel;
const AWARD_FILTERS: AwardFilter[] = ['all', ...AWARD_LEVELS];

export const AwardsSection = () => {
  const [awardFilter, setAwardFilter] = useState<AwardFilter>('all');

  const filteredAwards = useMemo(() => {
    const list = awardFilter === 'all' ? awards : awards.filter((a) => a.level === awardFilter);
    return list.slice(0, 6);
  }, [awardFilter]);

  return (
    <SectionShell
      id="awards"
      no="03"
      eyebrow={uiText.home.awardsEyebrow}
      title={uiText.home.awardsTitle}
      subtitle={uiText.home.awardsSub(awards.length)}
      tint="violet"
      texture="blueprint"
      textureFade
    >
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {AWARD_FILTERS.map((lv) => (
          <Chip
            key={lv}
            active={awardFilter === lv}
            onClick={() => setAwardFilter(lv)}
            className="px-3 py-1.5"
          >
            {lv === 'all' ? uiText.awards.all : lv}
          </Chip>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAwards.map((award, index) => {
          const meta = awardCategoryMeta(award.category);
          return (
            <SectionReveal key={`${award.title}-${index}`} delay={index * 0.06}>
              <div className="card-base p-6 h-full">
                <div className="flex items-center mb-3">
                  <GradientIcon
                    icon={resolveIcon(meta.icon, Trophy)}
                    tone={meta.tone}
                    className="mr-3 shadow-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {award.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {award.organization}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="tag-chip rounded-full">
                    {formatAwardDate(award.year, award.month, award.day)}
                  </span>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {award.level}
                  </span>
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link
          to="/profile?tab=awards"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
        >
          {uiText.home.viewAllAwards(awards.length)} <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </SectionShell>
  );
};

