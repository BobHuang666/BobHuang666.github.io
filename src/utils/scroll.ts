/** 平滑滚动到页面内的锚点（元素不存在时静默跳过） */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
