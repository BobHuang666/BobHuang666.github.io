const D2R = Math.PI / 180;

/** 地图数据中的单个行政区（字段刻意压缩过：n=名称 a=adcode c=center p=多边形扁平坐标） */
export interface GeoCity {
  n: string;
  a: number;
  c: [number, number];
  /** 每个元素是一条闭合环的扁平坐标 [lng,lat,lng,lat,...] */
  p: number[][];
}

export interface ChinaGeo {
  bbox: [number, number, number, number];
  cities: GeoCity[];
  /** 南海诸岛界线等特殊线要素 */
  lines: number[][];
}

/**
 * 世界国家数据：结构与 GeoCity 一致（n=中文国名 a=ISO 数字码 c=中心经纬度 p=轮廓）。
 * p 仍存经纬度，跨反子午线的多边形已在构建期切开。
 */
export interface WorldGeo {
  bbox: [number, number, number, number];
  countries: GeoCity[];
  /** 运行时使用的投影 */
  projection: string;
  /** 纵向拉伸：等距圆柱天然偏扁，适度拉高更接近常见世界地图（1 = 不拉） */
  stretch?: number;
  /** 拉伸后的内容宽高比，供页面确定 viewBox 高度 */
  aspect: number;
}

/** 经纬度 → 平面坐标的投影函数 */
export type Projector = (lng: number, lat: number) => [number, number];

export interface MapProjection {
  project: (lng: number, lat: number) => [number, number];
  /** 扁平坐标数组 → SVG path 的 d 属性 */
  toPath: (flat: number[]) => string;
  /** 环 → 折线 path（不闭合），用于界线 */
  toLine: (flat: number[]) => string;
}

/**
 * 等距圆柱投影（Plate Carrée）：经纬度直接当 xy，适合世界地图。
 * 高纬度会有横向拉伸，但比墨卡托温和，是世界足迹图的常见选择。
 */
export function createEquirectangular(): Projector {
  return (lng, lat) => [lng, -lat];
}

/**
 * Albers 等积圆锥投影（中国常用参数：中央经线 105°E，双标准纬线 25°N / 47°N）。
 * 相比直接「经纬度当 xy」，它不会把中国横向拉宽，形状与我们熟悉的地图一致。
 */
function createAlbers() {
  const lambda0 = 105 * D2R;
  const phi1 = 25 * D2R;
  const phi2 = 47 * D2R;
  const n = (Math.sin(phi1) + Math.sin(phi2)) / 2;
  const C = Math.cos(phi1) ** 2 + 2 * n * Math.sin(phi1);
  const rho0 = Math.sqrt(C) / n;

  return (lng: number, lat: number): [number, number] => {
    const theta = n * (lng * D2R - lambda0);
    const rho = Math.sqrt(Math.max(0, C - 2 * n * Math.sin(lat * D2R))) / n;
    return [rho * Math.sin(theta), rho * Math.cos(theta) - rho0];
  };
}

/**
 * 基于地图数据构建一个把经纬度映射到 SVG 画布坐标的投影。
 * 等比缩放并居中，画布尺寸变化时需要重建（配合 useMemo）。
 */
export function createMapProjection(
  geo: ChinaGeo | WorldGeo,
  width: number,
  height: number,
): MapProjection {
  // 世界数据自带投影声明；中国数据固定用 Albers
  const world = geo as WorldGeo;
  const isWorld = 'projection' in geo;
  const projector: Projector = isWorld
    ? world.projection === 'equirectangular'
      ? createEquirectangular()
      : createAlbers()
    : createAlbers();
  /** 世界地图偏扁，纵向拉伸让它高一些（只改 y，中国的 Albers 不受影响） */
  const stretch = isWorld ? world.stretch ?? 1 : 1;

  /** 经纬度 → 平面坐标（p 里存的也是经纬度，两者同一条通路） */
  const toPlane = (lng: number, lat: number): [number, number] => {
    const [x, y] = projector(lng, lat);
    return [x, y * stretch];
  };

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  const visit = (flat: number[]) => {
    for (let i = 0; i < flat.length; i += 2) {
      const [x, y] = toPlane(flat[i], flat[i + 1]);
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  };

  // 世界数据用 countries，中国数据用 cities（另有南海界线）
  const regions = 'cities' in geo ? geo.cities : geo.countries;
  for (const region of regions) for (const poly of region.p) visit(poly);
  if ('lines' in geo) for (const line of geo.lines) visit(line);

  const scale = Math.min(width / (maxX - minX), height / (maxY - minY));
  const offsetX = (width - (maxX - minX) * scale) / 2;
  const offsetY = (height - (maxY - minY) * scale) / 2;

  const project = (lng: number, lat: number): [number, number] => {
    const [x, y] = toPlane(lng, lat);
    return [(x - minX) * scale + offsetX, (y - minY) * scale + offsetY];
  };

  const build = (flat: number[], close: boolean) => {
    let d = '';
    for (let i = 0; i < flat.length; i += 2) {
      const [x, y] = project(flat[i], flat[i + 1]);
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    return close ? `${d}Z` : d;
  };

  return {
    project,
    toPath: (flat) => build(flat, true),
    toLine: (flat) => build(flat, false),
  };
}

/** 两点间大圆距离（km），用于统计里程 */
export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = (b[1] - a[1]) * D2R;
  const dLng = (b[0] - a[0]) * D2R;
  const lat1 = a[1] * D2R;
  const lat2 = b[1] * D2R;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

/**
 * 两点之间的弧线 path：用二次贝塞尔向法线方向鼓起，
 * curvature 越大弧度越明显（飞机画大弧、火车贴地画小弧）。
 */
export function arcPath(
  from: [number, number],
  to: [number, number],
  curvature: number,
): string {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // 法线方向（SVG y 向下，取左手法线让弧向上鼓）
  const cx = mx + (dy / len) * len * curvature;
  const cy = my - (dx / len) * len * curvature;
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
