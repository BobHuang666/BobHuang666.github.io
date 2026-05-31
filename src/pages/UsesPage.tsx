import { motion } from 'framer-motion';
import { Laptop, Code2, Terminal, Layers, Music } from 'lucide-react';
import { RelatedLink } from '../components/RelatedLink';

/**
 * /uses 页面 —— 装备清单（仿 uses.tech）
 * TODO: 按实际使用情况调整
 */
const UsesPage = () => {
  const categories = [
    {
      icon: Laptop,
      title: '硬件',
      items: [
        // TODO: 替换为真实设备型号
        { name: '笔记本', value: '待补充（如：MacBook Pro M3）' },
        { name: '显示器', value: '待补充' },
        { name: '键盘', value: '待补充' },
        { name: '鼠标', value: '待补充' },
        { name: '耳机', value: '待补充' },
      ],
    },
    {
      icon: Code2,
      title: '开发工具',
      items: [
        { name: '编辑器', value: 'VS Code · Cursor · WebStorm' },
        { name: '终端', value: 'iTerm2 · Zsh + Oh My Zsh' },
        { name: '版本管理', value: 'Git · GitHub · 工蜂' },
        { name: '调试', value: 'Chrome DevTools · Postman' },
        { name: 'AI 助手', value: 'ChatGPT · Claude · CodeBuddy' },
      ],
    },
    {
      icon: Terminal,
      title: '常用命令行',
      items: [
        { name: '包管理', value: 'npm · pnpm · brew' },
        { name: '导航', value: 'fzf · ripgrep · fd' },
        { name: '进程查看', value: 'htop · lsof' },
        { name: '文件传输', value: 'rsync · scp' },
      ],
    },
    {
      icon: Layers,
      title: '技术栈偏好',
      items: [
        { name: '前端框架', value: 'Vue 3 / React 18' },
        { name: '样式方案', value: 'Tailwind CSS / SCSS' },
        { name: '构建工具', value: 'Vite · uni-app' },
        { name: '后端语言', value: 'Go / Python' },
        { name: '数据库', value: 'MySQL · SQLite' },
      ],
    },
    {
      icon: Music,
      title: '其他',
      items: [
        { name: '笔记', value: 'Notion · Obsidian' },
        { name: '设计', value: 'Figma' },
        { name: '音乐', value: 'Apple Music / 网易云' },
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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            装备清单
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
            灵感来自 <a href="https://uses.tech" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">uses.tech</a>。这里记录我开发、学习、生活中常用的工具和装备 —— 也欢迎你推荐更好的。
          </p>

          <div className="space-y-8">
            {categories.map((cat, i) => (
              <motion.section
                key={cat.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                className="card-base p-6"
              >
                <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  <cat.icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  {cat.title}
                </h2>
                <dl className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
                  {cat.items.map((item) => (
                    <div key={item.name} className="contents">
                      <dt className="text-slate-500 dark:text-slate-400">{item.name}</dt>
                      <dd className="text-slate-800 dark:text-slate-200">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </motion.section>
            ))}
          </div>

          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RelatedLink to="/now" emoji="✨" title="当前动态" desc="我最近在做什么" />
            <RelatedLink to="/blog" emoji="📝" title="游戏攻略" desc="最新博客文章" />
            <RelatedLink to="/series" emoji="📚" title="专题系列" desc="按主题查看博客" />
            <RelatedLink to="/profile" emoji="🎮" title="角色档案" desc="完整简历与技能详情" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UsesPage;
