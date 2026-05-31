import type { Project, ProjectDetailData } from '../types';

/**
 * 项目数据 - 单一数据源
 * 数据来源：profile.md
 */

// 简化版（首页卡片用）
export const projects: Project[] = [
  {
    id: 'ink-ruler',
    title: '墨尺智慧作文教学平台',
    subtitle: '挑战杯项目 · 技术负责人',
    description:
      '面向中学生议论文写作的 AI 教学平台，对接团队训练的 LLM 实现自动批改、逻辑/语言/素材多维度评价。校赛第一名推荐至省赛，获软件著作权登记证书。',
    image: '/static/img/projects/ink-ruler-cover.jpg', // TODO: 替换真实截图
    imageGradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    tags: ['Vue3', 'TypeScript', 'Go', 'LLM', 'AI 教育'],
    link: 'https://bobhuang666.github.io/ink-ruler-public/',
    github: '', // TODO: 如有可补充
    timeline: '2024 - 至今',
    role: '技术负责人 / 全栈开发',
    highlight: '校赛第一 · 软件著作权',
  },
  {
    id: 'aicv-resume',
    title: 'AiCV 简历王 微信小程序',
    subtitle: '实习项目 · 已上线',
    description:
      '面向大学生的 AI 简历优化平台，实习期间上线获 1000+ 用户。参与简历上传/编辑/优化流程、面试题集、用户中心、会员充值等核心模块，完成 40+ 功能点。',
    image: '/static/img/projects/aicv-cover.jpg', // TODO: 替换真实截图
    imageGradient: 'from-indigo-500 via-purple-500 to-pink-500',
    tags: ['Vue3', 'uni-app', 'uView', 'SCSS', '小程序'],
    link: '', // TODO: 补小程序码或体验地址
    timeline: '2025.07 - 2025.10',
    role: 'AI 应用工程师（前端）实习生',
    highlight: '上线运营 · 1000+ 用户',
  },
  {
    id: 'igem-wiki',
    title: 'iGEM Wiki 前端开发',
    subtitle: '国际基因工程机器大赛',
    description:
      '国际基因工程机器大赛 Wiki 前端设计开发，使用 HTML+CSS+JS 实现响应式布局，设计 10+ 动态模块，处理 50MB+ 科研资料可视化，获最佳 Wiki 提名 + 团队 TOP10。',
    image: '/static/img/projects/igem-cover.jpg', // TODO: 替换真实截图
    imageGradient: 'from-amber-500 via-orange-500 to-rose-500',
    tags: ['HTML', 'CSS', 'JavaScript', '响应式设计', 'iGEM'],
    link: 'https://2024.igem.wiki/bnuzh-china/',
    timeline: '2024.03 - 2024.10',
    role: '前端开发 & 编程比赛策划',
    highlight: '全球 TOP10 · 最佳 Wiki 提名',
  },
];

// 详细版（详情页用）
export const projectsDetail: Record<string, ProjectDetailData> = {
  'ink-ruler': {
    ...projects[0],
    content: {
      overview: `墨尺智慧作文教学平台是面向中学生议论文写作的 AI 教学解决方案，作为「挑战杯」项目立项。我作为技术负责人，独立完成前后端架构设计与核心功能开发。

平台与潮州市磷溪中学百千万工程项目结对，与团队训练的 LLM 大模型服务对接，已成功获得软件著作权登记证书，并在校赛中获得第一名，推荐至省赛。`,
      features: [
        'AI 议论文自动批改，输出逻辑/语言/素材多维度评价',
        '修改痕迹可视化展示，支持学生对照学习',
        '语言学指标统计，量化分析作文质量',
        '1000+ 古籍素材分类查询与随机浏览',
        '关键词检索 + LLM 语义增强检索',
        '账户/会员/积分/签到体系，完整商业闭环',
      ],
      techStack: {
        frontend: ['Vue 3', 'TypeScript', 'Pinia', 'Vite', '响应式设计'],
        backend: ['Go', 'Gin / 类似框架', 'LLM API 调用封装', 'RESTful API'],
        database: ['MySQL / PostgreSQL', '素材数据建模', '用户体系'],
        tools: ['Git', 'Linux', 'Nginx', '生产环境部署'],
      },
      challenges: [
        '对接团队自研 LLM，调用稳定性与延迟控制',
        '议论文多维度评价的提示词工程与一致性',
        '1000+ 古籍素材的检索性能与语义匹配',
        '会员/积分体系与防作弊设计',
        '生产环境的部署稳定性与可观测性',
      ],
      solutions: [
        '封装统一 LLM 调用接口，做超时、重试、降级处理',
        '设计多 Prompt 模板与人工校验流程',
        '关键词倒排索引 + 向量化语义增强',
        '幂等订单 + 积分流水审计',
        '上线前压测 + 日志监控告警',
      ],
      results: [
        '校赛第一名，推荐至省赛',
        '获软件著作权登记证书',
        '与潮州市磷溪中学百千万工程结对落地',
        '生产环境稳定运行',
      ],
      lessons: [
        'AI 落地项目的「prompt 即代码」工程化思维',
        '全栈视角下的接口设计与解耦',
        '教育场景对易用性与可靠性的极致要求',
        '商业闭环设计需要业务、技术、合规共同推进',
      ],
    },
    team: ['BobHuang（技术负责人）', '团队 LLM 训练成员'],
  },
  'aicv-resume': {
    ...projects[1],
    content: {
      overview: `AiCV 简历王是一款面向大学生的 AI 简历优化微信小程序，在实习期间完成开发并上线，获得 1000+ 用户关注。

我参与了所有核心业务模块的开发与维护，深入了解了从需求评审、设计到开发、联调、上线的完整行业开发流程。`,
      features: [
        '简历上传 / 在线编辑 / AI 优化完整链路',
        '面试题集（按岗位/公司/难度分类）',
        '用户中心 / 个人简历管理',
        '会员充值 / 订单体系',
        '丰富的简历模板与导出功能',
      ],
      techStack: {
        frontend: ['Vue 3', 'uni-app', 'uView UI', 'SCSS', 'Vuex / Pinia'],
        backend: ['对接后端 RESTful API', '微信开放接口'],
        database: ['（后端团队负责）'],
        tools: ['HBuilderX', '微信开发者工具', 'Git', '敏捷开发流程'],
      },
      challenges: [
        '小程序平台限制下的复杂表单与富文本交互',
        '40+ 功能点 / 150+ 任务项的迭代节奏',
        '接口异常、数据渲染边界 case 较多',
        '与后端、产品、测试的协作沟通',
      ],
      solutions: [
        '抽离公共组件与 hooks，减少重复代码',
        '统一接口调用层与全局状态管理',
        '加强日志与错误提示，快速定位问题',
        '主动写 API 文档和联调用例，提高协作效率',
      ],
      results: [
        '小程序成功上线，1000+ 用户关注',
        '完成 40+ 功能点 / 150+ 任务项',
        '修复多类数据异常与渲染问题',
        '建立完整的小程序前端开发经验',
      ],
      lessons: [
        '真实业务比 toy project 复杂十倍，魔鬼在细节',
        '良好的工程化习惯能让迭代轻松一个量级',
        '跨角色沟通是产品最终能上线的关键',
        '主动反馈优于被动接受任务',
      ],
    },
  },
  'igem-wiki': {
    ...projects[2],
    content: {
      overview: `iGEM（国际基因工程机器大赛）是全球顶级合成生物学竞赛，每年吸引来自 40+ 国家的 400+ 支队伍参赛。作为 BNUZH-China 团队的 Wiki 组核心成员，我负责团队 Wiki 页面的前端设计与开发。

项目最终斩获 iGEM 全球 TOP10、金奖，以及最佳 Wiki 提名。`,
      features: [
        '响应式设计，适配桌面/平板/移动设备',
        '10+ 动态交互模块（数据可视化 / 动画效果）',
        '处理 50MB+ 文字、动画、图表等科研资料',
        '优化图片资源加载，提升页面性能',
        'SEO 友好结构 + 无障碍考虑',
        '合作举办两次校级编程大赛（20+ 算法题）',
      ],
      techStack: {
        frontend: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'CSS Grid & Flexbox', '响应式设计'],
        backend: ['静态网站托管', 'CDN 加速', '图片优化'],
        database: ['本地存储', '缓存策略'],
        tools: ['Git', 'Chrome DevTools', 'Lighthouse', 'Figma'],
      },
      challenges: [
        '50MB+ 科研资料的加载与展示优化',
        '设计复杂数据可视化与动画交互',
        '不同设备和浏览器的兼容性',
        '在严格 iGEM 规范下完成高质量交付',
      ],
      solutions: [
        '懒加载 + 分页 + 资源预取',
        'CSS3 动画 + 轻量 JS 实现交互',
        '渐进式增强 + 兼容性测试',
        '严格按 iGEM 官方规范开发',
      ],
      results: [
        '获 iGEM 最佳 Wiki 提名',
        '团队整体获金奖 + 全球 TOP10',
        '页面加载速度显著提升',
        '合作举办校级编程大赛 50+ 学生参与',
      ],
      lessons: [
        '前端不只是技术，更是用户体验的载体',
        '性能优化要从需求阶段就考虑',
        '响应式设计是现代 Web 开发的基本功',
        '团队协作和规范化交付决定项目上限',
      ],
    },
    team: ['BobHuang（前端开发）', 'BNUZH-China 团队'],
  },
};
