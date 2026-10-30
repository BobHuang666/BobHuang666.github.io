// 生成 Lighthouse 被测页面清单（标签 + URL）以及含全部 URL 的 LHCI 配置。
//
// 设计：静态路由在这里固定列出；动态详情页自动挑选「每类 1 个代表」——
//   - 文章：src/posts/*.md 中按文件名排序取第一篇「非草稿」文章
//   - 项目：src/data/projects.ts 中第一个顶层 id
// 这样以后新增博客文章/项目无需改动本脚本即可纳入审计（代表页覆盖模板级回归）。
//
// 产物：
//   .github/lighthouse/pages.json              —— 给部署卡片做标签映射
//   .github/lighthouse/lighthouserc.generated.json —— 在既有 lighthouserc.json
//                                                   的 assert/collect 基础上注入 urls
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SITE = 'https://blog.bobhuang.cn'
const LH_DIR = join(root, '.github', 'lighthouse')

// 静态路由：[标签, hash 路径]（'/' 表示站点根）
const STATIC_ROUTES = [
  ['首页', '/'],
  ['关于', '/profile'],
  ['博客', '/blog'],
  ['友链', '/friends'],
  ['同好', '/fandom'],
  ['旅行', '/travel'],
  ['错误页', '/500'],
  ['404', '/404'],
]

function staticUrl(hashPath) {
  // 首页直接用根，避免出现 https://x/#/ 这种多余形式
  return hashPath === '/' ? `${SITE}/` : `${SITE}/#${hashPath}`
}

const pages = STATIC_ROUTES.map(([label, hashPath]) => ({
  label,
  url: staticUrl(hashPath),
}))

// 代表文章：src/posts 下第一篇非草稿 .md（按文件名排序，确保可复现）
const postsDir = join(root, 'src', 'posts')
if (existsSync(postsDir)) {
  const md = readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
  for (const file of md) {
    const raw = readFileSync(join(postsDir, file), 'utf8')
    if (/^draft:\s*true\s*$/m.test(raw)) continue // 跳过草稿
    const id = file.replace(/\.md$/, '')
    const m = raw.match(/^title:\s*(.+)$/m)
    const title = m ? m[1].trim().replace(/^['"]|['"]$/g, '') : id
    pages.push({ label: `文章·${title}`, url: `${SITE}/#/blog/${id}` })
    break
  }
}

// 代表项目：src/data/projects.ts 中第一个顶层 id
const projectsFile = join(root, 'src', 'data', 'projects.ts')
if (existsSync(projectsFile)) {
  const srcText = readFileSync(projectsFile, 'utf8')
  const m = srcText.match(/^\s*id:\s*'([^']+)'/m)
  if (m) {
    const id = m[1]
    const escaped = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
    const tm = srcText.match(
      new RegExp(`id:\\s*'${escaped}'[\\s\\S]*?title:\\s*'([^']+)'`),
    )
    const title = tm ? tm[1] : id
    pages.push({ label: `项目·${title}`, url: `${SITE}/#/projects/${id}` })
  }
}

writeFileSync(join(LH_DIR, 'pages.json'), JSON.stringify(pages, null, 2) + '\n')

// 在既有 lighthouserc.json 的 collect 基础上注入 urls（保留 assert / settings）
const base = JSON.parse(readFileSync(join(LH_DIR, 'lighthouserc.json'), 'utf8'))
base.ci = base.ci || {}
base.ci.collect = { ...(base.ci.collect || {}), urls: pages.map((p) => p.url) }
writeFileSync(
  join(LH_DIR, 'lighthouserc.generated.json'),
  JSON.stringify(base, null, 2) + '\n',
)

console.log(`Lighthouse 被测页面数：${pages.length}`)
for (const p of pages) console.log(`  - ${p.label}：${p.url}`)
