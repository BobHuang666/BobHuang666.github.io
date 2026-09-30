import { motion } from 'framer-motion';
import { Eye, Heart, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { idols, type Idol } from '../../../data/fandom';
import { gradient } from '../../../utils/gradients';

/** 偶像墙：按主推 / 副推 / 关注分组 */
export const IdolsTab = ({ showRealName }: { showRealName: boolean }) => {
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
          <div className={`h-20 bg-gradient-to-br ${gradient(i.tone)} relative`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_50%)] opacity-30" />
          </div>
          <div className="p-4 -mt-8 relative">
            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient(i.tone)} ring-4 ring-white dark:ring-slate-900 flex items-center justify-center text-white font-bold text-lg shadow mb-2`}>
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
