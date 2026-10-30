# Roadmap · 迭代规划

> 当前功能与架构状态以 [README](../README.md) 为准，本文只记录**要做的事**与**迭代历史**；更细的改动以 git 提交记录为准。
> 优先级：🔴 P0 必做 · 🟠 P1 应做 · 🟡 P2 可做 · 🟢 P3 探索

---

## 🔴 P0 — 内容待补全

| 项 | 位置 | 说明 |
| --- | --- | --- |
| 项目真实截图 | `public/img/projects/` | 命名对应 `projects.ts` 的 `image` 字段，缺失时 SmartImage 降级为渐变块 |
| AiCV 项目链接 | `src/data/projects.ts` → `aicv-resume.link` | 补小程序码或体验地址 |
| 追星感悟首条 | `src/data/fandom.ts` → `lessons` | 当前是 `TODO` 占位，补一句真实感悟 |
| 周边收藏条目 | `src/data/fandom.ts` → `collections` | 部分为示例占位（主推一号 / 二号），替换为真实收藏 |

---

## 🟠 P1 — 下一阶段重点

- [ ] 补充 2-3 篇完整博客：iGEM Wiki 前端复盘、AiCV 实习总结、算法题解系列
- [ ] 完成 `src/drafts/` 中的草稿并移入 `src/posts/`
- [ ] 博客列表分页，文章数量增长后防止单页过长
- [ ] 博客展示「最后更新于」：front-matter 已有 `updated` 字段，列表与详情页尚未展示

---

## 🟡 P2 — 锦上添花

- [ ] Profile 打印样式：`@media print` 隐藏导航与动画，输出干净的简历版面
- [ ] Konami 彩蛋：↑↑↓↓←→←→BA 触发隐藏特效
- [ ] 项目时间轴：多项目并行进度可视化
- [ ] 博客发文频率图表

---

## 🟢 P3 — 未来探索

- [ ] 迁移到 Astro（SSG + MDX），同时解决 HashRouter 在 SEO / 分享上的短板
- [ ] CMS 化：用 Notion / Sanity 驱动内容，摆脱手动编辑数据文件
- [ ] 动态能力：Cloudflare Workers / EdgeOne 承载留言、订阅

---

## 🐛 已知技术债

- 测试覆盖 0%（个人站，可接受；核心工具函数如 `frontMatter` / `crypto` 适合优先补单测）
- HashRouter 的 URL 带 `#`，SEO / 分享弱于 History 模式（迁移 Astro 时一并解决）

---

## 📊 迭代历史

| 版本 | 时间 | 主要内容 |
| --- | --- | --- |
| v1.0 修复版 | 2026-05-31 | Bug 修复 / 真实化内容 / 数据层抽离 / 暗色 / 动画 / SEO |
| v1.5 体验版 | 2026-05-31 | Markdown 博客 / TOC / 代码复制 / Hero 打字机 / 奖项筛选 |
| v2.0 国际版 | 2026-05-31 | i18n / giscus 评论 / 技能星级 / 图片本地化 / 路由懒加载 |
| v2.5 全功能 | 2026-05-31 | ⌘K 全站搜索 / Hero 视觉特效 / GoatCounter / 专题 / 友链 / 追星 |
| v2.6 导航重构 | 2026-05-31 | 页面中文化命名 / 「更多」下拉 / Footer 四栏 / RelatedLink 串联 |
| v3.0 内容增强 | 2026-05-31 | HashRouter 链接修复 / KaTeX / Mermaid / GitHub 热力图 / sitemap / SmartImage WebP |
| v3.1 工程化 | 2026-05-31 | GitHub Actions CI/CD / Husky / 体积守门 / Lighthouse CI / Dependabot |
| v3.2 体验升级 | 2026-06-29 | 全站动态 SEO / 奖项时间线 / 技能雷达图 / Lightbox / Hero 粒子星空 / 骨架屏 / 回到顶部进度环 |
| v3.3 质量提升 | 2026-06-29 | 精准阅读时间估算 / 通用 Avatar / 暗色 View Transition 擦除动画 / SW 分层缓存 |
| v3.4 性能专项 | 2026-06-30 | AI 助手 / 鼠标粒子 / 滚动位置恢复 / 代码块多语言；首屏 JS 261→179 KB、PWA 预缓存 1685→674 KB |
| v4.0 架构重构 | 2026-09-30 | 分层收敛：页面只做编排，sections/tabs 下沉；数据派生下沉；共享组件 Chip/EmptyState/ErrorState；跨 feature 走 index.ts |
| v4.1 文案层重构 | 2026-10-01 | `copy.ts` → `uiText.ts`；分组收敛为「页面 / 区块」；`taglines` 强类型化 |
| v4.2 性能与 AI | 2026-10-31 | 按 Lighthouse 逐页优化：图片 webp/avif 管线、路由 modulepreload、CSS 内联、preconnect、无障碍修复、旅行 CLS；AI 知识库对齐页面数据并扩充到 16 类 |
| v4.3 分层重构 | 2026-10-31 | `@/*` 路径别名；修复 shared→features 与 types→utils 分层违规；搜索改 Provider 模式并修复 ⌘K 双实例失灵；feature 内目录统一；注释体系与文档重构 |
