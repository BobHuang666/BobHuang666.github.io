import { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  decay: number;
  hue: number;
  sat: number;
  lit: number;
}

const SPAWN_COUNT = 2;        // 减少每帧生成数量
const BASE_RADIUS = 2.5;      // 缩小粒子半径
const HUES_LIGHT = [250, 270, 290, 330, 210]; // indigo / violet / pink / blue
const HUES_DARK  = [190, 210, 260, 170, 220];  // cyan / blue / purple / teal

/**
 * 全局鼠标跟随粒子尾迹（canvas overlay）
 * - pointer-events:none，不拦截任何交互
 * - 响应 prefers-reduced-motion，直接跳过渲染
 */
const MouseParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const darkRef = useRef(false);

  const spawnParticles = useCallback((x: number, y: number) => {
    const hues = darkRef.current ? HUES_DARK : HUES_LIGHT;
    for (let i = 0; i < SPAWN_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.6 + 0.4;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8, // 微微上浮
        r: Math.random() * BASE_RADIUS + 1.5,
        alpha: Math.random() * 0.25 + 0.2,  // 初始透明度降至 0.2~0.45
        decay: Math.random() * 0.022 + 0.028, // 衰减更快，寿命更短
        hue: hues[Math.floor(Math.random() * hues.length)],
        sat: darkRef.current ? 90 : 75,
        lit: darkRef.current ? 70 : 58,
      });
    }
  }, []);

  useEffect(() => {
    // 尊重用户减少动效偏好
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 监听主题变化（通过 html.dark class）
    const observer = new MutationObserver(() => {
      darkRef.current = document.documentElement.classList.contains('dark');
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    darkRef.current = document.documentElement.classList.contains('dark');

    // 画布尺寸同步视口
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const onMove = (e: MouseEvent) => spawnParticles(e.clientX, e.clientY);
    window.addEventListener('mousemove', onMove, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const alive: Particle[] = [];
      for (const p of particlesRef.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // 轻微重力
        p.r *= 0.97;
        p.alpha -= p.decay;
        if (p.alpha > 0 && p.r > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.lit}%,${p.alpha.toFixed(3)})`;
          ctx.fill();
          alive.push(p);
        }
      }
      particlesRef.current = alive;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
      observer.disconnect();
    };
  }, [spawnParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[50] pointer-events-none"
      aria-hidden="true"
    />
  );
};

export default MouseParticles;
