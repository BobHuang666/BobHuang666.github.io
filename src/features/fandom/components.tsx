import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Chip } from '../../shared/components/ui/Chip';
import { EmptyState } from '../../shared/components/ui/EmptyState';

/** fandom 各 Tab 共用的展示原子 */

const TONE_MAP: Record<string, string> = {
  rose: 'text-rose-500 from-rose-100 to-pink-100 dark:from-rose-950/40 dark:to-pink-950/40',
  amber: 'text-amber-500 from-amber-100 to-orange-100 dark:from-amber-950/40 dark:to-orange-950/40',
  fuchsia: 'text-fuchsia-500 from-fuchsia-100 to-pink-100 dark:from-fuchsia-950/40 dark:to-pink-950/40',
  indigo: 'text-indigo-500 from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40',
};

export const StatPill = ({
  icon: Icon, value, label, tone,
}: {
  icon: LucideIcon;
  value: string | number;
  label: string;
  tone: keyof typeof TONE_MAP;
}) => (
  <div className={`rounded-2xl border border-white/60 dark:border-slate-800 bg-gradient-to-br ${TONE_MAP[tone]} p-3.5 flex items-center gap-3`}>
    <span className="shrink-0 grid place-items-center w-9 h-9 rounded-xl bg-white/70 dark:bg-slate-900/60">
      <Icon className={`h-5 w-5 ${TONE_MAP[tone].split(' ')[0]}`} />
    </span>
    <div className="min-w-0">
      <div className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">{value}</div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">{label}</div>
    </div>
  </div>
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
