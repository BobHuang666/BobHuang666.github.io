import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  dAlpha: number; // 闪烁速率
}

/**
 * Hero 增强背景
 * - canvas 粒子星空（无外部依赖）
 * - 3 个柔光 blob 持续漂移
 * - 鼠标视差
 * - Aurora 极光
 * - prefers-reduced-motion 降级
 */
export const HeroBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 移动端（触摸设备）跳过鼠标视差
    const isMobile = window.matchMedia('(hover: none)').matches;

    if (!reduced && !isMobile && containerRef.current) {
      let rafId = 0;
      const onMove = (e: MouseEvent) => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (!containerRef.current) return;
          const { innerWidth: w, innerHeight: h } = window;
          const x = (e.clientX / w - 0.5) * 30;
          const y = (e.clientY / h - 0.5) * 30;
          containerRef.current.style.setProperty('--mx', `${x}px`);
          containerRef.current.style.setProperty('--my', `${y}px`);
        });
      };
      window.addEventListener('mousemove', onMove);
      return () => {
        window.removeEventListener('mousemove', onMove);
        cancelAnimationFrame(rafId);
      };
    }
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 移动端跳过 canvas 粒子循环，节省 GPU/CPU
    const isMobile = window.matchMedia('(hover: none)').matches;
    if (reduced || isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const COUNT = 70;
    let particles: Particle[] = [];
    let w = 0, h = 0;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    const randomParticle = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      vy: -(Math.random() * 0.15 + 0.05), // 缓慢上浮
      alpha: Math.random(),
      dAlpha: (Math.random() * 0.006 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
    });

    const init = () => {
      resize();
      particles = Array.from({ length: COUNT }, randomParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // 更新
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.dAlpha;
        if (p.alpha <= 0 || p.alpha >= 1) p.dAlpha *= -1;

        // 出界回收
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        if (p.x < -4) p.x = w + 4;
        if (p.x > w + 4) p.x = -4;

        // 绘制
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha)) * 0.75;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fill();
        // 光晕
        if (p.r > 1.2) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
          g.addColorStop(0, 'rgba(255,255,255,0.3)');
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
        ctx.restore();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    init();
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 网格点阵 */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse at center, black 50%, transparent 80%)',
        }}
      />

      {/* Canvas 粒子星空 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
        aria-hidden="true"
      />

      {/* 3 个柔光 blob */}
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

      {/* Aurora 极光斜线 */}
      <div className="absolute inset-0 opacity-25 mix-blend-overlay">
        <div className="absolute -inset-[20%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(255,255,255,.4)_25%,transparent_50%,rgba(255,255,255,.4)_75%,transparent_100%)] animate-[spin_30s_linear_infinite]" />
      </div>

      {/* 底部柔化遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/25" />
    </div>
  );
};
