import { Compass, Users } from 'lucide-react';
import { practiceExperiences, studentWork } from '../../../data/skills';
import { SectionHeading, TimelineCard } from './primitives';

/** 学生工作 + 实践经历 */
export const ExperienceTab = () => (
  <div className="space-y-10">
    <div>
      <SectionHeading icon={Users} title="学生工作" />
      <div className="space-y-4">
        {studentWork.map((w, i) => (
          <TimelineCard key={i} item={w} accent="green" />
        ))}
      </div>
    </div>
    <div>
      <SectionHeading icon={Compass} title="实践经历" />
      <div className="space-y-4">
        {practiceExperiences.map((p, i) => (
          <TimelineCard key={i} item={p} accent="amber" />
        ))}
      </div>
    </div>
  </div>
);
