import type { SkillCategory, Experience, Research, Work } from '../types';

// 基础个人信息
export const profile = {
  name: 'Bob Huang',
  title: '人工智能 研0',
  tagline: '',
  avatar: '/static/img/avatar.jpg',
  email: '2295672887@qq.com',
  location: '北京师范大学',
  politicalStatus: '中共预备党员',
  github: 'https://github.com/BobHuang666',

  education: [
    {
      school: '北京师范大学',
      major: '人工智能',
      degree: '硕士',
      period: '2027.09 - 2030.07',
    },
    {
      school: '北京师范大学',
      major: '数据科学与大数据技术',
      degree: '学士',
      period: '2023.09 - 2027.07',
    },
  ],

  certificates: [
    { name: '大学英语六级', date: '2024.06', issuer: '教育部教育考试院' },
    { name: '业余钢琴十级', date: '2019', issuer: '中国音乐家协会' },
  ],
} as const;

// 技术栈
export const skillGroups: SkillCategory[] = [
  { name: '编程语言', icon: 'Code2', skills: ['C/C++', 'Python', 'Java', 'Go'] },
  { name: '前端开发', icon: 'Globe', skills: ['HTML/CSS/JS', 'Vue', 'React', 'uni-app'] },
  { name: '后端 & 数据', icon: 'Database', skills: ['MySQL', 'Hadoop', 'Spark', 'Flink'] },
  { name: '工具 & 工程化', icon: 'Shield', skills: ['Git', 'Linux', 'AI 工具链'] },
];

// 兴趣爱好
export const hobbies: SkillCategory[] = [
  { name: '兴趣爱好', icon: 'Heart', skills: ['追星', '旅行'] },
];

// 实习经历
export const experiences: Experience[] = [
  {
    time: '2026.05 - 2026.08',
    org: '腾讯集团总部 CDG',
    role: '前端开发实习生',
    description: '负责腾讯理财通小秘AI理财管家模块，结合用户资产/行情热点/用户记忆，通过猜你想问/功能卡片/入口投放，升级个性化服务能力，提高月活；同时关注埋点规范上报/灰度控制/代码架构规范。\n使用与优化团队AI工作流，认识「阶段编排约束 + Skill沉淀方法 + 知识库维护」模式，提升开发效率与完成度；编写埋点数据分析Skill，沉淀取数与洞察能力，协助产品分析优化。',
  },
  {
    time: '2025.07 - 2025.10',
    org: '智悦云创科技有限公司',
    role: 'AI 应用工程师（前端）实习生',
    description:
      '面向大学生的AI简历优化平台，实习期间项目成功上线并获1000+用户关注；参与所有核心业务模块的开发维护，如简历优化流程/用户会员中心，完成40+功能点、150+任务项；\n优化接口调用逻辑与状态管理，修复多类数据异常与渲染问题，提升问题定位与解决能力；\n与后端、产品、测试等团队成员合作，完成功能的联调与优化，提升沟通与协作能力。',
  },
];

// 培训经历
export const trainingExperiences: Experience[] = [
  {
    time: '2024.12 - 2025.08',
    org: '百度 — 北京师范大学',
    role: '百度松果人才培养菁英班学员',
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

// 著作成果
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
    result: '进行文献调研、问卷调查、实地走访与数据分析，形成调研报告《珠海乐士文化区绘本地摊经济行业分析》，项目顺利结项。',
  },
];
