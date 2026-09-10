import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { nowLastUpdated, nowSections } from '../data/now';
import { RelatedLink } from '../components/RelatedLink';
import { usePageMeta } from '../hooks/usePageMeta';

const NowPage = () => {
  const { t } = useTranslation();
  usePageMeta(t('now.heading'));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            {t('now.lastUpdated')}{nowLastUpdated}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t('now.heading')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            {t('now.intro')}{' '}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              nownownow.com
            </a>
            {t('now.introSuffix')}
          </p>

          <div className="space-y-8">
            {nowSections.map((s, i) => (
              <motion.section
                key={s.titleKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  <s.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  {t(s.titleKey)}
                </h2>
                <ul className="space-y-2 ml-7">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="text-slate-700 dark:text-slate-300 leading-relaxed relative pl-4 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-400"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RelatedLink to="/series" emoji="📚" title={t('nav.series')} desc="博客按主题分类" />
            <RelatedLink to="/friends" emoji="🤝" title={t('nav.friends')} desc="友情链接 & 交换链接" />
            <RelatedLink to="/blog" emoji="📝" title={t('nav.blog')} desc="最新博客文章" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NowPage;
