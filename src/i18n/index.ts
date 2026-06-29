import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

/**
 * i18n 渐进式策略：
 * - 关键 UI（导航 / Hero / 通用按钮）走 i18n
 * - 大段内容（项目描述、博客正文）暂保留中文，后续按需补充 EN
 */

const resources = {
  zh: {
    common: {
      // 导航
      nav: {
        home: '主城',
        profile: '角色档案',
        projects: '任务中心',
        blog: '游戏攻略',
        more: '更多',
        series: '专题系列',
        now: '当前动态',
        uses: '装备清单',
        friends: '友人帐',
        fandom: '秘密花园',
      },
      // 按钮
      btn: {
        viewProjects: '查看项目',
        aboutMe: '个人介绍',
        contactMe: '联系我',
        downloadCv: '简历下载',
        liveDemo: '在线演示',
        details: '项目详情',
        readMore: '阅读',
        backHome: '返回主城',
        viewAll: '查看全部',
      },
      // 首页 section
      home: {
        status: '在线 · 探索新副本中',
        majorPrefix: '·',
        skillsTitle: '技能点',
        skillsSub: '在校期间持续点亮的技能树 —— 涵盖语言、前端、后端与工程化',
        githubTitle: 'GitHub 战绩',
        githubSub: '来自 GitHub API 的实时数据 —— 仓库、热门项目、社交统计',
        projectsTitle: '通关副本',
        projectsSub: '精选代表性项目，每个都从立项打通到上线/获奖',
        blogTitle: '游戏攻略',
        blogSub: '算法题解 / 项目复盘 / 学习笔记 —— 正在持续更新',
        awardsTitle: '历史荣誉',
        awardsSubTpl: '累计 {{count}} 项荣誉 · 按级别筛选查看精选 6 项',
        contactTitle: '联系我',
        contactSub: '对算法竞赛、全栈开发、AI 应用感兴趣？欢迎交流，一起进步。',
      },
      // 奖项级别
      level: {
        all: '全部',
        international: '国际级',
        national: '国家级',
        provincial: '省级',
        school: '校级',
        college: '院系级',
      },
      // 杂
      misc: {
        readingMin: '{{n}} 分钟阅读',
        draft: '草稿',
        comments: '评论区',
        commentsHint: '基于 GitHub Discussions（giscus）· 需要 GitHub 账号',
        toc: '目录',
      },
      footer: {
        nav: '导航',
        contact: '联系',
        builtWith: '本站使用 React + Vite + Tailwind 构建',
      },
      // /now 页面
      now: {
        lastUpdated: '最后更新：',
        heading: '当前动态',
        intro: '灵感来自',
        introSuffix: '。比朋友圈更结构化，比博客更轻量，记录当下的状态。',
        sec_code: '正在写的代码',
        sec_reading: '正在读的书 / 学的东西',
        sec_doing: '正在做的事',
        sec_life: '生活',
      },
      // /uses 页面
      uses: {
        heading: '装备清单',
        intro: '灵感来自',
        introSuffix: '。这里记录我开发、学习、生活中常用的工具和装备 —— 也欢迎你推荐更好的。',
        hardware: '硬件',
        devtools: '开发工具',
        cli: '常用命令行',
        stack: '技术栈偏好',
        other: '其他',
      },
      // /friends 页面
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
      // /series 页面
      series: {
        heading: '专题系列',
        desc: '把零散的博客文章按主题组织成系列，方便按兴趣系统阅读。',
        articles: '篇文章',
        backToList: '返回专题列表',
        noPost: '这个专题还没有文章',
        noPostHint: '当博客文章带上',
        noPostHint2: '等标签时会自动归入',
        viewAll: '查看全部文章',
        matchTags: '匹配标签：',
      },
      // profile 页面
      profile: {
        tabBasic: '基本信息',
        tabSkills: '技能专长',
        tabAwards: '获奖经历',
        tabExp: '实习/学生工作',
        tabResearch: '科研课题',
        tabCourses: '课程成绩',
        tabInterests: '兴趣爱好',
        cardView: '卡片',
        timelineView: '时间线',
        radarView: '雷达图',
        listView: '列表',
      },
    },
  },
  en: {
    common: {
      nav: {
        home: 'Home',
        profile: 'Profile',
        projects: 'Projects',
        blog: 'Blog',
        more: 'More',
        series: 'Series',
        now: 'Now',
        uses: 'Uses',
        friends: 'Friends',
        fandom: 'Garden',
      },
      btn: {
        viewProjects: 'View Projects',
        aboutMe: 'About Me',
        contactMe: 'Contact',
        downloadCv: 'Download CV',
        liveDemo: 'Live Demo',
        details: 'Details',
        readMore: 'Read',
        backHome: 'Back Home',
        viewAll: 'View all',
      },
      home: {
        status: 'Online · Exploring new dungeons',
        majorPrefix: '·',
        skillsTitle: 'Skills',
        skillsSub: 'Languages · Frontend · Backend · Engineering',
        githubTitle: 'GitHub Stats',
        githubSub: 'Live data from GitHub API — repos, top projects & social',
        projectsTitle: 'Featured Projects',
        projectsSub: 'Hand-picked projects, each shipped or awarded',
        blogTitle: 'Blog',
        blogSub: 'Algorithm notes / project retros / learning logs',
        awardsTitle: 'Awards',
        awardsSubTpl: '{{count}} awards in total · Filter by level (top 6 shown)',
        contactTitle: 'Get in touch',
        contactSub:
          'Interested in competitive programming, full-stack or AI apps? Let’s talk.',
      },
      level: {
        all: 'All',
        international: 'International',
        national: 'National',
        provincial: 'Provincial',
        school: 'University',
        college: 'College',
      },
      misc: {
        readingMin: '{{n}} min read',
        draft: 'Draft',
        comments: 'Comments',
        commentsHint: 'Powered by GitHub Discussions (giscus) · GitHub login required',
        toc: 'Contents',
      },
      footer: {
        nav: 'Navigation',
        contact: 'Contact',
        builtWith: 'Built with React + Vite + Tailwind',
      },
      now: {
        lastUpdated: 'Last updated: ',
        heading: 'Now',
        intro: 'Inspired by',
        introSuffix: '. More structured than social media, lighter than a blog post.',
        sec_code: 'Currently coding',
        sec_reading: 'Currently reading / learning',
        sec_doing: 'Currently doing',
        sec_life: 'Life',
      },
      uses: {
        heading: 'Uses',
        intro: 'Inspired by',
        introSuffix: '. Tools and gear I use daily for dev, learning and life.',
        hardware: 'Hardware',
        devtools: 'Dev Tools',
        cli: 'CLI',
        stack: 'Tech Stack',
        other: 'Other',
      },
      friends: {
        subtitle: 'Friends · Link Exchange',
        heading: 'Friends',
        desc: 'People who make me better, and sites that show me other corners of the world.',
        apply: 'Add Your Link',
        applyDesc: 'Happy to exchange links with fellow devs. Add my card to your site first, then send me an email.',
        myCard: 'My Link Card',
        copy: 'Copy',
        copied: 'Copied!',
        howToApply: 'How to Apply',
        step1: 'Add my card info to your friends/links page',
        step2: 'Email me or open a GitHub Issue',
        step3: "I'll add your link as soon as possible ✨",
        mailBtn: 'Send Email',
        issueBtn: 'Open Issue',
      },
      series: {
        heading: 'Series',
        desc: 'Blog posts organized by topic for focused reading.',
        articles: 'articles',
        backToList: 'Back to series',
        noPost: 'No posts in this series yet',
        noPostHint: 'Posts tagged with',
        noPostHint2: 'will appear here automatically',
        viewAll: 'View all posts',
        matchTags: 'Tags: ',
      },
      profile: {
        tabBasic: 'Basic Info',
        tabSkills: 'Skills',
        tabAwards: 'Awards',
        tabExp: 'Experience',
        tabResearch: 'Research',
        tabCourses: 'Courses',
        tabInterests: 'Interests',
        cardView: 'Cards',
        timelineView: 'Timeline',
        radarView: 'Radar',
        listView: 'List',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    supportedLngs: ['zh', 'en'],
    defaultNS: 'common',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'bh:lang',
    },
    interpolation: { escapeValue: false },
  });

export default i18n;
