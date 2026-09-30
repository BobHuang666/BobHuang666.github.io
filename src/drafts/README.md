# drafts（草稿暂存区）

> **本目录不参与构建，也不会被发布。**

正式文章只来自 `src/posts/*.md`：

```ts
// src/data/blog.ts
const modules = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });
```

glob 只扫描 `posts/`，因此这里的 `.md` 文件不会被加载、不进入 `blogData`、不出现在列表/搜索/RSS/sitemap 中。

- 想发布：把文件移到 `src/posts/`（front-matter 里 `draft: true` 也会在运行时被过滤掉）。
- 只是暂存：留在这里即可。
