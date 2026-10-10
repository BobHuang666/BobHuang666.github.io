/**
 * 友情链接
 */
export interface FriendLink {
  name: string;
  url: string;
  avatar?: string;
  description: string;
}

export const friends: FriendLink[] = [
  {
    name: 'Dragon',
    url: 'https://cjl20050909.github.io/acade-site/',
    description: '政府与市场经济学、政企关系、财税政策',
  },
  {
    name: 'Xiaoyi',
    url: 'http://sis.bobhuang.cn/',
    description: 'Sister',
  }
];

export const myLinkCard = {
  name: 'BobHuang',
  url: 'https://blog.bobhuang.cn/',
  description: '北师大数据科学与大数据技术 · 人工智能 · 全栈开发',
  avatar: '/static/img/avatar.jpg',
};
