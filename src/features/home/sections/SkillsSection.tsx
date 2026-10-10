import { uiText } from '../../../data/uiText';
import { skillGroups } from '../../../data/profile';
import { resolveIcon } from '../../../utils/iconMap';
import { SectionReveal } from '../../../shared/components/effects/SectionReveal';
import { SectionHeader } from './SectionHeader';

/** 技能树概览（四个分类的标签云） */
export const SkillsSection = () => (
  <section id="skills" className="py-20 bg-slate-50 dark:bg-slate-900/40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={uiText.home.skillsTitle} subtitle={uiText.home.skillsSub} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skillGroups.map((category, index) => {
          const Icon = resolveIcon(category.icon);
          return (
            <SectionReveal key={category.name} delay={index * 0.08}>
              <div className="card-base p-6 h-full">
                <div className="flex items-center mb-4">
                  <div className="w-11 h-11 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center mr-3">
                    <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {category.name}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </SectionReveal>
          );
        })}
      </div>
    </div>
  </section>
);
