# 前端结构设计与协作约定

本项目是以 Vite、React 和 TypeScript 构建的静态个人站点。目录组织以**依赖方向**和**业务归属**为准，自下而上分为四层：数据层、共享层、页面层、应用层。import 统一使用 `@/*` 别名（映射 `src/*`），从路径即可看出所属分层。

## 分层总览

```text
src/
├─ app/                 # ④ 应用层：Provider 组合、路由注册与懒加载、全局壳层
├─ features/            # ③ 页面层：每个路由页面或跨页能力一个 feature
│  ├─ home/             #    HomePage + sections/（区块）+ 局部组件
│  ├─ profile/          #    ProfilePage + tabs/ + primitives
│  ├─ fandom/ travel/   #    Page + tabs|sections + components + meta/hooks/utils
│  ├─ blog/ friends/ projects/ errors/
│  ├─ search/           #    跨页能力，index.ts 暴露公共入口
│  └─ assistant/        #    AI 助手：视图、请求适配、知识库检索、配置与类型
├─ shared/              # ② 共享层：components/（layout、controls、ui、effects）
├─ contexts/            # ② 全局状态：theme.ts（Context + Hook）+ ThemeContext.tsx（Provider）
├─ hooks/               # ② 跨 feature Hooks
├─ data/                # ① 数据层：内容单一事实来源（含文案 uiText.ts）+ 派生索引
├─ posts/               # 内容资产：Markdown 博客正文，由 data/blog.ts 自动读取
├─ drafts/              # 未发布草稿（不参与构建，不在任何 glob 中）
├─ types/               # ① 数据模型：跨领域类型的唯一定义处
└─ utils/               # ① 纯函数工具（不依赖 React 与业务模块）
```

`public/` 是会被原样发布的静态文件目录。新增站点静态资源应放入 `public/static/`；根目录的历史 `static/` 已删除，不应重新创建。

## 依赖规则（严格单向）

```text
app  →  features / shared / contexts / hooks
features  →  shared / contexts / hooks / data / types / utils
shared / hooks  →  contexts / data / types / utils
data  →  types / utils          types 不依赖任何层          utils → types
```

- `features` 之间不直接导入内部实现文件。确有共享需求时，由被依赖方用 `index.ts` 显式导出稳定的公共入口（如 `features/search`），消费方只引用入口。
- `shared/`、`hooks/`、`data/`、`types/`、`utils/` 禁止反向依赖 `features/` 或 `app/`。需要在共享层触发页面能力时，由 `app/` 以插槽（slot）或 Provider 注入，参考「导航栏搜索按钮」的装配方式（`app/App.tsx` 把 `SearchButton` 以 slot 传入 `Navigation`，`SearchProvider` 统一持有面板状态与快捷键）。
- 涉及 React 组件的映射表放 `shared/components/ui/`（如 `iconMap.ts`），`utils/` 只放纯函数。

## 分层职责

| 层 | 职责 | 不该做什么 |
| --- | --- | --- |
| `app/` | Provider、路由注册与懒加载、全局壳层与浮层的装配 | 写业务 UI |
| `features/<x>/` | 取数、编排区块/Tab，持有页面级状态 | 把几百行 JSX 堆在一个文件里 |
| `features/<x>/sections\|tabs/` | 单一区块或 Tab 的展示与局部交互 | 跨 feature 复用 |
| `features/<x>/components/` | feature 内复用组件；小原子放 `primitives.tsx` | 被 2 个以上业务复用 |
| `features/<x>/meta.ts` | 枚举 → 图标/文案/配色的展示映射 | 放内容数据 |
| `shared/components/` | 被 2 个以上业务复用的展示单元 | 携带某个业务的领域语义 |
| `contexts/` | 全局状态原语（Context 定义 + Provider + Hook） | 业务状态 |
| `hooks/` | 跨 feature 复用的 Hook | 业务语义 |
| `data/` | 内容事实来源 + 由内容直接派生的索引 | 发网络请求、存浏览器状态 |
| `types/` | 跨领域数据模型 | 依赖任何层 |
| `utils/` | 纯函数工具（解析、格式化、滚动） | 依赖 React 或业务模块 |

## 文件放置规则

- feature 根目录只放 `Page.tsx`、`meta.ts`、纯函数助手（`format.ts` / `codeLanguage.ts` / `cardSvg.ts` 一类）与可选的 `index.ts`；组件进 `sections/`、`tabs/`、`components/`，逻辑进 `hooks/`、`utils/`。无路由的能力型 feature（如 assistant）可平铺。
- 新路由页面放入所属 `features/<name>/`，并在 `app/routes.tsx` 注册；路由级懒加载也只放在这里。
- 页面超过约 200 行就拆分：区块放 `sections/`，Tab 放 `tabs/`，独立组件放 `components/`。
- 仅被一个业务使用的组件放在对应 `features/<name>/components/`；被两个及以上业务使用、且不携带业务数据语义的 UI 才进 `shared/components/`。
- `data/` 只保存内容和由内容直接派生的索引；网络请求、浏览器状态和展示状态不应写入其中。
- **派生优先于硬编码**：分类、标签、相关阅读等能由数据算出的，一律在 `data/` 里派生，页面不重复实现。
- 共享类型放入 `types/`；仅一个 feature 使用的类型与该 feature 同目录。
- 全站文案集中在 `data/uiText.ts`，渲染层不写死中文字符串。文案只放「用户看得见的中文」（标题 / 按钮 / 空状态 / 提示），图标名、路由、class 与数值配置不进文案层；带变量的文案写成函数，参数名体现单位。

## 注释约定

- 每个模块文件第一行是一句 `/** 职责说明 */`，说明「这是什么」，不写历史沿革。
- 导出的组件 / 函数配一行 JSDoc，说明用途与前置条件，如「必须在 ThemeProvider 内使用」；文件头已说明的信息不重复。
- 接口字段名能自明的不写注释；只标注约定与坑位，如日期格式、名称匹配规则。
- 行内注释只解释**为什么**——设计取舍、约束、踩过的坑；不复述下一行代码做什么。
- 少用括号补充语，能直接陈述就拆成短句；不保留注释掉的代码，不写「之前 / 已改为」类过程性表述。
- 长文件可用 `// ── 段落 ──` 分隔。

## 冗余防线

- 同一视觉只保留一个实现：筛选胶囊 `Chip`、空态 `EmptyState`、错误页 `ErrorState`、图片放大 `SmartImage zoomable`、滚动 `scrollToId`。
- 页面不改数据：项目详情由 `getProjectDetail(id)` 按 id 关联简版数据，不依赖数组下标。
- 目录与正文共用一份 section 声明（项目详情 `SECTIONS`），避免滚动高亮因两处顺序不一致而错位。
- 未被任何地方引用的导出一律删除；新增导出前先确认有真实消费方。

## 修改时的检查清单

1. 修改或新增路由后，确认懒加载和 404 路由仍在 `app/routes.tsx`。
2. 新增内容字段时，先更新 `types/`，再更新 `data/` 和使用方。
3. 增加跨站状态时，评估是否应进入 `contexts/`；局部状态优先留在 feature 内。
4. 新增枚举展示（图标/文案/配色）时，加到对应 feature 的 `meta.ts`，不要在 JSX 里散落映射。
5. 新增文件时确认 import 全部走 `@/` 别名（同目录可用 `./`），注释遵守上文约定。
6. 合并前运行 `npm run check`；涉及打包或依赖时再运行 `npm run build` 与 `npm run size`。

## 结构完成状态

所有路由页面已归入对应 feature，所有 React 组件已归入 feature 或 `shared/components`。后续不得重新创建 `src/pages`、`src/components` 或 `src/lib` 作为兜底目录；新代码必须按上述规则归属。
