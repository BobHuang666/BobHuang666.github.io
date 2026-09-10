import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Sparkles, Lock, Eye, EyeOff, Calendar, MapPin, Ticket, Music,
  Crown, Gift, Disc3, Image as ImageIcon, PenLine, Flag, Cake, Radio,
  TrendingUp, PiggyBank, Clock, ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  idols, lessons, concerts, supportRecords, collections, fandomConfig,
  supportTypeMeta, collectionCategoryMeta, rarityMeta,
  type Idol, type SupportType, type CollectionCategory,
} from '../data/fandom';
import { RelatedLink } from '../components/RelatedLink';
import { usePageMeta } from '../hooks/usePageMeta';

const STORAGE_KEY = 'bh:fandom-pass';

type TabId = 'idols' | 'concerts' | 'support' | 'collection';

const supportIcons: Record<SupportType, LucideIcon> = {
  vote: TrendingUp,
  fund: PiggyBank,
  lightstick: Sparkles,
  banner: Flag,
  birthday: Cake,
  stream: Radio,
};

const categoryIcons: Record<CollectionCategory, LucideIcon> = {
  album: Disc3,
  photocard: ImageIcon,
  lightstick: Sparkles,
  goods: Gift,
  sign: PenLine,
  ticket: Ticket,
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

const daysUntil = (d: string) =>
  Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);

/**
 * 追星专题 —— /fandom
 * 隐私可控：fandomConfig.password 非空时需要输入密码（仅本地校验，非加密）
 */
const FandomPage = () => {
  usePageMeta('秘密花园', fandomConfig.intro);
  const needsAuth = Boolean(fandomConfig.password);
  const [authorized, setAuthorized] = useState(!needsAuth);
  const [pwd, setPwd] = useState('');
  const [showRealName, setShowRealName] = useState(fandomConfig.showRealName);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<TabId>('idols');

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

  const stats = useMemo(() => {
    const attended = concerts.filter((c) => c.status === 'attended').length;
    const fanYears = fandomConfig.fanSince
      ? Math.max(1, new Date().getFullYear() - Number(fandomConfig.fanSince))
      : 0;
    return { attended, support: supportRecords.length, items: collections.length, fanYears };
  }, []);

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
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">追星专题</h2>
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
            className={`w-full px-3 py-2 rounded-lg border ${error
                ? 'border-rose-400 focus:ring-rose-400'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 transition-colors mb-2`}
            autoFocus
          />
          {error && <p className="text-xs text-rose-500 mb-2">密码不对，再试一次？</p>}
          <button type="submit" className="btn-primary w-full mt-2">进入</button>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-950 dark:to-rose-950/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ===== Hero ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-rose-500">
              <Heart className="h-4 w-4 fill-rose-500" />
              Fandom · 秘密花园
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
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-6">
            {fandomConfig.intro}
          </p>

          {/* 统计胶囊 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill icon={Heart} value={stats.fanYears ? `${stats.fanYears}+` : '—'} label="追星 (年)" tone="rose" />
            <StatPill icon={Ticket} value={stats.attended} label="看过现场" tone="amber" />
            <StatPill icon={Sparkles} value={stats.support} label="应援次数" tone="fuchsia" />
            <StatPill icon={Gift} value={stats.items} label="珍藏周边" tone="indigo" />
          </div>
        </motion.div>

        {/* ===== Tabs ===== */}
        <div className="sticky top-16 z-10 -mx-4 px-4 py-2 mb-8 bg-gradient-to-b from-rose-50/90 via-rose-50/80 to-transparent dark:from-slate-950/90 dark:via-slate-950/80 backdrop-blur-sm">
          <div className="flex gap-1 p-1 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-rose-100 dark:border-slate-800 w-fit max-w-full overflow-x-auto scrollbar-none">
            {TABS.map((tb) => (
              <button
                key={tb.id}
                onClick={() => setTab(tb.id)}
                className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${tab === tb.id
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:text-rose-500'
                  }`}
              >
                {tab === tb.id && (
                  <motion.span
                    layoutId="fandomTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 shadow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <tb.icon className="relative h-4 w-4" />
                <span className="relative">{tb.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ===== Tab content ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            {tab === 'idols' && <IdolsTab showRealName={showRealName} />}
            {tab === 'concerts' && <ConcertsTab />}
            {tab === 'support' && <SupportTab />}
            {tab === 'collection' && <CollectionTab />}
          </motion.div>
        </AnimatePresence>

        {/* ===== 感悟 ===== */}
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
          <RelatedLink to="/blog" emoji="📝" title="游戏攻略" desc="看看其他文章" />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          本页内容仅作为个人记录，无任何商业用途与不当宣传意图
        </p>
      </div>
    </div>
  );
};

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'idols', label: '偶像墙', icon: Heart },
  { id: 'concerts', label: '演唱会', icon: Calendar },
  { id: 'support', label: '应援记录', icon: Sparkles },
  { id: 'collection', label: '周边收藏', icon: Gift },
];

/* ---------------- 统计胶囊 ---------------- */
const toneMap: Record<string, string> = {
  rose: 'text-rose-500 from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40',
  amber: 'text-amber-500 from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40',
  fuchsia: 'text-fuchsia-500 from-fuchsia-100 to-pink-100 dark:from-fuchsia-950/40 dark:to-pink-950/40',
  indigo: 'text-indigo-500 from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40',
};

const StatPill = ({
  icon: Icon, value, label, tone,
}: { icon: LucideIcon; value: string | number; label: string; tone: keyof typeof toneMap }) => (
  <div className={`rounded-2xl border border-white/60 dark:border-slate-800 bg-gradient-to-br ${toneMap[tone]} p-3.5 flex items-center gap-3`}>
    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-900/60">
      <Icon className={`h-5 w-5 ${toneMap[tone].split(' ')[0]}`} />
    </span>
    <div className="min-w-0">
      <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{label}</div>
    </div>
  </div>
);

/* ---------------- 偶像墙 ---------------- */
const IdolsTab = ({ showRealName }: { showRealName: boolean }) => {
  const mainList = idols.filter((i) => i.level === 'main');
  const subList = idols.filter((i) => i.level === 'sub');
  const casualList = idols.filter((i) => i.level === 'casual');
  return (
    <>
      {mainList.length > 0 && <IdolBlock title="主推" icon={Heart} list={mainList} showRealName={showRealName} highlight />}
      {subList.length > 0 && <IdolBlock title="副推" icon={Sparkles} list={subList} showRealName={showRealName} />}
      {casualList.length > 0 && <IdolBlock title="关注" icon={Eye} list={casualList} showRealName={showRealName} />}
    </>
  );
};

const IdolBlock = ({
  title, icon: Icon, list, showRealName, highlight,
}: { title: string; icon: LucideIcon; list: Idol[]; showRealName: boolean; highlight?: boolean }) => (
  <section className="mb-10">
    <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
      <Icon className={`h-5 w-5 ${highlight ? 'text-rose-500 fill-rose-500' : 'text-indigo-500'}`} />
      {title}
      <span className="text-xs font-normal text-slate-400 dark:text-slate-500">× {list.length}</span>
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
            {i.group && <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">{i.group}</p>}
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{i.reason}</p>
            {i.since && <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-3">Since {i.since}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

/* ---------------- 演唱会日历 ---------------- */
const ConcertsTab = () => {
  const upcoming = concerts
    .filter((c) => c.status === 'upcoming')
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const attended = concerts
    .filter((c) => c.status === 'attended')
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  if (concerts.length === 0) {
    return <EmptyState icon={Calendar} text="还没有演唱会记录 —— 期待下一场约定" />;
  }

  return (
    <div className="space-y-10">
      {upcoming.length > 0 && (
        <section>
          <SubHeading icon={Clock} text="即将赴约" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((c, idx) => {
              const days = daysUntil(c.date);
              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.06 }}
                  className={`relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br ${c.color} shadow-lg`}
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/15 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/25 text-xs font-medium backdrop-blur-sm">
                        <Music className="h-3 w-3" /> {c.idol}
                      </span>
                      <div className="text-right">
                        <div className="text-2xl font-extrabold leading-none">
                          {days > 0 ? days : 0}
                        </div>
                        <div className="text-[10px] opacity-90">{days > 0 ? '天后' : '就在今天'}</div>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold mb-1">{c.tour}</h4>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm opacity-95">
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{fmtDate(c.date)}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{c.city} · {c.venue}</span>
                    </div>
                    {c.seat && (
                      <span className="inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded-md bg-white/20 text-xs">
                        <Ticket className="h-3 w-3" />{c.seat}
                      </span>
                    )}
                    {c.highlight && <p className="text-sm mt-3 opacity-95 leading-relaxed">“{c.highlight}”</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}

      {attended.length > 0 && (
        <section>
          <SubHeading icon={Ticket} text="现场足迹" count={attended.length} />
          <div className="relative pl-6">
            <span className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-rose-300 via-pink-300 to-transparent dark:from-rose-700 dark:via-pink-800" />
            <div className="space-y-4">
              {attended.map((c, idx) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className="relative"
                >
                  <span className={`absolute -left-[18px] top-4 w-3 h-3 rounded-full bg-gradient-to-br ${c.color} ring-4 ring-white dark:ring-slate-950`} />
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{c.tour}</h4>
                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{fmtDate(c.date)}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 text-rose-500"><Music className="h-3 w-3" />{c.idol}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{c.city} · {c.venue}</span>
                      {c.seat && <span className="inline-flex items-center gap-1"><Ticket className="h-3 w-3" />{c.seat}</span>}
                    </div>
                    {c.highlight && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">“{c.highlight}”</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

/* ---------------- 应援记录 ---------------- */
const SupportTab = () => {
  const sorted = [...supportRecords].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  if (sorted.length === 0) return <EmptyState icon={Sparkles} text="还没有应援记录" />;
  return (
    <div className="relative pl-6">
      <span className="absolute left-1.5 top-2 bottom-2 w-px bg-gradient-to-b from-fuchsia-300 via-rose-300 to-transparent dark:from-fuchsia-800 dark:via-rose-800" />
      <div className="space-y-4">
        {sorted.map((s, idx) => {
          const meta = supportTypeMeta[s.type];
          const Icon = supportIcons[s.type];
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="relative"
            >
              <span className="absolute -left-[20px] top-4 grid place-items-center w-4 h-4 rounded-full bg-white dark:bg-slate-950 ring-4 ring-white dark:ring-slate-950">
                <Icon className="h-3.5 w-3.5 text-rose-500" />
              </span>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${meta.tone}`}>
                      {meta.label}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{s.title}</h4>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">{fmtDate(s.date)}</span>
                </div>
                <p className="text-xs text-rose-500 mb-1">For {s.idol}</p>
                {s.detail && <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.detail}</p>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- 周边收藏 ---------------- */
const CollectionTab = () => {
  const [filter, setFilter] = useState<CollectionCategory | 'all'>('all');
  const categories = useMemo(
    () => Array.from(new Set(collections.map((c) => c.category))),
    [],
  );
  const list = filter === 'all' ? collections : collections.filter((c) => c.category === filter);

  if (collections.length === 0) return <EmptyState icon={Gift} text="收藏柜还空着，等待第一件珍藏" />;

  return (
    <div>
      {/* 类别筛选 */}
      <div className="flex flex-wrap gap-2 mb-6">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>
          全部 <span className="opacity-60">{collections.length}</span>
        </FilterChip>
        {categories.map((cat) => (
          <FilterChip key={cat} active={filter === cat} onClick={() => setFilter(cat)}>
            {collectionCategoryMeta[cat]}{' '}
            <span className="opacity-60">{collections.filter((c) => c.category === cat).length}</span>
          </FilterChip>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {list.map((c, idx) => {
          const rarity = rarityMeta[c.rarity];
          const Icon = categoryIcons[c.category];
          return (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className={`group rounded-2xl bg-white dark:bg-slate-900 ring-2 ${rarity.ring} ${rarity.glow} overflow-hidden hover:-translate-y-1 transition-transform`}
            >
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${c.color} flex items-center justify-center`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,white_0%,transparent_55%)] opacity-25" />
                <Icon className="relative h-9 w-9 text-white/90 drop-shadow group-hover:scale-110 transition-transform" />
                {c.rarity === 'legend' && (
                  <Crown className="absolute top-2 right-2 h-4 w-4 text-amber-200 drop-shadow" />
                )}
                <span className={`absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-medium ${rarity.badge}`}>
                  {rarity.label}
                </span>
              </div>
              <div className="p-3">
                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{c.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[11px] text-rose-500 truncate">{c.idol}</span>
                  {c.date && <span className="text-[10px] text-slate-400 dark:text-slate-500">{c.date}</span>}
                </div>
                {c.note && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-3 leading-snug">{c.note}</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

/* ---------------- 小组件 ---------------- */
const SubHeading = ({ icon: Icon, text, count }: { icon: LucideIcon; text: string; count?: number }) => (
  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
    <Icon className="h-5 w-5 text-rose-500" />
    {text}
    {count !== undefined && <span className="text-xs font-normal text-slate-400 dark:text-slate-500">× {count}</span>}
  </h3>
);

const FilterChip = ({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${active
        ? 'bg-rose-500 text-white shadow'
        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700'
      }`}
  >
    {children}
  </button>
);

const EmptyState = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-400 dark:text-slate-500">
    <Icon className="h-10 w-10 mb-3 opacity-50" />
    <p className="text-sm">{text}</p>
    <span className="inline-flex items-center gap-1 mt-2 text-xs text-rose-400">
      去 fandom.ts 补充数据 <ChevronRight className="h-3 w-3" />
    </span>
  </div>
);

export default FandomPage;
