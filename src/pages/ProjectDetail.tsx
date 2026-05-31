import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Code2, Globe, Database, Shield, Zap, Users, Calendar, ArrowLeft, ExternalLink, Github,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { projectsDetail } from '../data/projects';
import { SmartImage } from '../components/SmartImage';

const SECTIONS = [
  { id: 'overview', title: '项目概述', icon: Globe },
  { id: 'features', title: '主要功能', icon: Code2 },
  { id: 'techStack', title: '技术栈', icon: Database },
  { id: 'challenges', title: '挑战与困难', icon: Shield },
  { id: 'solutions', title: '解决方案', icon: Zap },
  { id: 'results', title: '项目成果', icon: Users },
  { id: 'lessons', title: '经验总结', icon: Calendar },
] as const;

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('overview');

  const projectData = id ? projectsDetail[id] : undefined;

  useEffect(() => {
    const handleScroll = () => {
      let current = 'overview';
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && window.scrollY >= el.offsetTop - 160) current = s.id;
      });
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sid: string) => {
    setActiveSection(sid);
    const el = document.getElementById(sid);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (!projectData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          项目不存在 🗺️
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          没有找到 id 为 <code className="font-mono text-sm">{id}</code> 的项目
        </p>
        <p className="text-sm text-slate-400 mb-6">
          可用项目：{Object.keys(projectsDetail).join(' / ')}
        </p>
        <Link to="/#projects" className="btn-primary">
          返回项目列表
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-5 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </button>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 lg:sticky lg:top-24">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 uppercase tracking-wide">
                目录
              </h3>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center ${
                      activeSection === s.id
                        ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <s.icon className="h-4 w-4 mr-2 shrink-0" />
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <SmartImage
                    src={projectData.image}
                    alt={projectData.title}
                    fallbackTitle={projectData.title}
                    fallbackGradient={projectData.imageGradient}
                    className="w-full h-44 object-cover rounded-lg"
                  />
                </div>
                <div className="lg:w-2/3">
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {projectData.title}
                  </h1>
                  {projectData.subtitle && (
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-3">
                      {projectData.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                    {projectData.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {projectData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {projectData.timeline && (
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {projectData.timeline}
                      </div>
                    )}
                    {projectData.role && (
                      <div className="flex items-center text-slate-600 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5 mr-1.5" />
                        {projectData.role}
                      </div>
                    )}
                    {projectData.link && (
                      <a
                        href={projectData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        在线演示
                      </a>
                    )}
                    {projectData.github && (
                      <a
                        href={projectData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Github className="h-3.5 w-3.5 mr-1.5" />
                        查看源码
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sections */}
            <SectionCard id="overview" icon={Globe} title="项目概述">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {projectData.content.overview}
              </p>
            </SectionCard>

            <SectionCard id="features" icon={Code2} title="主要功能">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projectData.content.features.map((f) => (
                  <Bullet key={f} text={f} dotClass="bg-indigo-500" />
                ))}
              </div>
            </SectionCard>

            <SectionCard id="techStack" icon={Database} title="技术栈">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <TechCol icon={Globe} title="前端" items={projectData.content.techStack.frontend} />
                <TechCol icon={Database} title="后端" items={projectData.content.techStack.backend} />
                <TechCol icon={Shield} title="数据库" items={projectData.content.techStack.database} />
                <TechCol icon={Zap} title="工具" items={projectData.content.techStack.tools} />
              </div>
            </SectionCard>

            <SectionCard id="challenges" icon={Shield} title="挑战与困难">
              <div className="space-y-3">
                {projectData.content.challenges.map((c) => (
                  <Bullet key={c} text={c} dotClass="bg-red-500" />
                ))}
              </div>
            </SectionCard>

            <SectionCard id="solutions" icon={Zap} title="解决方案">
              <div className="space-y-3">
                {projectData.content.solutions.map((s) => (
                  <Bullet key={s} text={s} dotClass="bg-green-500" />
                ))}
              </div>
            </SectionCard>

            <SectionCard id="results" icon={Users} title="项目成果">
              <div className="space-y-3">
                {projectData.content.results.map((r) => (
                  <Bullet key={r} text={r} dotClass="bg-blue-500" />
                ))}
              </div>
            </SectionCard>

            <SectionCard id="lessons" icon={Calendar} title="经验总结">
              <div className="space-y-3">
                {projectData.content.lessons.map((l) => (
                  <Bullet key={l} text={l} dotClass="bg-purple-500" />
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ Helpers ============
const SectionCard = ({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: typeof Globe;
  title: string;
  children: React.ReactNode;
}) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5 }}
    className="scroll-mt-24 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8"
  >
    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center">
      <Icon className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
      {title}
    </h2>
    {children}
  </motion.section>
);

const Bullet = ({ text, dotClass }: { text: string; dotClass: string }) => (
  <div className="flex items-start">
    <div className={`w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0 ${dotClass}`} />
    <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{text}</span>
  </div>
);

const TechCol = ({
  icon: Icon,
  title,
  items,
}: {
  icon: typeof Globe;
  title: string;
  items: string[];
}) => (
  <div>
    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2.5 flex items-center">
      <Icon className="h-4 w-4 mr-1.5 text-indigo-600 dark:text-indigo-400" />
      {title}
    </h3>
    <ul className="space-y-1.5">
      {items.map((t) => (
        <li key={t} className="text-xs text-slate-700 dark:text-slate-300">• {t}</li>
      ))}
    </ul>
  </div>
);

export default ProjectDetail;
