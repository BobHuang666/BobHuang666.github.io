import { useEffect, useRef, useState } from 'react';

/**
 * 元素首次进入视口时返回 true，之后不再改变（one-shot）
 * 用于延迟触发网络请求、动画等耗性能操作
 */
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '200px', ...options },
    );
    obs.observe(el);
    return () => obs.disconnect();
    // options 为调用方传入的字面量，不应纳入依赖（避免无限重建）
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
