import type { BlogPost } from '../types';
import { parseFrontMatter, deriveExcerpt, FRONT_MATTER_DEFAULTS } from '../utils/frontMatter';

export type BlogMeta = Omit<BlogPost, 'content'>;

/**
 * 智能阅读时间估算
 * - 中文字符：350 字/分钟
 * - 英文单词：200 词/分钟
 * - 先剥离 Markdown 语法再统计
 */
function estimateReadTime(raw: string): number {
  // 剥离代码块、Front-Matter 残留、HTML 标签、Markdown 符号
  const text = raw
    .replace(/```[\s\S]*?```/g, '')   // 代码块
    .replace(/`[^`]+`/g, '')          // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '')   // 图片
    .replace(/\[.*?\]\(.*?\)/g, '')    // 链接
    .replace(/^#{1,6}\s/gm, '')        // 标题
    .replace(/[*_~>#|-]+/g, ' ')       // 强调/引用/表格等符号
    .replace(/\s+/g, ' ')
    .trim();

  // 中文字符数
  const zhChars = (text.match(/[\u4e00-\u9fa5\u3400-\u4dbf]/g) ?? []).length;
  // 英文单词数（连续字母/数字序列）
  const enWords = (text.match(/[a-zA-Z0-9]+/g) ?? []).length;

  const minutes = zhChars / 350 + enWords / 200;
  return Math.max(1, Math.round(minutes));
}

// 自动加载 src/posts 下所有 .md 文件
const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

const posts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => {
    const fileName = path.split('/').pop()!.replace(/\.md$/, '');
    const { data, content } = parseFrontMatter(raw as string);
    return {
      id: fileName,
      title: (data.title as string) ?? fileName,
      excerpt: (data.excerpt as string) ?? deriveExcerpt(content),
      content,
      category: (data.category as string) ?? FRONT_MATTER_DEFAULTS.category,
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      publishDate: (data.date as string) ?? '',
      updatedDate: (data.updated as string) || undefined,
      readTime: typeof data.readTime === 'number' ? data.readTime : estimateReadTime(content),
      author: (data.author as string) ?? FRONT_MATTER_DEFAULTS.author,
      coverImage: (data.cover as string) || undefined,
      isDraft: Boolean(data.draft),
    } as BlogPost;
  })
  // A `draft: true` file may remain in a local checkout, but must never be
  // addressable from the production application. CMS drafts live on their own
  // workflow branches and are therefore absent from main altogether.
  .filter((post) => !post.isDraft)
  .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));

export const blogData: BlogPost[] = posts;

/** 不含正文的轻量元数据，供首页/列表页使用 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const blogMeta: BlogMeta[] = posts.map(({ content: _content, ...rest }) => rest);

export function getPost(id: string): BlogPost | undefined {
  return posts.find((p) => p.id === id);
}
