import { BookOpen, Clock } from 'lucide-react';
import { courses } from '../../../data/skills';
import { SectionHeading } from './primitives';

/** 主修课程成绩：分数 → 等级 */
const getGrade = (score: number | string) => {
  const n = typeof score === 'number' ? score : parseFloat(score);
  if (n >= 95) return { label: 'A+', color: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' };
  if (n >= 90) return { label: 'A', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' };
  if (n >= 85) return { label: 'A-', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' };
  return { label: 'B+', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
};

export const CoursesTab = () => (
  <div>
    <SectionHeading icon={BookOpen} title="主修课程成绩" />
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">部分核心课程（成绩来自 profile）</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {courses.map((c) => {
        const g = getGrade(c.score);
        return (
          <div
            key={c.name}
            className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-5 hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {c.score} 分
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${g.color}`}>
                  {g.label}
                </span>
              </div>
            </div>
            {c.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{c.description}</p>
            )}
            {c.semester && (
              <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                <Clock className="h-3 w-3 mr-1" />
                {c.semester}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
