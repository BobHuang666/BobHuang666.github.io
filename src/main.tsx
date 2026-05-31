import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import i18n from './i18n'
import { initAnalytics, logWebVitals } from './utils/analytics'

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

