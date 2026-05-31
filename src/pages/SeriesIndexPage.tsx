import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, FileText } from 'lucide-react';
import { series } from '../data/series';
import { blogData } from '../data/blog';
import { RelatedLink } from '../components/RelatedLink';

/**
 * 专题系列总览页 —— /series
 * 自动根据 blogData 的 tags 把文章归到各专题
 */
const SeriesIndexPage = () => {
  const counts = series.map((s) => {
    const matched = blogData.filter(
      (b) => !b.isDraft && s.matchTags.some((t) => b.tags.includes(t)),
    );
    return { series: s, count: matched.length, latest: matched[0] };
  });

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
            <Layers className="h-4 w-4" />
            Series · 专题
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            专题系列
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            把零散的博客文章按主题汇集成专题 —— 算法笔记、前端日记、项目复盘……
            每篇文章可以同时属于多个专题。
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {counts.map(({ series: s, count, latest }, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                to={`/series/${s.slug}`}
                className="block group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* 顶部渐变条 */}
                <div className={`h-1.5 bg-gradient-to-r ${s.color}`} />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {count} 篇
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {s.title}
                  </h2>
                  {s.titleEn && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 font-mono">
                      {s.titleEn}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {s.description}
                  </p>

                  {latest ? (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                      <FileText className="h-3.5 w-3.5" />
                      <span className="truncate">最新：{latest.title}</span>
                    </div>
                  ) : (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
                      暂无文章 · 期待你的第一篇
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RelatedLink to="/blog" emoji="📝" title="全部博客" desc="按时间顺序浏览所有文章" />
          <RelatedLink to="/now" emoji="✨" title="当前动态" desc="我最近在做什么" />
          <RelatedLink to="/profile" emoji="🎮" title="角色档案" desc="完整简历与获奖" />
          <RelatedLink to="/friends" emoji="🤝" title="友人帐" desc="友情链接" />
        </div>
      </div>
    </div>
  );
};

export default SeriesIndexPage;
