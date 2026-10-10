# Roadmap · 迭代规划

> 主线记录**当前状态**与**未来要做的事**；版本级的改动摘要统一收在文末的「迭代历史」表，更细的改动以 git 提交记录为准。
> 优先级：🔴 P0 必做 · 🟠 P1 应做 · 🟡 P2 可做 · 🟢 P3 探索

---

## 🎯 当前状态

- **9 个路由**：`/` `/profile` `/projects/:id` `/blog` `/blog/:id` `/friends` `/fandom` `/500` `*`（404）
- **内容单一数据源**：全部内容在 `src/data/`，文案在 `src/data/uiText.ts`
- **博客**：`src/posts/*.md` 自动加载，Front-Matter / GFM / rehype-highlight / rehype-katex / Mermaid / 复制 / TOC / 阅读进度 / giscus 评论
- **搜索**：Fuse.js 命令面板（⌘K / Ctrl+K / `/`），覆盖博客 / 项目 / 奖项 / 技能 / 页面
- **AI 助手**：RAG 知识库检索 + OpenAI 兼容流式对话，无 API Key 时降级为站内检索结果
- **PWA**：自动生成 SW + manifest，分层缓存（页面 NetworkFirst / 图片 CacheFirst / 字体 StaleWhileRevalidate / GitHub API NetworkFirst）
- **性能**：路由与浮层组件懒加载；GitHub 组件进入视口才发请求；Hero canvas 在移动端与 `prefers-reduced-motion` 下降级
- **工程**：TypeScript strict + ESLint 零错误；husky + lint-staged + GitHub Actions CI/CD + 体积守门 + Lighthouse CI + Dependabot

体积累计（gzip，以 `npm run size` 为准）：首屏关键 JS **167 KB** / 全部 JS **1266 KB** / 全部 CSS **23 KB**。

---

## 🔴 P0 — 内容待填充（影响真实感）

| 项 | 文件 | 说明 |
|---|---|---|
| 项目截图 | `public/static/img/projects/` | 命名见 `projects.ts` 的 `image` 字段，缺失时 SmartImage 自动降级为渐变块 |
| AiCV 项目链接 | `src/data/projects.ts` → `aicv-resume.link` | 补小程序码或体验地址 |
| 腾讯 CDG 实习描述 | `src/data/skills.ts` → `experiences[0]` | 按合规范围补充工作内容 |
| 友链真实数据 | `src/data/friends.ts` | 替换示例占位 |
| 追星真实数据 | `src/data/fandom.ts` | 决定是否公开 / 密码保护后填充（`fandomConfig.password`） |

---

## 🟠 P1 — 下一阶段重点

### 内容产出

- [ ] 补充 2-3 篇完整博客：iGEM Wiki 前端复盘、AiCV 实习总结、算法题解系列
- [ ] 完成 `src/drafts/` 中的草稿并移入 `src/posts/`

### 功能完善

- [ ] 博客列表分页（文章数量增长后防止单页过长）
- [ ] 博客「最后更新于」：读取 front-matter 的 `updated` 并展示
- [ ] 作品集图片统一转 WebP / AVIF（`SmartImage` 已支持自动推断同源现代格式）

---

## 🟡 P2 — 锦上添花

- [ ] Profile 打印样式：`@media print` 隐藏导航与动画，输出干净的简历版面
- [ ] Konami 彩蛋：↑↑↓↓←→←→BA 触发隐藏特效
- [ ] 项目时间轴：多项目并行进度可视化
- [ ] 博客发文频率图表

---

## 🟢 P3 — 未来探索

- [ ] 迁移到 Astro（SSG + MDX），同时解决 HashRouter 在 SEO/分享上的短板
- [ ] CMS 化：用 Notion / Sanity 驱动内容，摆脱手动编辑数据文件
- [ ] 动态能力：Cloudflare Workers / EdgeOne 承载留言、订阅

---

## 🐛 已知 Tech Debt

- 项目封面图仍是占位路径，等真实截图
- 部分博客在 `src/drafts/` 尚未完成
- 友链 / 追星数据为占位示例
- 测试覆盖 0%（个人站可接受）
- HashRouter 的 URL 带 `#`，SEO / 分享弱于 History 模式（迁移 Astro 时一并解决）

---

## 📐 设计原则备忘

- **单一数据源**：任何内容都先看 `src/data/`，不在组件里硬编码
- **派生优先于硬编码**：分类、标签、相关阅读、GitHub 用户名等能算出来的，一律在 `data/` 派生
- **类型驱动**：`src/types/` 是数据契约，新字段先加类型
- **文案集中**：新 UI 文案优先放进 `src/data/uiText.ts`（只放用户可见中文，不混数值配置）
- **页面只做编排**：超过约 200 行就拆 `sections/` 或 `tabs/`
- **可访问性优先**：交互必须键盘可达 + ARIA 标注
- **暗色优先**：每个 `bg-*` / `text-*` 都要考虑 `dark:` 变体
- **动画克制**：尊重 `prefers-reduced-motion`，避免眩晕
- **组件懒加载**：大依赖（giscus、Fuse、Markdown、mermaid）始终按需加载

---

## 📊 迭代历史

| 版本 | 时间 | 主要内容 |
|---|---|---|
| v1.0 修复版 | 2026-05-31 | Bug 修复 / 真实化内容 / 数据层抽离 / 暗色 / 动画 / SEO |
| v1.5 体验版 | 2026-05-31 | Markdown 博客 / TOC / 代码复制 / GitHub 卡片 / Hero 打字机 / 奖项筛选 / /now / /uses |
| v2.0 国际版 | 2026-05-31 | i18n / giscus 评论 / 技能星级 + 证据 / 图片本地化 / 路由懒加载 |
| v2.5 全功能 | 2026-05-31 | ⌘K 全站搜索 / Hero 视觉特效 / GoatCounter / Web Vitals / 专题 / 友链 / 追星 |
| v2.6 导航重构 | 2026-05-31 | 页面中文化命名 / 顶部"更多"下拉 / Footer 四栏分组 / 全站 RelatedLink 互相串联 |
| v3.0 内容增强 | 2026-05-31 | HashRouter 链接修复 / KaTeX 数学 / Mermaid 图表 / GitHub 热力图 / sitemap / SmartImage WebP |
| v3.1 工程化 | 2026-05-31 | GitHub Actions CI/CD / Husky 钩子 / 打包体积守门 / Lighthouse CI / Dependabot |
| v3.2 体验升级 | 2026-06-29 | 全站动态 SEO / 专题上下篇导航 / 内页 i18n 全覆盖 / 奖项时间线 / 技能雷达图 / 图片 Lightbox / /now & /uses 数据解耦 / Hero 粒子星空 / 骨架屏体系 / 导航弹簧下划线 / 回到顶部进度环 / 联系区渐变卡片 |
| v3.3 质量提升 | 2026-06-29 | 精准阅读时间估算（中英分速） / 通用 Avatar 组件 / 专题封面图支持 / 暗色模式圆形擦除动画（View Transition API） / SW 分层缓存策略（skipWaiting + 5 条 runtimeCaching） |
| v3.4 性能专项 | 2026-06-30 | **新增**：AI 助手（RAG + OpenAI 流式）/ 鼠标粒子尾迹 / 滚动位置恢复 / 代码块多语言切换 / 追星页升级；**性能**：首屏 JS 261→179 KB（↓31%）/ PWA 预缓存 1685→674 KB（↓60%）/ GitHub 组件视口延迟请求 / 移动端 canvas 降级 / 移除 react-type-animation + gray-matter |
| v3.4.1 架构清理 | 2026-06-30 | highlight.js CSS 移入博客 chunk（首屏 CSS ↓3 KB）/ ScrollToTopButton 移除 framer-motion 依赖 / awards + skills 数据层 icon 字符串化（解耦 lucide）/ `IconName` 类型统一约定 |
| v4.0 架构重构 | 2026-09-30 | **分层收敛**：文案层 `copy.ts` 迁入 `data/` / 页面只做编排，区块与 Tab 下沉（`home/sections/`、`profile/tabs/`、`fandom/tabs/` + `meta.ts`），Home 566→27 行、Profile 600→132 行、Fandom 617→220 行 / **数据派生下沉**：`blogCategories` · `blogTags` · `getRelatedPosts` · `githubUsername` / `projectsDetail` 改为按 id 关联简版数据 / **共享组件**：新增 `Chip` · `EmptyState` · `ErrorState` · `GradientIcon`，`SmartImage` 支持 `zoomable` / 跨 feature 引用改为 `features/*/index.ts` 公共入口 / 删除死代码（`CodeBlock` · `LightboxImage` · 多余骨架屏变体 · 空 `i18n/` 目录） |
| v4.0.1 文档校准 | 2026-09-30 | 清理过期表述（移除已下线页面与多语言痕迹）/ 路由表与体积数据按实测更新 / ROADMAP 收敛为「当前状态 + 未来规划」并保留迭代历史 |
| v4.1 文案层重构 | 2026-10-01 | `copy.ts` → `uiText.ts`（消除「复制」语义歧义，明确不做 i18n）/ 分组改为「页面 / 区块」为主：`btn` + `misc` 并入 `common`、`level` 并入 `awards` / 新增 `related` 组收口 3 处不一致的跳转卡片文案 / `home.taglines` 由 `(string \| number)[]` 改为 `{ text, hold }[]`，`TypeWriter` 同步强类型 / 删除失效文案 `radarView` · `listView` |
