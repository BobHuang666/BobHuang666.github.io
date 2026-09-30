import { FlaskConical } from 'lucide-react';
import { research } from '../../../data/skills';
import { SectionHeading } from './primitives';

/** 科研 / 课题 */
export const ResearchTab = () => (
  <div>
    <SectionHeading icon={FlaskConical} title="科研 / 课题" />
    <div className="space-y-4">
      {research.map((r) => (
        <div
          key={r.title}
          className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow"
        >
          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{r.title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              <span className="text-slate-700 dark:text-slate-300 font-medium">来源：</span>{r.source}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              <span className="text-slate-700 dark:text-slate-300 font-medium">主持人：</span>{r.leader}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              <span className="text-slate-700 dark:text-slate-300 font-medium">起止：</span>{r.period}
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              <span className="text-slate-700 dark:text-slate-300 font-medium">本人：</span>{r.rank}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
