# 博客后台：一次性配置与日常使用

## 已实现的工作流

后台入口是 `/admin/`。它通过 Sveltia CMS 将文章和图片写入本仓库，而不是写入数据库：文章存放在 `src/posts/`，图片存放在 `public/uploads/`。现有 GitHub Actions 在内容合并到 `main` 后自动构建并部署 GitHub Pages。

后台启用了 Editorial Workflow。新建、编辑或删除已发布文章时，CMS 会在 GitHub 创建专用分支和拉取请求（PR）；在后台点 **Publish** 才会合并到 `main` 并上线。未发布的内容不在生产分支，因此不随网站构建，也不会被访客通过链接或搜索索引发现。

## 你需要完成的配置

### 1. 部署 GitHub OAuth 认证代理

GitHub Pages 只能托管静态文件，不能安全地保存 GitHub OAuth 的 `client_secret`；因此需要一个很小的 Cloudflare Worker 处理登录回调。使用官方 Sveltia CMS Authenticator 模板：<https://github.com/sveltia/sveltia-cms-auth>。

在 Cloudflare Workers 创建该 Worker 时，设置以下 secret（不要提交到本仓库）：

| Worker secret | 值 |
| --- | --- |
| `GITHUB_CLIENT_ID` | 第 2 步创建的 GitHub OAuth App Client ID |
| `GITHUB_CLIENT_SECRET` | 第 2 步创建的 GitHub OAuth App Client secret |

部署后复制 Worker 的公开地址，例如 `https://blog-cms-auth.<你的账号>.workers.dev`。

### 2. 创建 GitHub OAuth App

GitHub → Settings → Developer settings → OAuth Apps → New OAuth App：

| 项目 | 值 |
| --- | --- |
| Application name | `BobHuang Blog CMS` |
| Homepage URL | `https://bobhuang666.github.io/` |
| Authorization callback URL | `<Worker 地址>/callback` |

创建后，把 Client ID 与 Client secret 填入上一步 Worker 的 secrets。

### 3. 将 Worker 地址写入 CMS 配置

编辑 `public/admin/config.yml`，将：

```yml
base_url: https://bobhuang-blog-auth.2295672887.workers.dev
```

替换为真实 Worker 地址（不加 `/auth` 或 `/callback`）。提交并推送到 `main`，等待 GitHub Pages 部署完成。

### 4. 首次登录验证

访问 `https://bobhuang666.github.io/admin/`，选择 **Sign in with GitHub**。只使用拥有 `BobHuang666/BobHuang666.github.io` 写权限的 GitHub 帐号登录。

外人可看到登录页面，但 OAuth 授权后没有仓库写权限，无法写入、发布或删除站点内容。配置已禁用 Personal Access Token 登录，避免令牌被粘贴到浏览器。

## 日常写作

1. 在 `/admin/` 新建或打开一篇文章。
2. 填写标题、日期、分类、标签、摘要和正文；封面图或正文图片可直接上传。
3. 点击保存：文章保留在后台的 Draft 工作流中，不会出现在公开网站。
4. 文章完成后，切换为 Ready 并点击 Publish。CMS 合并 PR，GitHub Actions 自动部署；通常数分钟后网站更新。
5. 修改或删除已发布文章也会走同样的 PR/Publish 流程，可在合并前撤销。

## 维护说明

- `public/admin/config.yml` 是公开文件，只能放仓库名、Worker 地址等公开配置，绝不能放 OAuth secret 或 GitHub token。
- 单张图片限制为 10 MiB；建议上传 WebP/JPEG/PNG，尽量控制在 2 MiB 内以保持 Git 仓库与页面加载轻快。
- 保留 `src/posts/` 给 CMS 管理。开发时仍可手工修改 Markdown，但避免同时在 CMS 与本地编辑同一篇文章。
- 旧的 `draft: true` 文章已从公开站点数据中彻底排除；若要继续写它们，请在 CMS 中打开后以工作流草稿方式保存，或先将其移出 `src/posts/`。
