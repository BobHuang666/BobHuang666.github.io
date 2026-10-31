/** 路由切换的滚动位置恢复策略 */
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 以「路径+查询」作为页面标识保存滚动位置。
// 不用 location.key：HashRouter 对浏览器侧发起的 hash 变化（裸锚点点击、后退、
// location.hash 赋值）会复用当前 key，依赖 key 会让 effect 不触发——
// 表现为这类导航既不回顶也不恢复位置，且不同页面互相覆盖滚动记录。
const scrollMap = new Map<string, number>();

export default function ScrollRestoration() {
  const { pathname, search } = useLocation();
  const navType = useNavigationType();
  const pageKey = `${pathname}?${search}`;

  // 监听滚动，持续更新当前页面（按路径标识）的位置
  useEffect(() => {
    const save = () => scrollMap.set(pageKey, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [pageKey]);

  // 路由切换时：POP 恢复该页上次位置，其他情况回到顶部
  useEffect(() => {
    if (navType !== 'POP') {
      // 全局 CSS 设了 scroll-behavior: smooth，不带 behavior 的 scrollTo 会变成平滑动画；
      // 首次进入懒加载路由时骨架→真实内容的高度突变会中断动画，导致偶发停在半路，
      // 因此必须用 instant 瞬时回顶。
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const y = scrollMap.get(pageKey) ?? 0;
    // effect 在 DOM 提交后执行，instant 直接落位（不依赖 rAF，避免被节流环境卡住）
    window.scrollTo({ top: y, behavior: 'instant' });
    if (y <= window.scrollY) return;

    // 目标位置超过当前页高：懒加载内容尚未挂载，浏览器把滚动钳制在骨架高度。
    // 轮询等页面长高后对齐到目标；期间用户主动滚动（位置漂移）则立即停手。
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const clamped = Math.min(y, max);
      if (Math.abs(window.scrollY - clamped) > 2) {
        clearInterval(timer);
        return;
      }
      window.scrollTo({ top: clamped, behavior: 'instant' });
      if (clamped >= y || tries > 25) clearInterval(timer);
    }, 120);
    return () => clearInterval(timer);
  }, [pageKey, navType]);

  return null;
}
