/** 首页：只负责编排各 section，取数与交互下沉到区块 */
import { Hero } from './sections/Hero';
import { AnnouncementBar } from './sections/AnnouncementBar';
import { ProjectsSection } from './sections/ProjectsSection';
import { BlogSection } from './sections/BlogSection';
import { AwardsSection } from './sections/AwardsSection';
import { SkillsSection } from './sections/SkillsSection';
import { ClosingSection } from './sections/ClosingSection';

function HomePage() {
  return (
    <div>
      <Hero />
      <AnnouncementBar />
      <ProjectsSection />
      <BlogSection />
      <AwardsSection />
      <SkillsSection />
      <ClosingSection />
    </div>
  );
}

export default HomePage;
