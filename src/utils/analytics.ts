/**
 * GoatCounter 隐私友好的访问统计
 * ----------------------------------------------------------------
 * 启用方式：
 * 1. 注册 https://www.goatcounter.com/  → 拿到 yourcode.goatcounter.com
 * 2. 把下面的 code 改为你的名字
 * 3. 即可生效（HashRouter SPA 已做路径归一化 + hashchange 上报兼容）
 *
 * 设为空字符串则关闭（默认）
 */
export const ANALYTICS = {
  goatcounterCode: 'bobhuang',
} as const;

type GoatCounterWindow = Window & {
  goatcounter?: {
    path?: string | (() => string);
    count?: (opts: { path: string | (() => string) }) => void;
  };
};

/**
 * 归一化上报路径，避免同一页面被拆成多条记录：
 * - `/` 与 `/#/` 统一为 `/`（HashRouter 初始化后 hash 才写入）
 * - 去掉 query（如 giscus 登录回调的 /?giscus=xxx）
 * - 非本站路由（如 /ledger）保留原样，便于发现死链
 */
function normalizePath(): string {
  const { pathname, hash } = window.location;
  let path = hash.startsWith('#/') ? hash.slice(1) : pathname;
  const queryAt = path.indexOf('?');
  if (queryAt !== -1) path = path.slice(0, queryAt);
  return path || '/';
}

let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  const code = ANALYTICS.goatcounterCode;
  if (!code) return;
  if (typeof window === 'undefined') return;

  // 必须在 count.js 执行前写入，否则首次上报会用未清洗的 URL
  const w = window as GoatCounterWindow;
  w.goatcounter = { ...(w.goatcounter ?? {}), path: normalizePath };

  // 注入 GoatCounter 脚本
  const s = document.createElement('script');
  s.async = true;
  s.dataset.goatcounter = `https://${code}.goatcounter.com/count`;
  s.src = '//gc.zgo.at/count.js';
  document.head.appendChild(s);

  // 同一路径 1s 内重复触发（count.js 自动上报 + hashchange）只计一次
  let lastPath = '';
  let lastAt = 0;

  // HashRouter 兼容：监听 hashchange 手动上报
  window.addEventListener('hashchange', () => {
    setTimeout(() => {
      const gc = (window as GoatCounterWindow).goatcounter;
      const path = normalizePath();
      const now = Date.now();
      if (path === lastPath && now - lastAt < 1000) return;
      lastPath = path;
      lastAt = now;
      gc?.count?.({ path });
    }, 50);
  });
}

/**
 * 轻量 Web Vitals：仅在开发环境 console 打印，不向任何服务端上报。
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
