import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Chip } from '@/shared/components/ui/Chip';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { StatPill as SharedStatPill } from '@/shared/components/ui/StatPill';


const TONE_MAP: Record<string, { text: string; gradient: string }> = {
  rose: { text: 'text-rose-500', gradient: 'from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40' },
  amber: { text: 'text-amber-500', gradient: 'from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40' },
  fuchsia: { text: 'text-fuchsia-500', gradient: 'from-fuchsia-100 to-pink-100 dark:from-fuchsia-950/40 dark:to-pink-950/40' },
  indigo: { text: 'text-indigo-500', gradient: 'from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40' },
};

/** 统计胶囊：视觉实现在共享层，这里只负责页面主题色映射 */
export const StatPill = ({
  icon, value, label, tone,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone: keyof typeof TONE_MAP;
}) => (
  <SharedStatPill
    icon={icon}
    value={value}
    label={label}
    textClass={TONE_MAP[tone].text}
    gradientClass={TONE_MAP[tone].gradient}
  />
);

export const SubHeading = ({
  icon: Icon, text, count,
}: {
  icon: LucideIcon;
  text: string;
  count?: number;
}) => (
  <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 mb-4">
    <Icon className="h-5 w-5 text-rose-500" />
    {text}
    {count !== undefined && <span className="text-xs font-normal text-slate-400 dark:text-slate-500">× {count}</span>}
  </h3>
);

/** 分类筛选胶囊（复用共享 Chip，固定 rose 主题） */
export const FilterChip = ({
  active, onClick, children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) => (
  <Chip active={active} tone="rose" onClick={onClick} className="px-3 py-1.5">
    {children}
  </Chip>
);

/** 数据为空时的占位：统一提示去 fandom.ts 补数据 */
export const FandomEmptyState = ({ icon, text }: { icon: LucideIcon; text: string }) => (
  <EmptyState
    icon={icon}
    title={text}
    className="py-16"
    hint={
      <>
        去 fandom.ts 补充数据 <ChevronRight className="h-3 w-3" />
      </>
    }
  />
);
