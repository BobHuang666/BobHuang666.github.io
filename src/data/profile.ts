// 基础个人信息（公开）
export const profile = {
  name: 'Bob Huang',
  nameZh: 'Bob Huang',
  title: '数据科学与大数据技术 · 在读本科生',
  tagline: '热爱编程的算法竞赛选手，专注于全栈开发与 AI 应用落地',
  avatar: '/static/img/avatar.jpg',
  email: '2295672887@qq.com',
  // 出于隐私公开站点不展示手机号，保留为占位
  phone: '',
  location: '北京师范大学（珠海校区）',
  birthDate: '', // TODO: 如愿展示请填写
  status: '在线 · 探索新副本中',

  // 社交链接 - TODO: 请补充真实地址
  github: 'https://github.com/BobHuang666',
  blog: '', // 可填外部博客地址
  resumeUrl: '', // PDF 简历下载地址，可暂时留空

  // 教育
  education: {
    school: '北京师范大学（珠海校区）',
    level: '985',
    major: '数据科学与大数据技术',
    degree: '本科',
    grade: '2023 级',
    period: '2023.09 - 2027.07',
    politicalStatus: '中共预备党员',
    gpa: '3.5/4.0',
  },

  // 当前职务
  currentRole: 'BNUZH 程序设计竞赛社 社长',
} as const;
