import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LANGS = [
  { code: 'zh', label: '中' },
  { code: 'en', label: 'EN' },
];

export const LanguageToggle = ({ className = '' }: { className?: string }) => {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language ?? 'zh';

  const next = current.startsWith('zh') ? 'en' : 'zh';
  const handleClick = () => i18n.changeLanguage(next);
  const label = LANGS.find((l) => current.startsWith(l.code))?.label ?? '中';

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Switch language (current ${label})`}
      className={`relative inline-flex h-9 min-w-9 px-2 items-center justify-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${className}`}
    >
      <Languages className="h-3.5 w-3.5" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};
