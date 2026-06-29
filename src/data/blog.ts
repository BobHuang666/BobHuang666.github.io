import type { BlogPost } from '../types';

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

/**
 * 极简浏览器友好的 Front-Matter 解析器。
 * 仅支持 YAML 子集：string / number / boolean / 数组（[a, b, c] 或 - 行 列表）
 */
function parseFrontMatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const fmText = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  const lines = fmText.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) { i++; continue; }
    const key = kv[1];
    const value: string = kv[2].trim();

    if (value === '') {
      // 可能是 YAML 列表 - item
      const list: string[] = [];
      let j = i + 1;
      while (j < lines.length && /^\s*-\s+/.test(lines[j])) {
        list.push(lines[j].replace(/^\s*-\s+/, '').trim().replace(/^['"]|['"]$/g, ''));
        j++;
      }
      data[key] = list;
      i = j;
      continue;
    }

    // 数组 inline
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else if (/^(true|false)$/i.test(value)) {
      data[key] = value.toLowerCase() === 'true';
    } else if (/^-?\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
    } else {
      // 去除两端引号
      data[key] = value.replace(/^['"]|['"]$/g, '');
    }
    i++;
  }

  return { data, content };
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
      excerpt: (data.excerpt as string) ?? content.slice(0, 120).replace(/[#>*`]/g, ''),
      content,
      category: (data.category as string) ?? '未分类',
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      publishDate: (data.date as string) ?? '',
      readTime: typeof data.readTime === 'number' ? data.readTime : estimateReadTime(content),
      author: (data.author as string) ?? 'Bob Huang',
      coverImage: (data.cover as string) || undefined,
      isDraft: Boolean(data.draft),
    } as BlogPost;
  })
  .sort((a, b) => (a.publishDate < b.publishDate ? 1 : -1));

export const blogData: BlogPost[] = posts;

export function getPost(id: string): BlogPost | undefined {
  return posts.find((p) => p.id === id);
}
