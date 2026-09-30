import { SectionReveal } from '../../../shared/components/effects/SectionReveal';

/** 首页各 section 统一的「标题 + 副标题」 */
export const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <SectionReveal>
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </SectionReveal>
);
