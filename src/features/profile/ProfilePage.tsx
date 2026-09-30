import { useState, type ComponentType } from 'react';
import {
  Mail, MapPin, Shield,
  CreditCard, Code2, Award, Briefcase, FlaskConical, BookOpen, Heart,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { copy } from '../../data/copy';
import { profile } from '../../data/profile';
import { RelatedLink } from '../../shared/components/ui/RelatedLink';
import Avatar from '../../shared/components/ui/Avatar';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { SkillsTab } from './tabs/SkillsTab';
import { AwardsTab } from './tabs/AwardsTab';
import { ExperienceTab } from './tabs/ExperienceTab';
import { ResearchTab } from './tabs/ResearchTab';
import { CoursesTab } from './tabs/CoursesTab';
import { InterestsTab } from './tabs/InterestsTab';

type TabId = 'basic' | 'skills' | 'awards' | 'experience' | 'research' | 'courses' | 'interests';

interface TabDef {
  id: TabId;
  name: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: 'basic', name: '教育背景', icon: CreditCard },
  { id: 'skills', name: '技能专长', icon: Code2 },
  { id: 'awards', name: '获奖经历', icon: Award },
  { id: 'experience', name: '实习/学生工作', icon: Briefcase },
  { id: 'research', name: '科研课题', icon: FlaskConical },
  { id: 'courses', name: '课程成绩', icon: BookOpen },
  { id: 'interests', name: '兴趣爱好', icon: Heart },
];

const TAB_CONTENT: Record<TabId, ComponentType> = {
  basic: BasicInfoTab,
  skills: SkillsTab,
  awards: AwardsTab,
  experience: ExperienceTab,
  research: ResearchTab,
  courses: CoursesTab,
  interests: InterestsTab,
};

/** /profile —— 页面只负责头部信息卡与 Tab 编排，各 Tab 的内容在 ./tabs */
function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const ActiveContent = TAB_CONTENT[activeTab];

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

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md mb-6 border border-slate-200 dark:border-slate-800">
          <div className="flex overflow-x-auto scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

        {/* 相关跳转 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <RelatedLink to="/" emoji="🏰" title="返回主城" desc="查看项目与技能概览" />
          <RelatedLink to="/blog" emoji="📝" title={copy.nav.blog} desc="读我写的文章" />
          <RelatedLink to="/friends" emoji="🤝" title={copy.nav.friends} desc="友情链接" />
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
