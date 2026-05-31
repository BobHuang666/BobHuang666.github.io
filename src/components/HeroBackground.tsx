import { useEffect, useRef } from 'react';

/**
 * Hero 增强背景 —— 纯 CSS + 鼠标视差（无新依赖）
 * - 3 个柔光 blob 持续漂移
 * - 鼠标移动时 blob 跟随轻微偏移
 * - 网格点阵 mask 增加层次
 * - 自动响应 prefers-reduced-motion
 */
export const HeroBackground = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let rafId = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        const { innerWidth: w, innerHeight: h } = window;
        const x = (e.clientX / w - 0.5) * 30;
        const y = (e.clientY / h - 0.5) * 30;
        ref.current.style.setProperty('--mx', `${x}px`);
        ref.current.style.setProperty('--my', `${y}px`);
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 渐变基色（仍然交给外层 section bg） */}

      {/* 网格点阵 */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse at center, black 50%, transparent 80%)',
        }}
      />

      {/* 3 个柔光 blob —— translate 由 CSS 变量驱动 */}
      <div
        className="absolute -top-20 -left-10 w-80 h-80 bg-pink-400/40 rounded-full blur-3xl animate-blob"
        style={{ transform: 'translate(var(--mx, 0), var(--my, 0))' }}
      />
      <div
        className="absolute top-32 -right-20 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl animate-blob"
        style={{
          transform: 'translate(calc(var(--mx, 0) * -1), calc(var(--my, 0) * -1))',
          animationDelay: '4s',
        }}
      />
      <div
        className="absolute -bottom-32 left-1/3 w-80 h-80 bg-purple-400/40 rounded-full blur-3xl animate-blob"
        style={{
          transform: 'translate(calc(var(--mx, 0) * 0.5), calc(var(--my, 0) * 0.5))',
          animationDelay: '8s',
        }}
      />

      {/* Aurora 极光斜线（独立动画，slowest） */}
      <div className="absolute inset-0 opacity-30 mix-blend-overlay">
        <div className="absolute -inset-[20%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,.4)_25%,transparent_50%,rgba(255,255,255,.4)_75%,transparent_100%)] animate-[spin_30s_linear_infinite]" />
      </div>

      {/* 顶部柔化遮罩，让文字更清晰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/20" />
    </div>
  );
};
