/**
 * Front-Matter 解析 —— 纯函数，不依赖浏览器或 Vite 专有 API。
 *
 * 被两处共用，保证解析结果完全一致：
 * - `src/data/blog.ts`（浏览器构建，配 import.meta.glob）
 * - `scripts/sitemap-plugin.ts`（Node 构建脚本）
 *
 * 支持 YAML 子集：string / number / boolean / inline 数组 `[a, b]` / 列表 `- item`
 */

export interface ParsedFrontMatter {
  data: Record<string, unknown>;
  content: string;
}

/** front-matter 缺省值与截取长度，三处共用一份 */
export const FRONT_MATTER_DEFAULTS = {
  category: '未分类',
  author: 'Bob Huang',
  /** 未显式写 excerpt 时，从正文截取的长度 */
  excerptLength: 120,
} as const;

export function parseFrontMatter(raw: string): ParsedFrontMatter {
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
      // 可能是 YAML 列表：- item
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
    i++;
  }

  return { data, content };
}

/** 未写 excerpt 时的兜底：截取正文开头并去掉 Markdown 标记 */
export function deriveExcerpt(content: string, length = FRONT_MATTER_DEFAULTS.excerptLength): string {
  return content.slice(0, length).replace(/[#>*`]/g, '');
}
