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
        '/series',
        '/now',
        '/uses',
        '/friends',
        '/fandom',
      ],
    }),
    VitePWA({
      registerType: 'autoUpdate',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        // Mermaid / katex 体积大，不预缓存（按需加载即可）
        globIgnores: [
          '**/mermaid*',
          '**/cytoscape*',
          '**/katex*',
          '**/*Diagram*',
          '**/cose-bilkent*',
          '**/wardley*',
        ],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-api-cache',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/github-contributions-api\.jogruber\.de\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'github-contributions-cache',
              expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 6 },
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
