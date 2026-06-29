/**
 * 友情链接
 * TODO: 邀请你的朋友们填进来
 */
export interface FriendLink {
  name: string;
  url: string;
  avatar?: string;
  description: string;
  tags?: string[];
}

export const friends: FriendLink[] = [
  // 占位示例 —— 删掉换成真朋友的链接
  {
    name: 'Dragon',
    url: 'https://cjl20050909.github.io/acade-site/',
    description: '财税政策评估、发展经济学应用、微观计量经济学',
    tags: ['FIT'],
  }
];

/** 申请友链时给对方看到的本站信息 */
export const myLinkCard = {
  name: 'BobHuang',
  url: 'https://bobhuang666.github.io/',
  description: '北师大数据科学与大数据技术 · 算法竞赛 / 全栈开发',
  // 用作头像
  avatar: '/static/img/avatar.jpg',
};
