import { useState, useEffect, useRef, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // 代码高亮主题，仅博客详情加载
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Check, Copy } from 'lucide-react';
import { getLangMeta } from './CodeBlock';
import CodeGroup from './CodeGroup';
import type { CodeTab } from './CodeGroup';

interface Props {
  content: string;
}

// ── 文本提取（遍历 React 树，用于复制） ──────────────────
function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node && typeof node === 'object' && 'props' in node) {
    return extractText((node as React.ReactElement).props.children as ReactNode);
  }
  return '';
}

// ── Mermaid 代码块 ────────────────────────────────────────
const MermaidBlock = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled || !ref.current) return;
      const isDark = document.documentElement.classList.contains('dark');
      mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'default', securityLevel: 'loose', fontFamily: 'inherit' });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      mermaid.render(id, code)
        .then(({ svg }) => { if (!cancelled && ref.current) ref.current.innerHTML = svg; })
        .catch((e: Error) => { if (!cancelled && ref.current) ref.current.innerHTML = `<pre class="text-xs text-rose-500 p-2">Mermaid 渲染失败：${e.message}</pre>`; });
    });
    return () => { cancelled = true; };
  }, [code]);
  return <div className="not-prose my-4 flex justify-center bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto" ref={ref} />;
};

// ── 带语言徽章 + 复制按钮的高亮代码块 ───────────────────
// children 是 rehype-highlight 处理后的 React 节点树（保留 <span> 高亮标记）
const HighlightedBlock = ({ lang, children }: { lang?: string; children: ReactNode }) => {
  const [copied, setCopied] = useState(false);
  const { display, color } = getLangMeta(lang);

  const handleCopy = async () => {
    try {
      // 从 <pre><code>...spans...</code></pre> 中提取纯文本
      const text = extractText(children).replace(/\n$/, '');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative group not-prose my-4">
      {/* 语言标签栏 */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-t-lg bg-slate-800 dark:bg-slate-950 border-b border-white/5">
        {lang ? (
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold font-mono tracking-wide rounded px-2 py-0.5"
            style={{ background: color.bg, color: color.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color.dot }} />
            {display}
          </span>
        ) : <span />}
        <button
          onClick={handleCopy}
          aria-label={copied ? '已复制' : '复制代码'}
          className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
        >
          {copied
            ? <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">已复制</span></>
            : <><Copy className="h-3 w-3" /><span>复制</span></>
          }
        </button>
      </div>
      {/* 代码区：直接透传 children，保留 rehype-highlight 生成的 <span> 高亮节点 */}
      <pre className="!bg-slate-900 dark:!bg-slate-950 !rounded-t-none text-slate-100 rounded-b-lg !p-4 overflow-x-auto text-sm leading-relaxed !mt-0">
        {children}
      </pre>
    </div>
  );
};

// ── 内容分段（处理 :::code-group ... ::: 块）────────────
type Segment =
  | { type: 'md'; text: string }
  | { type: 'codegroup'; tabs: CodeTab[] };

function splitSegments(md: string): Segment[] {
  const segments: Segment[] = [];
  const pattern = /:::[ \t]*code-group[ \t]*\n([\s\S]*?)\n:::/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(md)) !== null) {
    const before = md.slice(lastIndex, match.index);
    if (before) segments.push({ type: 'md', text: before });

    const tabs: CodeTab[] = [];
    const re = /```(\w+)(?:\s+\[([^\]]+)\])?\n([\s\S]*?)```/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(match[1])) !== null) {
      tabs.push({ lang: m[1], label: m[2] || undefined, code: m[3].trimEnd() });
    }
    if (tabs.length) segments.push({ type: 'codegroup', tabs });
    lastIndex = match.index + match[0].length;
  }

  const rest = md.slice(lastIndex);
  if (rest) segments.push({ type: 'md', text: rest });
  return segments.length ? segments : [{ type: 'md', text: md }];
}

// ── ReactMarkdown 插件 & 组件配置 ────────────────────────
const MD_PLUGINS = {
  remarkPlugins: [remarkGfm, remarkMath] as Parameters<typeof ReactMarkdown>[0]['remarkPlugins'],
  rehypePlugins: [rehypeSlug, rehypeHighlight, rehypeKatex] as Parameters<typeof ReactMarkdown>[0]['rehypePlugins'],
};

const MD_COMPONENTS: Parameters<typeof ReactMarkdown>[0]['components'] = {
  pre: ({ children }) => {
    // children = <code class="language-xxx hljs">...highlighted spans...</code>
    const codeEl = (children as React.ReactElement)?.props as {
      className?: string;
      children?: ReactNode;
    } | undefined;
    const className = codeEl?.className ?? '';
    const lang = className.match(/language-(\w+)/)?.[1];

    if (lang === 'mermaid') {
      return <MermaidBlock code={extractText(codeEl?.children)} />;
    }

    // 将整个 <pre> 的 children 传入 HighlightedBlock（保留高亮 span 树）
    return <HighlightedBlock lang={lang}>{children}</HighlightedBlock>;
  },
  code: ({ className, children, ...rest }) => {
    if (!className) {
      return (
        <code
          className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-100 dark:bg-slate-800 text-pink-600 dark:text-pink-400 text-[0.875em] font-mono"
          {...rest}
        >
          {children}
        </code>
      );
    }
    return <code className={className} {...rest}>{children}</code>;
  },
};

const MarkdownRenderer = ({ content }: Props) => {
  const segments = splitSegments(content);
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:before:hidden prose-code:after:hidden">
      {segments.map((seg, i) =>
        seg.type === 'codegroup'
          ? <CodeGroup key={i} tabs={seg.tabs} />
          : <ReactMarkdown key={i} {...MD_PLUGINS} components={MD_COMPONENTS}>{seg.text}</ReactMarkdown>
      )}
    </article>
  );
};

export default MarkdownRenderer;
