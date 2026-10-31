# 博客创意方向清单（提案 · 未实施）

> 生成于 2026-10-31。本文档只做调研与规划，**不含任何代码改动**。
> 每个方向包含：是什么 → 参考谁 → 怎么做（结合现有架构）→ 成本评估。
> 确认后再挑条目排期实现。

---

## 一、现状盘点（可复用的家底）

| 已有能力 | 位置 | 对新创意的意义 |
|---|---|---|
| 游戏化主题（主城/角色档案/任务中心） | 全站文案、Profile 五 Tab | 成就系统、彩蛋、等级体系与主题天然契合 |
| GoatCounter 统计 + 每日报告 Workflow | `utils/analytics.ts`、`daily-report.yml`（已有 API Token） | 公开数据看板页的数据源现成 |
| GitHub 贡献图 API 缓存规则（遗留） | `vite.config.ts` Workbox 规则（`api.github.com`、`jogruber`） | ROADMAP v3.0 的"GitHub 热力图"半途而废，可直接复活 |
| giscus 评论（GitHub Discussions） | `src/data/giscus.ts` | 留言板可零成本复用 |
| Sveltia CMS（editorial workflow） | `public/admin/` | 新内容类型（碎碎念/TIL/书影音）可进 CMS 管理 |
| Cloudflare Worker | `bobhuang-blog-auth` | 可扩展为 GoatCounter/Bilibili 等需要鉴权 API 的代理 |
| 搜索面板 ⌘K（Fuse.js） | `src/features/search/` | 可挂载新页面、新动作（命令面板化） |
| framer-motion / View Transitions / SmartImage | 全站 | 动效类创意的底子已经很足 |
| AI 小bot + 运行时知识库 | `src/features/assistant/` | 新页面数据可继续喂 KB（注意[[ai-assistant-kb-rules]]：只收录页面实际展示的数据） |
| 旅行地图 d3-geo、Fandom 收藏稀有度 | `src/features/travel/`、`fandom/` | 演出地点上地图、照片墙等可扩展 |
| 404 弹球小游戏 | `errors/NotFoundPage/BallGame` | 可加本地排行榜、彩蛋联动 |

已有 ROADMAP 条目（本文档只补充细节，不重复立项）：博客分页、`updated` 日期展示、Konami 彩蛋、项目时间线、发文频率图、Profile 打印样式、Astro 迁移。

---

## 二、方向清单

优先级含义：★★★ 强烈推荐（性价比高/契合主题）；★★ 值得做；★ 看心情。
成本：S = 半天内，M = 1~2 天，L = 3 天以上。

### A. 新页面类

#### A1. `/dashboard` 数据看板页 ★★★ · M
**是什么**：把"站长自己"的数据做成公开仪表盘——博客流量、GitHub 活动、站点运行状态，游戏化包装成"服务器状态/玩家统计"。
**参考**：[Lee Robinson 的 /dashboard](https://leerob.io)（流量+音乐+步数一页看）、antfu.me 首页时间线。
**怎么做**：
- 数据源 1：GoatCounter——`daily-report.yml` 已经在调 API，再加一个 cron 把 JSON 写进仓库（或经 Cloudflare Worker 代理，Token 不进前端）；
- 数据源 2：GitHub 贡献热力图，见 D1，直接嵌进同一页；
- 数据源 3：uptime.yml 的探测结果（状态机已在 Actions cache 里）→ "服务可用率"卡片；
- 页面放 `features/dashboard/`，注册进 `routes.tsx`，纯静态 JSON 渲染，无运行时密钥。

#### A2. `/now` 页面 ★★★ · S
**是什么**：一页回答"我现在在忙什么"——当前课题、在读的书、在玩的游戏、近期目标。独立于简历式 Profile，更"活"。
**参考**：[nownownow.com](https://nownownow.com/)（/now 页运动发起者）、[32-Bit Cafe 资源列表](https://discourse.32bit.cafe/t/resources-list-for-the-personal-web/49)。
**怎么做**：`data/now.ts` 单文件 + 一个静态页；文案走 uiText；加入搜索索引和 AI KB。可以再注册到 nownownow.com 换外链。

#### A3. `/uses` 装备清单页 ★★ · S
**是什么**：我用的硬件/软件/效率工具清单，开发者博客标配，也是被搜索最多的页面类型之一。
**参考**：[32-Bit Cafe /uses 目录](https://discourse.32bit.cafe/t/resources-list-for-the-personal-web/49)、jamesg.blog 的 100 ideas。
**怎么做**：同 A2，`data/uses.ts` + 分组卡片（键盘/编辑器/命令行/AI 工具……），游戏化命名如"装备栏"。

#### A4. 书影音页（读书/观影/听歌） ★★ · M
**是什么**：豆瓣式的标记墙——书封、影封、评分、短评。Fandom 页已有"收藏品+稀有度"系统，书影音可作为第四个内容板块或独立页。
**参考**：[ygria 的豆瓣书影墙教程](https://ygria.site/)（爬豆瓣→静态 JSON→封面进仓库）、[NeoDB](https://neodb.social/)（可导入豆瓣数据、有开放 API，最省事）。
**怎么做**：首选 NeoDB API（公开数据可客户端拉取或 build-time 生成 JSON）；豆瓣方案需要自建爬取脚本 + Actions 定时跑。展示组件可复用 Fandom 的收藏卡片骨架。

#### A5. 留言板 Guestbook ★★★ · S
**是什么**：独立"留言板"页，访客随便说两句，区别于文章评论。
**参考**：独立网页圈标配（32-Bit Cafe、neocities 圈子都把它当门面）。
**怎么做**：新建 `features/guestbook/`，整个页面就是一块 giscus，`data-giscus` 映射到 `/guestbook` 路径 + 专用 Discussion 分类。半天搞定，互动提升立竿见影。

#### A6. 碎碎念/TIL 微博流 ★★ · M
**是什么**：一句话级别的小想法、"今天学到"，不配写整篇博客时发。可挂"任务日志"的游戏化名头。
**参考**：Maggie Appleton 的 [Digital Garden 理念](https://maggieappleton.com/garden-explained)、各类 statuslog。
**怎么做**：`src/notes/*.md` 新内容类型 + `import.meta.glob` 同 blog 的加载方式；Sveltia CMS 加一个 collection（`config.yml` 已是自定义 collection 结构）；列表页支持按时间线无限滚动；KB 检索顺带覆盖。

#### A7. 年度报告页（Wrapped） ★★ · M（内容依赖年底）
**是什么**：像 Spotify Wrapped 一样做"我的 2026"——发文数、字数、访问量、去过的城市、解锁的成就，一页炫技。
**参考**：各类 "Year in Review" 博客年终文章；数据看板页（A1）的组件可直接复用。
**怎么做**：基于 A1 的数据管道 + `src/data/wrapped2026.ts` 手工补充叙述性内容；动效用 framer-motion 逐屏滚动播放，做成"通关结算画面"最贴主题。

#### A8. 网站更新日志页（Changelog / 版本公告） ★★ · S
**是什么**：把每次大改版写成"版本更新公告"，配 ROADMAP 版本号。访客能感知网站在成长。
**参考**：jamesg.blog 100 ideas（第 8/73 条）、leerob.io 的 /course 之外的结构页。
**怎么做**：`data/changelog.ts` + 简单时间线页；也可反向输出为首页公告条的数据源（AnnouncementBar 已存在）。

#### A9. 友链朋友圈 ★ · M~L
**是什么**：聚合友链们的 RSS 最新文章，形成"朋友圈"流，激活现在只有 2 人的 Friends 页。
**参考**：[hexo-circle-of-friends](https://github.com/Rock-Candy-Tea/hexo-circle-of-friends)（主流方案，Python 爬 RSS）、PRIN BLOG 的 FreshRSS API 简易方案。
**怎么做**：GH Pages 无后端 → 用 Actions cron 定时抓友链 RSS 生成 `friends-feed.json` 提交进仓库；前端 `features/friends/` 加一个 Tab 渲染。友链少时也可先手工维护 JSON。

#### A10. 随机漫游页 ★ · S
**是什么**：一个 `/random` 入口（或 ⌘K 命令"手气不错"），随机跳到一篇博客/一个项目/一个彩蛋。
**参考**：jamesg.blog 100 ideas 第 10 条。
**怎么做**：从 `searchIndex` 派生候选集，一个函数 + 搜索面板动作即可。

---

### B. 博客阅读体验类

#### B1. RSS 输出 ★★★ · S（无 RSS 是当前最大短板）
**是什么**：目前全站没有任何 RSS/Atom/JSON Feed。中文独立博客圈靠 RSS 互推（见[中文博客琅琊榜](https://github.com/qianguyihao/blog-list)收录标准：必须提供 RSS）。
**怎么做**：`sitemap-plugin.ts` 已在 build 时遍历路由+posts，照葫芦画瓢加一个 `rss-plugin` 生成 `feed.xml`（+ 可选 JSON Feed）；`index.html` 加 `<link rel="alternate">`；Footer 加订阅入口。

#### B2. 动态 OG 分享图 ★★★ · M
**是什么**：现在所有页面的 OG 图都是同一张头像；每篇文章应有标题品牌化的分享卡。
**参考**：[Satori + resvg 构建期生成 OG 图的实践](https://engineering.oakoliver.com/articles/dynamic-og-image-generation-satori-resvg)（40 语言×12 路由全静态，和我们同为 SSG 场景）。
**怎么做**：build 阶段脚本读 `blogMeta`，Satori 把 JSX 转 SVG → `resvg-js`（或仓库已有的 sharp）转 PNG → 写入 `dist/og/<slug>.png`；`usePageMeta` 的 OG 路径改为每篇独立。纯构建期，零运行时成本。

#### B3. 文章内嵌交互组件 ★★ · M~L（最能"惊艳"的方向）
**是什么**：让 Markdown 里能跑活的 React 组件——可拖动的图表、可视化算法演示。数据科学+AI 保研人设下，写算法文章时价值极高。
**参考**：[Josh Comeau《How I Built My Blog》](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2)（MDX 嵌交互组件的鼻祖文）、[MDX 中文文档 Embed 指南](https://www.mdxjs.cn/guides/embed)。
**怎么做**：两条路线——
1. 轻量：自定义 remark/rehype 指令（如 `:::demo[skill-radar]`），从注册表映射到 `features/demos/` 下的组件，lazy 加载。不改 Markdown 管线依赖，保留现有 frontMatter 解析器；
2. 标准：迁 MDX（依赖重，且与自研 frontMatter 解析器有摩擦）。
建议先走路线 1，做一个 demo 组件（比如把 SkillRadar 做成文章内可交互版）验证。

#### B4. 文章反应 + 撒花 ★★ · S
**是什么**：文章底部一排 emoji 反应（👍🔥🎉），点击有 confetti；点赞数存 localStorage（无后端）或干脆只做"物理反馈不存数"。
**参考**：joshwcomeau.com 的互动彩蛋氛围；[Yukai Chou 的博客游戏化 ROI 实验](https://yukaichou.com/gamification-examples/yukai-chou-gamified-gamification-blog)（互动数据提升 50 倍分享）。
**怎么做**：`features/blog/components/` 新组件；framer-motion 粒子已有基建（MouseParticles 可借鉴）。若想真计数，可借 Cloudflare Worker + KV。

#### B5. "继续阅读"与阅读历史 ★★ · S
**是什么**：本地记录读过的文章，首页/博客页顶部出现"上次读到《xx》"恢复入口；⌘K 里加"最近浏览"分组。
**参考**：leerob.io 早期 dashboard 的思路（把个人化数据摆到门口）。
**怎么做**：一个 `useReadingHistory` hook（localStorage，记录 slug+时间+滚动位），`ScrollRestoration` 已有部分能力可对齐。

#### B6. 分享海报生成器 ★ · M
**是什么**：文章页点"生成分享图"，canvas 合成标题+摘要+二维码的品牌卡片，长按保存。中文博客圈高频功能。
**参考**：各中文博客海报插件（VuePress/Hexo 生态多处实现）。
**怎么做**：canvas 离屏绘制 + 现有头像/配色；注意字体加载时机（Noto Sans SC 子集化后体积可控）。

#### B7. 阅读设置面板 ★ · S
**是什么**：文章页右上角字号/行距/衬线切换，偏好存 localStorage。
**参考**：jamesg 100 ideas（字体/主题类条目）、[rauchg 的极简阅读器风格]。
**怎么做**：纯 CSS 变量挂 typography 容器，`prefers-reduced-motion` 同样尊重。

#### B8. 旅行照片墙（EXIF） ★ · M
**是什么**：Travel 页加照片瀑布流，hover 显示拍摄参数（机身/镜头/参数），点击 Lightbox 已有。
**参考**：Flickr 风格相册页；jamesg 100 ideas 第 17 条。
**怎么做**：图片走 SmartImage（自动 webp/avif，[[lighthouse-ghpages-limits]]）；EXIF 在构建期用脚本抽成 JSON，前端零解析。

---

### C. 游戏化与彩蛋类（与全站主题最契合）

#### C1. 全站成就系统 ★★★ · M~L（本项目最推荐）
**是什么**：访客在站内做出特定行为时解锁徽章——首次深潜阅读 3 篇、连续访问、触发彩蛋、试玩 404 游戏通关、给小bot 提问……右下角 toast 弹"🏆 成就解锁"。含隐藏成就（解锁前不显示条目）。
**参考**：[TapTap 成就系统设计](https://developer.taptap.cn/docs/sdk/achievement/features)（隐藏成就机制：解锁前不展示，天然适配彩蛋类）、GitHub 个人成就徽章体系、[Yukai Chou 游戏化实验](https://yukaichou.com/gamification-examples/yukai-chou-gamified-gamification-blog)。
**怎么做**：
- `features/achievements/`：成就定义表（id/标题/描述/图标/隐藏标记/触发条件谓词）+ `AchievementContext`（订阅全局事件：路由切换、停留时长、评论成功、游戏分数…）；
- 解锁状态存 localStorage（`bh:achievements`），toast 复用现有 UI；
- Profile 页"成就墙"Tab 展示收集进度（游戏化闭环：主页→档案→成就）；
- 可选：GoatCounter 自定义事件上报解锁数，站长侧看活跃度。

#### C2. Konami 彩蛋（ROADMAP 已立项） ★★ · S
**怎么做**：上上下下左右左右 BA → 触发主题级特效（如全站像素化 5 秒/粒子爆发/小bot 换人格）+ 解锁一枚隐藏成就（与 C1 联动，一举两得）。

#### C3. 终端彩蛋页 ★★ · S
**是什么**：`/terminal` 或按 `~` 键呼出假终端：`help`/`whoami`/`ls blog`/`cat about`/`sudo make dream`，输出全站数据，主题契合度极高。
**参考**：开发者博客经典彩蛋（Termi 劲示例众多）。
**怎么做**：纯前端玩具，`features/terminal/`；命令表可复用 `searchIndex` 与 `blogMeta`；隐藏入口：Footer 版权行的小圆点点击 3 次。

#### C4. 404 弹球排行榜 ★ · S
**是什么**：现有 BallGame 加 localStorage 最高分榜 + 通关解锁成就。
**怎么做**：`BallGame.tsx` 内部状态延伸；与 C1 联动。

#### C5. 节日/季节特效 ★ · S
**是什么**：下雪/樱花/烟花粒子，按日期自动开关。
**参考**：中文博客圈经典（Hexo 生态各特效插件）。
**怎么做**：复用 `HeroBackground` 的 canvas 粒子层，加一个按月份选特效的调度器；尊重 `prefers-reduced-motion`（现有基建已全站尊重）。

#### C6. 节点倒计时组件 ★ · S
**是什么**：Hero 或 Profile 挂"距 XX 还有 N 天"（毕业/开学/比赛节点），卡片式，重要节点自动置顶。
**怎么做**：`data/countdown.ts` 配置 + 小组件；顺带进 KB。

#### C7. AI 小bot 升级包 ★★ · S~M（多项可拆）
- 预设快捷问题 chips（"他的科研方向？""去过哪？"）→ 降低首次使用门槛；
- 每日开场白（结合日期/天气/倒计时）；
- 回答底部"来源卡片"（KB 已有 chunk 元数据，展示出处页面链接，顺带导流）；
- 语音输入（Web Speech API，纯前端）。
**注意**：[[ai-assistant-kb-rules]]——回答不得混入页面未展示的内容，来源卡片思路正好把这条规则显性化。

---

### D. 外部数据集成类

#### D1. GitHub 贡献热力图 ★★★ · S（半成品复活）
**是什么**：主页/Profile/dashboard 展示最近一年的贡献格子。
**参考**：[leanrada 的 heatmap widget 制作记](https://leanrada.com/notes/github-heatmap-widget)、[grubersjoe/github-contributions-api](https://github.com/grubersjoe/github-contributions-api)（`/v4/{user}?y=last`，免 Token，PWA 缓存规则已为它写好却从未被调用）。
**怎么做**：`features/profile/` 或 home 新组件，fetch + 缓存规则现成，自绘 SVG 格子（甚至可以做成就联动：连续 7 天访问看到"热力图点亮"）。

#### D2. GoatCounter 公开数据（并入 A1） ★★ · S
**注意**：API 需 Bearer Token，绝不进前端。走 Actions cron 落 JSON 或 Worker 代理，二选一。

#### D3. Now Playing 音乐状态 ★ · S~M
**是什么**：站点角落显示"正在听"。
**参考**：[Widdit/now-playing-service](https://github.com/Widdit/now-playing-service)（中文圈方案）、Last.fm API（scrobble 最近播放，最常见）。
**怎么做**：Last.fm 需 Token → 同样走 Worker 代理 + 客户端轮询缓存；或退化为静态"歌单页"（零 API，先有再好）。

#### D4. 演出足迹上地图 ★ · S
**是什么**：Fandom 的 Concerts 数据（城市）与 Travel 地图联动——地图上亮起"演唱会 venues"专属图层，点开弹出观演回忆。
**怎么做**：`travel.ts` 与 `fandom.ts` 的地名做映射表，`RouteLayer` 加一种 marker 类型。两个现成数据集的化学反应，全站独一份的创意。

---

### E. 基础设施/工程质量类

#### E1. ROADMAP 存量项补充实施细节
- **分页/updated 展示**：`blogMeta` 已带字段，纯 UI 工作（S）；
- **发文频率图**：blog.ts 派生数据 + 简单 SVG 柱状图（S）；
- **Profile 打印样式**：`@media print` 隐藏导航/动效，导出 PDF 即简历（S）；
- **Astro 迁移**：解决 HashRouter SEO 硬伤 + 天然支持 B3 的 MDX，但等于重写路由层（L，建议新方向稳定后再评估）。

#### E2. PWA 离线兜底页 ★ · S
**是什么**：断网时 SW 返回"离线模式"页面（游戏化包装成"失联信号"），替代白屏。
**怎么做**：Workbox 已在，加一个 offline fallback 路由 + 静态页。

#### E3. 短链跳转 `/go/:name` ★ · S
**是什么**：分享时用 `#/go/gh` 之类的短链跳转任意目标，可统计点击（GoatCounter 自定义事件）。
**怎么做**：`data/shortlinks.ts` 映射 + 一个通配路由。

---

## 三、推荐排期（供挑选）

| 波次 | 条目 | 理由 |
|---|---|---|
| **快赢包**（合计 ~2 天） | B1 RSS、A2 /now、A5 留言板、D1 GitHub 热力图 | 全部低成本，补齐独立博客"标配"，热力图基建现成 |
| **主题包**（~1 周） | C1 成就系统（含 C2/C4 联动）、C3 终端、B4 反应撒花 | 游戏化人设独此一家，记忆点拉满 |
| **门面包**（~1 周） | B2 OG 图、A1 /dashboard、B3 内嵌交互组件（先 1 个 demo） | 分享传播 + 技术展示，服务保研/求职形象 |
| **看心情** | A4 书影音、A7 Wrapped、A9 朋友圈、C5/C6、D3/D4、B6~B8 | 内容依赖或锦上添花 |

**不建议现在做**：Astro 迁移（大动干戈，等创意稳定）、i18n（单语言是明确决策）、Live2D 看板娘（与现有审美冲突 + 体积）、Webmention（需常驻服务，GH Pages 不友好）。

---

## 四、通用约束（实现任何一条前对照）

1. 四层架构：新页面进 `features/<name>/` + 注册 `app/routes.tsx`；文案进 `uiText.ts`；派生数据在 `data/` 层算好（见 `docs/ARCHITECTURE.md`）。
2. Lighthouse 红线：外部数据一律 lazy/idle 加载 + SW 缓存；图片走 SmartImage；别把主包撑爆（有 size 门禁）。
3. 密钥永不进前端：GoatCounter/Last.fm/豆瓣类一律 Actions cron 落库或 Worker 代理。
4. 新页面数据同步喂 AI KB（`knowledgeBase.ts` 自动从 data 层构建，多数情况零成本，但需确认 chunk 分类覆盖）。
5. 动效尊重 `prefers-reduced-motion`（现有约定）。
6. 完成后不自动提交，等确认（见[[ai-assistant-kb-rules]]）。

---

## 五、参考链接汇总

- [Josh Comeau — How I Built My Blog](https://www.joshwcomeau.com/blog/how-i-built-my-blog-v2)：交互组件/音效/动效的天花板
- [jamesg.blog — 100 (more) things you can do with your personal website](https://jamesg.blog/2024/03/10/100-more-personal-website-ideas/)：创意清单弹药库
- [32-Bit Cafe — Resources List for the Personal Web](https://discourse.32bit.cafe/t/resources-list-for-the-personal-web/49)：/now、/uses、guestbook 资源目录
- [nownownow.com](https://nownownow.com/)：/now 页注册处
- [Maggie Appleton — Digital Garden](https://maggieappleton.com/garden-explained)：数字花园内容组织法
- [grubersjoe/github-contributions-api](https://github.com/grubersjoe/github-contributions-api) + [leanrada — Making my GitHub heatmap widget](https://leanrada.com/notes/github-heatmap-widget)：贡献热力图
- [Satori + resvg 构建期 OG 图实践](https://engineering.oakoliver.com/articles/dynamic-og-image-generation-satori-resvg)：SSG 场景最贴合
- [hexo-circle-of-friends](https://github.com/Rock-Candy-Tea/hexo-circle-of-friends)：友链朋友圈
- [Widdit/now-playing-service](https://github.com/Widdit/now-playing-service)：正在播放组件
- [Yukai Chou — Blog Gamification ROI](https://yukaichou.com/gamification-examples/yukai-chou-gamified-gamification-blog) + [TapTap 成就系统设计](https://developer.taptap.cn/docs/sdk/achievement/features)：游戏化与隐藏成就
- [ygria — 豆瓣书影墙](https://ygria.site/) / [NeoDB](https://neodb.social/)：书影音数据源
- [中文博客琅琊榜](https://github.com/qianguyihao/blog-list)：RSS 是收录硬标准
