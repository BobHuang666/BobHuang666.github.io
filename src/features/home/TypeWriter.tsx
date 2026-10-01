import { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
  /** 打字序列：text = 要打的文本，hold = 打完后的停留毫秒（缺省 2200） */
  sequences: readonly { text: string; hold?: number }[];
  speed?: number;
}

/**
 * 首页 Hero 打字机。
 * 纯本地实现，不引入第三方库。
 */
export const TypeWriter = ({ sequences, speed = 55 }: Props) => {
  const [text, setText] = useState('');
  const state = useRef({ strIdx: 0, charIdx: 0, deleting: false });

  const tick = useCallback(() => {
    const { strIdx, charIdx, deleting } = state.current;
    const cur = sequences[strIdx];
    // 序列为空时不推进，避免无意义的空转
    if (!cur) return 1000;

    if (!deleting) {
      if (charIdx < cur.text.length) {
        setText(cur.text.slice(0, charIdx + 1));
        state.current.charIdx++;
        return speed;
      }
      // 打完 → 等待后删除
      state.current.deleting = true;
      return cur.hold ?? 2200;
    } else {
      if (charIdx > 0) {
        setText(cur.text.slice(0, charIdx - 1));
        state.current.charIdx--;
        return Math.max(20, speed / 2);
      }
      // 删完 → 切换
      state.current.deleting = false;
      state.current.strIdx = (strIdx + 1) % sequences.length;
      return 200;
    }
  }, [sequences, speed]);

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
