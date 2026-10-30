import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { sitemap } from './scripts/sitemap-plugin'

const SITE_URL = 'https://blog.bobhuang.cn/'

/**
 * 为轻量路由 chunk 注入 modulepreload。
 *
 * 路由页面全走动态 import，首访要经历入口 chunk 执行后才请求路由
 * chunk 及其共享小 chunk 的串行瀑布，这段 render delay 是 LCP 的大头。
 * 把 BlogDetailPage 之外的路由 chunk 及其静态依赖提前声明：
 * 首屏并行取回，路由切换零等待。
 */
function routeModulePreload(include: string[], exclude: string[] = []): Plugin {
  return {
    name: 'route-module-preload',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html // dev 模式无 bundle
        const chunks = Object.values(ctx.bundle).filter((c) => c.type === 'chunk')
        const byFile = new Map(chunks.map((c) => [c.fileName, c]))
        const isRoute = (fileName: string) => {
          const name = fileName.split('/').pop() ?? ''
          return include.some((p) => name.startsWith(p)) && !exclude.some((p) => name.includes(p))
        }
        // 路由 chunk + 它们的静态依赖闭包都要 preload
        const queue = chunks.filter((c) => isRoute(c.fileName)).map((c) => c.fileName)
        const seen = new Set<string>()
        while (queue.length) {
          const file = queue.pop()!
          if (seen.has(file)) continue
          seen.add(file)
          for (const dep of byFile.get(file)?.imports ?? []) queue.push(dep)
        }
        const links = [...seen]
          .map((f) => `<link rel="modulepreload" crossorigin href="/${f}">`)
          .join('\n    ')
        return html.replace('</head>', `    ${links}\n  </head>`)
      },
    },
  }
}

/**
 * 把入口 CSS 内联进 HTML：CSS 只有几 KB gzip，单独请求却阻塞所有
 * 页面的首次渲染。文件照常产出，PWA precache 不受影响。
 */
function inlineEntryCss(): Plugin {
  return {
    name: 'inline-entry-css',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html
        let out = html
        for (const item of Object.values(ctx.bundle)) {
          if (item.type !== 'asset' || !item.fileName.endsWith('.css')) continue
          const css = typeof item.source === 'string' ? item.source : Buffer.from(item.source).toString('utf-8')
          // 仅内联被 <link> 引用的入口 CSS；路由级 CSS（如 BlogDetailPage）保持按需加载
          const escaped = item.fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const linkRe = new RegExp(`[ \\t]*<link rel="stylesheet"[^>]*href="/${escaped}"[^>]*>\\n?`)
          if (linkRe.test(out)) {
            out = out.replace(linkRe, `    <style>${css}</style>\n`)
          }
        }
        return out
      },
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    routeModulePreload(
      ['ProfilePage', 'BlogPage', 'FriendsPage', 'FandomPage', 'TravelPage', 'ProjectDetailPage', 'NotFoundPage', 'ServerErrorPage'],
      ['BlogDetailPage'],
    ),
    inlineEntryCss(),
    sitemap({
      siteUrl: SITE_URL,
      routes: [
        '/',
        '/profile',
        '/blog',
        '/friends',
        '/fandom',
        '/travel',
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      // 新 SW 安装后立即接管，无需等待用户刷新
      includeAssets: ['static/img/red-logo.ico', 'static/img/avatar.jpg'],
      manifest: {
        name: 'BobHuang 个人主页',
        short_name: 'BobHuang',
        description: '北师大数据科学与大数据技术 · 算法竞赛 · 全栈开发',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/static/img/avatar.jpg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any',
          },
          {
            src: '/static/img/avatar.jpg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any',
          },
        ],
      },
      workbox: {
        // mode: 'development' 可规避 workbox-build terser 插件在 rollup 环境中的冲突
        mode: 'development',
        disableDevLogs: true,
        // 关闭默认 navigateFallback，导航交由下方自定义 NetworkFirst 处理
        navigateFallback: undefined,
        // SW 安装后立即激活并接管
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // 仅预缓存静态图片与图标
        globPatterns: ['**/*.{ico,png,svg,jpg,jpeg,webp,avif}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          // ① 导航请求（HTML）：NetworkFirst，离线时返回缓存
          {
            urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              // 仅网络失败时回退缓存；no-store 跳过浏览器缓存，始终取最新 HTML
              // fetchOptions 在 Workbox 运行时合法，但 @types/node 的 RequestInit 未声明 cache 字段，做最小断言
              fetchOptions: { cache: 'no-store' } as unknown as RequestInit,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ② GitHub REST API：NetworkFirst，30 分钟缓存
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-api-cache',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ③ GitHub 贡献热力图 API：NetworkFirst，6 小时缓存
          {
            urlPattern: /^https:\/\/github-contributions-api\.jogruber\.de\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-contributions-cache',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 6 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ④ 外部字体（Google Fonts / CDN）：StaleWhileRevalidate
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /\/assets\/.*\.(js|css)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: { maxEntries: 150, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ⑥ 本站静态图片（/static/img/）：CacheFirst，30 天
          {
            urlPattern: /\/static\/img\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          // ⑦ 地图底图数据（/static/geo/*.json）：CacheFirst，30 天
          {
            urlPattern: /\/static\/geo\/.*\.json$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'geo-data-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'markdown': [
            'react-markdown',
            'remark-gfm',
            'remark-math',
            'rehype-slug',
            'rehype-raw',
            'rehype-highlight',
            'rehype-katex',
          ],
          'katex': ['katex'],
        },
      },
    },
  },
})
