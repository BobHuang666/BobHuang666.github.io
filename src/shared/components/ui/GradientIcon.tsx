import type { LucideIcon } from 'lucide-react';
import { gradient, type GradientTone } from '../../../utils/gradients';

const SIZE_MAP = {
  sm: { box: 'w-9 h-9', icon: 'h-4 w-4' },
  md: { box: 'w-11 h-11', icon: 'h-5 w-5' },
} as const;

interface Props {
  icon: LucideIcon;
  /** 渐变语义名，缺省回落 indigo */
  tone?: GradientTone;
  size?: keyof typeof SIZE_MAP;
  className?: string;
}

/** 渐变底 + 白色图标的小方块（奖项、成就等徽章） */
export const GradientIcon = ({ icon: Icon, tone, size = 'md', className = '' }: Props) => {
  const s = SIZE_MAP[size];
  return (
    <div
      className={`shrink-0 ${s.box} rounded-lg bg-gradient-to-br ${gradient(tone)} flex items-center justify-center ${className}`}
    >
      <Icon className={`${s.icon} text-white`} />
    </div>
  );
};
