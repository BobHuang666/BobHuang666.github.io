# 前端结构设计与协作约定

本项目是以 Vite、React 和 TypeScript 构建的静态个人站点。目录组织以**依赖方向**和**业务归属**为准：应用层编排，功能层实现业务，共享层提供可复用能力，数据层提供单一内容源。

## 当前结构

```text
src/
├─ app/                 # 启动编排：Provider、路由与全局页面壳层
├─ features/            # 高内聚业务功能及其路由页面
│  ├─ home/             # HomePage + sections/（各区块）+ 局部组件
│  ├─ profile/          # ProfilePage + tabs/（每 Tab 一文件）+ tabs/primitives
│  ├─ fandom/           # FandomPage + tabs/ + meta.ts（枚举→展示）+ components
│  ├─ projects/ blog/ friends/ errors/
│  ├─ search/ github/   # 跨页面业务能力，通过 index.ts 暴露公共入口
│  └─ assistant/        # AI 助手：视图、请求适配、检索、配置与类型
├─ shared/components/   # 跨业务复用的 layout、controls、ui、effects
├─ contexts/            # 全局 React Context（主题）
├─ hooks/               # 跨功能复用的 Hook
├─ data/                # 内容单一事实来源（含文案 uiText.ts）与轻量派生索引
├─ posts/               # Markdown 博客正文，由 data/blog.ts 自动读取
├─ drafts/              # 未发布草稿（不参与构建，不在任何 glob 中）
├─ types/               # 跨领域数据模型
└─ utils/               # 无 React 状态的通用工具
```

`public/` 是会被原样发布的静态文件目录。新增站点静态资源应放入 `public/static/`；根目录的历史 `static/` 已删除，不应重新创建。

## 依赖规则

```text
app  →  features / shared / contexts
features → shared / hooks / data / types / utils
shared / hooks / data / types / utils 不能反向依赖 features 或 app
data / types / utils 之间只允许单向：types ← utils ← data
```

`features` 之间不直接导入内部实现文件。确有共享需求时，由被依赖方用 `index.ts` 显式导出稳定的公共入口（如 `features/github`、`features/search`），消费方只引用入口。

## 分层职责

| 层 | 职责 | 不该做什么 |
| --- | --- | --- |
| `app/` | Provider、路由注册与懒加载、全局壳层与浮层 | 写业务 UI |
| `features/<x>/<Page>` | 取数、**编排**区块/Tab，持有页面级状态 | 把几百行 JSX 堆在一个文件里 |
| `features/<x>/sections|tabs/` | 单一区块或 Tab 的展示与局部交互 | 跨 feature 复用 |
| `features/<x>/meta.ts` | 枚举 → 图标/文案/配色的展示映射 | 放内容数据 |
| `shared/components/` | 被 2 个以上业务复用的展示单元 | 携带某个业务的领域语义 |
| `data/` | 内容事实来源 + 由内容直接派生的索引 | 发网络请求、存浏览器状态 |
| `utils/` | 纯函数工具（解析、映射、滚动） | 依赖 React 或业务模块 |

## 文件放置规则

- 新路由页面放入所属 `features/<name>/`，并在 `app/routes.tsx` 注册；路由级懒加载也只放在这里。
- 页面超过约 200 行就拆分：区块放 `sections/`，Tab 放 `tabs/`，展示原子放同目录 `primitives.tsx` / `components.tsx`。
- 仅被一个业务使用的组件、状态、请求代码放在对应 `features/<name>/`。
- 被两个及以上业务使用、且不携带业务数据语义的 UI 才可放进 `shared/components/`。
- `data/` 只保存内容和由内容直接派生的索引；网络请求、浏览器状态和展示状态不应写入其中。
- **派生优先于硬编码**：分类、标签、相关阅读、GitHub 用户名等能由数据算出的，一律在 `data/` 里派生，页面不重复实现。
- 共享类型放入 `types/`；仅一个 feature 使用的类型与该 feature 同目录。
- 全站文案集中在 `data/uiText.ts`，渲染层不写死中文字符串。文案只放「用户看得见的中文」（标题 / 按钮 / 空状态 / 提示），图标名、路由、class 与数值配置不进文案层；带变量的文案写成函数，参数名体现单位。

## 冗余防线（已落地）

- 同一视觉只保留一个实现：筛选胶囊 `Chip`、空态 `EmptyState`、错误页 `ErrorState`、图片放大 `SmartImage zoomable`、滚动 `scrollToId`。
- 页面不改数据：项目详情由 `getProjectDetail(id)` 按 id 关联简版数据，不依赖数组下标。
- 目录与正文共用一份 section 声明（项目详情 `SECTIONS`），避免滚动高亮因两处顺序不一致而错位。
- 未被任何地方引用的导出一律删除；新增导出前先确认有真实消费方。

## 修改时的检查清单

1. 修改或新增路由后，确认懒加载和 404 路由仍在 `app/routes.tsx`。
2. 新增内容字段时，先更新 `types/`，再更新 `data/` 和使用方。
3. 增加跨站状态时，评估是否应进入 `contexts/`；局部状态优先留在 feature 内。
4. 新增枚举展示（图标/文案/配色）时，加到对应 feature 的 `meta.ts`，不要在 JSX 里散落映射。
5. 合并前运行 `npm run check`；涉及打包或依赖时再运行 `npm run build` 与 `npm run size`。

## 结构完成状态

所有路由页面已归入对应 feature，所有 React 组件已归入 feature 或 `shared/components`。后续不得重新创建 `src/pages`、`src/components` 或 `src/lib` 作为兜底目录；新代码必须按上述规则归属。
