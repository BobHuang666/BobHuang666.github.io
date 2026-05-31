/**
 * 追星专题数据 —— 隐私可控
 *
 * 配置项：
 * - PASSWORD: 留空 = 公开，填写 = 需要输入访问密码（仅本地校验，非安全用途）
 * - showRealName: false 时隐藏明星本名，只显示昵称
 *
 * 数据本身完全静态，可以随时调整，不会泄露任何敏感信息
 */
export interface Idol {
  /** 显示名（可以是昵称） */
  name: string;
  /** 真名 / 全名（可选） */
  fullName?: string;
  /** 团体/公司 */
  group?: string;
  /** 出道日 / 生日 */
  date?: string;
  /** 一句话理由 */
  reason: string;
  /** 入坑时间 */
  since?: string;
  /** 主推程度 */
  level: 'main' | 'sub' | 'casual';
  /** 头像渐变色 fallback */
  color: string;
}

export const fandomConfig = {
  /** 留空 = 公开访问。填密码后访问页面前需输入（仅本地 JS 校验） */
  password: '',
  /** 是否显示明星全名（关闭可只显示昵称） */
  showRealName: true,
  intro:
    '在写代码与卷算法之外，「追星」是我重要的能量来源。这里记录那些让我开心、坚持、变更好的人。',
};

/**
 * TODO: 把示例数据替换成你真正喜欢的明星
 * level 说明：main = 主推 · sub = 副推 · casual = 关注
 */
export const idols: Idol[] = [
  {
    name: '主推一号',
    fullName: '（待补充）',
    group: '（团体 / 公司）',
    since: '202X 年',
    reason:
      '为什么喜欢 ta —— 比如「舞台表现力惊艳，每次看 live 都能被治愈」',
    level: 'main',
    color: 'from-pink-500 via-rose-500 to-amber-400',
  },
  {
    name: '主推二号',
    fullName: '（待补充）',
    group: '（团体）',
    since: '202X 年',
    reason: '理由占位 —— 等你填上自己喜欢的明星',
    level: 'main',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
  },
  {
    name: '副推',
    fullName: '（待补充）',
    group: '（团体）',
    reason: '次要喜欢的明星，可以多列几个',
    level: 'sub',
    color: 'from-emerald-500 to-cyan-500',
  },
];

/**
 * "我从他们身上学到的"
 * TODO: 改成你自己的真实感悟
 */
export const lessons: string[] = [
  '坚持的力量 —— 每天进步一点点，比偶尔的爆发更重要',
  '保持热爱 —— 把热爱具体化成可量化的行动',
  '专业 ≠ 套路 —— 真诚永远是最稀缺的能力',
];
