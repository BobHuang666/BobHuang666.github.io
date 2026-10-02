import {
  Plane, Train, Car, Bus, Ship,
  type LucideIcon,
} from 'lucide-react';
import type { PlaceStatus, TransportMode } from '../../types';

/**
 * 交通方式 → 展示元数据。
 * 数据层只存 transport key，图标 / 颜色 / 线型 / 弧线曲率都在这里映射。
 */
export const TRANSPORT_META: Record<
  TransportMode,
  {
    label: string;
    icon: LucideIcon;
    /** SVG 描边色：明暗模式下都用同一套，因此选中间明度 */
    color: string;
    /** stroke-dasharray */
    dash: string;
    /** 弧线鼓起程度：飞机大弧、地面交通贴地小弧 */
    curvature: number;
  }
> = {
  plane: { label: '飞机', icon: Plane, color: '#6366f1', dash: '', curvature: 0.24 },
  train: { label: '火车', icon: Train, color: '#0ea5e9', dash: '', curvature: 0.1 },
  car: { label: '自驾', icon: Car, color: '#f59e0b', dash: '6 3', curvature: 0.13 },
  bus: { label: '大巴', icon: Bus, color: '#10b981', dash: '5 4', curvature: 0.13 },
  ship: { label: '轮渡', icon: Ship, color: '#06b6d4', dash: '2 3', curvature: 0.18 },
};

/**
 * 足迹状态 → 展示元数据。
 * fill / stroke 用 Tailwind 的 fill-* / stroke-* 工具类，自动跟随暗色模式。
 */
export const PLACE_STATUS_META: Record<
  PlaceStatus,
  { label: string; fill: string; marker: string; badge: string; order: number }
> = {
  lived: {
    label: '住过',
    fill: 'fill-indigo-400 dark:fill-indigo-500',
    marker: 'text-indigo-500 dark:text-indigo-400',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300',
    order: 0,
  },
  visited: {
    label: '去过',
    fill: 'fill-emerald-300 dark:fill-emerald-600',
    marker: 'text-emerald-500 dark:text-emerald-400',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    order: 1,
  },
  transit: {
    label: '途经',
    fill: 'fill-amber-200 dark:fill-amber-700',
    marker: 'text-amber-500 dark:text-amber-400',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    order: 2,
  },
  wishlist: {
    label: '想去',
    fill: 'fill-slate-200 dark:fill-slate-800',
    marker: 'text-slate-400 dark:text-slate-500',
    badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    order: 3,
  },
};

/** 未留下足迹的行政区底色 */
export const NEUTRAL_FILL = 'fill-slate-100 dark:fill-slate-900';

/** 行政区划代码前两位 → 省级名称，用于「已点亮 N 个省级行政区」统计 */
const PROVINCE_BY_PREFIX: Record<string, string> = {
  '11': '北京', '12': '天津', '13': '河北', '14': '山西', '15': '内蒙古',
  '21': '辽宁', '22': '吉林', '23': '黑龙江', '31': '上海', '32': '江苏',
  '33': '浙江', '34': '安徽', '35': '福建', '36': '江西', '37': '山东',
  '41': '河南', '42': '湖北', '43': '湖南', '44': '广东', '45': '广西',
  '46': '海南', '50': '重庆', '51': '四川', '52': '贵州', '53': '云南',
  '54': '西藏', '61': '陕西', '62': '甘肃', '63': '青海', '64': '宁夏',
  '65': '新疆', '71': '台湾', '81': '香港', '82': '澳门',
};

export function provinceOf(adcode: number): string {
  return PROVINCE_BY_PREFIX[String(adcode).slice(0, 2)] ?? '其他';
}

/** 规范名：去掉行政区后缀，便于「北京」匹配「北京市」 */
export function normalizeCityName(name: string): string {
  return name.replace(/(市|自治州|地区|盟|特别行政区|自治区)$/g, '');
}
