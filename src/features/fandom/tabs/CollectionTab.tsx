import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Gift } from 'lucide-react';
import { collections, type CollectionCategory } from '../../../data/fandom';
import { gradient } from '../../../utils/gradients';
import { categoryIcons, collectionCategoryMeta, rarityMeta } from '../meta';
import { FilterChip, FandomEmptyState } from '../components';

/** 周边收藏：按类别筛选 + 珍藏度光效 */
export const CollectionTab = () => {
  const [filter, setFilter] = useState<CollectionCategory | 'all'>('all');
  const categories = useMemo(
    () => Array.from(new Set(collections.map((c) => c.category))),
    [],
  );
  const list = filter === 'all' ? collections : collections.filter((c) => c.category === filter);

  if (collections.length === 0) {
    return <FandomEmptyState icon={Gift} text="收藏柜还空着，等待第一件珍藏" />;
  }

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
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient(c.tone)} flex items-center justify-center`}>
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
