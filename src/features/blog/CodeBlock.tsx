import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  className?: string;
  language?: string;
}

// 语言展示名映射
const LANG_DISPLAY: Record<string, string> = {
  js: 'JavaScript', javascript: 'JavaScript',
  ts: 'TypeScript', typescript: 'TypeScript',
  jsx: 'JSX', tsx: 'TSX',
  py: 'Python', python: 'Python',
  go: 'Go',
  rs: 'Rust', rust: 'Rust',
  cpp: 'C++', c: 'C',
  java: 'Java',
  css: 'CSS', scss: 'SCSS', sass: 'Sass',
  html: 'HTML',
  bash: 'Bash', sh: 'Shell', shell: 'Shell',
  zsh: 'Zsh',
  sql: 'SQL',
  json: 'JSON',
  yaml: 'YAML', yml: 'YAML',
  toml: 'TOML',
  md: 'Markdown', markdown: 'Markdown',
  vue: 'Vue',
  swift: 'Swift',
  kotlin: 'Kotlin',
  diff: 'Diff',
  text: 'Text', txt: 'Text',
};

// 语言对应的颜色主题
const LANG_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  js: { bg: 'rgba(234,179,8,0.18)', text: '#fde68a', dot: '#f59e0b' },
  javascript: { bg: 'rgba(234,179,8,0.18)', text: '#fde68a', dot: '#f59e0b' },
  ts: { bg: 'rgba(59,130,246,0.18)', text: '#93c5fd', dot: '#3b82f6' },
  typescript: { bg: 'rgba(59,130,246,0.18)', text: '#93c5fd', dot: '#3b82f6' },
  jsx: { bg: 'rgba(6,182,212,0.18)', text: '#a5f3fc', dot: '#06b6d4' },
  tsx: { bg: 'rgba(6,182,212,0.18)', text: '#a5f3fc', dot: '#06b6d4' },
  python: { bg: 'rgba(99,102,241,0.18)', text: '#c7d2fe', dot: '#818cf8' },
  py: { bg: 'rgba(99,102,241,0.18)', text: '#c7d2fe', dot: '#818cf8' },
  go: { bg: 'rgba(14,165,233,0.18)', text: '#7dd3fc', dot: '#0ea5e9' },
  rust: { bg: 'rgba(249,115,22,0.18)', text: '#fed7aa', dot: '#f97316' },
  rs: { bg: 'rgba(249,115,22,0.18)', text: '#fed7aa', dot: '#f97316' },
  cpp: { bg: 'rgba(139,92,246,0.18)', text: '#ddd6fe', dot: '#8b5cf6' },
  c: { bg: 'rgba(139,92,246,0.18)', text: '#ddd6fe', dot: '#8b5cf6' },
  java: { bg: 'rgba(239,68,68,0.18)', text: '#fca5a5', dot: '#ef4444' },
  css: { bg: 'rgba(236,72,153,0.18)', text: '#fbcfe8', dot: '#ec4899' },
  scss: { bg: 'rgba(236,72,153,0.18)', text: '#fbcfe8', dot: '#ec4899' },
  html: { bg: 'rgba(249,115,22,0.18)', text: '#fed7aa', dot: '#f97316' },
  bash: { bg: 'rgba(34,197,94,0.18)', text: '#bbf7d0', dot: '#22c55e' },
  sh: { bg: 'rgba(34,197,94,0.18)', text: '#bbf7d0', dot: '#22c55e' },
  shell: { bg: 'rgba(34,197,94,0.18)', text: '#bbf7d0', dot: '#22c55e' },
  sql: { bg: 'rgba(234,179,8,0.18)', text: '#fde68a', dot: '#eab308' },
  json: { bg: 'rgba(148,163,184,0.18)', text: '#cbd5e1', dot: '#94a3b8' },
  yaml: { bg: 'rgba(16,185,129,0.18)', text: '#a7f3d0', dot: '#10b981' },
  yml: { bg: 'rgba(16,185,129,0.18)', text: '#a7f3d0', dot: '#10b981' },
  vue: { bg: 'rgba(52,211,153,0.18)', text: '#a7f3d0', dot: '#34d399' },
  diff: { bg: 'rgba(148,163,184,0.15)', text: '#cbd5e1', dot: '#94a3b8' },
};

function getLangMeta(lang?: string) {
  const key = (lang ?? '').toLowerCase();
  return {
    display: LANG_DISPLAY[key] ?? key.toUpperCase(),
    color: LANG_COLORS[key] ?? { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', dot: '#64748b' },
  };
}

export const CodeBlock = ({ code, className = '', language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const { display, color } = getLangMeta(language);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative group not-prose my-4">
      {/* 语言标签栏 */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-t-lg bg-slate-800 dark:bg-slate-950 border-b border-white/5">
        {language ? (
          <span
            className="flex items-center gap-1.5 text-[11px] font-semibold font-mono tracking-wide rounded px-2 py-0.5"
            style={{ background: color.bg, color: color.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color.dot }} />
            {display}
          </span>
        ) : (
          <span />
        )}
        {/* 复制按钮 */}
        <button
          type="button"
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

      <pre
        className={`${className} !bg-slate-900 dark:!bg-slate-950 !rounded-t-none text-slate-100 rounded-b-lg p-4 overflow-x-auto text-sm leading-relaxed !mt-0`}
      >
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
};

export { getLangMeta };
