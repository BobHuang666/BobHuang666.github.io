import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface Props {
  /** 字符串 = 要打的文本，数字 = 打完后的停留毫秒 */
  sequences: (string | number)[];
  speed?: number;
}

/**
 * 首页 Hero 打字机。
 * 纯本地实现，不引入第三方库；序列中的数字表示打完该句后的停留时间。
 */
export const TypeWriter = ({ sequences, speed = 55 }: Props) => {
  const strings = useMemo(
    () => sequences.filter((s): s is string => typeof s === 'string'),
    [sequences],
  );
  const pauses = useMemo(
    () => sequences.filter((s): s is number => typeof s === 'number'),
    [sequences],
  );

  const [text, setText] = useState('');
  const state = useRef({ strIdx: 0, charIdx: 0, deleting: false });

  const tick = useCallback(() => {
    const { strIdx, charIdx, deleting } = state.current;
    const cur = strings[strIdx];

    if (!deleting) {
      if (charIdx < cur.length) {
        setText(cur.slice(0, charIdx + 1));
        state.current.charIdx++;
        return speed;
      }
      // 打完 → 等待后删除
      state.current.deleting = true;
      return pauses[strIdx] ?? 2200;
    } else {
      if (charIdx > 0) {
        setText(cur.slice(0, charIdx - 1));
        state.current.charIdx--;
        return Math.max(20, speed / 2);
      }
      // 删完 → 切换
      state.current.deleting = false;
      state.current.strIdx = (strIdx + 1) % strings.length;
      return 200;
    }
  }, [strings, pauses, speed]);

  useEffect(() => {
    let id: ReturnType<typeof setTimeout>;
    const schedule = (ms: number) => { id = setTimeout(() => { schedule(tick()); }, ms); };
    // 初始延迟后启动
    id = setTimeout(() => { schedule(tick()); }, 600);
    return () => clearTimeout(id);
  }, [tick]);

  return (
    <span>
      {text}
      <span className="typewriter-cursor" aria-hidden="true" />
    </span>
  );
};
