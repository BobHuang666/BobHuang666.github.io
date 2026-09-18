import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

// ── 弹弹球游戏常量 ────────────────────────────────────────
const CW = 420, CH = 260;
const PW = 84, PH = 10;
const BR = 9;
const INIT_SPEED = 3.8;
const PADDLE_Y = CH - 28;

type Phase = 'idle' | 'playing' | 'over';

interface GameState {
  phase: Phase;
  ball: { x: number; y: number; vx: number; vy: number };
  paddleX: number;
  targetX: number;
  score: number;
  keysDown: Set<string>;
  raf: number;
}

const BallGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stRef = useRef<GameState>({
    phase: 'idle',
    ball: { x: CW / 2, y: CH / 3, vx: 2.4, vy: INIT_SPEED },
    paddleX: CW / 2 - PW / 2,
    targetX: CW / 2 - PW / 2,
    score: 0,
    keysDown: new Set(),
    raf: 0,
  });
  const [phase, setPhase] = useState<Phase>('idle');
  const [score, setScore] = useState(0);

  const resetBall = () => {
    const s = stRef.current;
    const dir = Math.random() > 0.5 ? 1 : -1;
    const angle = (Math.random() * 0.5 + 0.3); // 0.3-0.8 rad
    s.ball = {
      x: CW / 2,
      y: CH / 3,
      vx: dir * Math.cos(angle) * INIT_SPEED,
      vy: Math.abs(Math.sin(angle) * INIT_SPEED) || INIT_SPEED,
    };
    s.paddleX = CW / 2 - PW / 2;
    s.targetX = CW / 2 - PW / 2;
    s.score = 0;
  };

  // Stable ref for start, so keydown handler can call it
  const startRef = useRef<() => void>(() => {});
  const start = useCallback(() => {
    resetBall();
    stRef.current.phase = 'playing';
    setPhase('playing');
    setScore(0);
  }, []);
  startRef.current = start;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      stRef.current.keysDown.add(e.key);
      if ((e.key === ' ' || e.key === 'Enter') && stRef.current.phase !== 'playing') {
        e.preventDefault();
        startRef.current();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => stRef.current.keysDown.delete(e.key);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    // Mouse / touch
    const toCanvasX = (clientX: number) => {
      const rect = canvas.getBoundingClientRect();
      return (clientX - rect.left) * (CW / rect.width);
    };
    const onMouseMove = (e: MouseEvent) => { stRef.current.targetX = toCanvasX(e.clientX) - PW / 2; };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      stRef.current.targetX = toCanvasX(e.touches[0].clientX) - PW / 2;
    };
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });

    // ── Render ───────────────────────────────────────────
    const draw = () => {
      const { ball, paddleX, score: sc } = stRef.current;

      // Background
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, CW, CH);

      // Grid
      ctx.strokeStyle = 'rgba(99,102,241,0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= CW; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CH); ctx.stroke(); }
      for (let y = 0; y <= CH; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CW, y); ctx.stroke(); }

      // Top wall
      const wallGrad = ctx.createLinearGradient(0, 0, CW, 0);
      wallGrad.addColorStop(0, 'rgba(99,102,241,0)');
      wallGrad.addColorStop(0.5, 'rgba(139,92,246,0.6)');
      wallGrad.addColorStop(1, 'rgba(99,102,241,0)');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, CW, 3);

      // Paddle
      const pg = ctx.createLinearGradient(paddleX, 0, paddleX + PW, 0);
      pg.addColorStop(0, '#6366f1');
      pg.addColorStop(1, '#8b5cf6');
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 14;
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.roundRect(paddleX, PADDLE_Y, PW, PH, 5);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ball
      const bg = ctx.createRadialGradient(ball.x - 2, ball.y - 2, 1, ball.x, ball.y, BR);
      bg.addColorStop(0, '#e0d7ff');
      bg.addColorStop(1, '#a78bfa');
      ctx.shadowColor = '#c4b5fd';
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BR, 0, Math.PI * 2);
      ctx.fillStyle = bg;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score
      ctx.fillStyle = 'rgba(203,213,225,0.7)';
      ctx.font = '700 13px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`SCORE  ${sc}`, CW - 12, 20);
      ctx.textAlign = 'left';
    };

    // ── Game loop ─────────────────────────────────────────
    const tick = () => {
      const s = stRef.current;

      if (s.phase === 'playing') {
        // Paddle lerp toward mouse, + key override
        s.paddleX += (s.targetX - s.paddleX) * 0.18;
        const keySpeed = 9;
        if (s.keysDown.has('ArrowLeft') || s.keysDown.has('a')) s.paddleX -= keySpeed;
        if (s.keysDown.has('ArrowRight') || s.keysDown.has('d')) s.paddleX += keySpeed;
        s.paddleX = Math.max(0, Math.min(CW - PW, s.paddleX));

        // Ball movement (speed increases with score)
        const mult = 1 + s.score * 0.028;
        s.ball.x += s.ball.vx * mult;
        s.ball.y += s.ball.vy * mult;

        // Side / top wall bounces
        if (s.ball.x - BR <= 0) { s.ball.vx = Math.abs(s.ball.vx); s.ball.x = BR; }
        if (s.ball.x + BR >= CW) { s.ball.vx = -Math.abs(s.ball.vx); s.ball.x = CW - BR; }
        if (s.ball.y - BR <= 0) { s.ball.vy = Math.abs(s.ball.vy); s.ball.y = BR; }

        // Paddle collision
        if (
          s.ball.vy > 0 &&
          s.ball.y + BR >= PADDLE_Y &&
          s.ball.y <= PADDLE_Y + PH + 5 &&
          s.ball.x + BR >= s.paddleX &&
          s.ball.x - BR <= s.paddleX + PW
        ) {
          const hit = (s.ball.x - s.paddleX) / PW - 0.5; // -0.5 ~ 0.5
          s.ball.vx = hit * 8;
          s.ball.vy = -Math.abs(s.ball.vy);
          s.ball.y = PADDLE_Y - BR;
          s.score++;
          setScore(s.score);
        }

        // Game over
        if (s.ball.y - BR > CH) {
          s.phase = 'over';
          setPhase('over');
        }
      }

      draw();
      s.raf = requestAnimationFrame(tick);
    };

    stRef.current.raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(stRef.current.raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div
      className="relative select-none cursor-none"
      onClick={() => { if (stRef.current.phase !== 'playing') startRef.current(); }}
    >
      <canvas
        ref={canvasRef}
        width={CW}
        height={CH}
        className="rounded-xl border border-indigo-900/40 w-full max-w-[420px]"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* Idle overlay */}
      {phase === 'idle' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-slate-950/55 backdrop-blur-sm gap-2">
          <p className="text-slate-300 text-xs font-mono">← → 或鼠标移动控制挡板</p>
          <p className="text-indigo-400 text-base font-mono font-bold animate-pulse">SPACE / 点击 开始游戏</p>
        </div>
      )}

      {/* Game Over overlay */}
      {phase === 'over' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-slate-950/60 backdrop-blur-sm gap-1.5">
          <p className="text-rose-400 text-2xl font-mono font-extrabold tracking-widest">GAME OVER</p>
          <p className="text-slate-200 text-sm font-mono">得分 <span className="text-indigo-400 font-bold">{score}</span></p>
          <p className="text-indigo-400 text-xs font-mono mt-2 animate-pulse">SPACE / 点击 再来一次</p>
        </div>
      )}
    </div>
  );
};

// ── 404 页面主体 ──────────────────────────────────────────
const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center gap-0">
      <div className="relative">
        <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none text-gradient-brand select-none">
          404
        </h1>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
        迷失在副本之外
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
        这条路线还未解锁，或者地图已经更新。用键盘打一局弹弹球，或者回到主城开始新冒险吧。
      </p>

      {/* 弹弹球游戏 */}
      <div className="mb-8 w-full flex justify-center">
        <BallGame />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4 mr-2" /> 返回主城
        </Link>
        <Link
          to="/blog"
          className="btn-outline text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
        >
          <Compass className="h-4 w-4 mr-2" /> 翻翻攻略
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
