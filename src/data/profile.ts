// 基础个人信息（公开）
export const profile = {
  name: 'Bob Huang',
  title: '数据科学与大数据技术 本科 · 人工智能 研0',
  tagline: '热爱编程的算法竞赛选手，专注于全栈开发与 AI 应用落地',
  avatar: '/static/img/avatar.jpg',
  email: '2295672887@qq.com',
  // 出于隐私公开站点不展示手机号，保留为占位
  location: '北京师范大学',
  politicalStatus: '中共预备党员',
  // 社交链接
  github: 'https://github.com/BobHuang666',
  
  // 教育经历
  education: [
    {
      school: '北京师范大学',
      major: '人工智能',
      degree: '硕士',
      grade: '2027 级',
      period: '2027.09 - 2030.07',
    },
    {
      school: '北京师范大学',
      major: '数据科学与大数据技术',
      degree: '本科',
      grade: '2023 级',
      period: '2023.09 - 2027.07',
    },
  ],
} as const;

/** GitHub 用户名，由主页链接派生，供 GitHub 数据组件使用 */
export const githubUsername = profile.github.match(/github\.com\/([^/]+)/)?.[1] ?? '';
