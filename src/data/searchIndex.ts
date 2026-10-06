import { blogData } from './blog';
import { projects } from './projects';
import { awards } from './awards';
import { skillsDetail } from './skills';
import { uiText } from './uiText';
import { formatAwardDate } from '../utils/awardDate';

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

const { pages } = uiText.search;

const staticPages: SearchItem[] = [
  { id: 'page-home', kind: 'page', title: pages.home, description: pages.homeDesc, href: '#/' },
  { id: 'page-profile', kind: 'page', title: pages.profile, description: pages.profileDesc, href: '#/profile' },
  { id: 'page-blog', kind: 'page', title: pages.blog, description: pages.blogDesc, href: '#/blog' },
  { id: 'page-travel', kind: 'page', title: pages.travel, description: pages.travelDesc, href: '#/travel' },
  { id: 'page-fandom', kind: 'page', title: pages.fandom, description: pages.fandomDesc, href: '#/fandom' },
  { id: 'page-friends', kind: 'page', title: pages.friends, description: pages.friendsDesc, href: '#/friends' },
];

const projectItems: SearchItem[] = projects.map((p) => ({
  id: `project-${p.id}`,
  kind: 'project',
  title: p.title,
  description: p.description,
  tags: p.tags,
  href: `#/projects/${p.id}`,
}));

const awardItems: SearchItem[] = awards.map((a) => ({
  id: `award-${a.title}`,
  kind: 'award',
  title: a.title,
  description: `${a.organization} · ${formatAwardDate(a.year, a.month, a.day)} · ${a.level}`,
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
  description: b.excerpt,
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
