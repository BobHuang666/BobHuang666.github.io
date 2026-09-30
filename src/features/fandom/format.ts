/** 中文长日期，如 2024年8月10日 */
export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

/** 距今天数（负数表示已过去） */
export const daysUntil = (d: string) =>
  Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
