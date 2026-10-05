import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Code2, Menu, X, ChevronDown,
  Music, UsersRound, MapPinned,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { uiText } from '../../../data/uiText';
import { ThemeToggle } from '../controls/ThemeToggle';
import { SearchTrigger } from '../../../features/search';

interface MainItem {
  to: string;
  label: string;
  end?: boolean;
  anchor?: string;
}

interface MoreItem {
  to: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const MAIN_ITEMS: MainItem[] = [
  { to: '/', label: uiText.nav.home, end: true },
  { to: '/profile', label: uiText.nav.profile },
  { to: '/?section=projects', label: uiText.nav.projects, anchor: 'projects' },
  { to: '/blog', label: uiText.nav.blog },
];

const MORE_ITEMS: MoreItem[] = [
  { to: '/friends', label: uiText.nav.friends, icon: UsersRound, description: uiText.related.friends.desc },
  { to: '/travel', label: uiText.nav.travel, icon: MapPinned, description: uiText.related.travel.desc },
  { to: '/fandom', label: uiText.nav.fandom, icon: Music, description: uiText.related.fandom.desc },
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // 滚动隐藏
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        setIsScrolled(y > 8);
        if (y <= 100) setIsVisible(true);
        else setIsVisible(y < lastScrollY.current);
        lastScrollY.current = y;
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点外部关闭
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Esc 关闭
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // 路由变化关闭菜单
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMoreOpen(false);
  }, [location.pathname]);

  const scrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAnchorClick = (e: React.MouseEvent, anchor?: string) => {
    if (!anchor) return;
    if (location.pathname === '/') {
      e.preventDefault();
      scrollToAnchor(anchor);
    } else {
      // 跨页时先跳首页再滚动到锚点
      e.preventDefault();
      window.location.hash = '/';
      setTimeout(() => scrollToAnchor(anchor), 100);
    }
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-2 py-1 text-sm font-medium transition-colors ${isActive
      ? 'text-indigo-600 dark:text-indigo-400'
      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;

  /** 带滑动下划线的 NavLink 包装 */
  const AnimatedNavLink = ({ to, end, label, anchor }: { to: string; end?: boolean; label: string; anchor?: string }) => {
    if (anchor) {
      return (
        <a
          href="#/"
          onClick={(e) => handleAnchorClick(e, anchor)}
          className="relative px-2 py-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          {label}
        </a>
      );
    }
    return (
      <NavLink to={to} end={end} className={navItemClass}>
        {({ isActive }) => (
          <>
            {label}
            {isActive && (
              <motion.span
                layoutId="nav-underline"
                className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
          </>
        )}
      </NavLink>
    );
  };

  // 判断 "更多" 是否处于激活状态
  const isMoreActive = MORE_ITEMS.some((m) => location.pathname.startsWith(m.to));

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${isScrolled
          ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur shadow-sm border-b border-slate-200/60 dark:border-slate-800/60'
          : 'bg-white dark:bg-slate-950'
        }`}
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <NavLink
            to="/"
            className="flex items-center group focus:outline-none shrink-0"
            aria-label="返回首页"
          >
            <Code2 className="h-7 w-7 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="ml-2 text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors hidden min-[360px]:inline">
              BobHuang
            </span>
          </NavLink>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-7">
            {MAIN_ITEMS.map((item) => (
              <AnimatedNavLink
                key={item.label}
                to={item.to}
                end={item.end}
                label={item.label}
                anchor={item.anchor}
              />
            ))}

            {/* "更多" 下拉 */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={isMoreOpen}
                className={`relative inline-flex items-center gap-1 px-2 py-1 text-sm font-medium transition-colors ${isMoreActive || isMoreOpen
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
              >
                {uiText.nav.more}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
                {isMoreActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-[1px] h-0.5 rounded-full bg-indigo-600 dark:bg-indigo-400"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>

              {isMoreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-72 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-fade-up"
                >
                  {MORE_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-start gap-3 px-4 py-3 transition-colors ${isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                        }`
                      }
                      role="menuitem"
                    >
                      <item.icon className="h-4 w-4 mt-0.5 shrink-0 text-indigo-500 dark:text-indigo-400" />
                      <div className="min-w-0">
                        <div className="text-sm font-medium">{item.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.description}
                        </div>
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <SearchTrigger />
            <ThemeToggle />
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-1 shrink-0">
            <SearchTrigger />
            <ThemeToggle />
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen((v) => !v)}
              className="text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none rounded p-2"
              aria-label={isMenuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 shadow-lg max-h-[80vh] overflow-y-auto scrollbar-thin"
          role="menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {MAIN_ITEMS.map((item) =>
              item.anchor ? (
                <a
                  key={item.label}
                  href="#/"
                  onClick={(e) => handleAnchorClick(e, item.anchor)}
                  className="block px-3 py-2 rounded-md text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  role="menuitem"
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md transition-colors ${isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`
                  }
                  role="menuitem"
                >
                  {item.label}
                </NavLink>
              ),
            )}

            {/* 移动端 "更多" 直接展开 */}
            <div className="pt-2 mt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="px-3 mb-1 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-semibold">
                {uiText.nav.more}
              </div>
              {MORE_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`
                  }
                  role="menuitem"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
