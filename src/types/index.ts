import type { LucideIcon } from 'lucide-react';

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  /** 可选：项目封面图，不存在则降级为渐变色块 */
  image?: string;
  /** 与 image 配对的渐变 fallback，例：'from-indigo-500 via-purple-500 to-pink-500' */
  imageGradient?: string;
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
  icon: LucideIcon;
  skills: string[];
}

export interface SkillDetailCategory {
  category: string;
  icon: LucideIcon;
  skills: {
    name: string;
    level: number;          // 0-100，仅用于排序参考
    stars?: 1 | 2 | 3 | 4 | 5;
    note?: string;
    color: string;
    /** 证据链接：项目 id 或外链 */
    evidence?: { label: string; href: string }[];
  }[];
}

export interface Award {
  title: string;
  organization: string;
  year: string;
  level: '国际级' | '国家级' | '省级' | '校级' | '院系级';
  description: string;
  rank?: string;
  icon: LucideIcon;
  color?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishDate: string;
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
