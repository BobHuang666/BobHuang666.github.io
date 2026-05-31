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
    name: '示例朋友 A',
    url: 'https://example.com',
    description: '前端开发 · 摄影爱好者',
    tags: ['Frontend'],
  },
  {
    name: '示例朋友 B',
    url: 'https://example.com',
    description: '后端 · Go / Rust',
    tags: ['Backend'],
  },
  {
    name: 'BNUZH 程设社',
    url: 'https://github.com/BobHuang666',
    description: '北师大珠海校区程序设计竞赛社',
    tags: ['社团'],
  },
];

/** 申请友链时给对方看到的本站信息 */
export const myLinkCard = {
  name: 'BobHuang',
  url: 'https://bobhuang666.github.io/',
  description: '北师大数据科学与大数据技术 · 算法竞赛 / 全栈开发',
  // 用作头像
  avatar: '/static/img/avatar.jpg',
};
