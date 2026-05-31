import { blogData } from './blog';
import { projects } from './projects';
import { awards } from './awards';
import { skillsDetail } from './skills';

export type SearchResultKind = 'blog' | 'project' | 'award' | 'skill' | 'page';

export interface SearchItem {
  id: string;
  kind: SearchResultKind;
  title: string;
  description: string;
  tags?: string[];
  /** 跳转地址（Hash router 格式） */
  href: string;
}

const staticPages: SearchItem[] = [
  {
    id: 'page-home',
    kind: 'page',
    title: '主城 / Home',
    description: '个人主页，包含技能、项目、奖项、博客与联系方式',
    href: '#/',
  },
  {
    id: 'page-profile',
    kind: 'page',
    title: '角色档案 / Profile',
    description: '基本信息、教育背景、获奖、课程、实习、科研',
    href: '#/profile',
  },
  {
    id: 'page-blog',
    kind: 'page',
    title: '游戏攻略 / Blog',
    description: '所有博客文章列表',
    href: '#/blog',
  },
  { id: 'page-now', kind: 'page', title: '/now · 我最近在做什么', description: '当前正在做的事 / 学的东西', href: '#/now' },
  { id: 'page-uses', kind: 'page', title: '/uses · 装备清单', description: '硬件、开发工具、技术栈偏好', href: '#/uses' },
  { id: 'page-series', kind: 'page', title: '专题系列 / Series', description: '把博客按主题汇集：算法、前端、项目复盘、AI、旅行、数据科学', href: '#/series' },
  { id: 'page-friends', kind: 'page', title: '友人帐 / Friends', description: '友情链接 & 友链申请', href: '#/friends' },
];

const projectItems: SearchItem[] = projects.map((p) => ({
  id: `project-${p.id}`,
  kind: 'project',
  title: p.title,
  description: p.description,
  tags: p.tags,
  href: `#/projects/${p.id}`,
}));

const awardItems: SearchItem[] = awards.map((a, i) => ({
  id: `award-${i}`,
  kind: 'award',
  title: a.title,
  description: `${a.organization} · ${a.year} · ${a.level} · ${a.description}`,
  tags: [a.level, a.year],
  href: '#/profile',
}));

const skillItems: SearchItem[] = skillsDetail.flatMap((cat) =>
  cat.skills.map((s) => ({
    id: `skill-${cat.category}-${s.name}`,
    kind: 'skill' as const,
    title: s.name,
    description: `${cat.category}${s.note ? ' · ' + s.note : ''}`,
    href: '#/profile',
  })),
);

const blogItems: SearchItem[] = blogData.map((b) => ({
  id: `blog-${b.id}`,
  kind: 'blog',
  title: b.title,
  description: `${b.excerpt}\n${b.content.slice(0, 300)}`,
  tags: b.tags,
  href: `#/blog/${b.id}`,
}));

export const searchCorpus: SearchItem[] = [
  ...staticPages,
  ...projectItems,
  ...blogItems,
  ...awardItems,
  ...skillItems,
];

export const KIND_META: Record<SearchResultKind, { label: string; labelEn: string; color: string }> = {
  blog: { label: '博客', labelEn: 'Blog', color: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/40' },
  project: { label: '项目', labelEn: 'Project', color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40' },
  award: { label: '奖项', labelEn: 'Award', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' },
  skill: { label: '技能', labelEn: 'Skill', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40' },
  page: { label: '页面', labelEn: 'Page', color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
};
