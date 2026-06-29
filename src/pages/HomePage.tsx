import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Github, Mail, ArrowRight, Sparkles, ExternalLink, FileText, Copy, Check,
  Trophy, Award, BookOpen, Brain, Code2, Users, Star, Medal,
  Globe, Database, Shield,
  type LucideIcon,
} from 'lucide-react';

/** awards.ts / skills.ts 中 icon 字符串 → lucide 组件映射 */
const ICON_MAP: Record<string, LucideIcon> = {
  Trophy, Award, BookOpen, Brain, Code2, Users, Star, Medal,
  Globe, Database, Shield,
};
import { profile } from '../data/profile';
import { techStack } from '../data/skills';
import { projects } from '../data/projects';
import { awards } from '../data/awards';
import { blogMeta } from '../data/blog';
import { SectionReveal } from '../components/SectionReveal';
import { SmartImage } from '../components/SmartImage';
import { HeroBackground } from '../components/HeroBackground';
import { RelatedLink } from '../components/RelatedLink';
import GitHubCard from '../components/GitHubCard';
import GitHubHeatmap from '../components/GitHubHeatmap';
import Avatar from '../components/Avatar';

// ── 内置打字机组件，无需第三方库 ──────────────────────────
function TypeWriter({ sequences, speed = 55 }: { sequences: (string | number)[]; speed?: number }) {
  const strings = useMemo(
    () => sequences.filter((s): s is string => typeof s === 'string'),
    [sequences],
  );
  const pauses = useMemo(
    () => sequences.filter((s): s is number => typeof s === 'number'),
    [sequences],
  );

  const [text, setText] = useState('');
  const state = useRef({ strIdx: 0, charIdx: 0, deleting: false });

  const tick = useCallback(() => {
    const { strIdx, charIdx, deleting } = state.current;
    const cur = strings[strIdx];

    if (!deleting) {
      if (charIdx < cur.length) {
        setText(cur.slice(0, charIdx + 1));
        state.current.charIdx++;
        return speed;
      }
      // 打完 → 等待后删除
      state.current.deleting = true;
      return pauses[strIdx] ?? 2200;
    } else {
      if (charIdx > 0) {
        setText(cur.slice(0, charIdx - 1));
        state.current.charIdx--;
        return Math.max(20, speed / 2);
      }
      // 删完 → 切换
      state.current.deleting = false;
      state.current.strIdx = (strIdx + 1) % strings.length;
      return 200;
    }
  }, [strings, pauses, speed]);

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
}

type AwardLevel = 'all' | '国际级' | '国家级' | '省级' | '校级' | '院系级';
const AWARD_LEVELS: AwardLevel[] = ['all', '国际级', '国家级', '省级', '校级', '院系级'];
const LEVEL_I18N: Record<AwardLevel, string> = {
  all: 'level.all',
  国际级: 'level.international',
  国家级: 'level.national',
  省级: 'level.provincial',
  校级: 'level.school',
  院系级: 'level.college',
};

function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const [awardFilter, setAwardFilter] = useState<AwardLevel>('all');
  const [emailCopied, setEmailCopied] = useState(false);
  const featuredBlogs = blogMeta.filter((b) => !b.isDraft).slice(0, 3);

  const copyEmail = async () => {
    if (!profile.email) return;
    try {
      await navigator.clipboard.writeText(profile.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const filteredAwards = useMemo(() => {
    const list = awardFilter === 'all' ? awards : awards.filter((a) => a.level === awardFilter);
    return list.slice(0, 6);
  }, [awardFilter]);

  // 从 profile.github URL 中提取用户名
  const ghUsername = useMemo(() => {
    const m = profile.github?.match(/github\.com\/([^/]+)/);
    return m?.[1] ?? '';
  }, []);

  const handleProjectClick = (
    e: React.MouseEvent,
    project: typeof projects[number],
    type: 'demo' | 'detail',
  ) => {
    e.preventDefault();
    if (type === 'demo') {
      if (!project.link) {
        alert('该项目演示地址待补充');
        return;
      }
      if (project.link.startsWith('http')) {
        window.open(project.link, '_blank', 'noopener,noreferrer');
      } else {
        navigate(project.link);
      }
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900 bg-[length:200%_200%] animate-gradient-x">
        {/* 增强背景 —— 网格 + blob + Aurora + 鼠标视差 */}
        <HeroBackground />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 头像 + 状态徽章组合 */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center mb-6"
          >
            <Avatar
              src={profile.avatar}
              name={profile.name}
              size="md"
              showRing
              showStatus
            />

            {/* 状态文案 —— 紧贴头像下方 */}
            <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur text-white/95 text-xs border border-white/20">
              {t('home.status')}
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight"
          >
            {profile.name}
            <span className="block text-lg md:text-2xl font-medium text-white/85 mt-2">
              {profile.nameZh} · {profile.education.major}
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed min-h-[3.5rem]"
          >
            <TypeWriter
              key={t('home.status') /* 切换语言时重挂载 */}
              sequences={
                t('home.status').startsWith('Online')
                  ? [
                      'CS undergrad @ BNU · Data Science track',
                      2500,
                      'Competitive programmer · ICPC / Lanqiao / CCF',
                      2200,
                      'Full-stack dev · Vue / React / Go / Python',
                      2200,
                      'Frontend intern @ Tencent CDG',
                      2500,
                    ]
                  : [
                      profile.tagline,
                      2500,
                      '算法竞赛选手 · ICPC / 蓝桥杯 / CCF 多项荣誉',
                      2200,
                      '全栈开发者 · Vue / React / Go / Python',
                      2200,
                      '正在腾讯 CDG 担任前端实习生',
                      2500,
                    ]
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            <button
              type="button"
              onClick={() => scrollToId('projects')}
              className="inline-flex items-center px-6 py-3 rounded-lg font-medium bg-white text-indigo-600 hover:bg-slate-50 transition-colors shadow-lg"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {t('btn.viewProjects')}
            </button>
            <Link
              to="/profile"
              className="inline-flex items-center px-6 py-3 rounded-lg font-medium border-2 border-white/70 text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              {t('btn.aboutMe')} <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
            <button
              type="button"
              onClick={() => scrollToId('contact')}
              className="inline-flex items-center px-6 py-3 rounded-lg font-medium border-2 border-white/70 text-white hover:bg-white hover:text-indigo-600 transition-colors"
            >
              <Mail className="h-4 w-4 mr-2" /> {t('btn.contactMe')}
            </button>
            {profile.resumeUrl && (
              <a
                href={profile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 rounded-lg font-medium border-2 border-white/70 text-white hover:bg-white hover:text-indigo-600 transition-colors"
              >
                <FileText className="h-4 w-4 mr-2" /> {t('btn.downloadCv')}
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* ============ Skills ============ */}
      <section id="skills" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="section-title">{t('home.skillsTitle')}</h2>
            <p className="section-subtitle">{t('home.skillsSub')}</p>
          </SectionReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((category, index) => (
              <SectionReveal key={category.name} delay={index * 0.08}>
                <div className="card-base p-6 h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-11 h-11 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center mr-3">
                      {(() => { const Icon = ICON_MAP[category.icon] ?? Code2; return <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />; })()}
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {category.name}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GitHub 实时数据 ============ */}
      {ghUsername && (
        <section id="github" className="py-20 bg-white dark:bg-slate-950">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal>
              <h2 className="section-title">{t('home.githubTitle')}</h2>
              <p className="section-subtitle">{t('home.githubSub')}</p>
            </SectionReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SectionReveal variant="slide-left">
                <GitHubCard username={ghUsername} />
              </SectionReveal>
              <SectionReveal variant="slide-right" delay={0.08}>
                <GitHubHeatmap username={ghUsername} />
              </SectionReveal>
            </div>
          </div>
        </section>
      )}

      {/* ============ Projects ============ */}
      <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900/40 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="section-title">{t('home.projectsTitle')}</h2>
            <p className="section-subtitle">{t('home.projectsSub')}</p>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <SectionReveal key={project.id} variant="scale" delay={index * 0.1}>
                <div className="group card-base overflow-hidden h-full flex flex-col">
                  <div className="relative h-44 overflow-hidden">
                    <SmartImage
                      src={project.image}
                      alt={project.title}
                      fallbackTitle={project.title}
                      fallbackGradient={project.imageGradient}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {project.highlight && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-gold-500/95 text-white text-xs font-medium shadow">
                        {project.highlight}
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {project.title}
                    </h3>
                    {project.subtitle && (
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">
                        {project.subtitle}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={(e) => handleProjectClick(e, project, 'demo')}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      >
                        在线演示 <ExternalLink className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleProjectClick(e, project, 'detail')}
                        className="flex-1 px-3 py-2 rounded-lg text-sm border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                      >
                        项目详情
                      </button>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Blog ============ */}
      <section id="blog" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="section-title">{t('home.blogTitle')}</h2>
            <p className="section-subtitle">{t('home.blogSub')}</p>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((post, index) => (
              <SectionReveal key={post.id} variant="scale" delay={index * 0.08}>
                <article
                  onClick={() => navigate(`/blog/${post.id}`)}
                  className="card-base p-6 h-full cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                      {post.category}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {post.readTime} 分钟
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {post.publishDate}
                    </span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium inline-flex items-center">
                      阅读 <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </div>
                </article>
              </SectionReveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
            >
              查看全部文章 <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ Awards ============ */}
      <section id="awards" className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="section-title">{t('home.awardsTitle')}</h2>
            <p className="section-subtitle">
              {t('home.awardsSubTpl', { count: awards.length })}
            </p>
          </SectionReveal>

          {/* 级别筛选 */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {AWARD_LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => setAwardFilter(lv)}
                className={`px-3 py-1.5 text-xs rounded-full transition-all ${
                  awardFilter === lv
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                {t(LEVEL_I18N[lv])}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAwards.map((award, index) => (
              <SectionReveal key={award.title} delay={index * 0.06}>
                <div className="card-base p-6 h-full">
                  <div className="flex items-center mb-3">
                    <div
                      className={`w-11 h-11 rounded-lg bg-gradient-to-br ${
                        award.color ?? 'from-indigo-500 to-purple-500'
                      } flex items-center justify-center mr-3 shadow-md`}
                    >
                      {(() => { const Icon = ICON_MAP[award.icon] ?? Trophy; return <Icon className="h-5 w-5 text-white" />; })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {award.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {award.organization}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {award.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                      {award.year}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {award.level}
                    </span>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/profile"
              className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
            >
              查看全部 {awards.length} 项荣誉 <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ 更多探索 ============ */}
      <section id="more" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <h2 className="section-title">更多探索</h2>
            <p className="section-subtitle">除了主线任务，还有这些副本可以探索</p>
          </SectionReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <RelatedLink to="/series" emoji="📚" title="专题系列" desc="按主题看博客" />
            <RelatedLink to="/now" emoji="✨" title="当前动态" desc="最近在做什么" />
            <RelatedLink to="/uses" emoji="🛠" title="装备清单" desc="硬件与工具" />
            <RelatedLink to="/friends" emoji="🤝" title="友人帐" desc="友情链接" />
            <RelatedLink to="/fandom" emoji="💕" title="秘密花园" desc="追星专题" />
          </div>
        </div>
      </section>

      {/* ============ Contact ============ */}
      <section id="contact" className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h2 className="section-title">{t('home.contactTitle')}</h2>
            <p className="section-subtitle">{t('home.contactSub')}</p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            {/* 渐变卡片 */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-px shadow-xl">
              <div className="relative rounded-[15px] bg-white dark:bg-slate-900 px-8 py-10">
                {/* 装饰光晕 */}
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-pink-400/10 blur-3xl pointer-events-none" />

                {/* 社交图标 */}
                <div className="relative flex justify-center gap-4 mb-7">
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                      className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      aria-label="发送邮件"
                      className="group w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:scale-110 transition-all shadow-sm"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  )}
                </div>

                {/* 邮箱 + 复制按钮 */}
                {profile.email && (
                  <div className="relative flex items-center justify-center gap-2">
                    <code className="text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg font-mono">
                      {profile.email}
                    </code>
                    <button
                      onClick={copyEmail}
                      aria-label="复制邮箱"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 transition-colors"
                    >
                      {emailCopied
                        ? <Check className="h-3.5 w-3.5 text-green-500" />
                        : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                )}

                {/* 复制成功提示 */}
                <motion.p
                  initial={false}
                  animate={{ opacity: emailCopied ? 1 : 0, y: emailCopied ? 0 : 4 }}
                  transition={{ duration: 0.2 }}
                  className="mt-2 text-xs text-green-600 dark:text-green-400 h-4"
                >
                  {emailCopied ? '邮箱已复制到剪贴板 ✓' : ''}
                </motion.p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
