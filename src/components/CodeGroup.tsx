import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { getLangMeta } from './CodeBlock';

export interface CodeTab {
  lang: string;
  code: string;
  /** 可选覆盖显示名，如 "config.ts" */
  label?: string;
}

interface CodeGroupProps {
  tabs: CodeTab[];
}

/**
 * 多语言代码块切换组件
 * 在 Markdown 中通过 :::code-group ... ::: 语法使用
 */
const CodeGroup = ({ tabs }: CodeGroupProps) => {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!tabs.length) return null;

  const cur = tabs[active];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cur.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="not-prose my-4 rounded-xl overflow-hidden border border-white/5 shadow-sm">
      {/* Tab 栏 */}
      <div className="flex items-center bg-slate-800 dark:bg-slate-950 overflow-x-auto scrollbar-none">
        {tabs.map((tab, i) => {
          const { display, color } = getLangMeta(tab.lang);
          const label = tab.label ?? display;
          const isActive = i === active;
          return (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 text-[12px] font-mono font-medium whitespace-nowrap
                border-b-2 transition-colors shrink-0
                ${isActive
                  ? 'border-indigo-400 text-slate-100 bg-slate-900/50'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5'}
              `}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: isActive ? color.dot : '#64748b' }}
              />
              {label}
            </button>
          );
        })}

        {/* 右侧复制按钮 */}
        <button
          onClick={handleCopy}
          aria-label={copied ? '已复制' : '复制代码'}
          className="ml-auto mr-2 flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors shrink-0"
        >
          {copied
            ? <><Check className="h-3 w-3 text-emerald-400" /><span className="text-emerald-400">已复制</span></>
            : <><Copy className="h-3 w-3" /><span>复制</span></>
          }
        </button>
      </div>

      {/* 代码区 */}
      <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 overflow-x-auto text-sm leading-relaxed m-0 rounded-none">
        <code>{cur.code}</code>
      </pre>
    </div>
  );
};

export default CodeGroup;
