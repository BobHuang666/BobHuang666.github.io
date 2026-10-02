/**
 * 生成「世界国家」轻量化地图数据。
 *
 * 数据源：world-atlas（Natural Earth 110m，仅构建期依赖，运行时不需要）
 *   - 只有英文国名与 ISO 代码，因此内置了一份英文 → 中文名映射
 *   - 台湾按地图规范并入中国，不作为独立要素
 *   - 排除南极洲：避免把整幅图纵向拉成 2:1
 *
 * 处理流程：TopoJSON → GeoJSON → Douglas-Peucker 抽稀 → 坐标降精度 → 紧凑格式。
 * 产物放 public/static/geo/，运行时 fetch，不进 JS bundle。
 *
 * 用法：npm run geo:world
 */
import { writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import * as topojson from 'topojson-client';

// 数据存经纬度（度），运行时用等距圆柱投影。
const TOLERANCE = Number(process.argv[2] ?? 0.08); // 度
const PRECISION = Number(process.argv[3] ?? 2);    // 小数位
/**
 * 纵向拉伸：等距圆柱下世界地图约 2.56:1 偏扁，
 * 只把 y 拉长一点（不换投影、仍保持矩形边缘），可在 1 ~ 1.6 之间调。
 */
const STRETCH = Number(process.argv[4] ?? 1.3);

/** 英文国名 → 中文国名（world-atlas 只提供英文名） */
const ZH = {
  // 以下名称写法与常见简写不同（Natural Earth 原文），单独补齐
  'U.S. Virgin Is.': '美属维尔京群岛', Guam: '关岛',
  'American Samoa': '美属萨摩亚', 'S. Geo. and the Is.': '南乔治亚和南桑威奇群岛',
  'Br. Indian Ocean Ter.': '英属印度洋领地', 'Isle of Man': '马恩岛',
  Tonga: '汤加', Samoa: '萨摩亚', 'Saint Lucia': '圣卢西亚',
  Palau: '帕劳', Malta: '马耳他', 'St. Pierre and Miquelon': '圣皮埃尔和密克隆',
  'Fr. Polynesia': '法属波利尼西亚', 'Faeroe Is.': '法罗群岛',
  Comoros: '科摩罗', 'Cabo Verde': '佛得角', Barbados: '巴巴多斯',
  Bahrain: '巴林', 'Heard I. and McDonald Is.': '赫德岛和麦克唐纳群岛',
  Andorra: '安道尔', 'Siachen Glacier': '锡亚琴冰川',
  Bahamas: '巴哈马', 'Falkland Is.': '福克兰群岛',
  'Fr. S. Antarctic Lands': '法属南部领地', Belize: '伯利兹',
  'Puerto Rico': '波多黎各', eSwatini: '斯威士兰',
  'North Korea': '朝鲜', 'South Korea': '韩国',
  'N. Cyprus': '北塞浦路斯', Somaliland: '索马里兰',
  Afghanistan: '阿富汗', Albania: '阿尔巴尼亚', Algeria: '阿尔及利亚',
  Angola: '安哥拉', Antarctica: '南极洲', Argentina: '阿根廷',
  Armenia: '亚美尼亚', Australia: '澳大利亚', Austria: '奥地利',
  Azerbaijan: '阿塞拜疆', Bangladesh: '孟加拉国', Belarus: '白俄罗斯',
  Belgium: '比利时', Benin: '贝宁', Bhutan: '不丹', Bolivia: '玻利维亚',
  'Bosnia and Herz.': '波黑', Botswana: '博茨瓦纳', Brazil: '巴西',
  Brunei: '文莱', Bulgaria: '保加利亚', 'Burkina Faso': '布基纳法索',
  Burundi: '布隆迪', Cambodia: '柬埔寨', Cameroon: '喀麦隆',
  Canada: '加拿大', 'Central African Rep.': '中非', Chad: '乍得',
  Chile: '智利', China: '中国', Colombia: '哥伦比亚', Congo: '刚果（布）',
  'Costa Rica': '哥斯达黎加', "Côte d'Ivoire": '科特迪瓦', Croatia: '克罗地亚',
  Cuba: '古巴', Cyprus: '塞浦路斯', Czechia: '捷克',
  'Dem. Rep. Congo': '刚果（金）', Denmark: '丹麦', Djibouti: '吉布提',
  Dominica: '多米尼克', 'Dominican Rep.': '多米尼加', Ecuador: '厄瓜多尔',
  Egypt: '埃及', 'El Salvador': '萨尔瓦多', 'Eq. Guinea': '赤道几内亚',
  Eritrea: '厄立特里亚', Estonia: '爱沙尼亚', Eswatini: '斯威士兰',
  Ethiopia: '埃塞俄比亚', Fiji: '斐济', Finland: '芬兰', France: '法国',
  Gabon: '加蓬', Gambia: '冈比亚', Georgia: '格鲁吉亚', Germany: '德国',
  Ghana: '加纳', Greece: '希腊', Greenland: '格陵兰', Guatemala: '危地马拉',
  Guinea: '几内亚', 'Guinea-Bissau': '几内亚比绍', Guyana: '圭亚那',
  Haiti: '海地', Honduras: '洪都拉斯', Hungary: '匈牙利', Iceland: '冰岛',
  India: '印度', Indonesia: '印度尼西亚', Iran: '伊朗', Iraq: '伊拉克',
  Ireland: '爱尔兰', Israel: '以色列', Italy: '意大利', Jamaica: '牙买加',
  Japan: '日本', Jordan: '约旦', Kazakhstan: '哈萨克斯坦', Kenya: '肯尼亚',
  Kiribati: '基里巴斯', Kosovo: '科索沃', Kuwait: '科威特',
  Kyrgyzstan: '吉尔吉斯斯坦', Laos: '老挝', Latvia: '拉脱维亚',
  Lebanon: '黎巴嫩', Lesotho: '莱索托', Liberia: '利比里亚', Libya: '利比亚',
  Lithuania: '立陶宛', Luxembourg: '卢森堡', Macedonia: '北马其顿',
  Madagascar: '马达加斯加', Malawi: '马拉维', Malaysia: '马来西亚',
  Mali: '马里', Mauritania: '毛里塔尼亚', Mauritius: '毛里求斯',
  Mexico: '墨西哥', Moldova: '摩尔多瓦', Mongolia: '蒙古',
  Montenegro: '黑山', Morocco: '摩洛哥', Mozambique: '莫桑比克',
  Myanmar: '缅甸', Namibia: '纳米比亚', Nepal: '尼泊尔',
  Netherlands: '荷兰', 'New Caledonia': '新喀里多尼亚', 'New Zealand': '新西兰',
  Nicaragua: '尼加拉瓜', Niger: '尼日尔', Nigeria: '尼日利亚',
  'N. Korea': '朝鲜', Norway: '挪威', Oman: '阿曼', Pakistan: '巴基斯坦',
  Palestine: '巴勒斯坦', Panama: '巴拿马', 'Papua New Guinea': '巴布亚新几内亚',
  Paraguay: '巴拉圭', Peru: '秘鲁', Philippines: '菲律宾', Poland: '波兰',
  Portugal: '葡萄牙', Qatar: '卡塔尔', Romania: '罗马尼亚', Russia: '俄罗斯',
  Rwanda: '卢旺达', 'S. Sudan': '南苏丹', 'Saudi Arabia': '沙特阿拉伯',
  Senegal: '塞内加尔', Serbia: '塞尔维亚', 'Sierra Leone': '塞拉利昂',
  Singapore: '新加坡', Slovakia: '斯洛伐克', Slovenia: '斯洛文尼亚',
  'Solomon Is.': '所罗门群岛', Somalia: '索马里', 'South Africa': '南非',
  'S. Korea': '韩国', Spain: '西班牙', 'Sri Lanka': '斯里兰卡', Sudan: '苏丹',
  Suriname: '苏里南', Sweden: '瑞典', Switzerland: '瑞士', Syria: '叙利亚',
  Taiwan: '中国台湾', Tajikistan: '塔吉克斯坦', Tanzania: '坦桑尼亚',
  Thailand: '泰国', 'Timor-Leste': '东帝汶', Togo: '多哥',
  'Trinidad and Tobago': '特立尼达和多巴哥', Tunisia: '突尼斯', Turkey: '土耳其',
  Turkmenistan: '土库曼斯坦', Uganda: '乌干达', Ukraine: '乌克兰',
  'United Arab Emirates': '阿联酋', 'United Kingdom': '英国',
  'United States of America': '美国', Uruguay: '乌拉圭', Uzbekistan: '乌兹别克斯坦',
  Vanuatu: '瓦努阿图', Venezuela: '委内瑞拉', Vietnam: '越南',
  'W. Sahara': '西撒哈拉', Yemen: '也门', Zambia: '赞比亚', Zimbabwe: '津巴布韦',
};

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '../public/static/geo/world-countries.json');

const round = (v) => Number(v.toFixed(PRECISION));

function perpDistance([px, py], [ax, ay], [bx, by]) {
  const dx = bx - ax;
  const dy = by - ay;
  if (dx === 0 && dy === 0) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

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

/** 环 → 扁平数组，返回 null 表示退化应丢弃 */
function packRing(ring) {
  const pts = simplify(ring, TOLERANCE);
  if (pts.length < 4) return null;
  const first = pts[0];
  const last = pts[pts.length - 1];
  const ring2 = first[0] === last[0] && first[1] === last[1] ? pts.slice(0, -1) : pts;
  if (ring2.length < 3) return null;

  const flat = [];
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [lng, lat] of ring2) {
    const x = round(lng);
    const y = round(lat);
    flat.push(x, y);
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  }
  // 过滤极小岛礁（阈值要小于新加坡的跨度，否则会把小国一起滤掉）
  if (Math.hypot(maxX - minX, maxY - minY) < 0.25) return null;
  // 绕极点的环（俄罗斯北冰洋岛屿等）：切割后会退化成横跨全图的条带，直接丢弃
  if (maxX - minX > 350) return null;
  return { flat, area: (maxX - minX) * (maxY - minY), cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
}

const require = createRequire(import.meta.url);
// 50m 精度：110m 缺少新加坡、马尔代夫等小国，足迹地图点不亮会很尴尬
const topo = require('world-atlas/countries-50m.json');
const collection = topojson.feature(topo, topo.objects.countries);

/** 台湾 / 香港 / 澳门并入中国：按地图规范不作为独立要素 */
const toPolygonList = (geometry) =>
  geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;

const MERGE_INTO_CHINA = ['Taiwan', 'Hong Kong', 'Macao', 'Hong Kong S.A.R.', 'Macao S.A.R.'];
const chinaFeature = collection.features.find((f) => f.properties.name === 'China');
const merged = collection.features.filter((f) => MERGE_INTO_CHINA.includes(f.properties.name));
if (chinaFeature && merged.length) {
  chinaFeature.geometry = {
    type: 'MultiPolygon',
    coordinates: merged.reduce(
      (acc, f) => [...acc, ...toPolygonList(f.geometry)],
      toPolygonList(chinaFeature.geometry),
    ),
  };
}

/**
 * 反子午线切割：俄罗斯、斐济等跨越 ±180° 的国家，直接按经纬度画会横穿整幅地图。
 * d3 的投影自带 antimeridian clipping，借它在构建期把这类多边形切成两块。
 * scale 取 180/π、translate 归零，投影输出就是「度」，方便再还原成经纬度。
 */
/**
 * 中心点要用经纬度（里程计算、标记定位都靠它），必须在投影之前算好。
 * 取面积最大的环的包围盒中心：美国的中心落在本土而不是阿拉斯加。
 */
const centerByName = new Map();
for (const feature of collection.features) {
  let best = null;
  let bestArea = -1;
  for (const polygon of toPolygonList(feature.geometry)) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [lng, lat] of polygon[0]) {
      if (lng < minX) minX = lng;
      if (lat < minY) minY = lat;
      if (lng > maxX) maxX = lng;
      if (lat > maxY) maxY = lat;
    }
    const area = (maxX - minX) * (maxY - minY);
    if (area > bestArea) {
      bestArea = area;
      best = [round((minX + maxX) / 2), round((minY + maxY) / 2)];
    }
  }
  if (best) centerByName.set(feature.properties.name, best);
}

const { geoProject } = require('d3-geo-projection');
const { geoEquirectangular } = require('d3-geo');
// 注意：geoProject 返回新对象，不会原地修改传入的 collection。
// 这里借它做反子午线切割（俄罗斯、斐济等跨 ±180° 的国家），
// scale 取 180/π、translate 归零，输出就是「度」，可无损还原成经纬度。
const projected = geoProject(
  collection,
  geoEquirectangular()
    .scale(180 / Math.PI)
    .translate([0, 0])
    .precision(1.2),
);

/** 投影输出是 [lng, -lat]，把纬度符号转回，后续流程仍按经纬度处理 */
const flipY = (coords) =>
  typeof coords[0] === 'number' ? [coords[0], -coords[1]] : coords.map(flipY);
for (const feature of projected.features) {
  feature.geometry.coordinates = flipY(feature.geometry.coordinates);
}

const countries = [];
const bbox = [Infinity, Infinity, -Infinity, -Infinity];

for (const feature of projected.features) {
  const englishName = feature.properties?.name;
  const name = ZH[englishName] ?? englishName;
  if (!name || name === '南极洲' || MERGE_INTO_CHINA.includes(englishName)) continue;

  const rings = toPolygonList(feature.geometry)
    .map((polygon) => packRing(polygon[0]))
    .filter(Boolean);
  if (!rings.length) continue;

  // 中心用投影前算好的经纬度；面积最大的环只作为兜底
  const main = rings.reduce((a, b) => (b.area > a.area ? b : a));

  countries.push({
    n: name,
    a: Number(feature.id) || 0,
    c: centerByName.get(englishName) ?? [main.cx, main.cy],
    p: rings.map((r) => r.flat),
  });

  for (const r of rings) {
    for (let i = 0; i < r.flat.length; i += 2) {
      bbox[0] = Math.min(bbox[0], r.flat[i]);
      bbox[1] = Math.min(bbox[1], r.flat[i + 1]);
      bbox[2] = Math.max(bbox[2], r.flat[i]);
      bbox[3] = Math.max(bbox[3], r.flat[i + 1]);
    }
  }
}

const payload = {
  bbox: bbox.map((v) => Number(v.toFixed(2))),
  countries,
  projection: 'equirectangular',
  stretch: STRETCH,
  // 页面按这个比例定 viewBox 高度：改 STRETCH 重跑即可，不用改组件
  aspect: Number(((bbox[2] - bbox[0]) / ((bbox[3] - bbox[1]) * STRETCH)).toFixed(3)),
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(payload), 'utf8');

console.log(`[world] countries=${countries.length} (台湾已并入中国，南极洲已排除)`);
console.log(`[world] ${OUT} ${(statSync(OUT).size / 1024).toFixed(1)} KB (raw)`);
