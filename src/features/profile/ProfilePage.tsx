import { useRef, useState, type ComponentType } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mail, MapPin, Shield,
  CreditCard, Award, Compass, Briefcase, FlaskConical,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { uiText } from '../../data/uiText';
import { profile } from '../../data/profile';
import { RelatedLink } from '../../shared/components/ui/RelatedLink';
import Avatar from '../../shared/components/ui/Avatar';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { AwardsTab } from './tabs/AwardsTab';
import { InternshipTab } from './tabs/InternshipTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { ResearchTab } from './tabs/ResearchTab';

type TabId = 'basic' | 'awards' | 'internship' | 'experience' | 'research';

interface TabDef {
  id: TabId;
  name: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: 'basic', name: '基本信息', icon: CreditCard },
  { id: 'awards', name: '获奖经历', icon: Award },
  { id: 'internship', name: '实习经历', icon: Briefcase },
  { id: 'experience', name: '在校经历', icon: Compass },
  { id: 'research', name: '科研课题', icon: FlaskConical },
];

const TAB_CONTENT: Record<TabId, ComponentType> = {
  basic: BasicInfoTab,
  awards: AwardsTab,
  internship: InternshipTab,
  experience: ExperienceTab,
  research: ResearchTab,
};

/** 五个 Tab 的导航条，顶部与底部共用同一份状态，保证两个导航栏同步 */
const TabNav = ({
  activeTab,
  onSelect,
}: {
  activeTab: TabId;
  onSelect: (id: TabId) => void;
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md mb-6 border border-slate-200 dark:border-slate-800">
    <div className="flex overflow-x-auto scrollbar-none">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-2 px-5 py-3.5 whitespace-nowrap transition-colors text-sm font-medium ${activeTab === tab.id
            ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30'
            : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
        >
          <tab.icon className="h-4 w-4" />
          {tab.name}
        </button>
      ))}
    </div>
  </div>
);

/** /profile —— 页面只负责头部信息卡与 Tab 编排，各 Tab 的内容在 ./tabs */
function ProfilePage() {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab: TabId =
    tabParam && TABS.some((t) => t.id === tabParam) ? (tabParam as TabId) : 'basic';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const topTabsRef = useRef<HTMLDivElement>(null);
  const ActiveContent = TAB_CONTENT[activeTab];

  // 切换底部 Tab 时滚动回到主体内容（顶部 Tab）位置
  const scrollToTop = () => {
    topTabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 mb-6 border border-slate-200 dark:border-slate-800"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            <Avatar src={profile.avatar} name={profile.name} size="lg" showStatus />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {profile.name}
              </h1>
              <p className="text-base md:text-lg text-indigo-600 dark:text-indigo-400 mb-3">
                {profile.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                {profile.tagline}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <InfoItem icon={Mail} text={profile.email || '邮箱待补充'} />
                <InfoItem icon={MapPin} text={profile.location} />
                <InfoItem icon={Shield} text={profile.politicalStatus} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs（顶部导航） */}
        <div ref={topTabsRef}>
          <TabNav activeTab={activeTab} onSelect={setActiveTab} />
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-md p-6 md:p-8 border border-slate-200 dark:border-slate-800"
        >
          <ActiveContent />
        </motion.div>

        {/* Tabs（底部导航，状态与顶部同步，切换后滚回顶部） */}
        <div className="mt-6">
          <TabNav
            activeTab={activeTab}
            onSelect={(id) => {
              setActiveTab(id);
              scrollToTop();
            }}
          />
        </div>

        {/* 相关跳转 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <RelatedLink to="/" emoji="🏰" title={uiText.related.home.title} desc={uiText.related.home.desc} />
          <RelatedLink to="/blog" emoji="📝" title={uiText.related.blog.title} desc={uiText.related.blog.desc} />
          <RelatedLink to="/friends" emoji="🤝" title={uiText.related.friends.title} desc={uiText.related.friends.desc} />
        </div>
      </div>
    </div>
  );
}

const InfoItem = ({ icon: Icon, text }: { icon: LucideIcon; text: string }) => (
  <div className="flex items-center text-slate-600 dark:text-slate-400">
    <Icon className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400 shrink-0" />
    <span className="truncate">{text}</span>
  </div>
);

export default ProfilePage;
