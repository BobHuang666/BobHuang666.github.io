/**
 * 追星专题数据 —— 隐私可控
 *
 * 配置项：
 * - PASSWORD: 留空 = 公开，填写 = 需要输入访问密码（仅本地校验，非安全用途）
 * - showRealName: false 时隐藏明星本名，只显示昵称
 *
 * 数据本身完全静态，可以随时调整，不会泄露任何敏感信息
 */
export interface Idol {
  /** 显示名（可以是昵称） */
  name: string;
  /** 真名 / 全名（可选） */
  fullName?: string;
  /** 团体/公司 */
  group?: string;
  /** 出道日 / 生日 */
  date?: string;
  /** 一句话理由 */
  reason: string;
  /** 入坑时间 */
  since?: string;
  /** 主推程度 */
  level: 'main' | 'sub' | 'casual';
  /** 头像渐变色 fallback */
  color: string;
}

/** 演唱会 / 线下行程 */
export interface Concert {
  /** 唯一 id */
  id: string;
  /** 艺人 / 团体 */
  idol: string;
  /** 巡演 / 演出名称 */
  tour: string;
  /** 城市 */
  city: string;
  /** 场馆 */
  venue: string;
  /** 日期 ISO，如 2024-08-10 */
  date: string;
  /** upcoming = 待赴约 · attended = 已现场 */
  status: 'upcoming' | 'attended';
  /** 票档 / 区域（可选） */
  seat?: string;
  /** 一句话期待或回忆 */
  highlight?: string;
  /** 卡片渐变色 */
  color: string;
}

export type SupportType =
  | 'vote'
  | 'fund'
  | 'lightstick'
  | 'banner'
  | 'birthday'
  | 'stream';

/** 应援记录 */
export interface SupportRecord {
  id: string;
  /** 日期 ISO */
  date: string;
  /** 对象艺人 */
  idol: string;
  /** 应援类型 */
  type: SupportType;
  /** 标题 */
  title: string;
  /** 详情（可选） */
  detail?: string;
}

export type CollectionCategory =
  | 'album'
  | 'photocard'
  | 'lightstick'
  | 'goods'
  | 'sign'
  | 'ticket';

export type Rarity = 'common' | 'rare' | 'epic' | 'legend';

/** 周边收藏 */
export interface Collection {
  id: string;
  /** 物品名 */
  name: string;
  /** 所属艺人 */
  idol: string;
  /** 类别 */
  category: CollectionCategory;
  /** 入手日期（可选） */
  date?: string;
  /** 珍藏度 */
  rarity: Rarity;
  /** 卡片渐变色 */
  color: string;
  /** 备注 / 小故事 */
  note?: string;
}

export const fandomConfig = {
  /** 留空 = 公开访问。填密码后访问页面前需输入（仅本地 JS 校验） */
  password: '',
  /** 是否显示明星全名（关闭可只显示昵称） */
  showRealName: true,
  /** 入坑年份，用于「追星 N 年」统计；留空则不展示 */
  fanSince: '2019',
  intro:
    '在写代码与卷算法之外，「追星」是我重要的能量来源。这里记录那些让我开心、坚持、变更好的人 —— 看过的现场、做过的应援、珍藏的周边。',
};

/**
 * TODO: 把示例数据替换成你真正喜欢的明星
 * level 说明：main = 主推 · sub = 副推 · casual = 关注
 */
export const idols: Idol[] = [
  {
    name: '主推一号',
    fullName: '（待补充）',
    group: '（团体 / 公司）',
    since: '202X 年',
    reason:
      '为什么喜欢 ta —— 比如「舞台表现力惊艳，每次看 live 都能被治愈」',
    level: 'main',
    color: 'from-pink-500 via-rose-500 to-amber-400',
  },
  {
    name: '主推二号',
    fullName: '（待补充）',
    group: '（团体）',
    since: '202X 年',
    reason: '理由占位 —— 等你填上自己喜欢的明星',
    level: 'main',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  {
    name: '副推',
    fullName: '（待补充）',
    group: '（团体）',
    reason: '次要喜欢的明星，可以多列几个',
    level: 'sub',
    color: 'from-emerald-500 to-cyan-500',
  },
];

/**
 * 演唱会日历
 * TODO: 替换成你真正去过 / 想去的现场。status='upcoming' 会自动出现倒计时
 */
export const concerts: Concert[] = [
  {
    id: 'c-upcoming-1',
    idol: '主推一号',
    tour: '202X World Tour「示例」',
    city: '上海',
    venue: '梅赛德斯-奔驰文化中心',
    date: '2026-12-20',
    status: 'upcoming',
    seat: '内场 A 区',
    highlight: '期待了一整年的约定，终于要见面了',
    color: 'from-rose-500 via-pink-500 to-fuchsia-500',
  },
  {
    id: 'c-2',
    idol: '主推一号',
    tour: '202X Fan Concert',
    city: '广州',
    venue: '广州体育馆',
    date: '2024-08-10',
    status: 'attended',
    seat: '看台 2 层',
    highlight: '全场合唱的那一刻，鸡皮疙瘩都起来了',
    color: 'from-amber-500 via-orange-500 to-rose-500',
  },
  {
    id: 'c-3',
    idol: '主推二号',
    tour: '示例巡演 The First',
    city: '深圳',
    venue: '深圳湾体育中心',
    date: '2023-05-01',
    status: 'attended',
    seat: '内场 B 区',
    highlight: '第一次看现场，原来心动可以这么具体',
    color: 'from-indigo-500 via-violet-500 to-purple-500',
  },
];

/**
 * 应援记录
 * TODO: 替换成你真实参与过的应援活动
 */
export const supportRecords: SupportRecord[] = [
  {
    id: 's-1',
    date: '2024-11-05',
    idol: '主推一号',
    type: 'birthday',
    title: '生日应援集资',
    detail: '参与城市地铁灯箱 + 公益植树应援',
  },
  {
    id: 's-2',
    date: '2024-09-18',
    idol: '主推一号',
    type: 'vote',
    title: '打榜冲榜',
    detail: '音源 + 投票连续打卡两周',
  },
  {
    id: 's-3',
    date: '2024-08-10',
    idol: '主推一号',
    type: 'lightstick',
    title: '现场灯牌应援',
    detail: '统一色块控场，全场变成一片海',
  },
  {
    id: 's-4',
    date: '2023-05-01',
    idol: '主推二号',
    type: 'banner',
    title: '手幅应援',
    detail: '自制手幅，举到手酸也值得',
  },
];

/**
 * 周边收藏
 * TODO: 替换成你真实拥有的周边。rarity 越高，卡片光效越华丽
 */
export const collections: Collection[] = [
  {
    id: 'm-1',
    name: '签名专辑',
    idol: '主推一号',
    category: 'sign',
    date: '2024',
    rarity: 'legend',
    color: 'from-amber-400 via-yellow-500 to-orange-500',
    note: '抽中的幸运签售，本命的亲签',
  },
  {
    id: 'm-2',
    name: '官方应援棒',
    idol: '主推一号',
    category: 'lightstick',
    date: '2023',
    rarity: 'epic',
    color: 'from-fuchsia-500 via-pink-500 to-rose-500',
  },
  {
    id: 'm-3',
    name: '小卡（限定版）',
    idol: '主推二号',
    category: 'photocard',
    date: '2024',
    rarity: 'rare',
    color: 'from-sky-500 via-cyan-500 to-teal-500',
  },
  {
    id: 'm-4',
    name: '正规一辑',
    idol: '主推一号',
    category: 'album',
    date: '2022',
    rarity: 'common',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    id: 'm-5',
    name: '巡演纪念票根',
    idol: '主推二号',
    category: 'ticket',
    date: '2023',
    rarity: 'rare',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'm-6',
    name: '官方周边套组',
    idol: '主推一号',
    category: 'goods',
    date: '2024',
    rarity: 'common',
    color: 'from-slate-500 to-slate-600',
  },
];

/** 应援类型展示元数据（文案 + 主题色） */
export const supportTypeMeta: Record<
  SupportType,
  { label: string; tone: string }
> = {
  vote: { label: '打榜', tone: 'text-rose-600 dark:text-rose-400 bg-rose-100/70 dark:bg-rose-950/40' },
  fund: { label: '集资', tone: 'text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/40' },
  lightstick: { label: '灯牌应援', tone: 'text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-100/70 dark:bg-fuchsia-950/40' },
  banner: { label: '手幅应援', tone: 'text-indigo-600 dark:text-indigo-400 bg-indigo-100/70 dark:bg-indigo-950/40' },
  birthday: { label: '生日应援', tone: 'text-pink-600 dark:text-pink-400 bg-pink-100/70 dark:bg-pink-950/40' },
  stream: { label: '打卡刷量', tone: 'text-cyan-600 dark:text-cyan-400 bg-cyan-100/70 dark:bg-cyan-950/40' },
};

/** 收藏类别展示元数据 */
export const collectionCategoryMeta: Record<CollectionCategory, string> = {
  album: '专辑',
  photocard: '小卡',
  lightstick: '应援棒',
  goods: '周边',
  sign: '签名',
  ticket: '票根',
};

/** 珍藏度展示元数据（文案 + 边框光效类） */
export const rarityMeta: Record<
  Rarity,
  { label: string; ring: string; glow: string; badge: string }
> = {
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

/**
 * "我从他们身上学到的"
 * TODO: 改成你自己的真实感悟
 */
export const lessons: string[] = [
  '坚持的力量 —— 每天进步一点点，比偶尔的爆发更重要',
  '保持热爱 —— 把热爱具体化成可量化的行动',
  '专业 ≠ 套路 —— 真诚永远是最稀缺的能力',
];
