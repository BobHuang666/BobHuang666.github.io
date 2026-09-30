import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlignLeft, LayoutGrid } from 'lucide-react';
import { copy } from '../../../data/copy';
import { skillsDetail } from '../../../data/skills';
import { gradient } from '../../../utils/gradients';
import { resolveIcon } from '../../../utils/iconMap';
import SkillRadar from '../SkillRadar';
import { SectionHeading, Stars, ViewSwitch } from './primitives';

/** 技能专长：列表视图 + 雷达图视图 */
export const SkillsTab = () => {
  const [view, setView] = useState<'list' | 'radar'>('list');

  // 雷达图数据：从每个类别里选最高分技能，最多 8 个
  const radarItems = skillsDetail
    .flatMap((cat) => cat.skills.slice(0, 2).map((s) => ({ label: s.name, value: s.level })))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <ViewSwitch
          value={view}
          onChange={setView}
          options={[
            { id: 'list', label: copy.profile.listView, icon: AlignLeft },
            { id: 'radar', label: copy.profile.radarView, icon: LayoutGrid },
          ]}
        />
      </div>

      {view === 'radar' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-4"
        >
          <SkillRadar items={radarItems} size={320} />
        </motion.div>
      ) : (
        <div className="space-y-8">
          {skillsDetail.map((cat) => (
            <div key={cat.category}>
              <SectionHeading icon={resolveIcon(cat.icon)} title={cat.category} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">{skill.name}</span>
                      <Stars count={skill.stars ?? Math.round((skill.level / 100) * 5)} />
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-1.5 rounded-full bg-gradient-to-r ${gradient(skill.tone)}`}
                      />
                    </div>
                    {skill.note && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{skill.note}</p>
                    )}
                    {skill.evidence && skill.evidence.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                        {skill.evidence.map((ev) => (
                          <a
                            key={ev.href + ev.label}
                            href={ev.href}
                            target={ev.href.startsWith('http') ? '_blank' : undefined}
                            rel={ev.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-md bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                          >
                            {ev.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
