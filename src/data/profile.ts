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

/** GitHub 用户名，由主页链接派生，供 GitHub 数据组件使用 */
export const githubUsername = profile.github.match(/github\.com\/([^/]+)/)?.[1] ?? '';
