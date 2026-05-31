import Giscus from '@giscus/react';
import { MessageSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../hooks/useTheme';
import { giscusConfig, isGiscusEnabled } from '../data/giscus';

interface Props {
  /** 不传则用页面 pathname */
  term?: string;
}

const Comments = ({ term }: Props) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  if (!isGiscusEnabled()) {
    return (
      <section className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
          <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          {t('misc.comments')}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('misc.commentsHint')}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          （未启用：请在 <code className="font-mono">src/data/giscus.ts</code> 中填入 repoId 与 categoryId）
        </p>
      </section>
    );
  }

  const lang = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'zh-CN';

  return (
    <section className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
        <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
        {t('misc.comments')}
      </h3>
      <Giscus
        repo={giscusConfig.repo}
        repoId={giscusConfig.repoId}
        category={giscusConfig.category}
        categoryId={giscusConfig.categoryId}
        mapping={term ? 'specific' : giscusConfig.mapping}
        term={term}
        strict={giscusConfig.strict}
        reactionsEnabled={giscusConfig.reactionsEnabled}
        emitMetadata={giscusConfig.emitMetadata}
        inputPosition={giscusConfig.inputPosition}
        theme={theme === 'dark' ? 'dark' : 'light'}
        lang={lang}
        loading={giscusConfig.loading}
      />
    </section>
  );
};

export default Comments;
