export type { LucideIcon } from 'lucide-react';
import type { GradientTone } from '../utils/gradients';

/** lucide 图标名称字符串，供数据层使用（组件层通过 resolveIcon() 解析） */
export type IconName = string;

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  /** 可选：项目封面图，不存在则降级为渐变色块 */
  image?: string;
  /** 封面图缺失时的渐变 fallback：语义名，由 gradient() 映射为类名 */
  imageTone?: GradientTone;
  tags: string[];
  link: string;      // 在线演示 / 外链
  github?: string;
  timeline?: string;
  role?: string;
  highlight?: string;
}

export interface ProjectDetailData extends Project {
  content: {
    overview: string;
    features: string[];
    techStack: {
      frontend: string[];
      backend: string[];
      database: string[];
      tools: string[];
    };
    challenges: string[];
    solutions: string[];
    results: string[];
    lessons: string[];
  };
  team?: string[];
}

export interface SkillCategory {
  name: string;
  icon: IconName;
  skills: string[];
}

export interface SkillDetailCategory {
  category: string;
  icon: IconName;
  skills: {
    name: string;
    level: number;          // 0-100，仅用于排序参考
    stars?: 1 | 2 | 3 | 4 | 5;
    note?: string;
    tone: GradientTone;
    /** 证据链接：项目 id 或外链 */
    evidence?: { label: string; href: string }[];
  }[];
}

/** 技能胶囊类别：只决定胶囊浅色调，页面不再分组展示 */
export type SkillPillGroup = 'language' | 'frontend' | 'backend' | 'tool' | 'hobby';

export interface SkillPill {
  name: string;
  group: SkillPillGroup;
}

/** 奖项级别常量：数据、筛选器、类型共用同一份，避免各处重复声明 */
export const AWARD_LEVELS = ['国际级', '国家级', '省级', '校级', '院系级'] as const;
export type AwardLevel = (typeof AWARD_LEVELS)[number];

export interface Award {
  title: string;
  organization: string;
  year: string;
  month?: string;
  day?: string;
  level: AwardLevel;
  description?: string;
  rank?: string;
  icon: IconName;
  tone?: GradientTone;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishDate: string;
  updatedDate?: string;
  readTime: number;
  author: string;
  coverImage?: string;
  isDraft?: boolean;
}

export interface Experience {
  time: string;
  org: string;
  role: string;
  description?: string;
}

export interface Course {
  name: string;
  score: number | string;
  semester?: string;
  description?: string;
}

export interface Research {
  title: string;
  source: string;
  level: string;
  leader?: string;
  period: string;
  result: string;
}

/** 著作成果：发明专利 / 计算机软件著作权等 */
export interface Work {
  title: string;
  type: string;
  rank: string;
  meta: { label: string; value: string }[];
}

/** 交通方式：数据层只存 key，图标 / 配色 / 线型由 features/travel/meta.ts 映射 */
export const TRANSPORT_MODES = ['plane', 'train', 'car', 'bus', 'ship', 'walk'] as const;
export type TransportMode = (typeof TRANSPORT_MODES)[number];

/** 足迹状态：住过 / 去过 / 途经 / 想去 */
export const PLACE_STATUSES = ['lived', 'visited', 'transit', 'wishlist'] as const;
export type PlaceStatus = (typeof PLACE_STATUSES)[number];

export interface CityVisit {
  /** ISO 日期，如 '2024-08-10' */
  date: string;
  note?: string;
}

export interface TravelPlace {
  id: string;
  /** 与地图数据中的行政区全称一致，如「北京市」「延边朝鲜族自治州」 */
  name: string;
  /** 地图名对不上时的备选名，用于兜底匹配 */
  aliases?: string[];
  status: PlaceStatus;
  /** 覆盖地图自带 center；缺省时取地图数据里的 center */
  lng?: number;
  lat?: number;
  /**
   * 展示用的「次级地名」：国内城市会自动显示所属省级行政区，
   * 世界国家没有省级概念，想写「济州」「东京」这类具体地方就填这里。
   */
  region?: string;
  visits: CityVisit[];
}

export interface TravelLeg {
  id: string;
  /** TravelPlace.id */
  from: string;
  to: string;
  date: string;
  transport: TransportMode;
  note?: string;
}

export interface TravelTrip {
  id: string;
  title: string;
  dateRange: [string, string];
  legs: TravelLeg[];
  tone: GradientTone;
  /** 归属哪张地图：决定它在哪个 Tab 下绘制、点击后跳到哪个 Tab */
  scope: 'china' | 'world';
  /** 关联游记：src/posts 下的文章 id（文件名去掉 .md），跳转 /blog/{postId} */
  postId?: string;
}
