/**
 * GoatCounter 隐私友好的访问统计
 * ----------------------------------------------------------------
 * 启用方式：
 * 1. 注册 https://www.goatcounter.com/  → 拿到 yourcode.goatcounter.com
 * 2. 把下面的 code 改为你的名字
 * 3. 即可生效（HashRouter SPA 已做 hashchange 上报兼容）
 *
 * 设为空字符串则关闭（默认）
 */
export const ANALYTICS = {
  goatcounterCode: 'bobhuang', // 例 'bobhuang'
} as const;

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  const code = ANALYTICS.goatcounterCode;
  if (!code) return;
  if (typeof window === 'undefined') return;

  // 注入 GoatCounter 脚本
  const s = document.createElement('script');
  s.async = true;
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  s.src = '//gc.zgo.at/count.js';
  document.head.appendChild(s);

  // HashRouter 兼容：监听 hashchange 手动上报
  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      type GoatCounterWindow = Window & {
        goatcounter?: { count?: (opts: { path: string }) => void };
      };
      const gc = (window as GoatCounterWindow).goatcounter;
      gc?.count?.({ path: location.pathname + location.hash });
    }, 50);
  });
}

/**
 * 轻量 Web Vitals 上报：仅在 console 打印，便于本地开发观察。
 * 后续可改造为 sendBeacon 发送到自有服务。
 */
export function logWebVitals() {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) return;

  // LCP
  try {
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      const lcp = last.renderTime || last.loadTime || last.startTime;
       
      console.log('[WebVitals] LCP:', Math.round(lcp), 'ms');
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  } catch { /* ignore */ }

  // CLS
  try {
    let cls = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
        if (!e.hadRecentInput) cls += e.value ?? 0;
      }
       
      console.log('[WebVitals] CLS:', cls.toFixed(4));
    }).observe({ type: 'layout-shift', buffered: true });
  } catch { /* ignore */ }

  // INP / FID via PerformanceEventTiming
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const e = entry as PerformanceEntry & { processingStart?: number };
        if (e.processingStart) {
          const inp = e.processingStart - e.startTime;
           
          console.log('[WebVitals] First Input Delay:', Math.round(inp), 'ms');
          return;
        }
      }
    }).observe({ type: 'first-input', buffered: true });
  } catch { /* ignore */ }
}
