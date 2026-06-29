import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, FileText, Clock, Calendar } from 'lucide-react';
import { series } from '../data/series';
import { blogData } from '../data/blog';
import { RelatedLink } from '../components/RelatedLink';

/** 格式化日期：2024-06-15 → 2024.06 */
function fmtDate(d: string): string {
  if (!d) return '';
  return d.slice(0, 7).replace('-', '.');
}

/**
 * 专题系列总览页 —— /series
 * 自动根据 blogData 的 tags 把文章归到各专题
 */
const SeriesIndexPage = () => {
  const enriched = series.map((s) => {
    const matched = blogData.filter(
      (b) => !b.isDraft && s.matchTags.some((t) => b.tags.includes(t)),
    );
    // 按发布日期降序
    const sorted = [...matched].sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));
    const totalReadTime = sorted.reduce((sum, p) => sum + (p.readTime ?? 0), 0);
    return { series: s, count: sorted.length, latest: sorted[0], totalReadTime };
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
          {enriched.map(({ series: s, count, latest, totalReadTime }, i) => (
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
                {/* 封面图或渐变色块 */}
                {s.coverImage ? (
                  <div className="relative h-28 overflow-hidden">
                    <img
                      src={s.coverImage}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-3 left-4 text-3xl drop-shadow-lg">{s.icon}</span>
                  </div>
                ) : (
                  <div className={`relative h-20 bg-gradient-to-br ${s.color} flex items-center px-5`}>
                    <span className="text-4xl drop-shadow">{s.icon}</span>
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-0.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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

                  {/* ── 统计胶囊行 ─────────────────────────── */}
                  <div className="flex items-center flex-wrap gap-2 mb-3">
                    {/* 文章数 */}
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                      <FileText className="h-3 w-3" />
                      {count} 篇
                    </span>
                    {/* 预估阅读时间（有文章才显示） */}
                    {totalReadTime > 0 && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        <Clock className="h-3 w-3" />
                        约 {totalReadTime} 分钟
                      </span>
                    )}
                    {/* 最新发布日期 */}
                    {latest?.publishDate && (
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 font-medium">
                        <Calendar className="h-3 w-3" />
                        {fmtDate(latest.publishDate)}
                      </span>
                    )}
                  </div>

                  {/* ── 最新文章 ──────────────────────────── */}
                  {latest ? (
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 min-w-0">
                      <FileText className="h-3.5 w-3.5 shrink-0" />
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
