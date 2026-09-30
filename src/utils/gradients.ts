/**
 * 全站渐变色板 —— Tailwind 类名的唯一存放处。
 *
 * 数据层只保存语义名 GradientTone（如 `tone: 'amber'`），
 * 由组件层调用 gradient() 换取真实类名。
 * 这样数据文件不再和 Tailwind 耦合：换主题、升级 Tailwind、调整配色都只改本文件。
 */
export const GRADIENT = {
  // ── 双色：奖项徽章 / 技能进度条 ──────────────────────────
  indigo: 'from-indigo-500 to-purple-500',
  amber: 'from-yellow-500 to-amber-500',
  violet: 'from-purple-500 to-pink-500',
  cyanBlue: 'from-cyan-500 to-blue-500',
  blueIndigo: 'from-blue-500 to-indigo-500',
  emeraldTeal: 'from-emerald-500 to-teal-500',
  rose: 'from-rose-500 to-pink-500',
  indigoBlue: 'from-indigo-500 to-blue-500',
  orange: 'from-amber-500 to-orange-500',
  violetPurple: 'from-violet-500 to-purple-500',
  red: 'from-red-500 to-rose-500',
  green: 'from-green-500 to-emerald-500',
  tealCyan: 'from-teal-500 to-cyan-500',
  pink: 'from-pink-500 to-rose-500',
  blueBold: 'from-blue-500 to-blue-600',
  yellowBold: 'from-yellow-500 to-yellow-600',
  blueSoft: 'from-blue-400 to-blue-500',
  yellowSoft: 'from-yellow-400 to-yellow-500',
  cyanBold: 'from-cyan-500 to-cyan-600',
  greenEmerald: 'from-green-500 to-emerald-600',
  tealCyanBold: 'from-teal-500 to-cyan-600',
  orangeBold: 'from-orange-500 to-orange-600',
  purpleBold: 'from-purple-500 to-purple-600',
  gray: 'from-gray-500 to-gray-600',
  indigoBold: 'from-indigo-500 to-indigo-600',
  greenBold: 'from-green-500 to-green-600',
  pinkRose: 'from-pink-500 to-rose-600',
  emeraldTealBold: 'from-emerald-500 to-teal-600',

  // ── 三色：封面 / 大卡片 ─────────────────────────────────
  cardEmerald: 'from-emerald-500 via-teal-500 to-cyan-600',
  cardIndigo: 'from-indigo-500 via-purple-500 to-pink-500',
  cardAmber: 'from-amber-500 via-orange-500 to-rose-500',
  cardSky: 'from-sky-500 via-blue-500 to-indigo-600',
  sunsetPink: 'from-pink-500 via-rose-500 to-amber-400',
  fuchsiaRose: 'from-rose-500 via-pink-500 to-fuchsia-500',
  indigoViolet: 'from-indigo-500 via-violet-500 to-purple-500',
  sunsetAmber: 'from-amber-400 via-yellow-500 to-orange-500',
  fuchsiaRoseBold: 'from-fuchsia-500 via-pink-500 to-rose-500',
  skyTeal: 'from-sky-500 via-cyan-500 to-teal-500',
  indigoVioletBold: 'from-indigo-500 to-violet-500',
  mintCyan: 'from-emerald-500 to-cyan-500',
  mintGreen: 'from-emerald-500 to-green-500',
  slate: 'from-slate-500 to-slate-600',
} as const;

/** 数据层使用的渐变语义名 */
export type GradientTone = keyof typeof GRADIENT;

/** 缺省渐变 */
export const DEFAULT_TONE: GradientTone = 'indigo';

/** 取渐变类名；未指定或非法时回落缺省值 */
export function gradient(tone?: GradientTone): string {
  return GRADIENT[tone ?? DEFAULT_TONE];
}
