import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usesCategories, usesTitleFallback } from '../data/uses';
import { RelatedLink } from '../components/RelatedLink';
import { usePageMeta } from '../hooks/usePageMeta';

const UsesPage = () => {
  const { t } = useTranslation();
  usePageMeta(t('uses.heading'));

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {t('uses.heading')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            {t('uses.intro')}{' '}
            <a
              href="https://uses.tech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              uses.tech
            </a>
            {t('uses.introSuffix')}
          </p>

          <div className="space-y-8">
            {usesCategories.map((cat, i) => (
              <motion.section
                key={cat.titleKey}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                className="card-base p-6"
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  <cat.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  {t(cat.titleKey, usesTitleFallback[cat.titleKey])}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
                  {cat.items.map((item) => (
                    <div key={item.name} className="contents">
                      <dt className="text-slate-500 dark:text-slate-400">{item.name}</dt>
                      <dd className="text-slate-800 dark:text-slate-200">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RelatedLink to="/now" emoji="✨" title={t('nav.now')} desc="我最近在做什么" />
            <RelatedLink to="/blog" emoji="📝" title={t('nav.blog')} desc="最新博客文章" />
            <RelatedLink to="/series" emoji="📚" title={t('nav.series')} desc="按主题查看博客" />
            <RelatedLink to="/profile" emoji="🎮" title={t('nav.profile')} desc="完整简历与技能详情" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UsesPage;
