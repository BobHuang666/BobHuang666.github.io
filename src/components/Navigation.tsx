import { useState, useEffect, useRef, useCallback } from 'react';
import { Code2, Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // 防抖函数
  const debounce = useCallback((func: () => void, wait: number) => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(func, wait);
    };
  }, []);

  // 滚动监听 - 控制导航栏显示/隐藏
  useEffect(() => {
    const handleScroll = debounce(() => {
      const currentScrollY = window.scrollY;

      // 在顶部时始终显示导航栏
      if (currentScrollY <= 100) {
        setIsVisible(true);
      } else {
        // 向下滚动时隐藏，向上滚动时显示
        const shouldShow = currentScrollY < lastScrollY;
        setIsVisible(shouldShow);
      }

      setLastScrollY(currentScrollY);
    }, 10); // 10ms 防抖

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [lastScrollY, debounce]);

  // 点击外部区域关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // 键盘导航支持
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMenuOpen]);

  // 平滑滚动到锚点
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  const handleProjectsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('projects');
  };

  return (
    <nav
      className={`bg-white shadow-lg fixed w-full z-10 transition-transform duration-300 ease-in-out ${isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      role="navigation"
      aria-label="主导航"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <a
            href="/"
            className="flex items-center group focus:outline-none rounded transition-shadow"
            aria-label="返回首页"
          >
            <Code2 className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform duration-150" aria-hidden="true" />
            <span className="ml-2 text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">BobHuang</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none rounded"
            >
              主城
            </a>
            <a
              href="/profile"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none rounded"
            >
              角色档案
            </a>
            <button
              onClick={handleProjectsClick}
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none rounded"
            >
              任务中心
            </button>
            <a
              href="/blog"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-indigo-600 transition-colors duration-200 focus:outline-none rounded"
            >
              游戏攻略
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none rounded p-2"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          role="menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none"
              role="menuitem"
            >
              主城
            </a>
            <a
              href="/profile"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none"
              role="menuitem"
            >
              角色档案
            </a>
            <button
              onClick={handleProjectsClick}
              className="w-full text-left block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none"
              role="menuitem"
            >
              任务中心
            </button>
            <a
              href="/blog"
              rel="noopener noreferrer"
              className="block px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200 focus:outline-none"
              role="menuitem"
            >
              游戏攻略
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
