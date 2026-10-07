import { FlaskConical, BookMarked } from 'lucide-react';
import { research, works } from '../../../data/skills';
import { SectionHeading } from './primitives';

/** 等级 → 徽标配色（与获奖经历一致：国家级=琥珀 / 省级=天蓝 / 校级=翠绿 / 院系级=紫） */
const LEVEL_BADGE: Record<string, string> = {
  国家级: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  省级: 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400',
  校级: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
  院系级: 'bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400',
};

/** 等级 → 卡片左侧强调色（与获奖经历配色一致） */
const LEVEL_ACCENT: Record<string, string> = {
  国家级: 'border-l-amber-400',
  省级: 'border-l-sky-400',
  校级: 'border-l-emerald-400',
  院系级: 'border-l-violet-300 dark:border-l-violet-600',
};

/** 等级 → 成果区底色（与等级配色一致） */
const LEVEL_RESULT_BG: Record<string, string> = {
  国家级: 'bg-amber-50 dark:bg-amber-950/30',
  省级: 'bg-sky-50 dark:bg-sky-950/30',
  校级: 'bg-emerald-50 dark:bg-emerald-950/30',
  院系级: 'bg-violet-50 dark:bg-violet-950/30',
};

/** 著作类型 → 徽标配色 */
const TYPE_BADGE: Record<string, string> = {
  发明专利: 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
  计算机软件著作权: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
};

const badge = (map: Record<string, string>, key: string) =>
  map[key] ?? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';

/** 著作成果（专利 / 软著）+ 科研 / 课题 */
export const ResearchTab = () => (
  <div className="space-y-12">
    {/* 著作成果 */}
    <div>
      <SectionHeading icon={BookMarked} title="著作成果" />
      <div className="space-y-4">
        {works.map((w) => (
          <div
            key={w.title}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">{w.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge(TYPE_BADGE, w.type)}`}>
                {w.type}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-1.5 gap-x-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">本人排序：</span>{w.rank}
              </p>
              {w.meta.map((m) => (
                <p key={m.label} className="text-slate-500 dark:text-slate-400">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{m.label}：</span>
                  {m.value}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* 科研 / 课题 */}
    <div>
      <SectionHeading icon={FlaskConical} title="科研 / 课题" />
      <div className="space-y-5">
        {research.map((r) => (
          <div
            key={r.title}
            className={`border border-slate-200 dark:border-slate-700 border-l-4 rounded-xl p-5 hover:shadow-md transition-all ${badge(LEVEL_ACCENT, r.level)}`}
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-3">
              <h4 className="font-semibold text-base text-slate-900 dark:text-slate-100">{r.title}</h4>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge(LEVEL_BADGE, r.level)}`}>
                {r.level}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1.5 gap-x-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">来源：</span>{r.source}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">时间：</span>{r.period}
              </p>
              {r.leader && (
                <p className="text-slate-500 dark:text-slate-400">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">主持人：</span>{r.leader}
                </p>
              )}
            </div>
            <ul className={`mt-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed rounded-lg p-3 ${badge(LEVEL_RESULT_BG, r.level)}`}>
              {r.result.split('\n').filter(Boolean).map((line, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                  <span className="flex-1">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </div>
);
