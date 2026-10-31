/** 全站页脚：站点信息、导航与联系方式（恒定深色块，与浅色模式形成收尾反差） */
import { Link, useLocation } from 'react-router-dom';
import { Github, Mail } from 'lucide-react';
import { uiText } from '@/data/uiText';
import { profile } from '@/data/profile';
import { scrollToId } from '@/utils/scroll';

const Footer = () => {
  // 用 Router Link 而非裸 hash 锚点：HashRouter 对浏览器侧 hash 变化会复用
  // location.key，会绕过 ScrollRestoration 的回顶/恢复逻辑
  const location = useLocation();

  return (
    <footer className="relative overflow-hidden bg-[#0b0b12] text-slate-300 mt-12">
      {/* 点阵纹理层 + 顶部 indigo 微光，避免死黑一大块 */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none bg-dots-dark opacity-60" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-3">{profile.name}</h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md mb-4">
              {profile.tagline}
            </p>
            <div className="flex gap-3">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="hover:text-indigo-400 transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-3">
              {uiText.footer.navTitle}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">{uiText.nav.home}</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">{uiText.nav.profile}</Link></li>
              <li>
                <Link
                  to="/"
                  onClick={(e) => {
                    if (location.pathname === '/') {
                      e.preventDefault();
                      scrollToId('projects');
                    }
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {uiText.nav.projects}
                </Link>
              </li>
              <li><Link to="/blog" className="hover:text-indigo-400 transition-colors">{uiText.nav.blog}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-3">
              {uiText.nav.more}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/travel" className="hover:text-indigo-400 transition-colors">{uiText.nav.travel}</Link></li>
              <li><Link to="/fandom" className="hover:text-indigo-400 transition-colors">{uiText.nav.fandom}</Link></li>
              <li><Link to="/friends" className="hover:text-indigo-400 transition-colors">{uiText.nav.friends}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-slate-500">
          <span className="font-mono">© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
