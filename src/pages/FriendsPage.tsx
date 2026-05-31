import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Link2, Copy, Check, Github } from 'lucide-react';
import { friends, myLinkCard } from '../data/friends';
import { profile } from '../data/profile';
import { RelatedLink } from '../components/RelatedLink';

const FriendsPage = () => {
  const [copied, setCopied] = useState(false);

  const myCardText = `Name: ${myLinkCard.name}
URL: ${myLinkCard.url}
Description: ${myLinkCard.description}
Avatar: ${new URL(myLinkCard.avatar, myLinkCard.url).toString()}`;

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(myCardText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  const mailto = profile.email
    ? `mailto:${profile.email}?subject=${encodeURIComponent('友链申请 · Friend Link Request')}&body=${encodeURIComponent(
        '你好 Bob：\n\n我想申请友链：\n名字：\n网址：\n简介：\n头像 URL：\n\n我已经把你的链接放在了我的网站上：\n',
      )}`
    : undefined;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
            <Link2 className="h-4 w-4" />
            Friends · 友情链接
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            友人帐
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            一些让我变得更好的人，与一些让我看见世界其他角度的网站。
          </p>
        </motion.div>

        {/* 友链列表 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {friends.map((f, i) => (
            <motion.a
              key={f.url + i}
              href={f.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-base shadow">
                {f.avatar ? (
                  <img src={f.avatar} alt={f.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  f.name.charAt(0)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {f.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {f.description}
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 申请友链 */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 p-6 md:p-8"
        >
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            <Heart className="h-5 w-5 text-rose-500" />
            申请友链
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
            欢迎技术友人 / 同好交换链接。建议双方先把对方放在自己站点，然后填写下面信息发邮件给我。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 我的卡片 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  我的友链卡片
                </h3>
                <button
                  onClick={copyCard}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
              <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono">{myCardText}</pre>
            </div>

            {/* 申请方式 */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                申请方式
              </h3>
              <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-2 list-decimal list-inside mb-4">
                <li>把上面的卡片信息放到你的网站友链页</li>
                <li>给我发邮件 / GitHub Issue 告知</li>
                <li>我会尽快加上你的链接 ✨</li>
              </ol>
              <div className="flex flex-wrap gap-2">
                {mailto && (
                  <a href={mailto} className="btn-primary text-sm py-2 px-3">
                    <Mail className="h-3.5 w-3.5 mr-1.5" /> 发邮件申请
                  </a>
                )}
                {profile.github && (
                  <a
                    href={`${profile.github}/issues/new?title=${encodeURIComponent('友链申请')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Github className="h-3.5 w-3.5 mr-1.5" /> 提 Issue
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RelatedLink to="/blog" emoji="📝" title="游戏攻略" desc="读读我写的文章" />
          <RelatedLink to="/now" emoji="✨" title="当前动态" desc="我最近在做什么" />
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
