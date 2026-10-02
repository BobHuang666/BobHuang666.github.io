/**
 * 生成「中国地级行政区」轻量化地图数据。
 *
 * 数据源：阿里 DataV.GeoAtlas（https://geo.datav.aliyun.com/areas_v3/bound）
 *   - 100000_full.json  全国省级（取直辖市 / 港澳台 / 南海界线）
 *   - {省 adcode}_full.json  该省下辖地级行政区
 *
 * 处理流程：下载 → Douglas-Peucker 抽稀 → 坐标降精度 → 紧凑格式输出。
 * 产物放 public/static/geo/，运行时 fetch，不进 JS bundle。
 *
 * 用法：npm run geo  （可选参数：node scripts/build-china-geo.js 0.02 3）
 */
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://geo.datav.aliyun.com/areas_v3/bound';
const TOLERANCE = Number(process.argv[2] ?? 0.02); // 度，约 2km
const PRECISION = Number(process.argv[3] ?? 3);    // 小数位

/** 直辖市 / 港澳台：直接从全国省级数据取，不再下钻到市辖区 */
const MUNICIPALITY = new Set([110000, 120000, 310000, 500000, 710000, 810000, 820000]);

/** 其余省份：下钻取地级行政区 */
const PROVINCES = [
  130000, 140000, 150000, 210000, 220000, 230000,
  320000, 330000, 340000, 350000, 360000, 370000,
  410000, 420000, 430000, 440000, 450000, 460000,
  510000, 520000, 530000, 540000, 610000, 620000,
  630000, 640000, 650000,
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/static/geo/china-cities.json');

async function fetchJson(url, retry = 2) {
  for (let i = 0; i <= retry; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'node' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === retry) throw new Error(`failed: ${url} (${err.message})`);
      await new Promise((r) => setTimeout(r, 800 * (i + 1)));
    }
  }
}

/** 点到线段的垂直距离（经纬度平面近似） */
function perpDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

/** Douglas-Peucker 抽稀，首尾点必留 */
function simplify(points, tolerance) {
  if (points.length <= 3) return points.slice();
  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [start, end] = stack.pop();
    let maxDist = -1;
    let index = -1;
    for (let i = start + 1; i < end; i++) {
      const dist = perpDistance(points[i], points[start], points[end]);
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }
    if (maxDist > tolerance && index > 0) {
      keep[index] = 1;
      stack.push([start, index], [index, end]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const round = (v) => Number(v.toFixed(PRECISION));

/** 环 → 扁平数字数组 [lng,lat,lng,lat,...]，去掉闭合重复点与退化环 */
function packRing(ring) {
  const simplified = simplify(ring, TOLERANCE);
  if (simplified.length < 4) return null;
  // 去掉与首点重合的尾点（渲染时用 Z 闭合）
  const first = simplified[0];
  const last = simplified[simplified.length - 1];
  const pts = first[0] === last[0] && first[1] === last[1] ? simplified.slice(0, -1) : simplified;
  if (pts.length < 3) return null;
  const flat = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [lng, lat] of pts) {
    const x = round(lng);
    const y = round(lat);
    flat.push(x, y);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  // 过滤极小岛屿，避免无意义数据撑大体积
  if (Math.hypot(maxX - minX, maxY - minY) < 0.04) return null;
  return { flat, minX, minY, maxX, maxY };
}

/** Geometry → polygons（扁平数组）+ 包围盒。洞（内环）忽略：市级示意图影响可忽略 */
function packGeometry(geometry) {
  if (!geometry) return null;
  const { type, coordinates } = geometry;
  const rings = type === 'Polygon' ? coordinates : type === 'MultiPolygon' ? coordinates.map((poly) => poly[0]) : [];
  const polygons = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const ring of rings) {
    const packed = packRing(ring);
    if (!packed) continue;
    polygons.push(packed.flat);
    minX = Math.min(minX, packed.minX);
    minY = Math.min(minY, packed.minY);
    maxX = Math.max(maxX, packed.maxX);
    maxY = Math.max(maxY, packed.maxY);
  }
  if (!polygons.length) return null;
  return { polygons, bbox: [minX, minY, maxX, maxY] };
}

async function main() {
  console.log(`[geo] tolerance=${TOLERANCE}deg precision=${PRECISION}`);

  const cities = [];
  const boundaryLines = [];
  const bbox = [Infinity, Infinity, -Infinity, -Infinity];
  const grow = (box) => {
    bbox[0] = Math.min(bbox[0], box[0]);
    bbox[1] = Math.min(bbox[1], box[1]);
    bbox[2] = Math.max(bbox[2], box[2]);
    bbox[3] = Math.max(bbox[3], box[3]);
  };

  // ① 全国省级：取直辖市 / 港澳台 / 南海界线
  const national = await fetchJson(`${BASE}/100000_full.json`);
  for (const feature of national.features) {
    const { name, adcode } = feature.properties ?? {};
    if (!name) {
      // DataV 用 name 为空的要素表示南海诸岛界线
      const rings = feature.geometry?.type === 'Polygon'
        ? feature.geometry.coordinates
        : feature.geometry?.coordinates?.map((poly) => poly[0]) ?? [];
      for (const ring of rings) {
        const packed = packRing(ring);
        if (packed) boundaryLines.push(packed.flat);
      }
      continue;
    }
    if (!MUNICIPALITY.has(adcode)) continue;
    const packed = packGeometry(feature.geometry);
    if (!packed) continue;
    const center = feature.properties.center ?? feature.properties.centroid ?? [
      (packed.bbox[0] + packed.bbox[2]) / 2,
      (packed.bbox[1] + packed.bbox[3]) / 2,
    ];
    cities.push({
      n: name,
      a: adcode,
      c: [round(center[0]), round(center[1])],
      p: packed.polygons,
    });
    grow(packed.bbox);
  }
  console.log(`[geo] national: ${cities.length} municipalities, ${boundaryLines.length} boundary lines`);

  // ② 各省：下钻地级行政区
  for (const adcode of PROVINCES) {
    const data = await fetchJson(`${BASE}/${adcode}_full.json`);
    let count = 0;
    for (const feature of data.features ?? []) {
      const name = feature.properties?.name;
      if (!name) continue;
      const packed = packGeometry(feature.geometry);
      if (!packed) continue;
      const center = feature.properties.center ?? feature.properties.centroid ?? [
        (packed.bbox[0] + packed.bbox[2]) / 2,
        (packed.bbox[1] + packed.bbox[3]) / 2,
      ];
      cities.push({
        n: name,
        a: feature.properties.adcode ?? adcode,
        c: [round(center[0]), round(center[1])],
        p: packed.polygons,
      });
      grow(packed.bbox);
      count++;
    }
    process.stdout.write(`[geo] ${adcode}: ${count}\n`);
  }

  const payload = {
    bbox: bbox.map((v) => Number(v.toFixed(2))),
    cities,
    lines: boundaryLines,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  const json = JSON.stringify(payload);
  writeFileSync(OUT, json, 'utf8');

  const bytes = statSync(OUT).size;
  console.log(`[geo] cities=${cities.length} lines=${boundaryLines.length}`);
  console.log(`[geo] ${OUT} ${(bytes / 1024).toFixed(1)} KB (raw)`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
