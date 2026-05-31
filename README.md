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
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 构建生产版本（输出到 dist/）
npm run build

# 预览构建结果
npm run preview

# 部署到 gh-pages 分支
npm run deploy

# 代码检查
npm run lint
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

```bash
npm run deploy
```

会自动构建并推送到 `gh-pages` 分支。仓库 Settings → Pages → Source 选 `gh-pages`。

---

## 后续迭代

详见 [`ROADMAP.md`](./ROADMAP.md)
