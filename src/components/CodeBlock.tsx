import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  className?: string;
  language?: string;
}

export const CodeBlock = ({ code, className = '', language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="relative group not-prose my-4">
      {language && (
        <span className="absolute top-2 left-3 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          {language}
        </span>
      )}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? '已复制' : '复制代码'}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/70 hover:bg-slate-600 text-slate-200 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100"
      >
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre
        className={`${className} !bg-slate-900 dark:!bg-slate-950 text-slate-100 rounded-lg p-4 pt-7 overflow-x-auto text-sm leading-relaxed`}
      >
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
};
