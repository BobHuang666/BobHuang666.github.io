import {
  Trophy, Award, BookOpen, Brain, Code2, Users, Star, Medal,
  Globe, Database, Shield,
  type LucideIcon,
} from 'lucide-react';

/**
 * 数据层 icon 字符串 → lucide 组件。
 * 数据层只存图标名称（IconName），不引入 lucide 依赖；
 * 组件层统一通过 resolveIcon() 解析，避免各处重复声明映射表。
 */
const ICON_MAP: Record<string, LucideIcon> = {
  Trophy, Award, BookOpen, Brain, Code2, Users, Star, Medal,
  Globe, Database, Shield,
};

/** 解析数据层的图标名称，找不到时用 fallback（默认 Code2） */
export function resolveIcon(name: string | undefined, fallback: LucideIcon = Code2): LucideIcon {
  return (name && ICON_MAP[name]) || fallback;
}
