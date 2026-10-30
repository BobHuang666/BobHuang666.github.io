import { profile, skillGroups, hobbies, experiences, trainingExperiences, practiceExperiences, studentWork, works, research } from '../../data/profile';
import { projects } from '../../data/projects';
import { blogData } from '../../data/blog';
import { awards } from '../../data/awards';
import { travelPlaces, worldPlaces, travelTrips } from '../../data/travel';
import { idols, concerts, checkIns, collections, fandomConfig, lessons } from '../../data/fandom';
import { friends, myLinkCard } from '../../data/friends';
import { uiText } from '../../data/uiText';
import { formatAwardDate } from '../../utils/awardDate';

export interface KBChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  link?: string;
  /** 相关度权重：兜底性 / 泛匹配的 chunk 设 <1，避免被捎带进无关回答 */
  weight?: number;
}

/** 与页面一致的「即将赴约」判断（date 为 ISO 字符串） */
const isUpcomingDate = (date: string) => new Date(`${date}T23:59:59`).getTime() >= Date.now();

export function buildKB(): KBChunk[] {
  const chunks: KBChunk[] = [];

  // ── 基本信息 ──────────────────────────────────────────────
  const basicLines = [
    `姓名：${profile.name}`,
    `头衔：${profile.title}`,
    `学校：${[...new Set(profile.education.map((e) => e.school))].join('、')}`,
    `专业：${profile.education.map((e) => `${e.major}（${e.degree}，${e.period}）`).join('；')}`,
    `政治面貌：${profile.politicalStatus}`,
    `证书：${profile.certificates.map((c) => `${c.name}（${c.date}）`).join('、')}`,
    `兴趣爱好：${hobbies.flatMap((h) => h.skills).join('、')}`,
    `邮箱：${profile.email}`,
    `GitHub：${profile.github}`,
  ];
  if (profile.tagline) basicLines.splice(2, 0, `简介：${profile.tagline}`);
  chunks.push({
    id: 'profile-basic',
    category: '基本信息',
    title: 'Bob Huang 的基本信息',
    content: basicLines.join('\n'),
    keywords: ['bob', 'huang', '个人', '基本', '信息', '学校', '专业', '大学', 'gpa', '学生', '是谁', '背景', '简历', '资料', '北师大', '北京师范大学', '珠海', '人工智能', '硕士', '研0', '保研', '党员', '邮箱', '联系'],
    link: '#/profile',
  });

  // ── 项目 ──────────────────────────────────────────────────
  for (const p of projects) {
    chunks.push({
      id: `project-${p.id}`,
      category: '项目',
      title: p.title,
      content: [
        `项目：${p.title}（${p.subtitle}）`,
        `简介：${p.description}`,
        `技术栈：${p.tags.join('、')}`,
        `时间：${p.timeline}`,
        `角色：${p.role}`,
        `亮点：${p.highlight}`,
        p.link ? `在线访问：${p.link}` : '',
        p.github ? `源码：${p.github}` : '',
      ].filter(Boolean).join('\n'),
      keywords: ['项目', '项目经历', '作品', ...p.tags.map(t => t.toLowerCase()), ...p.title.replace(/\s/g, '').split('')],
      link: `#/projects/${p.id}`,
    });
  }

  // ── 奖项 ──────────────────────────────────────────────────
  chunks.push({
    id: 'awards',
    category: '奖项荣誉',
    title: '竞赛奖项与荣誉',
    content: awards
      .map(a => `${formatAwardDate(a.year, a.month, a.day)} · ${a.level} · ${a.title}（${a.organization}）`)
      .join('\n'),
    keywords: ['奖项', '荣誉', '获奖', '竞赛', 'icpc', 'igem', '蓝桥杯', '算法', '数学建模', 'ccf', 'csp', '奖学金', 'ccpc', '天梯赛', '京师杯'],
    link: '#/profile',
  });

  // ── 技能 ──────────────────────────────────────────────────
  chunks.push({
    id: 'skills',
    category: '技术技能',
    title: '技术栈与技能',
    content: skillGroups.map(cat =>
      `【${cat.name}】\n` + cat.skills.map(s => `  ${s}`).join('\n')
    ).join('\n\n'),
    keywords: ['技能', '技术', '编程', '语言', '前端', '后端', '框架', 'vue', 'react', 'python', 'c++', 'go', 'typescript', '算法', '工具', 'mysql', 'hadoop', 'spark', 'flink', 'java'],
    link: '#/profile',
  });

  // ── 实习经历 ────────────────────────────────────────────
  chunks.push({
    id: 'experiences',
    category: '实习经历',
    title: '实习与工作经历',
    content: experiences.map(e =>
      `${e.time}｜${e.org}｜${e.role}\n  ${e.description}`
    ).join('\n\n'),
    keywords: ['实习', '经历', '腾讯', 'tencent', 'cdg', '理财通', '前端', '工作', '职场', '就业', '公司', '智悦云创', 'aicv'],
    link: '#/profile',
  });

  // ── 培训经历 ────────────────────────────────────────────
  chunks.push({
    id: 'training',
    category: '培训经历',
    title: '培训与训练营经历',
    content: trainingExperiences.map(e =>
      `${e.time}｜${e.org}｜${e.role}\n  ${e.description}`
    ).join('\n\n'),
    keywords: ['培训', '训练营', '百度', '松果', '菁英班', '字节跳动', '字节', 'bytedance'],
    link: '#/profile',
  });

  // ── 学生工作 ────────────────────────────────────────────
  chunks.push({
    id: 'student-work',
    category: '学生工作',
    title: '学生工作与社团',
    content: studentWork.map(e =>
      `${e.time}｜${e.org}｜${e.role}\n  ${e.description}`
    ).join('\n\n'),
    keywords: ['学生', '社团', '竞赛社', '团委', '社长', '组织', '活动', '干部', '程序设计竞赛社', '科技创新协会', '书院'],
    link: '#/profile',
  });

  // ── 社会实践 ──────────────────────────────────────────
  chunks.push({
    id: 'practice',
    category: '实践经历',
    title: '社会实践经历',
    content: practiceExperiences.map(e =>
      `${e.time}｜${e.org}｜${e.role}\n  ${e.description}`
    ).join('\n\n'),
    keywords: ['社会实践', '实践', '调研', '教育国情', '队长', '组长', '志愿', '助学', '训练营', '返母校'],
    link: '#/profile',
  });

  // ── 著作成果 ──────────────────────────────────────────
  chunks.push({
    id: 'works',
    category: '著作成果',
    title: '专利与软件著作权',
    content: works.map(w =>
      `${w.title}（${w.type}，排名第 ${w.rank}）\n  ${w.meta.map(m => `${m.label}：${m.value}`).join('；')}`
    ).join('\n\n'),
    keywords: ['专利', '软著', '软件著作权', '著作', '发明', 'vr', '骑行', '墨尺', '作文'],
    link: '#/profile',
  });

  // ── 科研 / 课题 ──────────────────────────────────────
  chunks.push({
    id: 'research',
    category: '科研课题',
    title: '科研与课题项目',
    content: research.map(r =>
      `${r.title}（${r.level} · ${r.source} · ${r.period}${r.leader ? ` · 负责人：${r.leader}` : ''}）\n  ${r.result.split('\n')[0]}`
    ).join('\n\n'),
    keywords: ['科研', '课题', '大创', 'research', '京师杯', '朋辈研学', '地摊经济', '公私协创', 'vr', '骑行'],
    link: '#/profile',
  });

  // ── 追星：总览 + 偶像墙 ──────────────────────────────
  chunks.push({
    id: 'fandom-overview',
    category: '追星日记',
    title: '追星总览与偶像墙',
    content: [
      fandomConfig.intro,
      `追星起点：${fandomConfig.fanSince} 年（至今约 ${new Date().getFullYear() - Number(fandomConfig.fanSince)} 年）`,
      `看过的现场：${concerts.length} 场｜线下打卡：${checkIns.length} 次｜珍藏周边：${collections.length} 件`,
      '偶像墙：',
      ...idols.map(i => `  ${i.name}（${i.group ?? ''}${i.since ? `，${i.since} 年入坑` : ''}）`),
      ...(lessons.filter(l => l && l !== 'TODO').length
        ? ['我从他们身上学到的：', ...lessons.filter(l => l && l !== 'TODO').map(l => `  ${l}`)]
        : []),
    ].join('\n'),
    keywords: ['追星', '偶像', '明星', '爱豆', '张艺兴', 'lay', 'exo', 'nct', 'red velvet', '泰妍', 'taeyeon', 'super junior', 'r.e.d', '染色体', 'sm', '主推', '入坑'],
    link: '#/fandom',
  });

  // ── 追星：演唱会 ────────────────────────────────────
  chunks.push({
    id: 'fandom-concerts',
    category: '追星日记',
    title: '演唱会与现场记录',
    content: '演出记录（★ 为即将赴约）：\n' + concerts
      .map(c => `${isUpcomingDate(c.date) ? '★ ' : ''}${c.date}｜${c.idol}｜《${c.tour}》｜${c.city} ${c.venue}${c.highlight ? `\n    ${c.highlight}` : ''}`)
      .join('\n'),
    keywords: ['演唱会', '现场', 'concert', '巡演', '香港', '澳门', '深圳', '广州', '济州', '跨年', '音乐会', '音乐节', '晚会'],
    link: '#/fandom',
  });

  // ── 追星：打卡与收藏 ────────────────────────────────
  chunks.push({
    id: 'fandom-checkins',
    category: '追星日记',
    title: '线下打卡与周边收藏',
    content: [
      '线下打卡：',
      ...checkIns.map(ci => `  ${ci.date}｜${ci.idol}｜${ci.place}${ci.note ? `（${ci.note}）` : ''}`),
      `周边收藏共 ${collections.length} 件，含：${collections.filter(c => c.note).map(c => `${c.name}（${c.idol}）`).join('、')}`,
    ].join('\n'),
    keywords: ['打卡', '应援', '周边', '收藏', '小卡', '专辑', '票根', '应援棒', '小羊蹄', '灯箱'],
    link: '#/fandom',
  });

  // ── 旅行 ────────────────────────────────────────────
  const lived = travelPlaces.filter(p => p.status === 'lived');
  const visited = travelPlaces.filter(p => p.status === 'visited' || p.status === 'transit');
  const countries = [...new Set(worldPlaces.map(p => p.name))].filter(n => n !== '中国');
  chunks.push({
    id: 'travel-overview',
    category: '足迹地图',
    title: '旅行足迹与出行记录',
    content: [
      uiText.travel.subtitle,
      `住过的城市：${lived.map(p => `${p.name.replace(/市|特别行政区$/, '')}（${p.visits[0]?.date.slice(0, 4)} 年起）`).join('、')}`,
      `国内去过的城市（${visited.length} 个）：${visited.map(p => p.name.replace(/市$/, '')).join('、')}`,
      `国外：${countries.join('、')}（济州岛、西归浦）`,
      `出行记录 ${travelTrips.length} 条：`,
      ...travelTrips.map(t => `  ${t.dateRange[0]}｜${t.title}（${t.legs.length} 段）`),
    ].join('\n'),
    keywords: ['旅行', '旅游', '足迹', '地图', '城市', '去过', '住过', '出行', '行程', '长江行', '西安', '重庆', '济州', '韩国', '北京', '深圳', '珠海', '潮州', '汕头', '马拉松', '音乐节'],
    link: '#/travel',
  });

  // ── 友链 ────────────────────────────────────────────
  chunks.push({
    id: 'friends',
    category: '友人帐',
    title: '友情链接与友链申请',
    content: [
      '友情链接：',
      ...friends.map(f => `  ${f.name}｜${f.url}｜${f.description}`),
      `Bob 的站点：${myLinkCard.url}（${myLinkCard.description}）`,
      '友链申请方式：先把对方的卡片信息放到自己网站的友链页，再发邮件或提 GitHub Issue 告知；也可在友人帐页面用「生成我的名片」功能输入口令生成加密名片并导出图片。',
    ].join('\n'),
    keywords: ['友链', '友情链接', '朋友', '友人帐', '申请', '名片', 'dragon', 'xiaoyi', '交换链接'],
    link: '#/friends',
  });

  // ── 网站导航 ────────────────────────────────────────
  chunks.push({
    id: 'site-map',
    category: '网站指南',
    title: '网站结构与功能',
    weight: 0.55, // 内容覆盖所有板块话题词，降权防止被捎带进具体问题的回答
    content: [
      '这是 Bob Huang 的个人网站（https://blog.bobhuang.cn），主要页面：',
      '  主城 /（首页）：项目副本、博客、荣誉、技能点、联系方式',
      '  角色档案 /profile：教育背景、技术栈、证书、奖项、实习、培训、学生工作、实践、著作、科研',
      '  任务中心（首页项目区）：四个代表性项目详情',
      '  游戏攻略 /blog：博客文章（算法题解、项目复盘、学习笔记、游记）',
      '  足迹地图 /travel：中国&世界地图的旅行足迹、出行路径与里程',
      '  追星日记 /fandom：偶像墙、演唱会记录、线下打卡、周边收藏',
      '  友人帐 /friends：友情链接、友链申请与加密名片生成',
      '全站功能：搜索、AI 助手（小bot，就是我）、文章评论（基于 GitHub Discussions 的 giscus）、PWA 离线安装。',
      `联系 Bob：邮箱 ${profile.email}，GitHub ${profile.github}`,
    ].join('\n'),
    keywords: ['网站', '导航', '页面', '功能', '搜索', '评论', 'giscus', 'pwa', '怎么', '哪里', '联系', '邮箱', 'github', '博客', '助手'],
    link: '#/',
  });

  // ── 博客 ────────────────────────────────────────────────
  const pubPosts = blogData.filter(p => !p.isDraft);
  if (pubPosts.length > 0) {
    chunks.push({
      id: 'blog-list',
      category: '博客',
      title: '博客文章列表',
      weight: 0.75, // 聚合全部文章摘要、泛匹配度高，略降权
      content: '已发布博客文章：\n' + pubPosts.map(p =>
        `  《${p.title}》｜${p.category}｜标签：${p.tags.join('、')}\n  ${p.excerpt}`
      ).join('\n\n'),
      keywords: ['博客', '文章', '写作', '笔记', '分享', '读后感', '总结'],
      link: '#/blog',
    });
    for (const post of pubPosts) {
      chunks.push({
        id: `blog-${post.id}`,
        category: '博客',
        title: post.title,
        content: `《${post.title}》\n分类：${post.category}\n标签：${post.tags.join('、')}\n摘要：${post.excerpt}`,
        keywords: ['博客', ...post.tags.map(t => t.toLowerCase()), ...post.title.split('')],
        link: `#/blog/${post.id}`,
      });
    }
  }

  return chunks;
}

/** 无区分度的常用字：单字匹配时跳过，避免「有/的/是」之类把所有 chunk 都点亮 */
const STOP_CHARS = new Set('的了呢吗吧呀哦嘛你你我他她它这那个有些什在和与跟就都很最也还又把被对让给是哪过会要能可以'.split(''));

/**
 * 关键字优先的轻量检索：
 * 1. 中文查询按「连续汉字的二元词组」匹配（比单字精度高一个量级）；
 * 2. 命中优先级：关键字精确 > 关键字包含 > 标题 > 正文；
 * 3. 按chunk 权重（weight）打折后，只保留与最优结果明显相近的条目——
 *    相关性弱的内容不再被「凑满 topK」带进回答。
 */
export function retrieve(query: string, chunks: KBChunk[], topK = 4): KBChunk[] {
  const lower = query.toLowerCase();
  const grams = [...new Set(
    (lower.match(/[\u4e00-\u9fff]{2,}/g) ?? []).flatMap(run =>
      Array.from({ length: run.length - 1 }, (_, i) => run.slice(i, i + 2)),
    ),
  )];
  const words = lower.match(/[a-z0-9]{2,}/g) ?? [];
  const chars = (lower.match(/[\u4e00-\u9fff]/g) ?? []).filter(c => !STOP_CHARS.has(c));

  if (grams.length === 0 && words.length === 0 && chars.length === 0) return [];

  const scored = chunks.map(chunk => {
    const title = chunk.title.toLowerCase();
    const content = chunk.content.toLowerCase();
    const kws = chunk.keywords.map(k => k.toLowerCase());
    let s = 0;
    for (const g of grams) {
      if (kws.some(k => k === g)) s += 5;
      else if (kws.some(k => k.includes(g))) s += 3;
      else if (title.includes(g)) s += 3;
      else if (content.includes(g)) s += 1.5;
    }
    for (const w of words) {
      if (kws.some(k => k === w || k.includes(w) || w.includes(k))) s += 4;
      else if (content.includes(w) || title.includes(w)) s += 2;
    }
    for (const c of chars) {
      if (kws.some(k => k.includes(c))) s += 1.5;
    }
    return { chunk, s: s * (chunk.weight ?? 1) };
  });

  const hits = scored.filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  if (hits.length === 0) return [];
  const best = hits[0].s;
  return hits
    .filter(x => x.s >= Math.max(3, best * 0.45))
    .slice(0, topK)
    .map(x => x.chunk);
}

// 构建 RAG 系统提示词
export function buildSystemPrompt(chunks: KBChunk[]): string {
  const context = chunks.map(c => `【${c.category}：${c.title}】\n${c.content}`).join('\n\n---\n\n');
  return `你是 Bob Huang 个人网站的 AI 助手，名叫「小bot」。Bob 是北京师范大学的本科生（数据科学与大数据技术专业，2023 级），已保研本校人工智能硕士（2027 年入学，目前研0），热爱算法竞赛、全栈开发与 AI 应用。

你只负责回答关于 Bob 和他的网站的问题。对于无关问题，请礼貌地说明你只能介绍 Bob 的信息。

网站有这些板块：首页（主城）、角色档案 /profile、博客 /blog、足迹地图 /travel（旅行）、追星日记 /fandom（追星）、友人帐 /friends（友链）。回答时可以在末尾附上相关页面链接（如 [角色档案](#/profile)）。

回答要简洁、友好、有温度，以中文为主，可适当使用 Markdown 格式。资料里没有的信息不要编造。

以下是从站内检索到的相关资料，请基于此作答：

${context}`;
}

// 生成无 API Key 的模板回复（直接整合检索结果）
export function fallbackReply(chunks: KBChunk[]): string {
  if (chunks.length === 0) {
    return '抱歉，我没有找到相关信息。你可以访问 [角色档案](#/profile) 页面了解更多，或者换个关键词再问问 😊';
  }
  const parts = chunks.map(c => {
    const linkLine = c.link ? `\n\n👉 [查看相关页面](${c.link})` : '';
    return `**${c.category}：${c.title}**\n\n${c.content.split('\n').map(l => l.trimStart()).join('\n')}${linkLine}`;
  });
  return `根据站内资料，以下是相关信息：\n\n${parts.join('\n\n---\n\n')}\n\n> 💡 配置 API Key 后可获得更自然的对话体验`;
}
