/** 双向同步两个横向滚动容器的 Hook */
import { useCallback, useRef } from 'react';

/**
 * 同步两个可横向滚动容器的滚动位置（如顶部与底部 Tab 栏）。
 * 当用户在一个容器上左右滑动（窄屏溢出时），另一个容器的滚动位置同步跟随。
 *
 * 通过「目标位置相等即返回」来阻断相互触发造成的死循环：
 * 设置 to.scrollLeft 会触发 to 的 scroll 事件，此时 to 与 from 的 scrollLeft 已经相等，直接 return。
 */
export function useSyncedScroll<T extends HTMLElement = HTMLDivElement>() {
  const topRef = useRef<T | null>(null);
  const bottomRef = useRef<T | null>(null);

  const sync = useCallback(
    (source: 'top' | 'bottom') => () => {
      const from = (source === 'top' ? topRef : bottomRef).current;
      const to = (source === 'top' ? bottomRef : topRef).current;
      if (!from || !to) return;
      if (to.scrollLeft === from.scrollLeft) return;
      to.scrollLeft = from.scrollLeft;
    },
    [],
  );

  return {
    topRef,
    bottomRef,
    onTopScroll: sync('top'),
    onBottomScroll: sync('bottom'),
  };
}
