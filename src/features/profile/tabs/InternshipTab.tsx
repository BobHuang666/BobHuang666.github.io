import { Briefcase, GraduationCap } from 'lucide-react';
import { experiences, trainingExperiences } from '../../../data/profile';
import { SectionHeading, TimelineCard } from './primitives';

/** 实习经历 + 培训经历 */
export const InternshipTab = () => (
  <div className="space-y-10">
    <div>
      <SectionHeading icon={Briefcase} title="实习经历" />
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <TimelineCard key={i} item={exp} bullets />
        ))}
      </div>
    </div>
    <div>
      <SectionHeading icon={GraduationCap} title="培训经历" />
      <div className="space-y-4">
        {trainingExperiences.map((t, i) => (
          <TimelineCard key={i} item={t} accent="amber" />
        ))}
      </div>
    </div>
  </div>
);
