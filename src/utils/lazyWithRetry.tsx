import { ComponentType, lazy, LazyExoticComponent } from 'react';

/**
 * 带重试的 React.lazy
 * ----------------------------------------------------------------
 * 背景：GitHub Pages 每次部署会整体替换 dist，旧 hash 的 chunk 立刻 404；
 * 网络抖动（ERR_CONNECTION_RESET）也会让动态 import 直接失败。
 * 一旦失败，React.lazy 的 rejected promise 会被永久缓存，页面将一直报错。
 *
 * 策略：
 * 1. 先重试 1 次（瞬时空洞/连接重置通常能自愈）；
 * 2. 仍失败则判定为「资源与当前页面版本不匹配」，整页刷新一次拿最新 HTML +
 *    最新 chunk（用 sessionStorage 标记，保证同一个 chunk 只自动刷新一次，不会死循环）；
 * 3. 刷新后依旧失败才真正抛错，交给 ErrorBoundary 展示可操作的错误页。
 */

const RELOAD_FLAG_PREFIX = 'bh:chunk-reload:';
const MAX_ATTEMPTS = 2;

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** 是否为「按需 chunk 拉不到」类错误（发版失效 / 网络中断 / 预加载失败） */
function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module|Unable to preload|ChunkLoadError/i.test(
    error.message,
  );
}

async function loadWithRetry<P>(
  factory: () => Promise<{ default: ComponentType<P> }>,
): Promise<{ default: ComponentType<P> }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    try {
      return await factory();
    } catch (error) {
      lastError = error;
      if (!isChunkLoadError(error)) throw error;
      await sleep(300 * (attempt + 1));
    }
  }
  throw lastError;
}

export function lazyWithRetry<P = unknown>(
  factory: () => Promise<{ default: ComponentType<P> }>,
  name: string,
): LazyExoticComponent<ComponentType<P>> {
  return lazy(async () => {
    const flag = RELOAD_FLAG_PREFIX + name;
    try {
      const mod = await loadWithRetry(factory);
      sessionStorage.removeItem(flag);
      return mod;
    } catch (error) {
      if (isChunkLoadError(error) && !sessionStorage.getItem(flag)) {
        sessionStorage.setItem(flag, String(Date.now()));
        console.warn(`[lazyWithRetry] ${name} 加载失败，整页刷新重试`, error);
        window.location.reload();
        // 刷新期间保持 pending，避免先闪一下错误页
        return await new Promise<never>(() => {});
      }
      throw error;
    }
  });
}
