import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// 用 location.key 作为唯一标识保存各页面滚动位置
const scrollMap = new Map<string, number>();

export default function ScrollRestoration() {
  const { key } = useLocation();
  const navType = useNavigationType();

  // 监听滚动，持续更新当前 key 对应的位置
  useEffect(() => {
    const save = () => scrollMap.set(key, window.scrollY);
    window.addEventListener('scroll', save, { passive: true });
    return () => window.removeEventListener('scroll', save);
  }, [key]);

  // 路由切换时：POP 恢复位置，其他情况回到顶部
  useEffect(() => {
    if (navType === 'POP') {
      const y = scrollMap.get(key) ?? 0;
      // rAF 确保 DOM 已更新后再滚动
      requestAnimationFrame(() => window.scrollTo(0, y));
    } else {
      window.scrollTo(0, 0);
    }
  }, [key, navType]);

  return null;
}
