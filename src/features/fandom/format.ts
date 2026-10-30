/**
 * 把 ISO 日期按本地零点解析。
 * `new Date('2026-10-11')` 这类纯日期串会被当作 UTC 零点，在东八区
 * 等于当天 08:00，倒计时会提前 8 小时归零，所以手动拆年月日。
 */
export const parseLocalDate = (d: string) => {
  // 已带时间 / 时区的字符串（如 '2026-10-11T19:30:00+08:00'）交给 Date 原样处理
  if (d.includes('T')) return new Date(d);
  const [y, m, day] = d.split('-').map(Number);
  return new Date(y, (m || 1) - 1, day || 1);
};

/** 点分隔短日期，如 2026.10.07 */
export const fmtDate = (d: string) => {
  const dt = parseLocalDate(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

/** 本地「今天」的零点，用于按自然日比较 */
const startOfToday = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/** 距今天数 */
export const daysUntil = (d: string) =>
  Math.round((parseLocalDate(d).getTime() - startOfToday().getTime()) / 86_400_000);

/** 是否尚未开始 */
export const isUpcoming = (d: string) => daysUntil(d) >= 0;
