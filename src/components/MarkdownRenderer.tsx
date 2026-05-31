import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { CodeBlock } from './CodeBlock';

interface Props {
  content: string;
}

/** Mermaid 代码块组件 —— 异步加载 mermaid */
const MermaidBlock = ({ code }: { code: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then(({ default: mermaid }) => {
      if (cancelled || !ref.current) return;
      const isDark = document.documentElement.classList.contains('dark');
      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'inherit',
      });
      const id = `mermaid-${Math.random().toString(36).slice(2)}`;
      mermaid
        .render(id, code)
        .then(({ svg }) => {
          if (!cancelled && ref.current) ref.current.innerHTML = svg;
        })
        .catch((e: Error) => {
          if (!cancelled && ref.current) {
            ref.current.innerHTML = `<pre class="text-xs text-rose-500 p-2">Mermaid 渲染失败：${e.message}</pre>`;
          }
        });
    });
    return () => { cancelled = true; };
  }, [code]);

  return (
    <div className="not-prose my-4 flex justify-center bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-auto" ref={ref} />
  );
};

const MarkdownRenderer = ({ content }: Props) => {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:before:hidden prose-code:after:hidden">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeSlug, rehypeHighlight, rehypeKatex]}
        components={{
          pre: ({ children }) => {
            const codeEl = (children as { props?: { className?: string; children?: string } })?.props;
            const className = codeEl?.className ?? '';
            const lang = className.match(/language-(\w+)/)?.[1];
            const code = String(codeEl?.children ?? '').replace(/\n$/, '');
            if (lang === 'mermaid') return <MermaidBlock code={code} />;
            return <CodeBlock code={code} className={className} language={lang} />;
          },
          code: ({ className, children, ...rest }) => {
            const isInline = !className;
            if (isInline) {
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
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};

export default MarkdownRenderer;
