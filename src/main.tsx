import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './app/App.tsx'
import './index.css'
import { initAnalytics, logWebVitals } from './utils/analytics'

window.addEventListener('vite:preloadError', (event) => {
  const preloadError = event as Event & { payload?: unknown };
  preloadError.preventDefault();
  const now = Date.now();
  const raw = sessionStorage.getItem('vite:preloadError:reloads');
  const [count, ts] = raw ? raw.split(':').map(Number) : [0, 0];
  if (now - ts > 10_000) sessionStorage.setItem('vite:preloadError:reloads', '1:' + now);
  else if (count >= 3) return;
  else sessionStorage.setItem('vite:preloadError:reloads', `${count + 1}:${ts}`);
  console.warn('[vite:preloadError] 检测到资源版本不一致，正在刷新以获取一致版本', preloadError.payload);
  window.location.reload();
});

function registerServiceWorker(attempt = 0) {
  registerSW({
    immediate: true,
    onRegisterError(error) {
      console.error('[ServiceWorker] registration failed', error);
      if (attempt < 2) {
        setTimeout(() => registerServiceWorker(attempt + 1), 3000 * (attempt + 1));
      }
    },
  });
}
registerServiceWorker();

document.documentElement.lang = 'zh-CN';

// 访问统计 + Web Vitals
initAnalytics();
if (import.meta.env.DEV) logWebVitals();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

