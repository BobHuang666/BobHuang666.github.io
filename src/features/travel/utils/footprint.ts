import type { PlaceStatus, TravelLeg, TransportMode, TravelPlace, TravelTrip } from '../../../types';
import { normalizeCityName, provinceOf } from '../meta';
import { haversineKm, type ChinaGeo, type GeoCity, type WorldGeo } from './projection';

/** 一个「点亮的地点」：TravelPlace + 匹配到的地图行政区 */
export interface FootprintPoint {
  place: TravelPlace;
  city: GeoCity | null;
  lng: number;
  lat: number;
  province: string;
  /** 首次抵达日期，wishlist 为 null */
  firstDate: string | null;
  visitCount: number;
}

/** 一段可绘制的路径 */
export interface RouteSegment {
  id: string;
  tripId: string;
  tripTitle: string;
  from: FootprintPoint;
  to: FootprintPoint;
  leg: TravelLeg;
  km: number;
}

export interface FootprintStats {
  cityCount: number;
  provinceCount: number;
  /** 已点亮的国家数（世界足迹，不含想去） */
  countryCount: number;
  tripCount: number;
  legCount: number;
  totalKm: number;
  /** 有足迹的年份，升序 */
  years: number[];
  /** 各交通方式使用次数，按次数降序 */
  transports: { mode: TransportMode; count: number }[];
}

/**
 * 把 TravelPlace 匹配到地图上的行政区，得到可直接渲染的点位。
 * 中国数据用 cities，世界数据用 countries，其余逻辑完全一致。
 */
export function buildFootprints(
  geo: ChinaGeo | WorldGeo | null,
  places: TravelPlace[],
): { points: FootprintPoint[]; statusByName: Map<string, PlaceStatus> } {
  const statusByName = new Map<string, PlaceStatus>();
  const points: FootprintPoint[] = [];

  // 底图未加载时 regions 为空：此时只处理写了显式坐标的地点，
  // 这样跨国行程的里程统计不依赖世界底图是否下载
  const regions: GeoCity[] = geo ? ('cities' in geo ? geo.cities : geo.countries) : [];

  // 全名与规范名都建索引，「北京」也能命中「北京市」
  const index = new Map<string, GeoCity>();
  for (const city of regions) {
    index.set(city.n, city);
    index.set(normalizeCityName(city.n), city);
  }

  for (const place of places) {
    const city =
      index.get(place.name) ??
      place.aliases?.map((a) => index.get(a)).find(Boolean) ??
      index.get(normalizeCityName(place.name)) ??
      null;

    const lng = place.lng ?? city?.c[0];
    const lat = place.lat ?? city?.c[1];
    // 既没有底图也没有显式坐标 → 无法定位，等底图加载后再算
    if (lng === undefined || lat === undefined) continue;

    const sorted = [...place.visits].sort((a, b) => a.date.localeCompare(b.date));

    if (city) statusByName.set(city.n, place.status);
    points.push({
      place,
      city,
      lng,
      lat,
      // 省级行政区只对国内城市有意义：世界国家的 adcode 是 ISO 码，
      // 套用国内规则会把中国算成「内蒙古」、韩国算成「河南」
      province: city && geo && 'cities' in geo ? provinceOf(city.a) : '',
      firstDate: sorted[0]?.date ?? null,
      visitCount: place.visits.length,
    });
  }

  return { points, statusByName };
}

/** 把行程展开成可绘制的路径段，并计算每段里程 */
export function buildRouteSegments(
  points: FootprintPoint[],
  trips: TravelTrip[],
): RouteSegment[] {
  const byId = new Map(points.map((p) => [p.place.id, p]));
  const segments: RouteSegment[] = [];

  for (const trip of trips) {
    for (const leg of trip.legs) {
      const from = byId.get(leg.from);
      const to = byId.get(leg.to);
      if (!from || !to) continue;
      segments.push({
        id: leg.id,
        tripId: trip.id,
        tripTitle: trip.title,
        from,
        to,
        leg,
        km: haversineKm([from.lng, from.lat], [to.lng, to.lat]),
      });
    }
  }

  return segments;
}

/** 若干路径段涉及的经纬度范围，用于点击行程时把地图聚焦过去 */
export function segmentBounds(
  segments: RouteSegment[],
): [number, number, number, number] | null {
  if (!segments.length) return null;
  const lngs = segments.flatMap((s) => [s.from.lng, s.to.lng]);
  const lats = segments.flatMap((s) => [s.from.lat, s.to.lat]);
  return [Math.min(...lngs), Math.min(...lats), Math.max(...lngs), Math.max(...lats)];
}

/** 汇总统计：城市数 / 省级行政区数 / 国家数 / 里程 / 年份 / 交通方式分布 */
export function buildStats(
  points: FootprintPoint[],
  trips: TravelTrip[],
  worldPoints: FootprintPoint[] = [],
): FootprintStats {
  const visited = points.filter((p) => p.place.status !== 'wishlist');
  const provinces = new Set(visited.map((p) => p.province));
  const years = new Set<number>();
  for (const p of visited) {
    if (p.firstDate) years.add(Number(p.firstDate.slice(0, 4)));
  }
  // 年份游标同时覆盖国内城市与世界国家，切换地图时筛选条件保持一致
  for (const p of worldPoints) {
    if (p.place.status !== 'wishlist' && p.firstDate) years.add(Number(p.firstDate.slice(0, 4)));
  }
  for (const trip of trips) {
    for (const leg of trip.legs) years.add(Number(leg.date.slice(0, 4)));
  }

  const transportMap = new Map<TransportMode, number>();
  let totalKm = 0;
  for (const trip of trips) {
    const byId = new Map(points.map((p) => [p.place.id, p]));
    for (const leg of trip.legs) {
      transportMap.set(leg.transport, (transportMap.get(leg.transport) ?? 0) + 1);
      const from = byId.get(leg.from);
      const to = byId.get(leg.to);
      if (from && to) totalKm += haversineKm([from.lng, from.lat], [to.lng, to.lat]);
    }
  }

  const countries = new Set(
    worldPoints.filter((p) => p.place.status !== 'wishlist').map((p) => p.place.name),
  );

  return {
    cityCount: visited.length,
    provinceCount: provinces.size,
    countryCount: countries.size,
    tripCount: trips.length,
    legCount: trips.reduce((sum, t) => sum + t.legs.length, 0),
    totalKm,
    years: [...years].sort((a, b) => a - b),
    transports: [...transportMap.entries()]
      .map(([mode, count]) => ({ mode, count }))
      .sort((a, b) => b.count - a.count),
  };
}
