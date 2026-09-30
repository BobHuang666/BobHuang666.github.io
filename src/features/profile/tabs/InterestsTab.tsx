import { interests } from '../../../data/skills';
import { resolveIcon } from '../../../utils/iconMap';
import { SectionHeading } from './primitives';

/** 兴趣爱好（分组数据来自 data/skills.ts） */
export const InterestsTab = () => (
  <div className="space-y-8">
    {interests.map((cat) => (
      <div key={cat.category}>
        <SectionHeading icon={resolveIcon(cat.icon)} title={cat.category} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cat.items.map((item) => {
            const Icon = resolveIcon(item.icon);
            return (
              <div
                key={item.name}
                className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-5 hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center mb-3">
                  <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mr-3">
                    <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    ))}
  </div>
);
