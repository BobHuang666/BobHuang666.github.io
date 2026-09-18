# 前端结构设计与协作约定

本项目是以 Vite、React 和 TypeScript 构建的静态个人站点。目录组织以**依赖方向**和**业务归属**为准：应用层编排，功能层实现业务，共享层提供可复用能力，数据层提供单一内容源。

## 当前结构

```text
src/
├─ app/                 # 启动编排：Provider、路由与全局页面壳层
├─ features/            # 高内聚业务功能及其路由页面
│  ├─ home/ profile/ projects/ blog/ friends/ fandom/ errors/
│  ├─ search/ github/   # 独立的跨页面业务能力
│  └─ assistant/        # AI 助手：视图、请求适配、检索、配置与类型
├─ shared/components/   # 跨业务复用的 layout、controls、ui、effects
├─ contexts/            # 全局 React Context
├─ hooks/               # 跨功能复用的 Hook
├─ data/                # 内容单一事实来源与轻量派生索引
├─ posts/               # Markdown 博客正文，由 data/blog.ts 自动读取
├─ types/               # 跨领域数据模型
└─ utils/               # 无 React 状态的通用工具
```

`public/` 是会被原样发布的静态文件目录。新增站点静态资源应放入 `public/static/`；根目录的历史 `static/` 已删除，不应重新创建。

## 依赖规则

```text
app  →  features / shared / contexts
features → shared / hooks / data / types / utils
shared / hooks / data / types / utils 不能反向依赖 features 或 app
```

`features` 之间不直接导入内部实现。若确有共享需求，应先提取到 `components`、`hooks`、`data`、`types` 或 `utils`，或者显式导出稳定的 feature 公共入口。

## 文件放置规则

- 新路由页面放入所属 `features/<name>/`，并在 `app/routes.tsx` 注册；路由级懒加载也只放在这里。
- 仅被一个业务使用的组件、状态、请求代码放在对应 `features/<name>/`。
- 被两个及以上业务使用、且不携带业务数据语义的 UI 才可放进 `shared/components/`。
- `data/` 只保存内容和由内容直接派生的索引；网络请求、浏览器状态和展示状态不应写入其中。
- 共享类型放入 `types/`；仅一个 feature 使用的类型与该 feature 同目录。
- 页面文件归属其 feature；一个可独立理解的 Tab、卡片组、弹窗或数据请求增长后，应抽到同一 feature 的子组件或 hook。

## 修改时的检查清单

1. 修改或新增路由后，确认懒加载和 404 路由仍在 `app/routes.tsx`。
2. 新增内容字段时，先更新 `types/`，再更新 `data/` 和使用方。
3. 增加跨站状态时，评估是否应进入 `contexts/`；局部状态优先留在 feature 内。
4. 合并前运行 `npm run check`；涉及打包或依赖时再运行 `npm run build` 与 `npm run size`。

## 结构完成状态

所有路由页面已归入对应 feature，所有 React 组件已归入 feature 或 `shared/components`。后续不得重新创建 `src/pages`、`src/components` 或 `src/lib` 作为兜底目录；新代码必须按上述规则归属。
