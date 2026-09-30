import { GraduationCap } from 'lucide-react';
import { profile } from '../../../data/profile';
import { SectionHeading, InfoLine } from './primitives';

/** 教育背景 */
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
              <InfoLine label="学历层次" value={`${edu.degree} · ${edu.grade}`} />
              <InfoLine label="在读时间" value={edu.period} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
