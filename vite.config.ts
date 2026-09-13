import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { rssFeed } from './scripts/rss-feed-plugin'
import { sitemap } from './scripts/sitemap-plugin'

const SITE_URL = 'https://bobhuang666.github.io/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    rssFeed({
      siteUrl: SITE_URL,
      title: 'BobHuang · 博客',
      description: '算法、前端、AI 实践与生活思考',
      author: { name: 'Bob Huang', email: '2295672887@qq.com' },
    }),
    sitemap({
      siteUrl: SITE_URL,
      routes: [
        '/',
        '/profile',
        '/blog',
        '/friends',
        '/fandom',
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      // 新 SW 安装后立即接管，无需等待用户刷新
      injectRegister: 'auto',
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
        // SW 安装后立即激活，不等待旧 SW 卸载
        skipWaiting: true,
        clientsClaim: true,
        // 预缓存：关键 JS/CSS/HTML + 图片，排除所有大体积按需 chunk
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,avif}'],
        globIgnores: [
          '**/workbox-*',
          // mermaid / 图表类（各自 100~600KB gzip）
          '**/mermaid*',
          '**/cytoscape*',
          '**/katex*',
          '**/*Diagram*',
          '**/cose-bilkent*',
          '**/wardley*',
          '**/dagre*',
          '**/mindmap*',
          '**/kanban*',
          '**/timeline-definition*',
          '**/defaultLocale*',
          // 路由懒加载页面
          '**/*Page*',
          '**/ProjectDetail*',
          // 其他按需组件
          '**/markdown*',
          '**/giscus*',
          '**/AiAssistant*',
          '**/MouseParticles*',
          '**/SearchPalette*',
          '**/chunk-*',
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          // ① 导航请求（HTML）：NetworkFirst，离线时返回缓存
          {
            urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              networkTimeoutSeconds: 5,
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
          // ⑤ 本站静态图片（/static/img/）：CacheFirst，30 天
          {
            urlPattern: /\/static\/img\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'static-images-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 },
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
