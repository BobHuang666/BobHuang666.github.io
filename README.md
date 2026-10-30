# BobHuang · 个人主页

[![Live](https://img.shields.io/badge/Live-blog.bobhuang.cn-6366f1?style=flat-square)](https://blog.bobhuang.cn/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8?style=flat-square)](https://web.dev/progressive-web-apps/)

> 游戏化包装的个人主页 + 博客：React 18 + Vite 5 + TypeScript + Tailwind CSS，部署在 GitHub Pages。

## 站点地图

| 路由 | 页面 | 说明 |
| --- | --- | --- |
| `/` | **主城** | Hero / 公告 / 项目 / 博客 / 奖项 / 技能 / 联系 |
| `/profile` | **角色档案** | 五 Tab 简历：基本信息 / 奖项 / 实习 / 经历 / 科研 |
| `/projects/:id` | 项目详情 | 概述 / 功能 / 技术栈 / 挑战 / 方案 / 成果 / 复盘 |
| `/blog` · `/blog/:id` | **游戏攻略** | Markdown 博客：搜索 / 分类 / 标签 / TOC / 代码高亮 / giscus 评论 |
| `/travel` | **足迹地图** | 中国 & 世界地图，足迹点亮 + 出行路线动画 |
| `/fandom` | **追星日记** | 偶像墙 / 演唱会 / 线下打卡 / 周边收藏 |
| `/friends` | **友人帐** | 友情链接 + 申请流程 + 加密名片生成 |
| `/500` · `*` | 兜底页 | 500 错误页；404 内置弹弹球小游戏 |
| 全局 | 🔍 搜索 · 🤖 AI 助手 | ⌘K 命令面板；RAG 知识库问答，无 API Key 时降级为站内检索 |

## 快速开始

```bash
npm install          # 首次会自动初始化 husky
npm run dev          # 开发服务器 http://localhost:5173
npm run build        # 构建到 dist/
npm run preview      # 预览构建产物
npm run check        # typecheck + lint
npm run size         # 打包体积报告（需先 build）
```

## 架构

四层单向依赖：**数据层 → 共享层 → 页面层 → 应用层**，import 统一走 `@/*` 别名（= `src/*`）。

```
src/
├─ app/         # 应用层：Provider 组合、路由注册与懒加载、全局壳层
├─ features/    # 页面层：每个路由页面 / 跨页能力一个模块
│               #   内部约定：Page.tsx + sections|tabs + components + meta.ts
├─ shared/      # 共享层：跨业务组件（layout / controls / ui / effects）
├─ contexts/    # 全局状态（主题）    ├─ hooks/   跨 feature Hook
├─ data/        # 数据层：内容单一事实来源 + uiText 文案 + 派生索引
├─ posts/       # Markdown 博客正文   ├─ drafts/  草稿（不参与构建）
├─ types/       # 跨领域数据模型      └─ utils/   纯函数工具
```

## 核心特性

| 类别 | 实现 |
| --- | --- |
| 路由 | HashRouter（规避 GH Pages 刷新 404）+ 路由懒加载 + modulepreload |
| 博客 | `src/posts/*.md` 自动加载，Front-Matter / GFM / KaTeX / Mermaid / TOC / 复制 / 阅读进度 |
| 搜索 | Fuse.js 命令面板，⌘K / Ctrl+K / `/`，覆盖博客 / 项目 / 奖项 / 技能 / 页面 |
| AI 助手 | RAG 知识库由 `data/` 自动派生、与页面展示同步；OpenAI 兼容流式对话 |
| 主题 | 明暗双主题，防闪烁内联脚本 + localStorage 持久化 |
| PWA | vite-plugin-pwa：SW + manifest + 分层运行时缓存 + 防白屏兜底 |
| 性能 | 图片管线（webp/avif + 右尺寸）、CSS 内联、路由预加载、空闲挂载浮层、`prefers-reduced-motion` 降级 |
| 统计 | GoatCounter 隐私友好统计 |
| SEO | 动态 title / description / OG + sitemap |
| 工程 | TS strict、ESLint 零错误、husky + lint-staged、体积守门、Lighthouse CI、Dependabot |

## 内容维护（改什么 → 改哪里）

| 想改什么 | 位置 |
| --- | --- |
| 个人信息 / 教育 / 技能 / 实习 / 培训 / 实践 / 学生工作 / 科研 / 著作 | `src/data/profile.ts` |
| 项目 / 奖项 | `src/data/projects.ts` · `src/data/awards.ts` |
| 博客文章 | 在 `src/posts/` 新建 `xxx.md`（Front-Matter 见现有文章），自动进列表 |
| 友链 / 追星 / 旅行 / 中文文案 | `src/data/friends.ts` · `fandom.ts` · `travel.ts` · `uiText.ts` |
| 主题色 / 字体 | `tailwind.config.js` |
| AI 助手知识库 | 由 `data/` 自动派生，通常无需手改 |

> 图片新增 / 替换后运行 `node scripts/optimize-images.mjs`：自动缩放尺寸并生成同名 `.webp` / `.avif`（`SmartImage` 自动协商使用）。

### 加密名片（友人帐页）

名片隐私信息以 **AES-GCM 密文**存在 `src/data/businessCard.ts`，口令不进源码、不进构建产物。编辑明文 `scripts/.card-secret.json`（已被 gitignore，schema 见 `card-secret.example.json`）后重新生成：

```bash
CARD_PASSWORD=你的口令 npm run gen:card     # PowerShell: $env:CARD_PASSWORD="你的口令"; npm run gen:card
```

### giscus 评论 / GoatCounter 统计

- 评论：仓库开启 Discussions 并安装 [giscus App](https://github.com/apps/giscus)，把 <https://giscus.app/zh-CN> 生成的 `repoId` / `categoryId` 填入 `src/data/giscus.ts`。
- 统计：在 [goatcounter.com](https://www.goatcounter.com/) 注册后，把 code 填入 `src/utils/analytics.ts` 的 `goatcounterCode`。

## 部署

`git push origin main` 即完成发布：CI 检查 → 自动部署 GH Pages → Lighthouse 全页评分 → 飞书通知，全程无手动步骤；PR 同样跑 CI 阻塞合并。流水线细节、质量基线与飞书告警配置见 [docs/CI-CD.md](docs/CI-CD.md)。

## 文档

| 文档 | 内容 |
| --- | --- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 分层规则、依赖方向、文件放置与注释约定 —— 参与开发前必读 |
| [docs/CI-CD.md](docs/CI-CD.md) | 流水线、质量基线、飞书告警配置 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 迭代规划与版本历史 |
