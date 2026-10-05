import {
  Disc3, Image as ImageIcon, Gift, PenLine, Ticket,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CollectionCategory, Rarity } from '../../data/fandom';

/**
 * fandom 的「枚举 → 展示」映射集中在这里。
 * 数据层只存枚举值，视图层统一查这张表，新增枚举只需改一处。
 */

export const categoryIcons: Record<CollectionCategory, LucideIcon> = {
  album: Disc3,
  photocard: ImageIcon,
  lightstick: Gift,
  goods: Gift,
  sign: PenLine,
  ticket: Ticket,
};

/** 收藏类别文案 */
export const collectionCategoryMeta: Record<CollectionCategory, string> = {
  album: '专辑',
  photocard: '小卡',
  lightstick: '应援棒',
  goods: '周边',
  sign: '签名',
  ticket: '票根',
};

/** 珍藏度：文案 + 边框光效类 */
export const rarityMeta: Record<Rarity, { label: string; ring: string; glow: string; badge: string }> = {
  common: {
    label: '普通',
    ring: 'ring-slate-200 dark:ring-slate-700',
    glow: '',
    badge: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
  },
  rare: {
    label: '稀有',
    ring: 'ring-sky-300 dark:ring-sky-500/60',
    glow: 'shadow-[0_0_24px_-6px] shadow-sky-400/40',
    badge: 'text-sky-600 bg-sky-100 dark:bg-sky-950/50 dark:text-sky-400',
  },
  epic: {
    label: '史诗',
    ring: 'ring-fuchsia-300 dark:ring-fuchsia-500/60',
    glow: 'shadow-[0_0_28px_-4px] shadow-fuchsia-400/50',
    badge: 'text-fuchsia-600 bg-fuchsia-100 dark:bg-fuchsia-950/50 dark:text-fuchsia-400',
  },
  legend: {
    label: '传说',
    ring: 'ring-amber-300 dark:ring-amber-400/70',
    glow: 'shadow-[0_0_32px_-2px] shadow-amber-400/60',
    badge: 'text-amber-600 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400',
  },
};
