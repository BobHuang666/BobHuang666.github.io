import { Code2, Globe, Database, Shield } from 'lucide-react';
import type { SkillCategory, SkillDetailCategory, Course, Experience, Research } from '../types';

// 首页用：简略技能栈
export const techStack: SkillCategory[] = [
  {
    name: '编程语言',
    icon: Code2,
    skills: ['C/C++', 'Python', 'TypeScript', 'JavaScript', 'Go'],
  },
  {
    name: '前端开发',
    icon: Globe,
    skills: ['Vue 3', 'React', 'uni-app', 'HTML/CSS', 'SCSS', '响应式'],
  },
  {
    name: '后端 & 数据',
    icon: Database,
    skills: ['Go', 'Python', 'MySQL', '大数据处理', 'API 设计'],
  },
  {
    name: '工具 & 工程化',
    icon: Shield,
    skills: ['Git', 'Linux', '敏捷开发', 'AI 工具链', '算法'],
  },
];

// Profile 页面用：技能详情（含等级 & 备注 & 证据）
// 等级换算建议：1-5 颗星 / 项目实战 / 学习了解
export const skillsDetail: SkillDetailCategory[] = [
  {
    category: '编程语言',
    icon: Code2,
    skills: [
      {
        name: 'C/C++', level: 95, stars: 5, note: '算法竞赛核心语言', color: 'from-blue-500 to-blue-600',
        evidence: [
          { label: 'ICPC 全国铜', href: '#/profile' },
          { label: '蓝桥杯总决赛', href: '#/profile' },
        ],
      },
      {
        name: 'Python', level: 90, stars: 5, note: '数据处理 & 后端 & AI', color: 'from-yellow-500 to-yellow-600',
        evidence: [{ label: '大数据课程 90+', href: '#/profile' }],
      },
      {
        name: 'TypeScript', level: 85, stars: 4, note: '前端项目主力', color: 'from-blue-400 to-blue-500',
        evidence: [
          { label: 'AiCV 简历王', href: '#/projects/aicv-resume' },
          { label: '本网站', href: 'https://github.com/BobHuang666' },
        ],
      },
      { name: 'JavaScript', level: 85, stars: 4, note: '基础扎实', color: 'from-yellow-400 to-yellow-500' },
      {
        name: 'Go', level: 70, stars: 3, note: '墨尺平台后端', color: 'from-cyan-500 to-cyan-600',
        evidence: [{ label: '墨尺智慧作文', href: '#/projects/ink-ruler' }],
      },
    ],
  },
  {
    category: '前端开发',
    icon: Globe,
    skills: [
      {
        name: 'Vue 3', level: 90, stars: 5, note: '实习 + 挑战杯', color: 'from-green-500 to-emerald-600',
        evidence: [
          { label: 'AiCV 简历王', href: '#/projects/aicv-resume' },
          { label: '墨尺平台', href: '#/projects/ink-ruler' },
        ],
      },
      {
        name: 'uni-app', level: 85, stars: 4, note: '小程序上线项目', color: 'from-teal-500 to-cyan-600',
        evidence: [{ label: 'AiCV 简历王', href: '#/projects/aicv-resume' }],
      },
      {
        name: 'React', level: 75, stars: 4, note: '本网站使用', color: 'from-cyan-500 to-cyan-600',
        evidence: [{ label: '本网站源码', href: 'https://github.com/BobHuang666' }],
      },
      {
        name: 'HTML/CSS/SCSS', level: 90, stars: 5, note: 'iGEM 大量实践', color: 'from-orange-500 to-orange-600',
        evidence: [{ label: 'iGEM Wiki', href: '#/projects/igem-wiki' }],
      },
      { name: '响应式设计', level: 88, stars: 4, note: '多端适配经验', color: 'from-purple-500 to-purple-600' },
    ],
  },
  {
    category: '后端 & 数据',
    icon: Database,
    skills: [
      {
        name: 'Go (Gin)', level: 70, stars: 3, note: '了解 + 实战', color: 'from-cyan-500 to-cyan-600',
        evidence: [{ label: '墨尺后端', href: '#/projects/ink-ruler' }],
      },
      { name: 'Python 后端', level: 80, stars: 4, note: 'Flask / FastAPI', color: 'from-gray-500 to-gray-600' },
      { name: 'MySQL', level: 75, stars: 4, note: '设计 + 优化', color: 'from-blue-500 to-blue-600' },
      { name: '大数据分析', level: 80, stars: 4, note: '专业方向', color: 'from-indigo-500 to-indigo-600' },
      { name: 'API 设计', level: 85, stars: 4, note: 'RESTful 规范', color: 'from-green-500 to-green-600' },
    ],
  },
  {
    category: '工具 & 工程化',
    icon: Shield,
    skills: [
      { name: 'Git / GitHub', level: 90, stars: 5, note: '熟练协作', color: 'from-orange-500 to-orange-600' },
      { name: 'Linux', level: 80, stars: 4, note: '日常开发环境', color: 'from-yellow-500 to-yellow-600' },
      {
        name: '算法 & 数据结构', level: 95, stars: 5, note: 'ICPC / 蓝桥杯', color: 'from-purple-500 to-purple-600',
        evidence: [{ label: '15+ 项算法荣誉', href: '#/profile' }],
      },
      { name: 'AI 工具链', level: 90, stars: 5, note: '快速落地项目', color: 'from-pink-500 to-rose-600' },
      { name: '英语 (CET-6)', level: 80, stars: 4, note: '听说读写', color: 'from-emerald-500 to-teal-600' },
    ],
  },
];

// 课程成绩（profile.md）
export const courses: Course[] = [
  { name: '算法专业实训', score: 99, description: '算法设计与实现能力的集中体现' },
  { name: '计算方法', score: 97, description: '数值算法与误差分析' },
  { name: 'Python 程序设计', score: 95, description: 'Python 基础与工程应用' },
  { name: 'C 程序设计基础', score: 93, description: 'C 语言入门与算法基础' },
  { name: '计算机组成与结构', score: 92, description: '体系结构与底层原理' },
  { name: '数据库系统', score: 91, description: 'SQL 与数据库设计原理' },
  { name: '人工智能导论', score: 91, description: 'AI 基础理论与方法' },
  { name: '大数据处理与分析', score: 90, description: '大数据生态与实战' },
  { name: '大模型技术及应用实践', score: 90, description: 'LLM 原理与落地应用' },
];

// 实习实践经历
export const experiences: Experience[] = [
  {
    time: '2026.05 - 至今',
    org: '腾讯集团总部 CDG',
    role: '前端开发实习生',
    duration: '3 个月',
    description: 'Tencent CDG 前端开发实习。', // TODO: 项目细节脱敏后补充
  },
  {
    time: '2025.07 - 2025.10',
    org: '智悦云创（湖南）科技有限公司',
    role: 'AI 应用工程师（前端）实习生',
    duration: '3 个月',
    description:
      '负责 AiCV 简历王微信小程序前端开发，参与所有核心业务模块，完成 40+ 功能点 / 150+ 任务项。',
  },
  {
    time: '2025.07.06 - 2025.07.09',
    org: '江西省赣州市瑞金市',
    role: '学员小组组长',
    duration: '4 天',
    description: '社会实践调研',
  },
  {
    time: '2024.08.01 - 2024.08.02',
    org: '广东省潮州市、汕头市',
    role: '社会实践队长',
    duration: '2 天',
    description: '家乡非遗文化调研',
  },
  {
    time: '2024.07.04 - 2024.07.11',
    org: '湖北省荆州市、荆门市',
    role: '后勤组组长',
    duration: '7 天',
    description: '教育国情调查',
  },
  {
    time: '2023.12 - 2024.02',
    org: '广东省潮州市潮安区',
    role: '区县小组组长',
    duration: '3 个月',
    description: '寒假社会实践',
  },
];

// 学生工作
export const studentWork: Experience[] = [
  {
    time: '2025.09 - 至今',
    org: 'BNUZH 程序设计竞赛社',
    role: '社长',
    description:
      '组织校级程序设计竞赛、算法讲堂、赛前培训、周赛训练，吸引 50+ 同学加入，每周活动 20+ 人。',
  },
  {
    time: '2024.09 - 2025.08',
    org: '校团委青年科技创新协会',
    role: '学术创新部部长',
    description:
      '带领 17 人团队，策划学术文化节等大型校园活动，覆盖 1000+ 师生。',
  },
  {
    time: '2023.09 - 2024.08',
    org: '校团委青年科技创新协会',
    role: '干事',
    description: '学术创新部干事，参与校园学术活动策划与执行',
  },
];

// 课题 / 科研项目
export const research: Research[] = [
  {
    title: '骑迹智联——高兼容低成本的 VR 骑行联动装置',
    source: '大学生创新创业训练计划项目',
    leader: 'AndyPark',
    period: '2025.06 - 2026.05',
    rank: '',
  },
  {
    title:
      '公私协创视角下：政府和社会资本合作模式对城市新质生产力的多维赋能影响研究',
    source: '会同书院"朋辈研学"项目',
    leader: 'Dragon',
    period: '2025.03 - 2025.09',
    rank: '',
  },
  {
    title: '地摊经济现状分析及发展前景研究',
    source: '会同书院"朋辈研学"项目',
    leader: '',
    period: '2023.09 - 2024.03',
    rank: '',
  },
];
