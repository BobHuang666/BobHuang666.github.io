# BobHuang · 个人主页

[![Live](https://img.shields.io/badge/Live-bobhuang666.github.io-6366f1?style=flat-square)](https://bobhuang666.github.io/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-ready-5a0fc8?style=flat-square)](https://web.dev/progressive-web-apps/)

> 基于 React 18 + Vite 5 + TypeScript + Tailwind CSS 构建的个人主页，支持 i18n / 暗色模式 / 全站搜索 / PWA / Markdown 博客 / 评论 / 数据统计。部署在 GitHub Pages。

---

## 站点地图

### 主导航
| 路由 | 页面 | 说明 |
|---|---|---|
| `/` | **主城** | 首页 · Hero / 技能 / GitHub / 项目 / 博客 / 奖项 / 更多探索 / 联系 |
| `/profile` | **角色档案** | 6 Tab 简历：基本信息 / 技能 / 奖项 / 实习 / 科研 / 课程 / 兴趣 |
| `/#projects` | **任务中心** | 锚点跳转 |
| `/blog` | **游戏攻略** | 博客列表 + 分类标签筛选 + 草稿开关 |

### 探索（导航栏「更多」下拉）
| 路由 | 页面 | 说明 |
|---|---|---|
| `/series` | **专题系列** | 6 个专题按标签自动归类博客 |
| `/series/:slug` | 专题详情 | 单专题的彩色页面 |
| `/now` | **当前动态** | 仿 nownownow.com · 我最近在做什么 |
| `/uses` | **装备清单** | 仿 uses.tech · 硬件 / 工具 / 技术栈 |
| `/friends` | **友人帐** | 友情链接 + 申请友链流程 |
| `/fandom` | **秘密花园** | 追星专题 · 可选密码保护 |

### 其他
| 路由 | 说明 |
|---|---|
| `/projects/:id` | 项目详情页（目录 + 概述 / 功能 / 技术栈 / 挑战 / 方案 / 成果 / 总结） |
| `/blog/:id` | 博客详情（Markdown + TOC + 代码高亮 + 复制 + 阅读进度 + 推荐 + 评论） |
| `*` | 404 NotFound |

---

## 本地开发

```bash
# 安装依赖（首次会自动初始化 husky 钩子）
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 dist/）
npm run build

# 预览构建结果
npm run preview

# 代码检查
npm run lint            # 仅检查
npm run lint:fix        # 检查并自动修复
npm run typecheck       # TypeScript 类型检查
npm run check           # typecheck + lint 一把梭

# 打包体积报告（需先 build）
npm run size
```

> Windows PowerShell 用户可直接复制运行，命令是跨平台的。

---

## 目录结构

```
src/
├── components/              # 通用组件
│   ├── Navigation.tsx       # 顶部导航（主导航 + 更多下拉 + 移动菜单）
│   ├── Footer.tsx           # 四栏页脚
│   ├── ThemeToggle.tsx      # 暗色切换
│   ├── LanguageToggle.tsx   # 中英切换
│   ├── SearchTrigger.tsx    # 搜索按钮 + ⌘K
│   ├── SearchPalette.tsx    # 命令面板（懒加载）
│   ├── HeroBackground.tsx   # Hero 视觉特效层
│   ├── SmartImage.tsx       # 智能图片（带降级）
│   ├── SectionReveal.tsx    # 滚动进场动画包装
│   ├── RelatedLink.tsx      # 页面底部跳转卡片
│   ├── MarkdownRenderer.tsx # 博客 Markdown 渲染
│   ├── CodeBlock.tsx        # 带复制按钮的代码块
│   ├── TableOfContents.tsx  # 博客右侧目录
│   ├── ReadingProgress.tsx  # 顶部阅读进度
│   ├── Comments.tsx         # giscus 评论
│   ├── GitHubCard.tsx       # GitHub 实时数据
│   └── ErrorBoundary.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   └── themeContextValue.ts
├── hooks/
│   └── useTheme.ts
├── data/                    # 单一数据源（被多页面共享）
│   ├── profile.ts           # 基础信息
│   ├── projects.ts          # 项目列表 + 详情
│   ├── awards.ts            # 奖项（15 项）
│   ├── skills.ts            # 技能 + 课程 + 实习 + 科研
│   ├── blog.ts              # 自动加载 src/posts/*.md
│   ├── series.ts            # 专题定义
│   ├── friends.ts           # 友链
│   ├── fandom.ts            # 追星
│   ├── searchIndex.ts       # 搜索语料聚合
│   └── giscus.ts            # 评论配置
├── i18n/
│   └── index.ts             # react-i18next 中英双语
├── pages/
│   ├── HomePage.tsx
│   ├── ProfilePage.tsx
│   ├── ProjectDetail.tsx
│   ├── BlogPage.tsx
│   ├── BlogDetailPage.tsx
│   ├── SeriesIndexPage.tsx
│   ├── SeriesDetailPage.tsx
│   ├── NowPage.tsx
│   ├── UsesPage.tsx
│   ├── FriendsPage.tsx
│   ├── FandomPage.tsx
│   └── NotFoundPage.tsx
├── posts/                   # Markdown 博客（含 Front-Matter）
│   ├── welcome.md
│   ├── igem-frontend.md
│   └── aicv-mp-intern.md
├── utils/
│   └── analytics.ts         # GoatCounter + Web Vitals
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 核心特性

| 类别 | 实现 |
|---|---|
| **路由** | HashRouter（规避 GH Pages 刷新 404）+ 路由懒加载 + Suspense |
| **暗色模式** | `prefers-color-scheme` + localStorage 持久化 + 防闪烁脚本 |
| **国际化** | react-i18next 中英双语，`<html lang>` 联动 |
| **博客** | Markdown 文件自动加载，含 Front-Matter / GFM / 代码高亮 / 复制 / TOC / 阅读进度 |
| **搜索** | Fuse.js 命令面板，⌘K / Ctrl+K / `/` 触发 |
| **评论** | giscus 集成（GitHub Discussions） |
| **统计** | GoatCounter 隐私友好统计 + Web Vitals 上报 |
| **PWA** | vite-plugin-pwa 自动生成 SW + Manifest + 离线缓存 |
| **动画** | framer-motion + `prefers-reduced-motion` 兼容 |
| **设计 token** | Tailwind 扩展 brand/gold 色阶 + Inter/Noto Sans SC |
| **可访问性** | aria-label / focus ring / 键盘可达 / 跳过链接 |
| **SEO** | title / description / OG / Twitter Card / theme-color |
| **代码分割** | react-vendor / motion / markdown / giscus / SearchPalette 多 chunk |

---

## 配置指南

### 编辑内容
| 想改什么 | 改哪里 |
|---|---|
| 个人基础信息 / 邮箱 / GitHub | `src/data/profile.ts` |
| 添加 / 修改项目 | `src/data/projects.ts` |
| 添加奖项 | `src/data/awards.ts` |
| 修改技能 / 课程 / 实习 / 科研 | `src/data/skills.ts` |
| 添加博客 | 在 `src/posts/` 新建 `xxx.md`，自动出现在列表 |
| 专题分类 | `src/data/series.ts`（按 `matchTags` 自动归类） |
| 友链 | `src/data/friends.ts` |
| 追星 | `src/data/fandom.ts`（可设密码） |
| 主题色 / 字体 | `tailwind.config.js` |
| i18n 文案 | `src/i18n/index.ts` |

### 启用评论（giscus）
1. 仓库改为 public
2. 安装 [giscus GitHub App](https://github.com/apps/giscus)
3. 仓库设置中开启 Discussions
4. 去 https://giscus.app/zh-CN 生成配置
5. 把 `repoId` / `categoryId` 填到 `src/data/giscus.ts`

### 启用访问统计（GoatCounter）
1. 在 https://www.goatcounter.com/ 注册
2. 把分配的 code 填到 `src/utils/analytics.ts` 的 `goatcounterCode`

---

## 部署 GitHub Pages

本项目已接入 **GitHub Actions 全自动部署**，无需手动执行任何命令。

### 一次性配置（仅首次需要）

进入仓库 **Settings → Pages → Build and deployment**：

- **Source** 选择 **GitHub Actions**

### 日常发布流程

```bash
git push origin main
```

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动：

1. 安装依赖、跑 `typecheck` + `lint` + `build` + `size` 检查
2. 上传 `dist/` 产物到 GitHub Pages
3. 部署完成后跑 Lighthouse 评分（首页 / 博客 / Profile）

PR 阶段也会跑同样的检查（`.github/workflows/ci.yml`），任何环节失败都会阻塞合并。

---

## 自动化质量保障

| 阶段 | 工具 | 触发 | 失败行为 |
|---|---|---|---|
| **本地 commit** | husky + lint-staged | `git commit` | 仅对暂存的 `.ts/.tsx` 跑 `eslint --fix`（毫秒级，仅检查改动） |
| **本地 push** | husky | `git push` | 全量 `tsc --noEmit` 类型检查，类型错误本地拦截 |
| **PR / push 到 main** | GitHub Actions `ci.yml` | 远端 | typecheck → lint → build → bundle size，任一失败阻塞 |
| **合并到 main** | GitHub Actions `deploy.yml` | 远端 | 全量检查通过后自动构建 + 部署 + Lighthouse |
| **依赖维护** | Dependabot | 每周一 | 自动开 PR 升级 npm 与 actions 依赖 |

### 打包体积守门（`scripts/check-bundle-size.js`）

智能区分**首屏关键 chunk** 与**按需加载 chunk**：

| 维度 | 阈值（gzip） | 当前 |
|---|---|---|
| 单个 JS chunk | ≤ 250 KB | ✅ 最大 markdown 182 KB（按需） |
| 首屏关键 JS 总和 | ≤ 250 KB | ✅ 238 KB |
| 全部 JS 总和 | ≤ 1500 KB | ✅ 1265 KB |
| 单个 CSS | ≤ 50 KB | ✅ 最大 12.67 KB |

> mermaid 各 diagram、katex、cytoscape、wardley、markdown、giscus 等被识别为按需加载，**不计入首屏关键体积**。如需调整阈值或新增懒加载模式，编辑脚本顶部的 `LIMITS` / `LAZY_PATTERNS`。

### Lighthouse CI

`.github/lighthouse/lighthouserc.json` 设定的最低分（warn 级别，不阻塞部署）：

- Performance ≥ 80
- Accessibility ≥ 90
- Best Practices ≥ 90
- SEO ≥ 90

每次部署后报告会上传到临时公开存储，可在 Actions 运行日志里点开链接查看。

---

## 后续迭代

详见 [`ROADMAP.md`](./ROADMAP.md)
