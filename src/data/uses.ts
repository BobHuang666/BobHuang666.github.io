import { Laptop, Code2, Terminal, Layers, Music } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface UsesItem {
  /** 用途标签（中文） */
  name: string;
  /** 具体内容 */
  value: string;
}

export interface UsesCategory {
  /** i18n key, e.g. "uses.hardware" */
  titleKey: string;
  icon: LucideIcon;
  items: UsesItem[];
}

/** /uses 装备清单 —— 直接在这里修改 */
export const usesCategories: UsesCategory[] = [
  {
    titleKey: 'uses.hardware',
    icon: Laptop,
    items: [
      { name: '笔记本', value: '待补充（如：MacBook Pro M3）' },
      { name: '显示器', value: '待补充' },
      { name: '键盘', value: '待补充' },
      { name: '鼠标', value: '待补充' },
      { name: '耳机', value: '待补充' },
    ],
  },
  {
    titleKey: 'uses.devtools',
    icon: Code2,
    items: [
      { name: '编辑器', value: 'VS Code · Cursor · WebStorm' },
      { name: '终端', value: 'iTerm2 · Zsh + Oh My Zsh' },
      { name: '版本管理', value: 'Git · GitHub · 工蜂' },
      { name: '调试', value: 'Chrome DevTools · Postman' },
      { name: 'AI 助手', value: 'ChatGPT · Claude · CodeBuddy' },
    ],
  },
  {
    titleKey: 'uses.cli',
    icon: Terminal,
    items: [
      { name: '包管理', value: 'npm · pnpm · brew' },
      { name: '导航', value: 'fzf · ripgrep · fd' },
      { name: '进程查看', value: 'htop · lsof' },
      { name: '文件传输', value: 'rsync · scp' },
    ],
  },
  {
    titleKey: 'uses.stack',
    icon: Layers,
    items: [
      { name: '前端框架', value: 'Vue 3 / React 18' },
      { name: '样式方案', value: 'Tailwind CSS / SCSS' },
      { name: '构建工具', value: 'Vite · uni-app' },
      { name: '后端语言', value: 'Go / Python' },
      { name: '数据库', value: 'MySQL · SQLite' },
    ],
  },
  {
    titleKey: 'uses.other',
    icon: Music,
    items: [
      { name: '笔记', value: 'Notion · Obsidian' },
      { name: '设计', value: 'Figma' },
      { name: '音乐', value: 'Apple Music / 网易云' },
    ],
  },
];

/** 分类标题的中文 fallback（i18n 未命中时使用） */
export const usesTitleFallback: Record<string, string> = {
  'uses.hardware': '硬件',
  'uses.devtools': '开发工具',
  'uses.cli': '常用命令行',
  'uses.stack': '技术栈偏好',
  'uses.other': '其他',
};
