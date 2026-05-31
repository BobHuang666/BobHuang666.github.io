import { Github, Mail, Heart, Rss } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { profile } from '../data/profile';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-slate-900 text-slate-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-3">{profile.name} · {profile.nameZh}</h3>
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
              <a
                href="/feed.xml"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="RSS Feed"
                className="hover:text-orange-400 transition-colors"
              >
                <Rss className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* 主导航 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">{t('footer.nav')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/" className="hover:text-indigo-400 transition-colors">{t('nav.home')}</a></li>
              <li><a href="#/profile" className="hover:text-indigo-400 transition-colors">{t('nav.profile')}</a></li>
              <li>
                <a
                  href="#/"
                  onClick={(e) => {
                    if (window.location.hash.replace(/^#/, '') === '/') {
                      e.preventDefault();
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="hover:text-indigo-400 transition-colors"
                >
                  {t('nav.projects')}
                </a>
              </li>
              <li><a href="#/blog" className="hover:text-indigo-400 transition-colors">{t('nav.blog')}</a></li>
            </ul>
          </div>

          {/* 探索 */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">{t('nav.more')}</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#/series" className="hover:text-indigo-400 transition-colors">{t('nav.series')}</a></li>
              <li><a href="#/now" className="hover:text-indigo-400 transition-colors">{t('nav.now')}</a></li>
              <li><a href="#/uses" className="hover:text-indigo-400 transition-colors">{t('nav.uses')}</a></li>
              <li><a href="#/friends" className="hover:text-indigo-400 transition-colors">{t('nav.friends')}</a></li>
              <li><a href="#/fandom" className="hover:text-indigo-400 transition-colors flex items-center gap-1">
                {t('nav.fandom')}
                <Heart className="h-3 w-3 text-rose-400" />
              </a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-slate-500">
          <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
          <span>{t('footer.builtWith')}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
