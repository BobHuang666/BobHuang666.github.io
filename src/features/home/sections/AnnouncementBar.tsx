import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, ArrowRight } from 'lucide-react';
import { blogMeta } from '../../../data/blog';

/**
 * 单条公告：当标题在容器内放得下时，正常左对齐展示；
 * 当标题放不下（文本宽度 > 容器宽度）时，触发单向（向左）无缝轮播。
 */
const AnnouncementItem = ({ post }: { post: (typeof blogMeta)[number] }) => {
  const rowRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const animRef = useRef<Animation | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [inView, setInView] = useState(false);

  // 测量文本是否溢出容器：放得下不触发，放不下才轮播
  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const measure = () => {
      setOverflow(text.scrollWidth - container.clientWidth > 0);
    };

    measure();
    // 字体加载完成后再测一次，避免初始布局时字号/字宽变化导致误判
    if (document.fonts?.ready) document.fonts.ready.then(measure);

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, [post.title]);

  // 进入视图后才允许播放
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 溢出且进入视图后，延迟 1s 启动单向轮播：文本复制一份拼接，从 0 滚动到 -50% 无缝循环
  useEffect(() => {
    if (!overflow || !inView) return;
    const timer = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const duration = Math.max(6000, track.scrollWidth * 12);
      animRef.current = track.animate(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-50%)' },
        ],
        { duration, iterations: Infinity, easing: 'linear' }
      );
    }, 1000);

    return () => {
      if (timer) window.clearTimeout(timer);
      animRef.current?.cancel();
      animRef.current = null;
    };
  }, [overflow, inView]);

  const pause = () => animRef.current?.pause();
  const play = () => animRef.current?.play();

  return (
    <Link
      ref={rowRef}
      to={`/blog/${post.id}`}
      onMouseEnter={pause}
      onMouseLeave={play}
      className="group flex items-center gap-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 px-4 py-3 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/70 dark:hover:bg-amber-950/30 transition-colors"
    >
      <span
        className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-semibold group-hover:bg-amber-500 transition-colors"
        aria-label="通知公告"
      >
        <Megaphone className="h-3.5 w-3.5" />
      </span>
      <span
        ref={containerRef}
        className="flex-1 min-w-0 overflow-hidden font-medium text-sm text-slate-700 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400"
      >
        <span ref={trackRef} className={overflow ? 'flex w-max will-change-transform' : 'block'}>
          <span ref={textRef} className="inline-block whitespace-nowrap pr-8 shrink-0">
            {post.title}
          </span>
          {overflow && (
            <span className="whitespace-nowrap pr-8" aria-hidden="true">
              {post.title}
            </span>
          )}
        </span>
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
};

/**
 * Hero 下方通知公告区：每条公告独立一栏，竖向排列，每行只放一个。
 * 三条及以下：有多少条公告就渲染多少个公告栏；
 * 超过三条：只展示最新（按发布日期倒序）的三条。
 */
export const AnnouncementBar = () => {
  const all = blogMeta.filter((p) => p.tags.includes('公告'));
  if (all.length === 0) return null;

  const items = all.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 space-y-2">
      {items.map((post) => (
        <AnnouncementItem key={post.id} post={post} />
      ))}
    </div>
  );
};
