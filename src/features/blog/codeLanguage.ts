/**
 * 代码块的「语言 → 展示元数据」映射。
 *
 * 只被 Markdown 渲染链路（MarkdownRenderer / CodeGroup）消费，
 * 与数据层、共享组件层无关，因此放在 blog feature 内而不是 utils。
 */

/** 语言展示名映射 */
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

/** 语言对应的徽章配色 */
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

const FALLBACK_COLOR = { bg: 'rgba(148,163,184,0.15)', text: '#94a3b8', dot: '#64748b' };

/** 取语言展示名与徽章配色；未知语言回落到大写原名 + 中性灰 */
export function getLangMeta(lang?: string) {
  const key = (lang ?? '').toLowerCase();
  return {
    display: LANG_DISPLAY[key] ?? key.toUpperCase(),
    color: LANG_COLORS[key] ?? FALLBACK_COLOR,
  };
}
