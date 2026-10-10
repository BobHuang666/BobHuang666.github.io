/** 点分隔短日期，如 2026.10.07 */
export const fmtDate = (d: string) => {
  const dt = new Date(d);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

/** 距今天数（负数表示已过去） */
export const daysUntil = (d: string) =>
  Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
