/**
 * 全站中文文案集中管理。
 * 组件统一从这里取文案，渲染层不写死字符串。
 * 本站仅中文，已移除多语言能力（无 i18n 运行时、无语言切换）。
 */

export const copy = {
  /** 导航 */
  nav: {
    home: '主城',
    profile: '角色档案',
    projects: '任务中心',
    blog: '游戏攻略',
    more: '更多',
    friends: '友人帐',
    fandom: '秘密花园',
  },

  /** 按钮 */
  btn: {
    viewProjects: '查看项目',
    aboutMe: '个人介绍',
    contactMe: '联系我',
  },

  /** 首页各 section */
  home: {
    status: '在线 · 探索新副本中',
    projectsTitle: '通关副本',
    projectsSub: '精选代表性项目，每个都从立项打通到上线/获奖',
    blogTitle: '游戏攻略',
    blogSub: '算法题解 / 项目复盘 / 学习笔记 —— 正在持续更新',
    awardsTitle: '历史荣誉',
    /** 带数量的副标题 */
    awardsSub: (count: number) => `累计 ${count} 项荣誉 · 按级别筛选查看精选 6 项`,
    skillsTitle: '技能点',
    skillsSub: '在校期间持续点亮的技能树 —— 涵盖语言、前端、后端与工程化',
    githubTitle: 'GitHub 战绩',
    githubSub: '来自 GitHub API 的实时数据 —— 仓库、热门项目、社交统计',
    contactTitle: '联系我',
    contactSub: '对算法竞赛、全栈开发、AI 应用感兴趣？欢迎交流，一起进步。',
  },

  /** 奖项级别（其余级别直接用数据里的中文字面量，只有“全部”需要文案） */
  level: {
    all: '全部',
  },

  /** 通用 */
  misc: {
    /** 带阅读时长的文案 */
    readingMin: (n: number) => `${n} 分钟阅读`,
    comments: '评论区',
    commentsHint: '基于 GitHub Discussions（giscus）· 需要 GitHub 账号',
    toc: '目录',
    notFound: '文章不存在',
  },

  footer: {
    nav: '导航',
    builtWith: '本站使用 React + Vite + Tailwind 构建',
  },

  /** /friends 页面 */
  friends: {
    subtitle: 'Friends · 友情链接',
    heading: '友人帐',
    desc: '一些让我变得更好的人，与一些让我看见世界其他角落的网站。',
    apply: '申请友链',
    applyDesc: '欢迎技术友人 / 同好交换链接。建议双方先把对方放在自己站点，然后填写下面信息发邮件给我。',
    myCard: '我的友链卡片',
    copy: '复制',
    copied: '已复制',
    howToApply: '申请方式',
    step1: '把上面的卡片信息放到你的网站友链页',
    step2: '给我发邮件 / GitHub Issue 告知',
    step3: '我会尽快加上你的链接 ✨',
    mailBtn: '发邮件申请',
    issueBtn: '提 Issue',
  },

  /** 搜索：类型徽章文案 + 静态页条目文案 */
  search: {
    kind: { blog: '博客', project: '项目', award: '奖项', skill: '技能', page: '页面' },
    pages: {
      home: '主城 / Home',
      homeDesc: '个人主页，包含技能、项目、奖项、博客与联系方式',
      profile: '角色档案 / Profile',
      profileDesc: '基本信息、教育背景、获奖、课程、实习、科研',
      blog: '游戏攻略 / Blog',
      blogDesc: '所有博客文章列表',
      friends: '友人帐 / Friends',
      friendsDesc: '友情链接 & 友链申请',
    },
  },

  /** /profile 页面视图切换 */
  profile: {
    cardView: '卡片',
    timelineView: '时间线',
    radarView: '雷达图',
    listView: '列表',
  },
} as const;
