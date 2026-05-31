// 打包体积检查脚本
// 用法：npm run build && npm run size
// 超出阈值会以非零状态码退出，CI 会失败
import { readdirSync, statSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { gzipSync } from 'node:zlib'

const DIST = 'dist'
const ASSETS = join(DIST, 'assets')

// 体积上限（gzip 后），单位 KB
// 策略：mermaid/katex/wardley/cytoscape 等是按需加载（路由/Markdown 触发），不计入首屏
// 真正影响首屏体验的是 react-vendor + motion + index + layout 等关键 chunk
const LIMITS = {
  // 单个 JS chunk gzip 上限（防止某个 chunk 异常膨胀）
  singleJsGzipKB: 250,
  // 首屏关键 JS gzip 总和上限（不含按需加载）
  criticalJsGzipKB: 250,
  // 全部 JS gzip 总体积上限（含按需）
  totalJsGzipKB: 1500,
  // 单个 CSS gzip 上限
  singleCssGzipKB: 50,
}

// 按需加载的 chunk 名称模式（不计入首屏关键体积）
const LAZY_PATTERNS = [
  /mermaid/i,
  /Diagram/i,
  /cytoscape/i,
  /wardley/i,
  /cose-bilkent/i,
  /katex/i,
  /markdown/i, // 仅在博客详情页加载
  /giscus/i,
  /timeline-definition/i,
  /chunk-/i, // mermaid 内部子 chunk
]

if (!existsSync(ASSETS)) {
  console.error(`✗ 找不到 ${ASSETS}，请先执行 npm run build`)
  process.exit(1)
}

function gzipSize(filePath) {
  return gzipSync(readFileSync(filePath)).length
}

function fmt(bytes) {
  return (bytes / 1024).toFixed(2) + ' KB'
}

function isLazy(name) {
  return LAZY_PATTERNS.some((re) => re.test(name))
}

const files = readdirSync(ASSETS).map((name) => {
  const full = join(ASSETS, name)
  const raw = statSync(full).size
  const gz = gzipSize(full)
  return { name, full, raw, gz, lazy: isLazy(name) }
})

const jsFiles = files.filter((f) => f.name.endsWith('.js'))
const cssFiles = files.filter((f) => f.name.endsWith('.css'))

let failed = false
const issues = []

console.log('\n=== 打包产物体积报告 (gzip) ===\n')
console.log(
  'Type'.padEnd(5) +
    'Load'.padEnd(8) +
    'File'.padEnd(48) +
    'Raw'.padStart(11) +
    'Gzip'.padStart(11),
)
console.log('-'.repeat(83))

for (const f of [...jsFiles, ...cssFiles].sort((a, b) => b.gz - a.gz)) {
  const type = f.name.endsWith('.js') ? 'JS' : 'CSS'
  const load = type === 'JS' ? (f.lazy ? 'lazy' : 'critical') : '-'
  console.log(
    type.padEnd(5) +
      load.padEnd(8) +
      f.name.padEnd(48) +
      fmt(f.raw).padStart(11) +
      fmt(f.gz).padStart(11),
  )

  if (f.name.endsWith('.js') && f.gz > LIMITS.singleJsGzipKB * 1024) {
    failed = true
    issues.push(
      `单个 JS 超出阈值: ${f.name} = ${fmt(f.gz)} > ${LIMITS.singleJsGzipKB} KB`,
    )
  }
  if (f.name.endsWith('.css') && f.gz > LIMITS.singleCssGzipKB * 1024) {
    failed = true
    issues.push(
      `单个 CSS 超出阈值: ${f.name} = ${fmt(f.gz)} > ${LIMITS.singleCssGzipKB} KB`,
    )
  }
}

const criticalJs = jsFiles.filter((f) => !f.lazy)
const lazyJs = jsFiles.filter((f) => f.lazy)
const totalJsGz = jsFiles.reduce((s, f) => s + f.gz, 0)
const criticalJsGz = criticalJs.reduce((s, f) => s + f.gz, 0)
const lazyJsGz = lazyJs.reduce((s, f) => s + f.gz, 0)
const totalCssGz = cssFiles.reduce((s, f) => s + f.gz, 0)

console.log('-'.repeat(83))
console.log(`首屏关键 JS: ${fmt(criticalJsGz)} (gzip)  限额 ${LIMITS.criticalJsGzipKB} KB`)
console.log(`按需加载 JS: ${fmt(lazyJsGz)} (gzip)`)
console.log(`JS 总计:     ${fmt(totalJsGz)} (gzip)  限额 ${LIMITS.totalJsGzipKB} KB`)
console.log(`CSS 总计:    ${fmt(totalCssGz)} (gzip)`)

if (criticalJsGz > LIMITS.criticalJsGzipKB * 1024) {
  failed = true
  issues.push(
    `首屏关键 JS 超出阈值: ${fmt(criticalJsGz)} > ${LIMITS.criticalJsGzipKB} KB`,
  )
}
if (totalJsGz > LIMITS.totalJsGzipKB * 1024) {
  failed = true
  issues.push(
    `JS 总体积超出阈值: ${fmt(totalJsGz)} > ${LIMITS.totalJsGzipKB} KB`,
  )
}

if (failed) {
  console.error('\n✗ 体积检查未通过：')
  issues.forEach((i) => console.error('  - ' + i))
  console.error(
    '\n建议：拆分大的 chunk、移除未使用的依赖，或在 scripts/check-bundle-size.js 调整阈值。\n',
  )
  process.exit(1)
} else {
  console.log('\n✓ 体积检查通过\n')
}
