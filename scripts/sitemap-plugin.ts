import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';

interface Options {
  siteUrl: string;
  /** 静态路由列表（不含博客详情） */
  routes: string[];
  postsDir?: string;
}

function parseDate(raw: string): string {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return '';
  const fm = m[1];
  const line = fm.split(/\r?\n/).find((l) => l.startsWith('date:'));
  if (!line) return '';
  return line.replace(/^date:\s*/, '').replace(/^['"]|['"]$/g, '').trim();
}

function isDraft(raw: string): boolean {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return false;
  return /draft:\s*true/i.test(m[1]);
}

/** 生成 sitemap.xml + robots.txt */
export function sitemap(options: Options): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    closeBundle() {
      const { siteUrl, routes, postsDir = 'src/posts' } = options;
      const root = process.cwd();

      // 收集博客文章
      const blogUrls: { loc: string; lastmod: string }[] = [];
      try {
        const files = readdirSync(resolve(root, postsDir)).filter((f) => f.endsWith('.md'));
        for (const f of files) {
          const raw = readFileSync(join(root, postsDir, f), 'utf-8');
          if (isDraft(raw)) continue;
          const id = f.replace(/\.md$/, '');
          blogUrls.push({
            loc: `${siteUrl}#/blog/${id}`,
            lastmod: parseDate(raw) || new Date().toISOString().slice(0, 10),
          });
        }
      } catch {
        // ignore
      }

      const today = new Date().toISOString().slice(0, 10);
      const allUrls = [
        ...routes.map((r) => ({ loc: `${siteUrl}#${r}`, lastmod: today })),
        ...blogUrls,
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
      writeFileSync(resolve(root, 'dist', 'sitemap.xml'), xml, 'utf-8');

      const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}sitemap.xml
`;
      writeFileSync(resolve(root, 'dist', 'robots.txt'), robots, 'utf-8');
       
      console.log(`[sitemap] ${allUrls.length} urls → dist/sitemap.xml + robots.txt`);
    },
  };
}
