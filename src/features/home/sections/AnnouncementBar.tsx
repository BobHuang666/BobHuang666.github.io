import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight } from 'lucide-react';
import { blogMeta } from '../../../data/blog';

/**
 * Hero 下方通知公告条：无标题，仅高亮「通知公告」入口。
 * 标签含「公告」的文章才会在此展示，点击跳转对应正文。
 * 上下与 Hero / 下一区块保留 margin，左右居中并留白。
 */
export const AnnouncementBar = () => {
  const announcements = blogMeta.filter((p) => p.tags.includes('公告'));
  if (announcements.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="flex items-center gap-3 overflow-x-auto scrollbar-thin rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 px-4 py-3">
        <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-semibold">
          <Megaphone className="h-3.5 w-3.5" />
          通知公告
        </span>
        {announcements.slice(0, 3).map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.id}`}
            className="group inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 whitespace-nowrap"
          >
            <span className="font-medium group-hover:underline">{post.title}</span>
            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
};
