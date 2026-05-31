import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Lock, Eye, EyeOff } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { idols, lessons, fandomConfig, type Idol } from '../data/fandom';
import { RelatedLink } from '../components/RelatedLink';

const STORAGE_KEY = 'bh:fandom-pass';

/**
 * 追星专题 —— /fandom
 * 隐私可控：fandomConfig.password 非空时需要输入密码（仅本地校验，非加密）
 */
const FandomPage = () => {
  const needsAuth = Boolean(fandomConfig.password);
  const [authorized, setAuthorized] = useState(!needsAuth);
  const [pwd, setPwd] = useState('');
  const [showRealName, setShowRealName] = useState(fandomConfig.showRealName);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!needsAuth) return;
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === fandomConfig.password) setAuthorized(true);
  }, [needsAuth]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === fandomConfig.password) {
      setAuthorized(true);
      setError(false);
      sessionStorage.setItem(STORAGE_KEY, pwd);
    } else {
      setError(true);
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.form
          onSubmit={handleAuth}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-7 shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4 text-rose-500">
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">私密页面</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            追星专题
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            这是相对私密的内容，需要密码访问。如果你是朋友，问我一下吧 😊
          </p>
          <input
            type="password"
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
              setError(false);
            }}
            placeholder="访问密码"
            className={`w-full px-3 py-2 rounded-lg border ${
              error
                ? 'border-rose-400 focus:ring-rose-400'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
            } bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors mb-2`}
            autoFocus
          />
          {error && (
            <p className="text-xs text-rose-500 mb-2">密码不对，再试一次？</p>
          )}
          <button type="submit" className="btn-primary w-full mt-2">
            进入
          </button>
        </motion.form>
      </div>
    );
  }

  const mainList = idols.filter((i) => i.level === 'main');
  const subList = idols.filter((i) => i.level === 'sub');
  const casualList = idols.filter((i) => i.level === 'casual');

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-950 dark:to-rose-950/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
              Fandom · 追星专题
            </div>
            <button
              onClick={() => setShowRealName((v) => !v)}
              className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-rose-500 transition-colors"
              title={showRealName ? '隐藏真名' : '显示真名'}
            >
              {showRealName ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              {showRealName ? '只显示昵称' : '显示真名'}
            </button>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            那些发着光的人
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {fandomConfig.intro}
          </p>
        </motion.div>

        {mainList.length > 0 && (
          <Block title="主推" icon={Heart} list={mainList} showRealName={showRealName} highlight />
        )}
        {subList.length > 0 && (
          <Block title="副推" icon={Sparkles} list={subList} showRealName={showRealName} />
        )}
        {casualList.length > 0 && (
          <Block title="关注" icon={Eye} list={casualList} showRealName={showRealName} />
        )}

        {lessons.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-12 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30 p-6 md:p-8"
          >
            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
              <Sparkles className="h-5 w-5 text-rose-500" />
              我从他们身上学到的
            </h2>
            <ul className="space-y-3">
              {lessons.map((l) => (
                <li key={l} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <Heart className="shrink-0 h-4 w-4 mt-1 text-rose-400 fill-rose-300/60" />
                  <span className="leading-relaxed">{l}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <RelatedLink to="/now" emoji="✨" title="当前动态" desc="我最近在做什么" />
          <RelatedLink to="/blog" emoji="📝" title="游戏攻略" desc="看看其他文章" />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          本页内容仅作为个人记录，无任何商业用途与不当宣传意图
        </p>
      </div>
    </div>
  );
};

const Block = ({
  title,
  icon: Icon,
  list,
  showRealName,
  highlight,
}: {
  title: string;
  icon: LucideIcon;
  list: Idol[];
  showRealName: boolean;
  highlight?: boolean;
}) => (
  <section className="mb-10">
    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
      <Icon className={`h-5 w-5 ${highlight ? 'text-rose-500 fill-rose-500' : 'text-indigo-500'}`} />
      {title}
      <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
        × {list.length}
      </span>
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {list.map((i, idx) => (
        <motion.div
          key={i.name + idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: idx * 0.05 }}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className={`h-20 bg-gradient-to-br ${i.color} relative`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_50%)] opacity-30" />
          </div>
          <div className="p-4 -mt-8 relative">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${i.color} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-white font-bold text-lg shadow mb-2`}>
              {i.name.charAt(0)}
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{i.name}</h3>
            {showRealName && i.fullName && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{i.fullName}</p>
            )}
            {i.group && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">{i.group}</p>
            )}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{i.reason}</p>
            {i.since && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3">
                Since {i.since}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default FandomPage;
