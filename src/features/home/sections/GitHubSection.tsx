import { uiText } from '../../../data/uiText';
import { githubUsername } from '../../../data/profile';
import { SectionReveal } from '../../../shared/components/effects/SectionReveal';
import { GitHubCard, GitHubHeatmap } from '../../github';
import { SectionHeader } from './SectionHeader';

/** GitHub 实时数据：未配置 GitHub 主页时整块不渲染 */
export const GitHubSection = () => {
  if (!githubUsername) return null;

  return (
    <section id="github" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={uiText.home.githubTitle} subtitle={uiText.home.githubSub} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SectionReveal variant="slide-left">
            <GitHubCard username={githubUsername} />
          </SectionReveal>
          <SectionReveal variant="slide-right" delay={0.08}>
            <GitHubHeatmap username={githubUsername} />
          </SectionReveal>
        </div>
      </div>
    </section>
  );
};
