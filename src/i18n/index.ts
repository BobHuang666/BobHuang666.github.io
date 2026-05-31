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
        awardsTitle: '历史战绩',
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
