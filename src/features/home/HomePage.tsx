import { Hero } from './sections/Hero';
import { AnnouncementBar } from './sections/AnnouncementBar';
import { ProjectsSection } from './sections/ProjectsSection';
import { BlogSection } from './sections/BlogSection';
import { AwardsSection } from './sections/AwardsSection';
import { SkillsSection } from './sections/SkillsSection';
import { MoreSection } from './sections/MoreSection';
import { ContactSection } from './sections/ContactSection';

/**
 * / —— 首页只负责编排 section。
 * 取数、筛选状态、交互逻辑都下沉到各自 section，页面本身保持无状态。
 */
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
