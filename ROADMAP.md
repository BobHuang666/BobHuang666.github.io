# Roadmap · 个人主页迭代规划

> 本文记录大改造历程，以及未来可以继续打磨的方向。
> 优先级：🔴 P0 必做 · 🟠 P1 应做 · 🟡 P2 可做 · 🟢 P3 探索

---

## 🎯 当前状态（v2.5）

整站已完成 **4 个大版本** 的迭代，从一个套模板的简单 SPA 演化为：

- 📱 **9 个完整页面** + 项目/博客/专题 3 套详情页
- 🧩 **40+ 复用组件**，单一数据源
- 🌐 **中英双语** + 暗色模式 + ⌘K 全站搜索
- 📝 **Markdown 博客** + TOC + 代码高亮 + 阅读进度 + giscus 评论
- 🚀 **PWA** + 路由懒加载 + 代码分割（5 段 chunk）
- 🎨 **Hero 鼠标视差 + Aurora 极光 + 打字机** 视觉特效
- 📊 GitHub 实时数据 + GoatCounter 统计 + Web Vitals
- 🔒 追星专题可选密码保护

构建产物（gzip）：主入口 48KB · markdown 105KB（按需）· SearchPalette 13KB（按需）

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
- [x] 路由活跃高亮 + 滚动隐藏 + 毛玻璃
- [x] Footer 4 栏分组 + 社交链接
- [x] 全局 `RelatedLink` 卡片，所有内容页底部互相串联
- [x] ⌘K / Ctrl+K / `/` 命令面板搜索
- [x] 搜索覆盖博客 / 项目 / 奖项 / 技能 / 页面，键盘上下选择

### 国际化
- [x] react-i18next 中英双语
- [x] LanguageDetector 自动识别
- [x] `<html lang>` 联动
- [x] 导航 / Footer / Hero / Section 标题 / 搜索 / 评论全部 i18n
- [x] Hero 打字机中英双轨

### 视觉与动画
- [x] 暗色模式 + 防闪烁 + 系统偏好识别
- [x] framer-motion 滚动进场 + `prefers-reduced-motion`
- [x] Tailwind 主题扩展（brand / gold 色阶）
- [x] Inter + Noto Sans SC 字体
- [x] Hero：彩色光环头像 + 鼠标视差 blob + Aurora + 网格点阵
- [x] 打字机文案轮播
- [x] 全局自定义滚动条
- [x] SmartImage 智能降级（无图时渐变 + 标题水印）
- [x] 卡片 hover lift 效果统一

### 博客系统
- [x] Markdown 文件加载（`import.meta.glob`）
- [x] Front-Matter 解析（标题 / 日期 / 分类 / 标签 / 草稿等）
- [x] 自动按日期排序
- [x] GFM 表格 / 删除线 / 任务列表
- [x] rehype-highlight 代码高亮（GitHub Dark）
- [x] 代码块右上角复制按钮
- [x] 右侧 TOC 滚动同步高亮
- [x] 顶部彩色阅读进度条
- [x] 分类 / 标签 / 搜索 / 草稿筛选
- [x] 草稿模式开关
- [x] giscus 评论接入
- [x] 推荐阅读 + 所属专题展示

### 简历内容（基于 profile.md）
- [x] 15 项奖项（国际/国家/省/校院级）+ 分级筛选
- [x] 3 个核心项目完整详情（墨尺/AiCV/iGEM）
- [x] 技能星级 + 项目证据链接
- [x] 9 门核心课程成绩
- [x] 实习经历 + 学生工作 + 科研课题完整呈现
- [x] 教育背景（学校/专业/学号/政治面貌）

### 工程
- [x] 路由懒加载，每页独立 chunk
- [x] vendor / motion / markdown / giscus / SearchPalette 分包
- [x] PWA：vite-plugin-pwa 自动 SW + manifest + 离线
- [x] GitHub API 缓存策略
- [x] HashRouter 解决 GH Pages 刷新 404
- [x] TypeScript strict + ESLint 0 警告
- [x] React.lazy + Suspense + PageLoading
- [x] ErrorBoundary 顶层兜底
- [x] 图片 `loading="lazy"` + `decoding="async"`

### SEO / 可访问性
- [x] title / description / keywords
- [x] Open Graph + Twitter Card
- [x] theme-color（light/dark）
- [x] HTML lang `zh-CN`
- [x] 所有图标按钮 `aria-label`
- [x] focus ring 可见
- [x] 键盘可达
- [x] `prefers-reduced-motion` 支持

### 数据 & 统计
- [x] GoatCounter 接入（HashRouter 兼容版）
- [x] Web Vitals dev console 监控（LCP / CLS / FID）

---

## 🔴 P0 - 你需要尽快补充的内容

| 项 | 文件 | 说明 |
|---|---|---|
| 真实 GitHub 用户名 | `src/data/profile.ts` 的 `github` 字段 | 当前 `BobHuang666`，请确认 |
| 简历 PDF | `src/data/profile.ts` 的 `resumeUrl` | 上传到 `static/` 后填路径，Hero 自动出现"简历下载"按钮 |
| 项目截图 | `static/img/projects/` 目录 | 命名见 `src/data/projects.ts` 中 `image` 字段 |
| 头像 | `static/img/avatar.jpg` | 已存在，确认是否要换 |
| 腾讯 CDG 实习描述 | `src/data/skills.ts` 的 `experiences` | 按合规范围补充 |
| 友链真实数据 | `src/data/friends.ts` | 替换示例朋友 |
| 追星真实数据 | `src/data/fandom.ts` | 决定是否公开/加密码 |
| 启用 giscus | `src/data/giscus.ts` 填 `repoId` / `categoryId` |
| 启用 GoatCounter | `src/utils/analytics.ts` 填 `goatcounterCode` |
| `/uses` 真实硬件 | `src/pages/UsesPage.tsx` 中的占位 | 笔记本/键盘/显示器型号 |
| `/now` 真实状态 | `src/pages/NowPage.tsx` 中的占位 | 最近在读的书 / 在做的事 |

---

## 🟠 P1 - 强烈建议下一阶段做

### 内容
- [ ] **写出 2-3 篇真实博客**：
  - 「iGEM Wiki 前端开发实践」基于 50MB+ 科研资料优化的复盘
  - 「小程序前端实习半程总结」AiCV 工程化经验
  - 「墨尺平台架构记」LLM 应用与全栈
- [ ] **算法题解系列**：开始 LeetCode 高频题解，自动归入「算法笔记」专题
- [ ] **真实硬件 / 友链 / 追星**数据填充

### 视觉
- [x] **`SmartImage` 升级** ✅ —— 支持 `<picture>` + WebP/AVIF 自动嗅探（提供同名 .webp/.avif 即生效）
- [x] **GitHub Contribution 热力图** ✅ —— `GitHubHeatmap` 组件，主题色自动跟随暗色模式
- [ ] **Profile Header 头像**与首页头像组件复用（avoid duplication）

### 功能
- [x] **KaTeX 数学公式支持** ✅ —— `remark-math` + `rehype-katex`，行内 + 块级
- [x] **博客 Mermaid 图表** ✅ —— 动态懒加载，主题随暗色切换
- [x] **RSS / Atom 全站订阅** ✅ —— 构建时自动生成 `feed.xml`（自定义 vite 插件）
- [x] **sitemap.xml + robots.txt** ✅ —— 自定义 vite 插件，9 个静态路由 + 全部博客自动收录
- [ ] **专题详情页加 RSS Feed**（分专题订阅，待做）

---

## 🟡 P2 - 锦上添花

### 内容
- [ ] **专题文章导航**（同专题上一篇 / 下一篇）
- [ ] **专题封面图**
- [ ] **博客字数 / 字符统计自动计算**
- [ ] **修订历史**：每篇博客记录最后修改日期（git commit 时间）

### 交互
- [ ] **图片 lightbox**：博客中点击图片放大
- [ ] **博客系列文章导航条**（同系列 1/3 → 2/3 → 3/3）
- [ ] **代码块语言切换标签**（多语言示例时）
- [ ] **奖项墙时间线视图**切换
- [ ] **技能雷达图**（Profile 页用 SVG / recharts）

### 游戏化彩蛋
- [ ] **Konami 彩蛋**：上上下下左右左右 BA 触发隐藏页面
- [ ] **鼠标跟随效果**：尾迹 / 粒子
- [ ] **BGM 切换按钮**：可静音
- [ ] **页面访问"经验值"**：localStorage 记录访问深度，解锁限定主题色
- [ ] **404 页面隐藏游戏**

### 工程
- [ ] **Lighthouse 实测调优**：目标 95+
- [ ] **图片转 WebP**：等真实截图就位（基础设施已就绪，`SmartImage` 自动嗅探同名 webp）
- [x] **sitemap.xml + robots.txt 构建时自动生成** ✅
- [x] **RSS feed.xml 构建时自动生成** ✅
- [ ] **Vite Bundle Analyzer**：找进一步压缩空间
- [ ] **CI/CD**：GitHub Actions 自动 build & deploy

---

## 🟢 P3 - 未来探索方向

### 架构演进
- [ ] **迁移到 Astro**：保留 React 组件岛，但拿到 SSG + 极致性能 + MDX
- [ ] **CMS 化**：用 Notion API / Sanity / Strapi
- [ ] **动态站点**：Cloudflare Workers / EdgeOne 做留言、私信、订阅
- [ ] **AI 助手**：站内 ChatBot，基于你的所有项目/博客回答访客（RAG）

### 内容扩展
- [ ] **职业时间线页**：从入学 → 现在的关键事件可视化
- [ ] **3D / WebGL 元素**：Three.js / Spline，比如 Hero 区 3D 头像
- [ ] **动态简历生成**：根据 `src/data/` 自动 PDF 简历
- [ ] **追星专题升级**：演唱会日历 / 应援记录 / 周边收藏

### 数据可视化
- [ ] **GitHub commit 热力图**（首页或 Profile）
- [ ] **技能雷达图**
- [ ] **博客发文频率柱状图**
- [ ] **项目时间轴**

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

- 项目图片是占位路径，需要真实截图 → 等你的素材
- 部分博客是草稿状态，等填充内容
- 简历 PDF 路径占位，未上传则按钮不显示（已优雅降级）
- 友链 / 追星数据是占位
- 测试覆盖 0%（个人站可接受，不计入 debt）

---

## 📊 迭代历史

| 版本 | 时间 | 主要内容 |
|---|---|---|
| v1.0 修复版 | 2026-05-31 | Bug 修复 / 真实化内容 / 数据层抽离 / 暗色 / 动画 / SEO |
| v1.5 体验版 | 2026-05-31 | Markdown 博客 / TOC / 代码复制 / GitHub 卡片 / Hero 打字机 / 奖项筛选 / /now / /uses |
| v2.0 国际版 | 2026-05-31 | i18n / giscus 评论 / 技能星级 + 证据 / 图片本地化 / 路由懒加载 |
| v2.5 全功能 | 2026-05-31 | ⌘K 全站搜索 / Hero 视觉特效 / GoatCounter / Web Vitals / 专题 / 友链 / 追星 |
| v2.6 导航重构 | 2026-05-31 | 页面中文化命名 / 顶部"更多"下拉 / Footer 四栏分组 / 全站 RelatedLink 互相串联 |
| v3.0 内容增强 | 2026-05-31 | HashRouter 链接修复 / KaTeX 数学 / Mermaid 图表 / GitHub 热力图 / RSS / sitemap / SmartImage WebP-AVIF |
