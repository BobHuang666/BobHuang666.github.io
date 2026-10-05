import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Sparkles, Calendar, Ticket, Gift, CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { concerts, checkIns, collections, fandomConfig, lessons } from '../../data/fandom';
import { uiText } from '../../data/uiText';
import { RelatedLink } from '../../shared/components/ui/RelatedLink';
import { usePageMeta } from '../../hooks/usePageMeta';
import { StatPill } from './components';
import { IdolsTab } from './tabs/IdolsTab';
import { ConcertsTab } from './tabs/ConcertsTab';
import { CheckInTab } from './tabs/CheckInTab';
import { CollectionTab } from './tabs/CollectionTab';

type TabId = 'idols' | 'concerts' | 'checkin' | 'collection';

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: 'idols', label: '偶像墙', icon: Heart },
  { id: 'concerts', label: '演唱会', icon: Calendar },
  { id: 'checkin', label: '线下打卡', icon: CheckCircle2 },
  { id: 'collection', label: '周边收藏', icon: Gift },
];

/**
 * /fandom —— 追星专题（公开页面）
 * 页面负责 Hero 统计与 Tab 编排；各 Tab 内容位于 ./tabs。
 */
const FandomPage = () => {
  usePageMeta(uiText.nav.fandom, fandomConfig.intro);
  const [tab, setTab] = useState<TabId>('idols');

  const stats = useMemo(() => {
    const attended = concerts.filter((c) => c.status === 'attended').length;
    const fanYears = fandomConfig.fanSince
      ? Math.max(1, new Date().getFullYear() - Number(fandomConfig.fanSince))
      : 0;
    return { attended, checkIns: checkIns.length, items: collections.length, fanYears };
  }, []);

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
          <div className="flex items-center gap-2 text-sm text-rose-500 mb-3">
            <Heart className="h-4 w-4 fill-rose-500" />
            Fandom · {uiText.nav.fandom}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            那些发着光的人
          </h1>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mb-6">
            {fandomConfig.intro}
          </p>

          {/* 统计胶囊 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatPill icon={Heart} value={stats.fanYears ? `${stats.fanYears}` : '—'} label="追星 (年)" tone="rose" />
            <StatPill icon={Ticket} value={stats.attended} label="看过现场" tone="amber" />
            <StatPill icon={CheckCircle2} value={stats.checkIns} label="打卡次数" tone="fuchsia" />
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
            {tab === 'idols' && <IdolsTab />}
            {tab === 'concerts' && <ConcertsTab />}
            {tab === 'checkin' && <CheckInTab />}
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
          <RelatedLink to="/blog" emoji="📝" title={uiText.related.blog.title} desc={uiText.related.blog.desc} />
        </div>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
          本页内容仅作为个人记录，无任何商业用途与不当宣传意图
        </p>
      </div>
    </div>
  );
};

export default FandomPage;
