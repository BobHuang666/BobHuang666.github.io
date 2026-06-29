import { Code2, BookOpen, Sparkles, Coffee } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NowSection {
  /** i18n key, e.g. "now.sec_code" */
  titleKey: string;
  icon: LucideIcon;
  items: string[];
}

/** 最后更新日期 */
export const nowLastUpdated = '2026-06-29';

/** /now 页面各区块内容 —— 直接在这里修改即可 */
export const nowSections: NowSection[] = [
  {
    titleKey: 'now.sec_code',
    icon: Code2,
    items: [
      '腾讯 CDG 前端实习中（合规范围内的内容后续会公开分享）',
      '个人网站持续迭代 —— 你正在看的就是产物',
      '算法每日一题：保持 LeetCode 在线，准备秋招',
    ],
  },
  {
    titleKey: 'now.sec_reading',
    icon: BookOpen,
    items: [
      '《Designing Data-Intensive Applications》——大数据方向必读',
      '大模型相关论文 + LangChain / RAG 实践',
    ],
  },
  {
    titleKey: 'now.sec_doing',
    icon: Sparkles,
    items: [
      'BNUZH 程序设计竞赛社 社长 —— 组织周赛 / 算法讲堂',
      '准备秋招 / 春招实习',
      '骑迹智联 VR 装置 大创课题持续推进中',
    ],
  },
  {
    titleKey: 'now.sec_life',
    icon: Coffee,
    items: [
      '在珠海，偶尔回潮州、北京',
      '咖啡 / 旅行 / 追星',
    ],
  },
];
