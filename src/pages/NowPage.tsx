import { Sparkles, Code2, BookOpen, Coffee, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { RelatedLink } from '../components/RelatedLink';

/**
 * /now 页面 —— 仿 nownownow.com，记录"我最近在做什么"
 * TODO: 后续可以定期手动更新，或者改成读取 /src/data/now.ts
 */
const NowPage = () => {
  const lastUpdated = '2026-05-31';

  const sections = [
    {
      icon: Code2,
      title: '正在写的代码',
      items: [
        '腾讯 CDG 前端实习中（合规范围内的内容后续会公开分享）',
        '个人网站持续迭代 —— 你正在看的就是产物',
        '算法每日一题：保持 LeetCode 在线，准备秋招',
      ],
    },
    {
      icon: BookOpen,
      title: '正在读的书 / 学的东西',
      items: [
        '《Designing Data-Intensive Applications》——大数据方向必读',
        '大模型相关论文 + LangChain / RAG 实践',
        // TODO: 自由补充
      ],
    },
    {
      icon: Sparkles,
      title: '正在做的事',
      items: [
        'BNUZH 程序设计竞赛社 社长 —— 组织周赛 / 算法讲堂',
        '准备秋招 / 春招实习',
        '骑迹智联 VR 装置 大创课题持续推进中',
      ],
    },
    {
      icon: Coffee,
      title: '生活',
      items: [
        '在珠海，偶尔回潮州、北京',
        '咖啡 / 旅行 / 追星',
        // TODO: 自由补充
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="h-4 w-4" />
            最后更新：{lastUpdated}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            当前动态
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            灵感来自 <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">nownownow.com</a>（Derek Sivers 发起的 <code className="font-mono text-xs">/now</code> 运动）。比朋友圈更结构化，比博客更轻量，记录当下的状态。
          </p>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.section
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  <s.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  {s.title}
                </h2>
                <ul className="space-y-2 ml-7">
                  {s.items.map((it) => (
                    <li
                      key={it}
                      className="text-slate-700 dark:text-slate-300 leading-relaxed relative pl-4 before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-400"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RelatedLink to="/uses" emoji="🛠" title="装备清单" desc="我用的硬件 & 工具" />
            <RelatedLink to="/series" emoji="📚" title="专题系列" desc="博客按主题分类" />
            <RelatedLink to="/friends" emoji="🤝" title="友人帐" desc="友情链接 & 交换链接" />
            <RelatedLink to="/blog" emoji="📝" title="游戏攻略" desc="最新博客文章" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NowPage;
