import { motion } from 'framer-motion';
import { Code2, GraduationCap, Heart, Award } from 'lucide-react';
import { profile } from '../../../data/profile';
import { skillPills } from '../../../data/skills';
import type { SkillPillGroup } from '../../../types';
import { SectionHeading, InfoLine } from './primitives';

/** 胶囊浅色调：按类别区分，不评分、不额外说明 */
const PILL_STYLE: Record<SkillPillGroup, string> = {
  language: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300',
  frontend: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  backend: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300',
  tool: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  hobby: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
};

/** 胶囊列表：技能专长 / 兴趣爱好共用 */
const PillCloud = ({ pills }: { pills: typeof skillPills }) => (
  <div className="flex flex-wrap gap-2.5">
    {pills.map((pill, i) => (
      <motion.span
        key={pill.name}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: i * 0.02 }}
        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${PILL_STYLE[pill.group]}`}
      >
        {pill.name}
      </motion.span>
    ))}
  </div>
);

/** 基本信息：教育背景 + 技能专长 + 兴趣爱好 */
export const BasicInfoTab = () => (
  <div className="space-y-8">
    <div>
      <SectionHeading icon={GraduationCap} title="教育背景" />
      <div className="space-y-4">
        {profile.education.map((edu, i) => (
          <div
            key={i}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoLine label="学校" value={edu.school} />
              <InfoLine label="专业" value={edu.major} />
              <InfoLine label="学历层次" value={edu.degree} />
              <InfoLine label="时间" value={edu.period} />
            </div>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionHeading icon={Code2} title="技术栈" />
      <PillCloud pills={skillPills.filter((p) => p.group !== 'hobby')} />
    </div>

    <div>
      <SectionHeading icon={Award} title="技能特长" />
      <div className="space-y-3">
        {profile.certificates.map((c, i) => (
          <div
            key={i}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
          >
            <span className="font-medium text-slate-900 dark:text-slate-100">{c.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">{c.date}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{c.issuer}</span>
          </div>
        ))}
      </div>
    </div>

    <div>
      <SectionHeading icon={Heart} title="兴趣爱好" />
      <PillCloud pills={skillPills.filter((p) => p.group === 'hobby')} />
    </div>
  </div>
);
