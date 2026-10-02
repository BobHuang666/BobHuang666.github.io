import { useEffect, useState } from 'react';
import type { ChinaGeo, WorldGeo } from '../utils/projection';

const CHINA_URL = `${import.meta.env.BASE_URL}static/geo/china-cities.json`;
const WORLD_URL = `${import.meta.env.BASE_URL}static/geo/world-countries.json`;

/** 模块级缓存：同一种数据整站只请求一次，来回切换不重复下载 */
const cache = new Map<string, Promise<unknown>>();

function load<T>(key: string, url: string): Promise<T> {
  let pending = cache.get(key) as Promise<T> | undefined;
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`地图数据加载失败：${res.status}`);
      return res.json() as Promise<T>;
    });
    cache.set(key, pending);
  }
  return pending;
}

interface GeoState<T> {
  geo: T | null;
  loading: boolean;
  error: boolean;
}

/**
 * 通用底图数据加载。
 * 数据放在 public/ 下按需 fetch —— 不进 JS bundle，不影响首屏体积预算。
 * enabled=false 时完全不发起请求（用于未切换到的地图）。
 */
function useGeo<T>(key: string, url: string, enabled: boolean): GeoState<T> {
  const [state, setState] = useState<GeoState<T>>({ geo: null, loading: enabled, error: false });

  useEffect(() => {
    if (!enabled) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true }));
    load<T>(key, url)
      .then((geo) => {
        if (alive) setState({ geo, loading: false, error: false });
      })
      .catch(() => {
        cache.delete(key); // 允许重试
        if (alive) setState({ geo: null, loading: false, error: true });
      });
    return () => {
      alive = false;
    };
  }, [key, url, enabled]);

  return state;
}

/** 中国地级行政区底图 */
export function useChinaGeo() {
  return useGeo<ChinaGeo>('china', CHINA_URL, true);
}

/** 世界国家底图：仅在切换到世界地图时才下载 */
export function useWorldGeo(enabled: boolean) {
  return useGeo<WorldGeo>('world', WORLD_URL, enabled);
}
