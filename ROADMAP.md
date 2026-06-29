# Roadmap · 个人主页迭代规划

> 本文记录大改造历程，以及未来可以继续打磨的方向。
> 优先级：🔴 P0 必做 · 🟠 P1 应做 · 🟡 P2 可做 · 🟢 P3 探索

---

## 🎯 当前状态（v3.3）

整站已完成 **9 个大版本** 的迭代，从一个套模板的简单 SPA 演化为：

- 📱 **11 个路由页面** + 项目/博客/专题 3 套详情页
- 🧩 **50+ 复用组件**，单一数据源（`src/data/` 统一管理）
- 🌐 **中英双语全覆盖**（含 Now/Uses/Friends/Series 内页）+ 暗色模式 + ⌘K 全站搜索
- 📝 **Markdown 博客** + TOC + 代码高亮 + 阅读进度 + giscus 评论 + KaTeX + Mermaid + **上下篇导航**
- 🚀 **PWA**（skipWaiting + clientsClaim + 分层缓存策略）+ 路由懒加载 + 骨架屏 + 代码分割
- 🎨 **Hero 鼠标视差 + Aurora 极光 + canvas 粒子星空 + 打字机**视觉特效
- 📊 GitHub 实时数据 + 贡献热力图 + GoatCounter + Web Vitals
- 🔍 **动态 SEO**：所有内页 title/description 随路由更新
- 🏆 **奖项时间线视图**（卡片/时间线可切换）
- 📡 **技能雷达图**（列表/雷达图可切换，纯 SVG）
- 🖼 **图片 Lightbox** 放大查看
- ⬆️ **智能回到顶部按钮**（环形进度圈 + 玻璃拟态 + tooltip）
- 🧭 导航栏 **弹簧滑动下划线** 活跃指示器
- 🌓 **暗色模式切换动画**（View Transition API 圆形 clip-path 擦除）
- 🖼 **专题封面图**（SeriesIndex 卡片 + Detail 页 header 封面叠加）
- 👤 **通用 Avatar 组件**（旋转光环 / 状态圆点 / SVG 降级，首页与 Profile 统一复用）
- 🕐 **精准阅读时间估算**（中文字符 ÷350 / 英文单词 ÷200，剥离 Markdown 后计算）
- 🤖 **GitHub Actions 全自动 CI/CD** + Husky + 体积守门 + Lighthouse 评分

构建产物（gzip）：首屏关键 238KB · 主入口 49KB · markdown 182KB（按需）

---

## ✅ 已完成功能清单

### 路由与页面（11 个路由全部完成）
- [x] `/` 主城（首页）
- [x] `/profile` 角色档案
- [x] `/projects/:id` 项目详情
- [x] `/blog` + `/blog/:id` 博客列表 + 详情
- [x] `/series` + `/series/:slug` 专题系列
- [x] `/now` 当前动态
- [x] `/uses` 装备清单
- [x] `/friends` 友人帐
- [x] `/fandom` 秘密花园（追星）
- [x] `*` 404 NotFound

### 导航与交互
- [x] 顶部导航 4 主项 + "更多"下拉 5 子项
- [x] 移动端汉堡菜单 + 更多分组
- [x] **弹簧滑动下划线**路由活跃指示（framer-motion layoutId）
- [x] 滚动隐藏 + 毛玻璃
- [x] Footer 4 栏分组 + 社交链接
- [x] 全局 `RelatedLink` 卡片，所有内容页底部互相串联
- [x] ⌘K / Ctrl+K / `/` 命令面板搜索
- [x] 搜索覆盖博客 / 项目 / 奖项 / 技能 / 页面，键盘上下选择
- [x] **全局回到顶部按钮**（环形进度 + 玻璃拟态 + tooltip）

### 国际化
- [x] react-i18next 中英双语
- [x] LanguageDetector 自动识别
- [x] `<html lang>` 联动
- [x] 导航 / Footer / Hero / Section 标题 / 按钮全部 i18n
- [x] Now / Uses / Friends / Series / Profile Tab 全部 i18n
- [x] Hero 打字机中英双轨

### 视觉与动画
- [x] 暗色模式 + 防闪烁 + 系统偏好识别
- [x] **暗色模式切换动画**（View Transition API + clip-path 圆形擦除，降级兼容）
- [x] framer-motion 滚动进场 + `prefers-reduced-motion`
- [x] `SectionReveal` 多变体：fade-up / fade / scale / slide-left / slide-right
- [x] expo-out 缓动曲线，进场动画更轻盈
- [x] Tailwind 主题扩展（brand / gold 色阶）
- [x] Inter + Noto Sans SC 字体
- [x] **Hero canvas 粒子星空**（70 颗粒子随机漂浮闪烁，无额外依赖）
- [x] Hero blob + Aurora + 网格点阵 + 鼠标视差
- [x] 打字机文案轮播
- [x] 全局自定义滚动条
- [x] SmartImage 智能降级（无图时渐变 + 标题水印）
- [x] 卡片 hover lift 效果统一
- [x] **骨架屏组件体系**（CardSkeleton / ListItemSkeleton / PageSkeleton）

### 博客系统
- [x] Markdown 文件加载（`import.meta.glob`）
- [x] Front-Matter 解析（标题 / 日期 / 分类 / 标签 / 草稿等）
- [x] **精准阅读时间估算**（剥离 Markdown 语法，中文 ÷350 / 英文单词 ÷200）
- [x] GFM 表格 / 删除线 / 任务列表
- [x] rehype-highlight 代码高亮（GitHub Dark）
- [x] 代码块右上角复制按钮
- [x] 右侧 TOC 滚动同步高亮
- [x] 顶部彩色阅读进度条
- [x] 分类 / 标签 / 搜索 / 草稿筛选
- [x] giscus 评论接入
- [x] 推荐阅读 + 所属专题展示
- [x] **同专题上一篇 / 下一篇文章导航**
- [x] **博客详情页动态 SEO**（title / meta description / OG tags）

### 简历内容
- [x] 15 项奖项（国际/国家/省/校院级）+ 分级筛选
- [x] **奖项卡片视图 / 时间线视图可切换**（按年份分组）
- [x] 3 个核心项目完整详情 + 项目图片 Lightbox
- [x] **技能列表 / 雷达图可切换**（纯 SVG，无外部依赖）
- [x] 9 门核心课程成绩
- [x] 实习经历 + 学生工作 + 科研课题 + 教育背景
- [x] **通用 Avatar 组件**（旋转光环 / 在线状态圆点 / SVG 降级，首页与 Profile 统一复用）

### 数据管理（单一数据源）
- [x] `src/data/profile.ts` — 基础信息
- [x] `src/data/projects.ts` — 项目数据
- [x] `src/data/awards.ts` — 奖项数据
- [x] `src/data/skills.ts` — 技能数据
- [x] `src/data/blog.ts` — 博客加载器
- [x] `src/data/series.ts` — 专题数据（含 `coverImage` 封面图字段）
- [x] `src/data/friends.ts` — 友链数据
- [x] `src/data/fandom.ts` — 追星数据
- [x] `src/data/now.ts` — /now 页面内容（从页面解耦）
- [x] `src/data/uses.ts` — /uses 装备清单（从页面解耦）

### 工程
- [x] 路由懒加载，每页独立 chunk
- [x] vendor / motion / markdown / giscus / SearchPalette 分包
- [x] PWA：vite-plugin-pwa 自动 SW + manifest + 离线（skipWaiting + clientsClaim）
- [x] **SW 分层缓存策略**：页面 NetworkFirst / 图片 CacheFirst / Fonts StaleWhileRevalidate / API NetworkFirst
- [x] HashRouter 解决 GH Pages 刷新 404
- [x] TypeScript strict + ESLint 0 警告
- [x] React.lazy + Suspense + **PageSkeleton 骨架屏**
- [x] ErrorBoundary 顶层兜底
- [x] 图片 `loading="lazy"` + `decoding="async"`
- [x] GitHub Actions CI/CD + Husky + lint-staged
- [x] 打包体积守门 + Lighthouse CI
- [x] Dependabot 周度升级

### SEO / 可访问性
- [x] 所有内容页动态 title / description / OG tags（`usePageMeta` hook）
- [x] Open Graph + Twitter Card
- [x] sitemap.xml + robots.txt 构建时自动生成
- [x] RSS feed.xml 构建时自动生成
- [x] HTML lang 动态更新（中英切换联动）
- [x] 所有图标按钮 `aria-label`
- [x] focus ring 可见 + 键盘可达
- [x] `prefers-reduced-motion` 全面支持

---

## 🔴 P0 - 内容待填充（影响真实感，最优先）

| 项 | 文件 | 说明 |
|---|---|---|
| 简历 PDF | `src/data/profile.ts` → `resumeUrl` | 上传 PDF 后填写路径，Hero 自动出现下载按钮 |
| 项目截图 | `static/img/projects/` | 命名见 `projects.ts` 中 `image` 字段，SmartImage 自动展示 |
| 腾讯 CDG 实习描述 | `src/data/skills.ts` → `experiences[0]` | 按合规范围补充工作内容 |
| 友链真实数据 | `src/data/friends.ts` | 替换示例占位，填写真实友链 |
| 追星真实数据 | `src/data/fandom.ts` | 决定是否公开/密码保护后填充 |
| `/uses` 真实硬件 | `src/data/uses.ts` → `hardware` | 笔记本/键盘/显示器/耳机型号 |
| `/now` 最新状态 | `src/data/now.ts` | 定期更新 lastUpdated + sections |
| 博客草稿 | `src/posts/` | 完成 iGEM Wiki 复盘、AiCV 实习总结 |

---

## 🟠 P1 - 下一阶段重点

### 内容产出
- [ ] **写出 2-3 篇完整博客**：
  - 「iGEM Wiki 前端开发实践」科研项目复盘
  - 「AiCV 小程序实习总结」工程化与踩坑
  - 「算法题解系列」开始 LeetCode 高频题解，自动归入「算法笔记」专题

### 功能完善
- [ ] **博客修订历史**：基于 git commit 时间显示「最后更新于」
- [ ] **博客列表分页**（文章超过 10 篇时防止列表过长）
- [ ] **专题分 RSS Feed**（不同主题独立订阅链接）

---

## 🟡 P2 - 锦上添花

### 视觉体验
- [ ] **404 页面游戏化**：键盘控制弹弹球或像素小人
- [ ] **代码块语言标签 + 多语言切换**（展示同功能不同语言的示例时）
- [ ] **专题系列首页卡片升级**：展示文章数、预估阅读时间、最新发布日期
- [ ] **Profile 打印样式**：`@media print` 隐藏导航/动画，输出干净的简历版面

### 游戏化彩蛋
- [ ] **Konami 彩蛋**：↑↑↓↓←→←→BA 触发隐藏页面/特效
- [ ] **鼠标跟随粒子**：鼠标移动时产生短暂尾迹
- [ ] **页面访问经验值**：localStorage 记录访问深度，达到阈值解锁限定主题色
- [ ] **BGM 切换按钮**：右下角可选背景音乐

### 工程优化
- [ ] **Vite Bundle Analyzer**：用 `rollup-plugin-visualizer` 找进一步压缩空间
- [ ] **图片 WebP 转换**：等真实截图到位后批量转换（SmartImage 已就绪）

---

## 🟢 P3 - 未来探索方向

### 架构演进
- [ ] **迁移到 Astro**：保留 React 组件岛，拿到 SSG + MDX + 极致性能
- [ ] **CMS 化**：Notion API / Sanity 驱动内容，摆脱手动编辑数据文件
- [ ] **动态站点**：Cloudflare Workers / EdgeOne 做留言、私信、订阅
- [ ] **站内 AI 助手**：基于博客/项目内容的 RAG 问答 Bot

### 内容扩展
- [ ] **职业时间线页**：从入学到现在的关键事件可视化
- [ ] **3D / WebGL Hero**：Three.js / Spline 3D 头像或背景
- [ ] **动态简历 PDF 生成**：根据 `src/data/` 自动排版输出 PDF
- [ ] **追星专题升级**：演唱会日历 / 应援记录 / 周边收藏
- [ ] **博客发文频率图表**：可视化写作习惯

### 数据可视化
- [ ] **项目时间轴**：多项目并行进度可视化（Gantt 风格）
- [ ] **访客地图**（结合 GoatCounter API）

---

## 📐 设计原则备忘

- **单一数据源**：任何内容都先看 `src/data/`，不在组件里硬编码
- **类型驱动**：`src/types/` 是数据契约，新字段先加类型
- **可访问性优先**：所有交互必须键盘可达 + ARIA 标注
- **暗色优先级**：每个 `bg-*` / `text-*` 都要考虑 `dark:` 变体
- **i18n 优先**：新加 UI 文案先看 `src/i18n/index.ts` 有没有合适 key
- **响应式断点**：移动端先行（`sm:` `md:` `lg:`）
- **动画克制**：尊重 `prefers-reduced-motion`，避免眩晕
- **组件懒加载**：大依赖（giscus、Fuse、Markdown）始终 `React.lazy`

---

## 🐛 已知 Tech Debt

- 项目图片是占位路径，需要真实截图 → 等素材
- 部分博客是草稿状态，等填充内容
- 简历 PDF 路径占位，未上传则按钮不显示（已优雅降级）
- 友链 / 追星数据是占位
- 测试覆盖 0%（个人站可接受）
- HashRouter URL 带 `#`，SEO/分享略弱于 History 模式（迁移 Astro 时一并解决）

---

## 📊 迭代历史

| 版本 | 时间 | 主要内容 |
|---|---|---|
| v1.0 修复版 | 2026-05-31 | Bug 修复 / 真实化内容 / 数据层抽离 / 暗色 / 动画 / SEO |
| v1.5 体验版 | 2026-05-31 | Markdown 博客 / TOC / 代码复制 / GitHub 卡片 / Hero 打字机 / 奖项筛选 / /now / /uses |
| v2.0 国际版 | 2026-05-31 | i18n / giscus 评论 / 技能星级 + 证据 / 图片本地化 / 路由懒加载 |
| v2.5 全功能 | 2026-05-31 | ⌘K 全站搜索 / Hero 视觉特效 / GoatCounter / Web Vitals / 专题 / 友链 / 追星 |
| v2.6 导航重构 | 2026-05-31 | 页面中文化命名 / 顶部"更多"下拉 / Footer 四栏分组 / 全站 RelatedLink 互相串联 |
| v3.0 内容增强 | 2026-05-31 | HashRouter 链接修复 / KaTeX 数学 / Mermaid 图表 / GitHub 热力图 / RSS / sitemap / SmartImage WebP |
| v3.1 工程化 | 2026-05-31 | GitHub Actions CI/CD / Husky 钩子 / 打包体积守门 / Lighthouse CI / Dependabot |
| v3.2 体验升级 | 2026-06-29 | 全站动态 SEO / 专题上下篇导航 / 内页 i18n 全覆盖 / 奖项时间线 / 技能雷达图 / 图片 Lightbox / /now & /uses 数据解耦 / Hero 粒子星空 / 骨架屏体系 / 导航弹簧下划线 / 回到顶部进度环 / 联系区渐变卡片 |
| v3.3 质量提升 | 2026-06-29 | 精准阅读时间估算（中英分速） / 通用 Avatar 组件 / 专题封面图支持 / 暗色模式圆形擦除动画（View Transition API） / SW 分层缓存策略（skipWaiting + 5 条 runtimeCaching） |
