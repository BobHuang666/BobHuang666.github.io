/** 首页：只负责编排各 section，取数与交互下沉到区块 */
import { Hero } from './sections/Hero';
import { AnnouncementBar } from './sections/AnnouncementBar';
import { ProjectsSection } from './sections/ProjectsSection';
import { BlogSection } from './sections/BlogSection';
import { AwardsSection } from './sections/AwardsSection';
import { SkillsSection } from './sections/SkillsSection';
import { MoreSection } from './sections/MoreSection';
import { ContactSection } from './sections/ContactSection';

function HomePage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <Hero />
      <AnnouncementBar />
      <ProjectsSection />
      <BlogSection />
      <AwardsSection />
      <SkillsSection />
      <MoreSection />
      <ContactSection />
    </div>
  );
}

export default HomePage;
