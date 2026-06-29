import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getSeriesBySlug } from '../data/series';
import { blogData } from '../data/blog';
import { RelatedLink } from '../components/RelatedLink';
import { usePageMeta } from '../hooks/usePageMeta';

const SeriesDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useTranslation();
  const s = slug ? getSeriesBySlug(slug) : undefined;

  usePageMeta(s ? s.title : t('series.heading'), s?.description);

  if (!s) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          专题不存在 🗺️
        </h2>
        <Link to="/series" className="btn-primary">
          {t('series.backToList')}
        </Link>
      </div>
    );
  }

  const posts = blogData.filter(
    (b) => !b.isDraft && s.matchTags.some((tag) => b.tags.includes(tag)),
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${s.color} text-white`}>
        {/* 封面图（如有）覆盖在渐变之上 */}
        {s.coverImage && (
          <img
            src={s.coverImage}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,white_1px,transparent_1px)] bg-[size:18px_18px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <Link
            to="/series"
            className="inline-flex items-center text-xs text-white/80 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('series.backToList')}
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
            {posts.length} {t('series.articles')} · {t('series.matchTags')}{s.matchTags.join('、')}
          </p>
        </div>
      </section>

      {/* List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {posts.length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
              {t('series.noPost')}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              {t('series.noPostHint')} <code className="px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-800 rounded">{s.matchTags[0]}</code> {t('series.noPostHint2')}
            </p>
            <Link to="/blog" className="btn-primary">
              {t('series.viewAll')}
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
                    {t('misc.readingMin', { n: p.readTime })}
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
          <RelatedLink to="/series" emoji="📚" title={t('nav.series')} desc={t('series.backToList')} />
          <RelatedLink to="/blog" emoji="📝" title={t('nav.blog')} desc={t('series.viewAll')} />
        </div>
      </div>
    </div>
  );
};

export default SeriesDetailPage;
