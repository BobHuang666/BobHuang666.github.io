import type { SkillCategory, SkillDetailCategory, SkillPill, Course, Experience, Research, Work } from '../types';

// icon 使用字符串 key，组件层通过 resolveIcon() 解析
// 首页用：简略技能栈
export const techStack: SkillCategory[] = [
  {
    name: '编程语言',
    icon: 'Code2',
    skills: ['C/C++', 'Python', 'TypeScript', 'JavaScript', 'Go'],
  },
  {
    name: '前端开发',
    icon: 'Globe',
    skills: ['Vue 3', 'React', 'uni-app', 'HTML/CSS', 'SCSS', '响应式'],
  },
  {
    name: '后端 & 数据',
    icon: 'Database',
    skills: ['Go', 'Python', 'MySQL', '大数据处理', 'API 设计'],
  },
  {
    name: '工具 & 工程化',
    icon: 'Shield',
    skills: ['Git', 'Linux', '敏捷开发', 'AI 工具链', '算法'],
  },
];

// Profile 页面用：技能详情（含等级 & 备注 & 证据）
// 等级换算建议：1-5 颗星 / 项目实战 / 学习了解
export const skillsDetail: SkillDetailCategory[] = [
  {
    category: '编程语言',
    icon: 'Code2',
    skills: [
      {
        name: 'C/C++', level: 95, stars: 5, note: '算法竞赛核心语言', tone: 'blueBold',
        evidence: [
          { label: 'ICPC 全国铜', href: '#/profile' },
          { label: '蓝桥杯总决赛', href: '#/profile' },
        ],
      },
      {
        name: 'Python', level: 90, stars: 5, note: '数据处理 & 后端 & AI', tone: 'yellowBold',
        evidence: [{ label: '大数据课程 90+', href: '#/profile' }],
      },
      {
        name: 'TypeScript', level: 85, stars: 4, note: '前端项目主力', tone: 'blueSoft',
        evidence: [
          { label: 'AiCV 简历王', href: '#/projects/aicv-resume' },
          { label: '本网站', href: 'https://github.com/BobHuang666' },
        ],
      },
      { name: 'JavaScript', level: 85, stars: 4, note: '基础扎实', tone: 'yellowSoft' },
      {
        name: 'Go', level: 70, stars: 3, note: '墨尺平台后端', tone: 'cyanBold',
        evidence: [{ label: '墨尺智慧作文', href: '#/projects/ink-ruler' }],
      },
    ],
  },
  {
    category: '前端开发',
    icon: 'Globe',
    skills: [
      {
        name: 'Vue 3', level: 90, stars: 5, note: '实习 + 挑战杯', tone: 'greenEmerald',
        evidence: [
          { label: 'AiCV 简历王', href: '#/projects/aicv-resume' },
          { label: '墨尺平台', href: '#/projects/ink-ruler' },
        ],
      },
      {
        name: 'uni-app', level: 85, stars: 4, note: '小程序上线项目', tone: 'tealCyanBold',
        evidence: [{ label: 'AiCV 简历王', href: '#/projects/aicv-resume' }],
      },
      {
        name: 'React', level: 75, stars: 4, note: '本网站使用', tone: 'cyanBold',
        evidence: [{ label: '本网站源码', href: 'https://github.com/BobHuang666' }],
      },
      {
        name: 'HTML/CSS/SCSS', level: 90, stars: 5, note: 'iGEM 大量实践', tone: 'orangeBold',
        evidence: [{ label: 'iGEM Wiki', href: '#/projects/igem-wiki' }],
      },
      { name: '响应式设计', level: 88, stars: 4, note: '多端适配经验', tone: 'purpleBold' },
    ],
  },
  {
    category: '后端 & 数据',
    icon: 'Database',
    skills: [
      {
        name: 'Go (Gin)', level: 70, stars: 3, note: '了解 + 实战', tone: 'cyanBold',
        evidence: [{ label: '墨尺后端', href: '#/projects/ink-ruler' }],
      },
      { name: 'Python 后端', level: 80, stars: 4, note: 'Flask / FastAPI', tone: 'gray' },
      { name: 'MySQL', level: 75, stars: 4, note: '设计 + 优化', tone: 'blueBold' },
      { name: '大数据分析', level: 80, stars: 4, note: '专业方向', tone: 'indigoBold' },
      { name: 'API 设计', level: 85, stars: 4, note: 'RESTful 规范', tone: 'greenBold' },
    ],
  },
  {
    category: '工具 & 工程化',
    icon: 'Shield',
    skills: [
      { name: 'Git / GitHub', level: 90, stars: 5, note: '熟练协作', tone: 'orangeBold' },
      { name: 'Linux', level: 80, stars: 4, note: '日常开发环境', tone: 'yellowBold' },
      {
        name: '算法 & 数据结构', level: 95, stars: 5, note: 'ICPC / 蓝桥杯', tone: 'purpleBold',
        evidence: [{ label: '15+ 项算法荣誉', href: '#/profile' }],
      },
      { name: 'AI 工具链', level: 90, stars: 5, note: '快速落地项目', tone: 'pinkRose' },
      { name: '英语 (CET-6)', level: 80, stars: 4, note: '听说读写', tone: 'emeraldTealBold' },
    ],
  },
];

// Profile 页「技能专长」Tab 用：扁平胶囊列表（不分组、不评分、不额外说明）
// group 只决定胶囊浅色，名称与 skillsDetail 保持一致
export const skillPills: SkillPill[] = [
  { name: 'C/C++', group: 'language' },
  { name: 'Python', group: 'language' },
  { name: 'TypeScript', group: 'language' },
  { name: 'JavaScript', group: 'language' },
  { name: 'Go', group: 'language' },

  { name: 'Vue 3', group: 'frontend' },
  { name: 'uni-app', group: 'frontend' },
  { name: 'React', group: 'frontend' },
  { name: 'HTML/CSS/SCSS', group: 'frontend' },
  { name: '响应式设计', group: 'frontend' },

  { name: 'Go', group: 'backend' },
  { name: 'Python 后端', group: 'backend' },
  { name: 'MySQL', group: 'backend' },
  { name: '大数据分析', group: 'backend' },
  { name: 'API 设计', group: 'backend' },

  { name: '算法 & 数据结构', group: 'tool' },
  { name: 'Git / GitHub', group: 'tool' },
  { name: 'Linux', group: 'tool' },
  { name: 'AI 工具链', group: 'tool' },
  { name: '英语 (CET-6)', group: 'tool' },

  { name: '追星', group: 'hobby' },
  { name: '旅行', group: 'hobby' },
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

// 实习经历
export const experiences: Experience[] = [
  {
    time: '2026.05 - 2026.08',
    org: '腾讯集团总部 CDG',
    role: '前端开发实习生',
    description: '负责小秘AI理财管家模块，结合用户资产/行情热点/用户记忆，通过猜你想问/功能卡片/入口投放，升级个性化服务能力，提高月活；同时关注埋点规范上报/灰度控制/代码架构规范。\n使用与优化团队AI工作流，认识「阶段编排约束 + Skill沉淀方法 + 知识库维护」模式，提升开发效率与完成度；编写埋点数据分析Skill，沉淀取数与洞察能力，协助产品分析优化。',
  },
  {
    time: '2025.07 - 2025.10',
    org: '智悦云创（湖南）科技有限公司',
    role: 'AI 应用工程师（前端）实习生',
    description:
      '面向大学生的AI简历优化平台，实习期间项目成功上线并获1000+用户关注；参与所有核心业务模块的开发维护，如简历优化流程/用户会员中心，完成40+功能点、150+任务项；\n优化接口调用逻辑与状态管理，修复多类数据异常与渲染问题，提升问题定位与解决能力；\n与后端、产品、测试等团队成员合作，完成功能的联调与优化，提升沟通与协作能力。',
  },
];

// 培训经历
export const trainingExperiences: Experience[] = [
  {
    time: '2024.12 - 2025.08',
    org: '北京师范大学 — 百度',
    role: '松果人才培养菁英班学员',
    description: '完成百度及清华社规定的部分课程及题库练习。',
  },
  {
    time: '2025.11 - 2025.12',
    org: '字节跳动',
    role: '工程训练营学员',
    description: '完成全部课程任务及结营项目。',
  },
];

// 社会实践经历
export const practiceExperiences: Experience[] = [
  {
    time: '2026.05 至今',
    org: '北京师范大学会同书院',
    role: '助学先锋营成员',
    description: '会同书院党委活动，学业帮扶',
  },
  {
    time: '2025.10.31 - 2026.04.25',
    org: '北京师范大学珠海校区',
    role: '卓越训练营学员',
    description: '北京师范大学珠海校区第3期卓越训练营',
  },
  {
    time: '2025.07.06 - 2025.07.09',
    org: '江西省赣州市',
    role: '学员小组组长',
    description: '北京师范大学珠海校区团委“感悟红色文化，传承革命精神”实践活动',
  },
  {
    time: '2025.01 - 2025.02',
    org: '广东省汕头市',
    role: '答疑组组长',
    description: '北京师范大学寒假优秀学子回母校宣传活动，荣获“返乡宣传优秀团队”',
  },
  {
    time: '2024.08.01 - 2024.08.02',
    org: '广东省潮州市、汕头市',
    role: '社会实践队长',
    description: '北京师范大学珠海校区暑期社会实践“聚焦家乡非遗，坚定文化自信”专项调研项目，“潮茶寻源”实践队',
  },
  {
    time: '2024.07.04 - 2024.07.11',
    org: '湖北省荆州市、荆门市',
    role: '后勤组组长',
    description: '北京师范大学会同书院“走在祖国大地上的思政课”暑期实践研学活动',
  },
  {
    time: '2023.12 - 2024.02',
    org: '广东省潮州市潮安区',
    role: '区县小组组长',
    description: '北京师范大学“弘扬京师风范 挺膺青年担当”寒假返乡调研专题项目，大学生教育国情调查社会实践',
  },
];

// 学生工作
export const studentWork: Experience[] = [
  {
    time: '2025.09 - 2026.08',
    org: 'BNUZH 程序设计竞赛社',
    role: '社长',
    description:
      '组织校级程序设计竞赛、算法讲堂、赛前培训、周赛训练，吸引 50+ 同学加入，每周活动 20+ 人。',
  },
  {
    time: '2024.09 - 2025.08',
    org: '校团委青年科技创新协会',
    role: '部长',
    description:
      '带领学术创新部 17 人团队，策划学术文化节等大型校园活动，覆盖 1000+ 师生。',
  },
  {
    time: '2024.09 - 2025.08',
    org: 'BNUZH 程序设计竞赛社',
    role: '副社长',
    description:
      '协助组织校级程序设计竞赛、算法讲堂、赛前培训、周赛训练。',
  },
  {
    time: '2024.09 - 2024.08',
    org: '北京师范大学会同书院',
    role: '导师小组组长',
    description: '组织4次导师小组活动',
  },
  {
    time: '2024.09 - 2024.08',
    org: '北京师范大学会同书院',
    role: '宿舍学长',
    description: '走访宿舍，新生答疑',
  },
  {
    time: '2023.09 - 2024.08',
    org: '校团委青年科技创新协会',
    role: '干事',
    description: '学术创新部干事，参与校园学术活动策划与执行',
  },
];

// 著作成果（发明专利 / 软件著作权）
export const works: Work[] = [
  {
    title: '基于单片机的自行车转向角度检测与VR联动装置及方法',
    type: '发明专利',
    rank: '3',
    meta: [
      { label: '申请号', value: '2025117634801' },
      { label: '申请日', value: '2025.11.27' },
      { label: '公布号', value: 'CN121632119A' },
      { label: '案件状态', value: '等待实审提案' },
      { label: '主分类号', value: 'G01C21/18' },
    ],
  },
  {
    title: '“墨尺”智慧作文教学平台',
    type: '计算机软件著作权',
    rank: '1',
    meta: [
      { label: '登记号', value: '2026SR0581563' },
      { label: '证书号', value: '软著登字第17795844号' },
      { label: '获得时间', value: '2026.04.27' },
    ],
  },
];

// 课题 / 科研项目
export const research: Research[] = [
  {
    title: '骑迹智联——高兼容低成本的 VR 骑行联动装置',
    level: '省级',
    source: '大学生创新创业训练计划项目',
    period: '2025.06 - 2026.05',
    leader: 'AndyPark',
    result: '完成装置原型设计、硬件搭建与联动调试，项目顺利结项；\n申请《基于单片机的自行车转向角度检测与VR联动装置及方法》发明专利，进入实质审查阶段;\n作为优秀项目于会同书院“大创项目经验分享会”上进行经验分享；\n本人负责蓝牙传输协议、虚拟场景搭建与响应控制，通过传感器实时采集自行车车把转角，经蓝牙无线传输至手机端控制虚拟骑行行为，并使用Python、JS开发Web应用。',
  },
  {
    title:
      '公私协创视角下：政府和社会资本合作模式对城市新质生产力的多维赋能影响研究',
    level: '院系级',
    source: '会同书院“朋辈研学”项目',
    period: '2025.03 - 2025.09',
    leader: 'Dragon',
    result: '完成数据获取、清洗与分析，形成论文《公私协创：政府和社会资本合作模式对城市新质生产力发展的影响研究》，获“京师杯”课外学术科技作品竞赛一等奖，项目顺利结项。',
  },
  {
    title: '地摊经济现状分析及发展前景研究',
    level: '院系级',
    source: '会同书院“朋辈研学”项目',
    period: '2023.09 - 2024.03',
    result: '进行文献调研、问卷调查、实地走访与数据分析，形成调研报告，项目顺利结项。',
  },
];
