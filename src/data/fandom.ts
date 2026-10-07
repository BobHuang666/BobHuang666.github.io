import type { GradientTone } from '../utils/gradients';

/**
 * 追星专题数据（公开页面，无需密码）
 *
 * 数据完全静态，可随时调整，不泄露任何敏感信息。
 * 头像通过 avatar 字段加载：网络 URL 或项目内路径（如 /img/fandom/xxx.jpg）。
 * 图片已保存到 public/img/fandom/，也可替换为官方图源。
 */
export interface Idol {
  /** 显示名（昵称） */
  name: string;
  /** 团体 / 公司 */
  group?: string;
  /** 生日 / 出道日 */
  date?: string;
  /** 入坑时间 */
  since?: string;
  /** 头像图片地址：网络 URL 或项目内路径（如 /img/fandom/xxx.jpg） */
  avatar?: string;
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
  tone: GradientTone;
}

/** 线下打卡 */
export interface CheckIn {
  /** 唯一 id */
  id: string;
  /** 日期 ISO */
  date: string;
  /** 对象艺人 */
  idol: string;
  /** 打卡地点 */
  place: string;
  /** 一句话感想（可选） */
  note?: string;
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
  tone: GradientTone;
  /** 备注 / 小故事 */
  note?: string;
}

export const fandomConfig = {
  /** 入坑年份，用于「追星 N 年」统计；留空则不展示 */
  fanSince: '2017',
  intro:
    '在写代码与卷算法之外，「追星」是我重要的能量来源。这里记录那些让我开心、坚持、变更好的人 —— 看过的现场、做过的应援、珍藏的周边。',
};

/** 偶像墙 */
export const idols: Idol[] = [
  {
    name: 'Lay Zhang 张艺兴',
    group: 'EXO / 染色体娱乐',
    date: '1991.10.07',
    since: '2017',
    avatar: '/img/fandom/idol-lay.jpg',
  },
  {
    name: 'R.E.D',
    group: '染色体娱乐',
    date: '2024.07.11（出道）',
    since: '2024',
    avatar: '/img/fandom/group-red.jpg',
  },
  {
    name: 'EXO',
    group: 'SM Entertainment',
    date: '2012.04.08（出道）',
    since: '2017',
    avatar: '/img/fandom/group-exo.jpg',
  },
  {
    name: 'NCT',
    group: 'SM Entertainment',
    date: '2016.04.09（出道）',
    since: '2021',
    avatar: '/img/fandom/group-nct.jpg',
  },
  {
    name: 'Red Velvet',
    group: 'SM Entertainment',
    date: '2014.08.01（出道）',
    since: '2020',
    avatar: '/img/fandom/group-redvelvet.jpg',
  },
  {
    name: 'Super Junior',
    group: 'SM Entertainment',
    date: '2005.11.06（出道）',
    since: '2021',
    avatar: '/img/fandom/group-superjunior.jpg',
  },
  {
    name: 'Taeyeon 金泰妍',
    group: '少女时代 / SM',
    date: '1989.03.09',
    since: '2022',
    avatar: '/img/fandom/idol-taeyeon.jpg',
  },
];

/**
 * 演唱会日历
 * status='upcoming' 会自动出现倒计时
 */
export const concerts: Concert[] = [
  {
    id: 'c-hechi-2026',
    idol: 'R.E.D',
    tour: '2026 活力金城音乐节',
    city: '河池',
    venue: '河池市体育场',
    date: '2026-10-31',
    status: 'upcoming',
    highlight: '时隔一个月又见R.E.D & 姚晓棠',
    tone: 'fuchsiaRose',
  },
  {
    id: 'c-nct127-hk-2026',
    idol: 'NCT',
    tour: "NCT 127 5TH TOUR 'NEO CITY : THE REDLINE'",
    city: '香港',
    venue: '启德体艺馆',
    date: '2026-10-11',
    status: 'upcoming',
    tone: 'cardIndigo',
  },
  {
    id: 'c-shanwei-2026',
    idol: 'R.E.D',
    tour: '“山海升明月”2026 粤港澳大湾区中秋晚会',
    city: '汕尾',
    venue: '汕尾市体育中心',
    date: '2026-09-21',
    status: 'attended',
    tone: 'mintCyan',
  },
  {
    id: 'c-red-sz-2026',
    idol: 'R.E.D',
    tour: 'R.E.D 赤焰红 1.0「Shadow Play」深圳站',
    city: '深圳',
    venue: '深圳宝安体育中心',
    date: '2026-07-11',
    status: 'attended',
    tone: 'cardAmber',
  },
  {
    id: 'c-chromosome-hk-2026',
    idol: '张艺兴 / EXO-SC / 王子浩LE\'V / R.E.D / NouerA / CHROMOSOME SEEDS',
    tour: 'CHROMOSOME UNIVERSE NEW YEAR COUNTDOWN SHOW 染色體家族跨年夜',
    city: '香港',
    venue: '西九文化区',
    date: '2026-01-01',
    status: 'attended',
    tone: 'indigoViolet',
  },
  {
    id: 'c-red-sz-2025',
    idol: 'R.E.D',
    tour: 'R.E.D「赤焰红」出道一周年 Special Stage 深圳',
    city: '深圳',
    venue: '深圳宝安体育中心',
    date: '2025-07-27',
    status: 'attended',
    tone: 'fuchsiaRose',
  },
  {
    id: 'c-taeyeon-hk-2025',
    idol: '泰妍',
    tour: 'TAEYEON CONCERT – The TENSE in HONG KONG',
    city: '香港',
    venue: '亚洲国际博览馆 Arena',
    date: '2025-06-07',
    status: 'attended',
    highlight: '耳机🎧里唱歌的人出现了',
    tone: 'cardAmber',
  },
  {
    id: 'c-chromosome-mo-2025',
    idol: '张艺兴 / 王子浩LE\'V / R.E.D / NouerA / CHROMOSOME SEEDS',
    tour: 'CHROMOSOME UNIVERSE NEW YEAR COUNTDOWN SHOW 染色體家族跨年夜',
    city: '澳门',
    venue: '美狮美高梅',
    date: '2025-01-01',
    status: 'attended',
    highlight: 'Keep on going higher!',
    tone: 'indigoViolet',
  },
  {
    id: 'c-music-link-2024',
    idol: 'R.E.D',
    tour: '《音乐缘计划》录制',
    city: '澳门',
    venue: '美狮美高梅',
    date: '2024-10-14',
    status: 'attended',
    highlight: 'R.E.D、薛之谦、周深、单依纯、周深、周笔畅、黄子弘凡、刘宇宁、王琳凯、陈卓璇、陈端端',
    tone: 'skyTeal',
  },
  {
    id: 'c-wayv-gz-2024',
    idol: '威神V',
    tour: '2024 WayV CONCERT [ON THE Way]',
    city: '广州',
    venue: '广州体育馆 1 号馆',
    date: '2024-08-24',
    status: 'attended',
    highlight: '也是在国内听到Regular了',
    tone: 'mintCyan',
  },
  {
    id: 'c-red-meet-2024',
    idol: 'R.E.D',
    tour: 'R.E.D 出道粉丝见面会 深圳站',
    city: '深圳',
    venue: 'HOU LIVE X Mixc cube',
    date: '2024-08-23',
    status: 'attended',
    highlight: 'First Date',
    tone: 'fuchsiaRose',
  },
  {
    id: 'c-lay-gz-2024',
    idol: '张艺兴',
    tour: '2024 张艺兴「大航海4·STEP」巡回演唱会—广州站',
    city: '广州',
    venue: '宝能广州国际体育演艺中心',
    date: '2024-08-02',
    status: 'attended',
    tone: 'sunsetAmber',
  },
  {
    id: 'c-exo-mo-2024',
    idol: 'XIUMIN',
    tour: '《社长爱豆超市》粉丝见面会',
    city: '澳门',
    venue: '澳门百老汇',
    date: '2024-03-31',
    status: 'attended',
    tone: 'indigoViolet',
  },
  {
    id: 'c-dna-fs-2023',
    idol: '张艺兴 / 王子浩LE\'V / LIN',
    tour: '佛山 D.N.A 音乐节',
    city: '佛山',
    venue: '佛山市青年公园',
    date: '2023-10-04',
    status: 'attended',
    tone: 'mintGreen',
  },
];

/** 线下打卡 */
export const checkIns: CheckIn[] = [
  {
    id: 'ci-20260906',
    date: '2026-09-06',
    idol: 'R.E.D',
    place: '北京电影学院 & 中央戏剧学院',
    note: '打卡北京电影学院（JINNY）、中央戏剧学院（QIANA）',
  },
  {
    id: 'ci-20260707',
    date: '2026-07-07',
    idol: 'R.E.D',
    place: '深圳宝体站',
    note: '团体应援灯箱',
  },
  {
    id: 'ci-20260703',
    date: '2026-07-03',
    idol: 'R.E.D',
    place: '深圳宝体站',
    note: 'BETTY应援灯箱',
  },
  {
    id: 'ci-20251025',
    date: '2025-10-25',
    idol: '郎平',
    place: 'BNUZH 风雨操场',
    note: '观摩郎平教授教学课',
  },
  {
    id: 'ci-20250912',
    date: '2025-09-12',
    idol: 'EXO / RIIZE / NCT WISH',
    place: '韩国济州市、西归浦市',
    note: '实弹射击（伯贤同款）、MEGA COFFEE（RIIZE 代言）、NCT WISH 团综小商店',
  },
  {
    id: 'ci-20250911',
    date: '2025-09-11',
    idol: 'Red Velvet',
    place: '韩国济州市 JEJU LAF',
    note: 'Red Velvet 团综滑索',
  },
  {
    id: 'ci-20241003',
    date: '2024-10-03',
    idol: 'R.E.D',
    place: '深圳',
    note: '深圳国际交流书院（BETTY）、深圳市艺术高中（QIANA）',
  },
  {
    id: 'ci-20240716',
    date: '2024-07-16',
    idol: '张艺兴',
    place: '上海 肯德基汇宝店',
    note: '《极限挑战》肯德基事变旧址',
  },
  {
    id: 'ci-20240601',
    date: '2024-06-01',
    idol: 'R.E.D',
    place: '柠季',
    note: 'R.E.D（染色体小花盆 1 号）出道前第一个代言',
  },
  {
    id: 'ci-20240511',
    date: '2024-05-11',
    idol: '陈丽洁',
    place: 'BNUZH 大操场',
    note: '猪猪侠、果宝特攻、超兽武装、快乐酷宝原唱',
  },
  {
    id: 'ci-20240506',
    date: '2024-05-06',
    idol: 'EXO',
    place: '珠海优特汇',
    note: '伯贤生日大屏',
  },
  {
    id: 'ci-20240331',
    date: '2024-03-31',
    idol: 'EXO',
    place: '澳门威尼斯人',
    note: '世勋 ins 同款照片打卡',
  },
  {
    id: 'ci-20231117',
    date: '2023-11-17',
    idol: '莫言',
    place: '北京师范大学珠海校区 励耘楼',
    note: '诺奖得主莫言讲座',
  },
  {
    id: 'ci-20230917',
    date: '2023-09-17',
    idol: 'NCT',
    place: '珠海',
    note: 'NCT 日本大队演唱会珠海线下观演，迄今为止最后一次人那么齐的演唱会',
  },
];

/**
 * 周边收藏
 * rarity 越高，卡片光效越华丽
 */
export const collections: Collection[] = [
  {
    id: 'm-1',
    name: '小羊蹄 应援棒',
    idol: '张艺兴',
    category: 'lightstick',
    rarity: 'legend',
    tone: 'sunsetAmber',
    note: '张艺兴官方应援棒，昵称「小羊蹄」',
  },
  {
    id: 'm-2',
    name: '官方应援棒',
    idol: '主推一号',
    category: 'lightstick',
    date: '2023',
    rarity: 'epic',
    tone: 'fuchsiaRoseBold',
  },
  {
    id: 'm-3',
    name: '小卡（限定版）',
    idol: '主推二号',
    category: 'photocard',
    date: '2024',
    rarity: 'rare',
    tone: 'skyTeal',
  },
  {
    id: 'm-4',
    name: '正规一辑',
    idol: '主推一号',
    category: 'album',
    date: '2022',
    rarity: 'common',
    tone: 'indigoVioletBold',
  },
  {
    id: 'm-5',
    name: '巡演纪念票根',
    idol: '主推二号',
    category: 'ticket',
    date: '2023',
    rarity: 'rare',
    tone: 'mintGreen',
  },
  {
    id: 'm-6',
    name: '官方周边套组',
    idol: '主推一号',
    category: 'goods',
    date: '2024',
    rarity: 'common',
    tone: 'slate',
  },
];

/**
 * "我从他们身上学到的"
 */
export const lessons: string[] = [
  'TODO',
  '坚持的力量 —— 每天进步一点点，比偶尔的爆发更重要',
  '保持热爱 —— 把热爱具体化成可量化的行动',
  '专业 ≠ 套路 —— 真诚永远是最稀缺的能力',
];
