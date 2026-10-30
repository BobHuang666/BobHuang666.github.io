# CI/CD 与站点运维

> 一句话流程：`git push origin main` → CI 检查 → 自动部署 GH Pages → Lighthouse 全页评分 → 飞书通知。
> 首次部署仅需在仓库 Settings → Pages 将 Source 设为 **GitHub Actions**。

## 流水线一览

| 环节 | 触发 | 内容 | 工作流 |
| --- | --- | --- | --- |
| 本地 commit / push | husky | lint-staged 仅查暂存文件；push 前全量 typecheck | — |
| CI 检查 | push / PR | typecheck → lint → build → 体积守门，任一失败阻塞合并 | `ci.yml` |
| 部署 | push main | 构建上传 GH Pages，随后自动枚举全站页面跑 Lighthouse | `deploy.yml` |
| 站点探测 | 每 15 分钟 | 探测 `blog.bobhuang.cn`，3 次重试防误报，状态翻转才通知 | `uptime.yml` |
| 每日日报 | 每天 08:05 北京时间 | 昨日 / 本周访客、热门页面 TOP5、SSL 剩余天数 | `daily-report.yml` |
| 依赖维护 | 每周一 | Dependabot 自动升级 npm 与 actions 依赖 | — |

## 质量基线

**打包体积**（`scripts/check-bundle-size.js`，gzip 口径）：

| 维度 | 阈值 |
| --- | --- |
| 单个 JS chunk | ≤ 250 KB |
| 首屏关键 JS 总和 | ≤ 250 KB |
| 全部 JS 总和 | ≤ 1.5 MB |
| 单个 CSS | ≤ 50 KB |

mermaid / katex / cytoscape / markdown 等按需 chunk 不计入首屏关键体积；阈值与懒加载模式在脚本顶部的 `LIMITS` / `LAZY_PATTERNS` 调整。

**Lighthouse**（部署时由 `scripts/gen-lighthouse-pages.mjs` 自动枚举被测页面）：

- 静态路由 8 个 + 每类动态详情页各 1 个代表（第一篇非草稿文章、第一个项目）。
- 阈值 warn 级不阻塞部署：Performance ≥ 80，其余 ≥ 90（改阈值改 `lighthouserc.json` 基线）。
- HashRouter SPA 由 Lighthouse 执行 JS 渲染路由后审计，配合 `usePageMeta` 各页分数真实独立。
- 报告上传临时公开存储，逐页分数与直链通过飞书卡片推送；生成的 `lighthouserc.generated.json` / `pages.json` 为 CI 运行时产物，已 gitignore。

> GitHub Pages 固定 `Cache-Control: max-age=600`，Lighthouse 的 `uses-long-cache-ttl` / `cache-insight` 告警为平台限制，无法修复。

## 飞书通知

所有通知为卡片消息，发送脚本统一在 `.github/scripts/feishu-notify.mjs`：

| 通知 | 触发 |
| --- | --- |
| 🚨 CI 失败 | push / PR 检查失败，卡片含失败步骤与日志链接 |
| 🚀 部署成功 / 🚨 部署失败 | 含版本、gzip 体积、各页 Lighthouse 分数与报告链接 |
| 🚨 站点宕机 / ✅ 恢复 | 探测状态翻转才发，防轰炸 |
| 📊 每日日报 | 访客与热门页面统计，SSL 不足 14 天转橙色警告 |

所需 GitHub Secrets（Settings → Secrets and variables → Actions）：

| Secret | 用途 | 必填 |
| --- | --- | --- |
| `FEISHU_WEBHOOK_URL` | 飞书自定义机器人 Webhook，不配置则所有通知静默跳过 | 需要 CI / 部署 / 宕机告警时 |
| `FEISHU_WEBHOOK_SECRET` | 机器人开启「签名校验」时的密钥 | 否 |
| `GOATCOUNTER_API_TOKEN` | GoatCounter 个人设置 → API 生成 | 每日日报 |

> 日报用显式 `+08:00` 偏移查询，不依赖 GoatCounter 时区设置；若想让 Dashboard 按天分组也对齐北京时间，在 GoatCounter 用户设置把 Timezone 改为 `Asia/Shanghai`。
> 本站托管在 GitHub Pages（无服务器 / 容器 / 备份），CPU / 内存 / 备份类告警不适用。
> schedule 任务在仓库 60 天无 push 后会被 GitHub 暂停，手动跑一次即可恢复。
> 想看卡片效果：Actions → 对应工作流 → Run workflow 手动触发（`Uptime Monitor` 勾选 `force` 可强制发卡）。
