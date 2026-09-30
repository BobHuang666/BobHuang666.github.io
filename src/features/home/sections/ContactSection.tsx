import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Mail, Copy, Check } from 'lucide-react';
import { copy } from '../../../data/copy';
import { profile } from '../../../data/profile';
import { SectionReveal } from '../../../shared/components/effects/SectionReveal';
import { SectionHeader } from './SectionHeader';

/** 联系方式：社交入口 + 邮箱一键复制 */
export const ContactSection = () => {
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
    <section id="contact" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SectionHeader title={copy.home.contactTitle} subtitle={copy.home.contactSub} />

        <SectionReveal delay={0.1}>
          {/* 渐变卡片 */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-px shadow-xl">
            <div className="relative rounded-[15px] bg-white dark:bg-slate-900 px-8 py-10">
              {/* 装饰光晕 */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-pink-400/10 blur-3xl pointer-events-none" />

              {/* 社交图标 */}
              <div className="relative flex justify-center gap-4 mb-7">
                {profile.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="发送邮件"
                    className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
                  >
                    <Mail className="h-5 w-5" />
                  </a>
                )}
              </div>

              {/* 邮箱 + 复制按钮 */}
              {profile.email && (
                <div className="relative flex items-center justify-center gap-2">
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

              {/* 复制成功提示 */}
              <motion.p
                initial={false}
                animate={{ opacity: emailCopied ? 1 : 0, y: emailCopied ? 0 : 4 }}
                transition={{ duration: 0.2 }}
                className="mt-2 text-xs text-green-600 dark:text-green-400 h-4"
              >
                {emailCopied ? copy.home.emailCopied : ''}
              </motion.p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
