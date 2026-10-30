/** 数据层图标名 → lucide 组件的解析表 */
import {
  Trophy, Award, BookOpen, Brain, Code2, Users, Star, Medal,
  Globe, Database, Shield, Heart, Github, Music, Plane, Gamepad2,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Trophy, Award, BookOpen, Brain, Code2, Users, Star, Medal,
  Globe, Database, Shield, Heart, Github, Music, Plane, Gamepad2,
};

/** 解析数据层的图标名称，找不到时回落 fallback */
export function resolveIcon(name: string | undefined, fallback: LucideIcon = Code2): LucideIcon {
  return (name && ICON_MAP[name]) || fallback;
}
