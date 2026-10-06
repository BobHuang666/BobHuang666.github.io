/**
 * 奖项时间格式化：根据有无月/日，输出三种合法格式之一
 *   - 仅年份        → "2026"
 *   - 年 + 月       → "2026.10"
 *   - 年 + 月 + 日  → "2026.10.06"
 * 月、日缺省时自动补零到两位；仅有日而无月时不展示日。
 */
export const formatAwardDate = (
  year: string,
  month?: string,
  day?: string,
): string => {
  const m = month ? month.padStart(2, '0') : '';
  const d = day ? day.padStart(2, '0') : '';
  if (m && d) return `${year}.${m}.${d}`;
  if (m) return `${year}.${m}`;
  return year;
};

interface AwardDateLike {
  year: string;
  month?: string;
  day?: string;
}

/**
 * 时间降序比较：先按年份降序，再按月份降序，最后按日期降序。
 * 规则：仅有月份无日期的项，排在同月「有日期」项的前面（视为该月日期最大）。
 * 无月份的项排在最后。用 32 作哨兵避免 Infinity - Infinity 产生 NaN。
 */
export const compareAwardDateDesc = (a: AwardDateLike, b: AwardDateLike): number => {
  const ya = +a.year;
  const yb = +b.year;
  if (yb !== ya) return yb - ya;
  const ma = a.month ? parseInt(a.month, 10) : 0;
  const mb = b.month ? parseInt(b.month, 10) : 0;
  if (mb !== ma) return mb - ma;
  const da = a.day ? parseInt(a.day, 10) : a.month ? 32 : 0;
  const db = b.day ? parseInt(b.day, 10) : b.month ? 32 : 0;
  return db - da;
};
