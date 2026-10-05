import { useState } from 'react';
import { motion } from 'framer-motion';
import { idols, type Idol } from '../../../data/fandom';

/** 头像：有图加载图，失败或缺失时回退到首字渐变圆 */
const Avatar = ({ idol, className }: { idol: Idol; className?: string }) => {
  const [err, setErr] = useState(false);
  const base = `${className ?? ''}`;
  if (idol.avatar && !err) {
    return (
      <img
        src={idol.avatar}
        alt={idol.name}
        className={`${base} object-cover`}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div className={`${base} bg-gradient-to-br from-rose-400 to-pink-500 text-white flex items-center justify-center font-bold`}>
      {idol.name.charAt(0)}
    </div>
  );
};

/** 偶像墙：所有偶像平铺展示，无主推 / 副推之分 */
export const IdolsTab = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {idols.map((i, idx) => (
      <motion.div
        key={i.name + idx}
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: idx * 0.05 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div className="h-20 bg-gradient-to-br from-rose-100 via-pink-100 to-fuchsia-100 dark:from-rose-950/40 dark:via-pink-950/30 dark:to-fuchsia-950/30 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,white_0%,transparent_50%)] opacity-40" />
        </div>
        <div className="p-4 -mt-10 relative">
          <Avatar
            idol={i}
            className="w-16 h-16 rounded-full ring-4 ring-white dark:ring-slate-900 shadow mb-2 text-2xl"
          />
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{i.name}</h3>
          {i.group && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">{i.group}</p>
          )}
          {(i.date || i.since) && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
              {i.date && <span>🎂 {i.date}</span>}
              {i.since && <span>💫 入坑 {i.since}</span>}
            </div>
          )}
        </div>
      </motion.div>
    ))}
  </div>
);
