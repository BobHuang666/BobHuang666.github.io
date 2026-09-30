import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './app/App.tsx'
import './index.css'
import './i18n'
import i18n from './i18n'
import { initAnalytics, logWebVitals } from './utils/analytics'

window.addEventListener('vite:preloadError', (event) => {
  const preloadError = event as Event & { payload?: unknown };
  preloadError.preventDefault();
  console.warn('[vite:preloadError] 资源预加载失败，已降级忽略', preloadError.payload);
});

let reloadingForServiceWorkerUpdate = false;

function registerServiceWorker(attempt = 0) {
  registerSW({
    immediate: true,
    onNeedReload() {
      if (reloadingForServiceWorkerUpdate) return;
      reloadingForServiceWorkerUpdate = true;
      window.location.reload();
    },
    onRegisterError(error) {
      console.error('[ServiceWorker] registration failed', error);
      if (attempt < 2) {
        setTimeout(() => registerServiceWorker(attempt + 1), 3000 * (attempt + 1));
      }
    },
  });
}
registerServiceWorker();

// 让 <html lang> 跟随语言变化
const updateLang = (lng: string) => {
  document.documentElement.lang = lng.startsWith('zh') ? 'zh-CN' : 'en';
};
updateLang(i18n.resolvedLanguage ?? 'zh');
i18n.on('languageChanged', updateLang);

// 访问统计 + Web Vitals
initAnalytics();
if (import.meta.env.DEV) logWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

