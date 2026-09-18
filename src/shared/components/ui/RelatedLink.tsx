import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  to: string;
  emoji?: string;
  title: string;
  desc?: string;
}

/** 页面底部相关跳转卡片，统一样式 */
export const RelatedLink = ({ to, emoji, title, desc }: Props) => {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
    >
      {emoji && <span className="text-xl shrink-0">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </div>
        {desc && (
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{desc}</div>
        )}
      </div>
      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
};
