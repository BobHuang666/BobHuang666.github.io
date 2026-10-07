import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { uiText } from '../../../data/uiText';
import { projects } from '../../../data/projects';
import { gradient } from '../../../utils/gradients';
import { SectionReveal } from '../../../shared/components/effects/SectionReveal';
import { SmartImage } from '../../../shared/components/ui/SmartImage';
import { SectionHeader } from './SectionHeader';

/** 精选项目卡片区 */
export const ProjectsSection = () => {
  const navigate = useNavigate();

  const handleProjectClick = (
    e: React.MouseEvent,
    project: (typeof projects)[number],
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
    <section id="projects" className="py-20 bg-slate-50 dark:bg-slate-900/40 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={uiText.home.projectsTitle} subtitle={uiText.home.projectsSub} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <SectionReveal key={project.id} variant="scale" delay={index * 0.1}>
              <div className="group card-base overflow-hidden h-full flex flex-col">
                <div className="relative h-44 overflow-hidden">
                  <SmartImage
                    src={project.image}
                    alt={project.title}
                    fallbackTitle={project.title}
                    fallbackGradient={gradient(project.imageTone)}
                    autoModernFormats={false}
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
                      {uiText.common.demo} <ExternalLink className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleProjectClick(e, project, 'detail')}
                      className="flex-1 px-3 py-2 rounded-lg text-sm border border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                    >
                      {uiText.common.detail}
                    </button>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
