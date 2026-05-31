/**
 * 专题系列页 —— 把零散的博客组织成「专题」
 *
 * 每个专题包含若干文章 id（来自 src/posts/）
 * 一篇文章可以同时属于多个专题（在 article.tags 中包含专题 slug 即可）
 */
export interface Series {
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  /** 用来过滤博客文章的标签（任一匹配即归入此专题） */
  matchTags: string[];
  color: string;
  icon: '⚔️' | '📚' | '🧪' | '🎯' | '🤖' | '✈️';
}

export const series: Series[] = [
  {
    slug: 'algorithm',
    title: '算法笔记',
    titleEn: 'Algorithm Notes',
    description: 'LeetCode、ICPC、蓝桥杯题解与算法思想总结',
    matchTags: ['算法', 'LeetCode', '动态规划', '数据结构'],
    color: 'from-indigo-500 to-blue-600',
    icon: '⚔️',
  },
  {
    slug: 'frontend',
    title: '前端日记',
    titleEn: 'Frontend Diary',
    description: 'Vue / React / 工程化 / 小程序实战与踩坑',
    matchTags: ['前端', 'Vue3', 'React', '小程序', 'uni-app', 'TypeScript'],
    color: 'from-emerald-500 to-cyan-600',
    icon: '🎯',
  },
  {
    slug: 'project-retro',
    title: '项目复盘',
    titleEn: 'Project Retrospectives',
    description: '墨尺 / AiCV / iGEM 等真实项目的全流程回顾',
    matchTags: ['iGEM', '墨尺', 'AiCV', '项目复盘', '实习'],
    color: 'from-rose-500 to-pink-600',
    icon: '📚',
  },
  {
    slug: 'ai',
    title: '大模型实践',
    titleEn: 'LLM in Practice',
    description: 'LLM 应用工程化、prompt 设计、RAG 落地经验',
    matchTags: ['LLM', 'AI', '大模型', 'prompt'],
    color: 'from-violet-500 to-purple-600',
    icon: '🤖',
  },
  {
    slug: 'travel',
    title: '行走日志',
    titleEn: 'Travel Log',
    description: '潮州 · 北京 · 大理 · 瑞金 · ……走过的地方与思考',
    matchTags: ['旅行', '潮州', '随笔'],
    color: 'from-amber-500 to-orange-600',
    icon: '✈️',
  },
  {
    slug: 'datascience',
    title: '数据科学',
    titleEn: 'Data Science',
    description: '大数据处理、可视化、数据挖掘与建模',
    matchTags: ['数据', '大数据', '数据分析', '可视化'],
    color: 'from-blue-500 to-indigo-600',
    icon: '🧪',
  },
];

export function getSeriesBySlug(slug: string) {
  return series.find((s) => s.slug === slug);
}
