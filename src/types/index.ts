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

/** 奖项级别常量：数据、筛选器、类型共用同一份，避免各处重复声明 */
export const AWARD_LEVELS = ['国际级', '国家级', '省级', '校级', '院系级'] as const;
export type AwardLevel = (typeof AWARD_LEVELS)[number];

export interface Award {
  title: string;
  organization: string;
  year: string;
  level: AwardLevel;
  description: string;
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
  duration?: string;
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
  leader: string;
  period: string;
  rank: string;
}
