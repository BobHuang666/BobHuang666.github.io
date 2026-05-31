import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';

interface Options {
  siteUrl: string;
  title: string;
  description: string;
  author: { name: string; email: string };
  /** Markdown 源目录，相对项目根 */
  postsDir?: string;
  /** 输出文件名 */
  filename?: string;
}

interface ParsedPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  isDraft: boolean;
}

function parseFrontMatter(raw: string) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { data: {} as Record<string, unknown>, content: raw };
  const fm = m[1];
  const data: Record<string, unknown> = {};
  fm.split(/\r?\n/).forEach((line) => {
    const kv = line.match(/^([A-Za-z0-9_]+)\s*:\s*(.*)$/);
    if (!kv) return;
    const key = kv[1];
    const value = kv[2].trim();
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
      data[key] = value.replace(/^['"]|['"]$/g, '');
    }
  });
  return { data, content: m[2] };
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** vite 插件：构建时把 src/posts/*.md 输出为 RSS feed.xml */
export function rssFeed(options: Options): Plugin {
  const {
    siteUrl,
    title,
    description,
    author,
    postsDir = 'src/posts',
    filename = 'feed.xml',
  } = options;

  return {
    name: 'rss-feed',
    apply: 'build',
    closeBundle() {
      const root = process.cwd();
      const dir = resolve(root, postsDir);
      let files: string[] = [];
      try {
        files = readdirSync(dir).filter((f) => f.endsWith('.md'));
      } catch {
        // 目录不存在，跳过
        return;
      }
      const posts: ParsedPost[] = files
        .map((f) => {
          const raw = readFileSync(join(dir, f), 'utf-8');
          const { data, content } = parseFrontMatter(raw);
          return {
            id: f.replace(/\.md$/, ''),
            title: (data.title as string) ?? f,
            excerpt:
              (data.excerpt as string) ?? content.slice(0, 200).replace(/[#>*`]/g, ''),
            date: (data.date as string) ?? '',
            category: (data.category as string) ?? '随笔',
            tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
            isDraft: Boolean(data.draft),
          };
        })
        .filter((p) => !p.isDraft)
        .sort((a, b) => (a.date < b.date ? 1 : -1));

      const now = new Date().toUTCString();

      const items = posts
        .map((p) => {
          const link = `${siteUrl}#/blog/${p.id}`;
          const pubDate = p.date ? new Date(p.date).toUTCString() : now;
          const categories = [p.category, ...p.tags]
            .map((c) => `<category>${escapeXml(c)}</category>`)
            .join('');
          return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="false">${siteUrl}#/blog/${p.id}</guid>
      <pubDate>${pubDate}</pubDate>
      ${categories}
      <description><![CDATA[${p.excerpt}]]></description>
    </item>`;
        })
        .join('\n');

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}${filename}" rel="self" type="application/rss+xml"/>
    <managingEditor>${author.email} (${author.name})</managingEditor>
    <webMaster>${author.email} (${author.name})</webMaster>
${items}
  </channel>
</rss>
`;

      const outPath = resolve(root, 'dist', filename);
      writeFileSync(outPath, xml, 'utf-8');
       
      console.log(`\n[rss-feed] ${posts.length} posts → dist/${filename}`);
    },
  };
}
