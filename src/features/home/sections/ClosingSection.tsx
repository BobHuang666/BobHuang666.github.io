/** 首页收尾区：更多探索（支线入口）+ 联系卡片，合并原 More/Contact 两节消除相邻同色 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Copy, Check } from 'lucide-react';
import { uiText } from '@/data/uiText';
import { profile } from '@/data/profile';
import { SectionReveal } from '@/shared/components/effects/SectionReveal';
import { RelatedLink } from '@/shared/components/ui/RelatedLink';
import { SectionShell } from '@/shared/components/layout/SectionShell';

export const ClosingSection = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <SectionShell
      id="contact"
      no="05"
      eyebrow={uiText.home.closingEyebrow}
      title={uiText.home.moreTitle}
      subtitle={uiText.home.moreSub}
      tint="indigo"
      tintBottom
      narrow
    >
      {/* 三个支线入口：紧凑一行三列 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(
          [
            { to: '/travel', emoji: '🗺️', meta: uiText.related.travel },
            { to: '/fandom', emoji: '🎤', meta: uiText.related.fandom },
            { to: '/friends', emoji: '🤝', meta: uiText.related.friends },
          ] as const
        ).map(({ to, emoji, meta }, i) => (
          <SectionReveal key={to} delay={i * 0.08} className="h-full">
            <RelatedLink to={to} emoji={emoji} title={meta.title} desc={meta.desc} className="h-full" />
          </SectionReveal>
        ))}
      </div>

      {/* 联系卡片：居中收窄（indigo 家族渐变发丝描边 + 玻璃面板） */}
      <SectionReveal delay={0.15}>
        <div className="mt-12 md:mt-16 max-w-2xl mx-auto relative rounded-2xl p-px bg-gradient-to-br from-indigo-500/60 via-violet-500/40 to-sky-500/60 shadow-xl">
          <div className="card-glass rounded-[15px] px-6 py-8 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {uiText.home.contactTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              {uiText.home.contactSub}
            </p>

            <div className="flex justify-center gap-4 mb-6">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="发送邮件"
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>

            {profile.email && (
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-mono">
                  {profile.email}
                </code>
                <button
                  onClick={copyEmail}
                  aria-label="复制邮箱"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
                >
                  {emailCopied
                    ? <Check className="h-3.5 w-3.5 text-green-500" />
                    : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}

            <motion.p
              initial={false}
              animate={{ opacity: emailCopied ? 1 : 0, y: emailCopied ? 0 : 4 }}
              transition={{ duration: 0.2 }}
              className="mt-2 text-xs text-green-600 dark:text-green-400 h-4"
            >
              {emailCopied ? uiText.home.emailCopied : ''}
            </motion.p>
          </div>
        </div>
      </SectionReveal>
    </SectionShell>
  );
};
