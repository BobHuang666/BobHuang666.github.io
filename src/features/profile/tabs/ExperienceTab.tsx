import { Briefcase, Users } from 'lucide-react';
import { experiences, studentWork } from '../../../data/skills';
import { SectionHeading, TimelineCard } from './primitives';

/** 实习经历 + 学生工作 */
export const ExperienceTab = () => (
  <div className="space-y-10">
    <div>
      <SectionHeading icon={Briefcase} title="实习经历" />
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <TimelineCard key={i} item={exp} />
        ))}
      </div>
    </div>
    <div>
      <SectionHeading icon={Users} title="学生工作" />
      <div className="space-y-4">
        {studentWork.map((w, i) => (
          <TimelineCard key={i} item={w} accent="green" />
        ))}
      </div>
    </div>
  </div>
);
