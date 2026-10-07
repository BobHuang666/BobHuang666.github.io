/**
 * 全站 UI 文案集中管理（单语言，不做 i18n）。
 *
 * 约定：
 * 1. 只放「用户看得见的中文」——标题 / 副标题 / 按钮 / 空状态 / 提示；
 *    图标名、路由、class、数值配置一律不放这里。
 * 2. 键名 camelCase，按「页面 / 区块」分组，层级不超过两层。
 * 3. 带变量的文案写成函数，参数名体现单位（count / minutes）。
 * 4. 渲染层不写死中文，统一从这里取。
 * 5. 下线功能时，同步删除对应文案。
 */

export const uiText = {
  /** 全站通用：按钮与通用提示 */
  common: {
    viewProjects: '查看项目',
    aboutMe: '个人介绍',
    contactMe: '联系我',
    demo: '在线演示',
    detail: '项目详情',
    back: '返回',
    backToList: '返回博客列表',
    /** 带阅读时长 */
    readingMin: (minutes: number) => `${minutes} 分钟阅读`,
    comments: '评论区',
    commentsHint: '基于 GitHub Discussions（giscus）· 需要 GitHub 账号',
    toc: '目录',
    notFound: '文章不存在',
  },

  /** 导航 */
  nav: {
    home: '主城',
    profile: '角色档案',
    projects: '任务中心',
    blog: '游戏攻略',
    more: '更多',
    friends: '友人帐',
    fandom: '秘密花园',
    travel: '足迹地图',
  },

  /** 页脚 */
  footer: {
    navTitle: '导航',
    builtWith: '本站使用 React + Vite + Tailwind 构建',
  },

  /** 相关跳转卡片：全站复用，避免各处硬编码文案不一致 */
  related: {
    home: { title: '返回主城', desc: '查看项目与技能概览' },
    blog: { title: '游戏攻略', desc: '读我写的文章' },
    friends: { title: '友人帐', desc: '友情链接' },
    fandom: { title: '秘密花园', desc: '追星专题' },
    travel: { title: '足迹地图', desc: '点亮去过的城市与出行路线' },
  },

  /** 首页各 section */
  home: {
    status: '在线 · 探索新副本中',
    /** 打字机轮播标语：text = 文本，hold = 打完后的停留毫秒 */
    taglines: [
      { text: '热爱编程的算法竞赛选手，专注于全栈开发与 AI 应用落地', hold: 2500 },
      { text: '算法竞赛选手 · ICPC / 蓝桥杯 / CCF 多项荣誉', hold: 2200 },
      { text: '全栈开发者 · Vue / React / Go / Python', hold: 2200 },
      { text: '正在腾讯 CDG 担任前端实习生', hold: 2500 },
    ],
    projectsTitle: '通关副本',
    projectsSub: '精选代表性项目，每个都从立项打通到上线/获奖',
    blogTitle: '游戏攻略',
    blogSub: '算法题解 / 项目复盘 / 学习笔记 —— 正在持续更新',
    viewAllPosts: '查看全部文章',
    awardsTitle: '历史荣誉',
    /** 带数量的副标题 */
    awardsSub: (count: number) => `累计 ${count} 项荣誉`,
    /** 带数量的「查看全部」 */
    viewAllAwards: (count: number) => `查看全部 ${count} 项荣誉`,
    skillsTitle: '技能点',
    skillsSub: '在校期间持续点亮的技能树 —— 涵盖语言、前端、后端与工程化',
    githubTitle: 'GitHub 战绩',
    githubSub: '来自 GitHub API 的实时数据 —— 仓库、热门项目、社交统计',
    moreTitle: '更多探索',
    moreSub: '除了主线任务，还有这些副本可以探索',
    contactTitle: '联系我',
    contactSub: '欢迎交流，一起进步',
    emailCopied: '邮箱已复制到剪贴板 ✓',
  },

  /** 奖项筛选器（其余级别直接用数据里的中文字面量，只有“全部”需要文案） */
  awards: {
    all: '全部',
    summary: (count: number) => `累计 ${count} 项荣誉`,
  },

  /** /profile 页面视图切换 */
  profile: {
    cardView: '卡片',
    timelineView: '时间线',
  },

  /** /blog 列表页 */
  blog: {
    title: '游戏攻略',
    subtitle: '技术笔记、项目复盘、学习记录 —— 慢慢写，慢慢更新',
    rss: 'RSS 订阅',
    searchLabel: '搜索',
    searchPlaceholder: '标题、标签…',
    categoryLabel: '分类',
    tagsLabel: '标签',
    clearFilters: '清空筛选',
    /** 带数量的结果统计 */
    found: (count: number) => `找到 ${count} 篇文章`,
    emptyTitle: '没有找到相关文章',
    emptyDesc: '尝试调整搜索条件或清空筛选',
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
      profileDesc: '基本信息、教育背景、技能专长、获奖、社会实践、科研',
      blog: '游戏攻略 / Blog',
      blogDesc: '所有博客文章列表',
      friends: '友人帐 / Friends',
      friendsDesc: '友情链接 & 友链申请',
      travel: '足迹地图 / Travel',
      travelDesc: '中国地级行政区足迹地图，含出行路径与交通方式',
      fandom: '秘密花园 / Fandom',
      fandomDesc: '追星专题 · 偶像墙、演唱会、线下打卡与周边收藏',
    },
  },

  /** /travel 页面 */
  travel: {
    title: '我去过的地方',
    subtitle: '中国地图&世界地图，把住过的、去过的、路过的地方都点亮。带箭头的是出行路径，图标代表那段路怎么走的。',
    loading: '地图数据加载中…',
    errorTitle: '地图数据加载失败',
    errorDesc: '检查网络后刷新页面重试',
    tabChina: '中国地图',
    tabWorld: '世界地图',
    dataSource:
      '中国底图来自阿里 DataV.GeoAtlas，世界底图来自 Natural Earth；边界均已简化，仅用于示意、不作测量依据',
  },
} as const;
