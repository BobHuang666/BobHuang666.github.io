import { useState } from 'react';
import {
  Mail, MapPin, Calendar, GraduationCap, Code2, Award, BookOpen,
  Heart, Plane, Music, Gamepad2, Brain, Users,
  Github, Star, Clock, Briefcase, FlaskConical, CreditCard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { awards } from '../data/awards';
import { skillsDetail, courses, experiences, studentWork, research } from '../data/skills';
import { RelatedLink } from '../components/RelatedLink';

type TabId = 'basic' | 'skills' | 'awards' | 'courses' | 'experience' | 'research' | 'interests';

interface TabDef {
  id: TabId;
  name: string;
  icon: LucideIcon;
}

const TABS: TabDef[] = [
  { id: 'basic', name: '基本信息', icon: CreditCard },
  { id: 'skills', name: '技能专长', icon: Code2 },
  { id: 'awards', name: '获奖经历', icon: Award },
  { id: 'experience', name: '实习/学生工作', icon: Briefcase },
  { id: 'research', name: '科研课题', icon: FlaskConical },
  { id: 'courses', name: '课程成绩', icon: BookOpen },
  { id: 'interests', name: '兴趣爱好', icon: Heart },
];

function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('basic');

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
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128"><rect width="128" height="128" fill="%236366f1"/><text x="50%25" y="55%25" font-size="48" fill="white" text-anchor="middle" font-family="sans-serif">BH</text></svg>';
                }}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                {profile.name} <span className="text-slate-500 dark:text-slate-400 font-medium">/ {profile.nameZh}</span>
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
                {profile.education.studentId && (
                  <InfoItem icon={CreditCard} text={`学号 ${profile.education.studentId}`} />
                )}
                <InfoItem icon={Calendar} text={profile.education.period} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md mb-6 border border-slate-200 dark:border-slate-800">
          <div className="flex overflow-x-auto scrollbar-thin">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 whitespace-nowrap transition-colors text-sm font-medium ${
                  activeTab === tab.id
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
          {activeTab === 'basic' && <BasicInfoTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'awards' && <AwardsTab />}
          {activeTab === 'experience' && <ExperienceTab />}
          {activeTab === 'research' && <ResearchTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'interests' && <InterestsTab />}
        </motion.div>

        {/* 相关跳转 */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <RelatedLink to="/" emoji="🏰" title="返回主城" desc="查看项目与技能概览" />
          <RelatedLink to="/blog" emoji="📝" title="游戏攻略" desc="读我写的文章" />
          <RelatedLink to="/now" emoji="✨" title="当前动态" desc="最近在做什么" />
          <RelatedLink to="/uses" emoji="🛠" title="装备清单" desc="我用的工具" />
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

const SectionHeading = ({ icon: Icon, title }: { icon: LucideIcon; title: string }) => (
  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-5 flex items-center">
    <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400 mr-2.5" />
    {title}
  </h3>
);

// ============ Basic Info ============
function BasicInfoTab() {
  return (
    <div className="space-y-8">
      <div>
        <SectionHeading icon={GraduationCap} title="教育背景" />
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl p-6 border border-indigo-100 dark:border-indigo-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoLine label="学校" value={`${profile.education.school}（${profile.education.level}）`} />
            <InfoLine label="专业" value={profile.education.major} />
            <InfoLine label="学历层次" value={`${profile.education.degree} · ${profile.education.grade}`} />
            <InfoLine label="在读时间" value={profile.education.period} />
            <InfoLine label="政治面貌" value={profile.education.politicalStatus} />
            <InfoLine label="GPA / 排名" value={profile.education.gpa || '待补充'} />
          </div>
        </div>
      </div>

      <div>
        <SectionHeading icon={Briefcase} title="当前职务" />
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 border border-amber-100 dark:border-amber-900/40">
          <p className="text-slate-800 dark:text-slate-200 font-medium">{profile.currentRole}</p>
        </div>
      </div>
    </div>
  );
}

const InfoLine = ({ label, value }: { label: string; value: string }) => (
  <div>
    <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</h4>
    <p className="text-slate-800 dark:text-slate-200">{value}</p>
  </div>
);

// ============ Skills ============
function SkillsTab() {
  return (
    <div className="space-y-8">
      {skillsDetail.map((cat) => (
        <div key={cat.category}>
          <SectionHeading icon={cat.icon} title={cat.category} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cat.skills.map((skill) => (
              <div
                key={skill.name}
                className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{skill.name}</span>
                  <Stars count={skill.stars ?? Math.round((skill.level / 100) * 5)} />
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mb-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-1.5 rounded-full bg-gradient-to-r ${skill.color}`}
                  />
                </div>
                {skill.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{skill.note}</p>
                )}
                {skill.evidence && skill.evidence.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
                    {skill.evidence.map((ev) => (
                      <a
                        key={ev.href + ev.label}
                        href={ev.href}
                        target={ev.href.startsWith('http') ? '_blank' : undefined}
                        rel={ev.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-md bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors"
                      >
                        {ev.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const Stars = ({ count }: { count: number }) => {
  const filled = Math.max(0, Math.min(5, count));
  return (
    <span className="inline-flex" aria-label={`${filled} 颗星`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
        />
      ))}
    </span>
  );
};

// ============ Awards ============
function AwardsTab() {
  return (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        累计 {awards.length} 项荣誉 · 涵盖国际级、国家级、省级与校院级
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {awards.map((award) => (
          <div
            key={award.title}
            className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start mb-3">
              <div className={`shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br ${award.color ?? 'from-indigo-500 to-purple-500'} flex items-center justify-center mr-3 shadow`}>
                <award.icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                  {award.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {award.organization}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
              {award.description}
            </p>
            <div className="flex items-center justify-between text-xs">
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                {award.year} · {award.level}
              </span>
              {award.rank && (
                <span className="text-slate-500 dark:text-slate-400">{award.rank}</span>
              )}
              {!award.rank && <Star className="h-4 w-4 text-yellow-500" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Experience ============
function ExperienceTab() {
  return (
    <div className="space-y-10">
      <div>
        <SectionHeading icon={Briefcase} title="实习经历" />
        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <TimelineCard key={i} item={exp} />
          ))}
        </div>
      </div>
      <div>
        <SectionHeading icon={Users} title="学生工作" />
        <div className="space-y-4">
          {studentWork.map((w, i) => (
            <TimelineCard key={i} item={w} accent="green" />
          ))}
        </div>
      </div>
    </div>
  );
}

const TimelineCard = ({
  item,
  accent = 'indigo',
}: {
  item: { time: string; org: string; role: string; duration?: string; description?: string };
  accent?: 'indigo' | 'green';
}) => {
  const color =
    accent === 'green'
      ? 'border-l-green-500 bg-green-50/50 dark:bg-green-950/20'
      : 'border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20';
  return (
    <div className={`pl-5 pr-4 py-4 border-l-4 ${color} rounded-r-lg`}>
      <div className="flex flex-wrap items-baseline gap-x-3 mb-1">
        <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.role}</h4>
        <span className="text-xs text-slate-500 dark:text-slate-400">@ {item.org}</span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        {item.time}
        {item.duration && ` · ${item.duration}`}
      </p>
      {item.description && (
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {item.description}
        </p>
      )}
    </div>
  );
};

// ============ Research ============
function ResearchTab() {
  return (
    <div>
      <SectionHeading icon={FlaskConical} title="科研 / 课题" />
      <div className="space-y-4">
        {research.map((r) => (
          <div
            key={r.title}
            className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{r.title}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 gap-x-4 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">来源：</span>{r.source}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">主持人：</span>{r.leader}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">起止：</span>{r.period}
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                <span className="text-slate-700 dark:text-slate-300 font-medium">本人：</span>{r.rank}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ Courses ============
function CoursesTab() {
  const getGrade = (score: number | string) => {
    const n = typeof score === 'number' ? score : parseFloat(score);
    if (n >= 95) return { label: 'A+', color: 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300' };
    if (n >= 90) return { label: 'A', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300' };
    if (n >= 85) return { label: 'A-', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' };
    return { label: 'B+', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300' };
  };

  return (
    <div>
      <SectionHeading icon={BookOpen} title="主修课程成绩" />
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">部分核心课程（成绩来自 profile）</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((c) => {
          const g = getGrade(c.score);
          return (
            <div
              key={c.name}
              className="bg-gradient-to-r from-blue-50/60 to-indigo-50/60 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-5 hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{c.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {c.score} 分
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${g.color}`}>
                    {g.label}
                  </span>
                </div>
              </div>
              {c.description && (
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">{c.description}</p>
              )}
              {c.semester && (
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {c.semester}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Interests ============
function InterestsTab() {
  const interests = [
    {
      category: '技术爱好',
      icon: Code2,
      items: [
        { name: '算法竞赛', description: '热爱解决算法问题，参与各类编程竞赛', icon: Brain },
        { name: '开源项目', description: '积极参与开源社区，贡献代码', icon: Github },
        { name: '技术博客', description: '分享技术心得，记录学习历程', icon: BookOpen },
      ],
    },
    {
      category: '生活爱好',
      icon: Heart,
      items: [
        { name: '追星', description: '韩娱 & 内娱', icon: Music },
        { name: '旅行', description: '走过西安、荆州、杭州、瑞金等城市', icon: Plane },
        { name: '游戏', description: '游戏爱好者，享受思考的乐趣', icon: Gamepad2 }
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {interests.map((cat) => (
        <div key={cat.category}>
          <SectionHeading icon={cat.icon} title={cat.category} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cat.items.map((item) => (
              <div
                key={item.name}
                className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-5 hover:shadow-md transition-shadow border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center mb-3">
                  <div className="w-9 h-9 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center mr-3">
                    <item.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfilePage;
