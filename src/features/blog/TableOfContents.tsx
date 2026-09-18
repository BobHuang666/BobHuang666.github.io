import { useEffect, useState, useMemo } from 'react';
import { List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Props {
  /** Markdown 原文，用于解析标题层级 */
  content: string;
  /** 用于查找渲染后元素的容器选择器 */
  containerSelector?: string;
}

/** 从 markdown 原文提取 # 标题 */
function extractHeadings(md: string): Heading[] {
  const out: Heading[] = [];
  const lines = md.split(/\r?\n/);
  let inCode = false;
  for (const line of lines) {
    if (line.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;
    const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!m) continue;
    const level = m[1].length;
    if (level > 4) continue;
    const text = m[2].replace(/[`*_]/g, '').trim();
    // 与 rehype-slug 默认 GitHub slug 算法接近的最小化实现
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\- ]+/g, '')
      .trim()
      .replace(/\s+/g, '-');
    out.push({ id, text, level });
  }
  return out;
}

const TableOfContents = ({ content, containerSelector }: Props) => {
  const { t } = useTranslation();
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;
    // 找渲染后的真实 id（rehype-slug 可能 slug 与我们略不同）
    const root = containerSelector
      ? document.querySelector(containerSelector)
      : document;
    if (!root) return;
    const elements = Array.from(root.querySelectorAll<HTMLElement>('h1, h2, h3, h4'));

    const onScroll = () => {
      let current = elements[0]?.id ?? '';
      for (const el of elements) {
        if (el.getBoundingClientRect().top < 120) current = el.id;
        else break;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings, containerSelector]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (headings.length < 2) return null;

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin">
      <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <List className="h-3.5 w-3.5" />
        {t('misc.toc')}
      </div>
      <ul className="space-y-1 text-sm border-l border-slate-200 dark:border-slate-800">
        {headings.map((h) => (
          <li key={h.id}>
            <button
              onClick={() => scrollTo(h.id)}
              style={{ paddingLeft: `${(h.level - 1) * 12 + 12}px` }}
              className={`block w-full text-left py-1 pr-2 -ml-px border-l-2 transition-colors text-[13px] truncate ${
                activeId === h.id
                  ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {h.text}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TableOfContents;
