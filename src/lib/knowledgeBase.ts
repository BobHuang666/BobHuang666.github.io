import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { blogData } from '../data/blog';
import { skillsDetail, experiences, studentWork, courses } from '../data/skills';
import { awards } from '../data/awards';

export interface KBChunk {
  id: string;
  category: string;
  title: string;
  content: string;
  keywords: string[];
  link?: string;
}

export function buildKB(): KBChunk[] {
  const chunks: KBChunk[] = [];

  // ── 基本信息 ──────────────────────────────────────────────
  chunks.push({
    id: 'profile-basic',
    category: '基本信息',
    title: 'Bob Huang 的基本信息',
    content: [
      `姓名：${profile.name}`,
      `头衔：${profile.title}`,
      `简介：${profile.tagline}`,
      `学校：${profile.education.school}（${profile.education.level}高校）`,
      `专业：${profile.education.major}，${profile.education.degree}`,
      `年级：${profile.education.grade}，${profile.education.period}`,
      `GPA：${profile.education.gpa}`,
      `政治面貌：${profile.education.politicalStatus}`,
      `当前职务：${profile.currentRole}`,
      `状态：${profile.status}`,
      `GitHub：${profile.github}`,
    ].join('\n'),
    keywords: ['bob', 'huang', '个人', '基本', '信息', '学校', '专业', '大学', 'gpa', '学生', '是谁', '介绍', '北师大', '北京师范大学'],
  });

  // ── 项目 ──────────────────────────────────────────────────
  for (const p of projects) {
    chunks.push({
      id: `project-${p.id}`,
      category: '项目',
      title: p.title,
      content: [
        `项目：${p.title}`,
        `简介：${p.description}`,
        `技术栈：${p.tags.join('、')}`,
        `时间：${p.timeline}`,
        `角色：${p.role}`,
        `亮点：${p.highlight}`,
      ].join('\n'),
      keywords: ['项目', '作品', ...p.tags.map(t => t.toLowerCase()), ...p.title.replace(/\s/g, '').split('')],
      link: `#/projects/${p.id}`,
    });
  }

  // ── 奖项 ──────────────────────────────────────────────────
  chunks.push({
    id: 'awards',
    category: '奖项荣誉',
    title: '竞赛奖项与荣誉',
    content: awards
      .map(a => `${a.year} · ${a.level} · ${a.title}（${a.organization}）\n  ${a.description}`)
      .join('\n'),
    keywords: ['奖项', '荣誉', '获奖', '竞赛', 'icpc', 'igem', '蓝桥杯', '算法', '数学建模', 'ccf', 'csp', '奖学金'],
  });

  // ── 技能 ──────────────────────────────────────────────────
  chunks.push({
    id: 'skills',
    category: '技术技能',
    title: '技术栈与技能',
    content: skillsDetail.map(cat =>
      `【${cat.category}】\n` +
      cat.skills.map(s => `  ${s.name}（${s.stars}星）：${s.note}`).join('\n')
    ).join('\n\n'),
    keywords: ['技能', '技术', '编程', '语言', '前端', '后端', '框架', 'vue', 'react', 'python', 'c++', 'go', 'typescript', '算法', '工具'],
  });

  // ── 课程成绩 ────────────────────────────────────────────
  chunks.push({
    id: 'courses',
    category: '课程成绩',
    title: '主要课程成绩',
    content: '主要课程成绩：\n' + courses.map(c => `  ${c.name}：${c.score}分（${c.description}）`).join('\n'),
    keywords: ['课程', '成绩', '分数', '学习', '绩点', '成绩单', '科目'],
  });

  // ── 实习经历 ────────────────────────────────────────────
  chunks.push({
    id: 'experiences',
    category: '实习经历',
    title: '实习与工作经历',
    content: experiences.map(e =>
      `${e.time}｜${e.org}｜${e.role}\n  ${e.description}`
    ).join('\n\n'),
    keywords: ['实习', '经历', '腾讯', 'tencent', 'cdg', '前端', '工作', '职场', '就业', '公司'],
  });

  // ── 学生工作 ────────────────────────────────────────────
  chunks.push({
    id: 'student-work',
    category: '学生工作',
    title: '学生工作与社团',
    content: studentWork.map(e =>
      `${e.time}｜${e.org}｜${e.role}\n  ${e.description}`
    ).join('\n\n'),
    keywords: ['学生', '社团', '竞赛社', '团委', '社长', '组织', '活动', '干部'],
  });

  // ── 博客 ────────────────────────────────────────────────
  const pubPosts = blogData.filter(p => !p.isDraft);
  if (pubPosts.length > 0) {
    chunks.push({
      id: 'blog-list',
      category: '博客',
      title: '博客文章列表',
      content: '已发布博客文章：\n' + pubPosts.map(p =>
        `  《${p.title}》｜${p.category}｜标签：${p.tags.join('、')}\n  ${p.excerpt}`
      ).join('\n\n'),
      keywords: ['博客', '文章', '写作', '笔记', '分享', '读后感', '总结'],
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

// 简单 BM-like 关键字检索
function tokenize(text: string): string[] {
  const cjk = text.match(/[\u4e00-\u9fff]/g) ?? [];
  const words = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];
  return [...cjk, ...words];
}

export function retrieve(query: string, chunks: KBChunk[], topK = 4): KBChunk[] {
  const qTokens = tokenize(query);
  if (qTokens.length === 0) return chunks.slice(0, topK);

  const scored = chunks.map(chunk => {
    const haystack = (chunk.content + ' ' + chunk.title + ' ' + chunk.keywords.join(' ')).toLowerCase();
    let s = 0;
    for (const t of qTokens) {
      if (t.length < 1) continue;
      if (haystack.includes(t)) s += t.length >= 2 ? 3 : 1;
      for (const kw of chunk.keywords) {
        if (kw.includes(t) || t.includes(kw)) s += 1;
      }
    }
    return { chunk, s };
  });

  return scored
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, topK)
    .map(x => x.chunk);
}

// 构建 RAG 系统提示词
export function buildSystemPrompt(chunks: KBChunk[]): string {
  const context = chunks.map(c => `【${c.category}：${c.title}】\n${c.content}`).join('\n\n---\n\n');
  return `你是 Bob Huang 个人网站的 AI 助手，名叫「小bot」。Bob 是一名北京师范大学（珠海校区）数据科学与大数据技术专业的本科生，热爱算法竞赛、全栈开发与 AI 应用。

你只负责回答关于 Bob 的相关问题。对于与 Bob 无关的问题，请礼貌地说明你只能介绍 Bob 的信息。

回答要简洁、友好、有温度，以中文为主，可适当使用 Markdown 格式。

以下是从站内检索到的相关资料，请基于此作答：

${context}`;
}

// 生成无 API Key 的模板回复（直接整合检索结果）
export function fallbackReply(chunks: KBChunk[]): string {
  if (chunks.length === 0) {
    return '抱歉，我没有找到相关信息。你可以访问 [关于我](/profile) 页面了解更多，或者换个关键词再问问 😊';
  }
  const parts = chunks.map(c => `**${c.category}：${c.title}**\n\n${c.content.split('\n').map(l => l.trimStart()).join('\n')}`);
  return `根据站内资料，以下是相关信息：\n\n${parts.join('\n\n---\n\n')}\n\n> 💡 配置 API Key 后可获得更自然的对话体验`;
}
