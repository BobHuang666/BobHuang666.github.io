/** 首页「更多探索」区：三个次级页面入口 */
import { uiText } from '@/data/uiText';
import { RelatedLink } from '@/shared/components/ui/RelatedLink';
import { SectionHeader } from './SectionHeader';

export const MoreSection = () => (
  <section id="more" className="py-20 bg-white dark:bg-slate-950">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionHeader title={uiText.home.moreTitle} subtitle={uiText.home.moreSub} />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <RelatedLink to="/travel" emoji="🗺️" title={uiText.related.travel.title} desc={uiText.related.travel.desc} />
        <RelatedLink to="/fandom" emoji="🎤" title={uiText.related.fandom.title} desc={uiText.related.fandom.desc} />
        <RelatedLink to="/friends" emoji="🤝" title={uiText.related.friends.title} desc={uiText.related.friends.desc} />
      </div>
    </div>
  </section>
);
