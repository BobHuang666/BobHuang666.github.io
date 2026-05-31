import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, Clock } from 'lucide-react';
import { getSeriesBySlug } from '../data/series';
import { blogData } from '../data/blog';
import { RelatedLink } from '../components/RelatedLink';

const SeriesDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const s = slug ? getSeriesBySlug(slug) : undefined;

  if (!s) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          专题不存在 🗺️
        </h2>
        <Link to="/series" className="btn-primary">
          返回专题列表
        </Link>
      </div>
    );
  }

  const posts = blogData.filter(
    (b) => !b.isDraft && s.matchTags.some((t) => b.tags.includes(t)),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${s.color} text-white`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Link
            to="/series"
            className="inline-flex items-center text-xs text-white/80 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            返回专题列表
          </Link>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{s.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{s.title}</h1>
              {s.titleEn && (
                <p className="text-sm text-white/70 font-mono mt-1">{s.titleEn}</p>
              )}
            </div>
          </div>
          <p className="text-white/85 max-w-2xl leading-relaxed">{s.description}</p>
          <p className="mt-4 text-xs text-white/70">
            {posts.length} 篇文章 · 匹配标签：{s.matchTags.join('、')}
          </p>
        </div>
      </section>

      {/* List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              这个专题还没有文章
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              当博客文章带上 <code className="px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-800 rounded">{s.matchTags[0]}</code> 等标签时会自动归入
            </p>
            <Link to="/blog" className="btn-primary">
              查看全部文章
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
              >
                <Link
                  to={`/blog/${p.id}`}
                  className="block p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                      {p.category}
                    </span>
                    <Calendar className="h-3.5 w-3.5" />
                    {p.publishDate}
                    <span>·</span>
                    <Clock className="h-3.5 w-3.5" />
                    {p.readTime} 分钟
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {p.excerpt}
                  </p>
                </Link>
              </motion.article>
            ))}
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RelatedLink to="/series" emoji="📚" title="全部专题" desc="返回专题列表" />
          <RelatedLink to="/blog" emoji="📝" title="全部博客" desc="按时间浏览所有文章" />
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailPage;
