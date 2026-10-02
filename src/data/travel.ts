import type { TravelPlace, TravelTrip } from '../types';

/**
 * 旅行足迹示例数据。
 *
 * 约定：
 * 1. name 必须与中国地级行政区全称一致（见 public/static/geo/china-cities.json 的 n 字段），
 *    例如「北京市」「延边朝鲜族自治州」——写「北京」会匹配不上。
 * 2. status 决定地图着色与标记样式；visits 至少一条，首条日期作为首次抵达时间。
 * 3. 换成你自己的足迹时，只需改本文件，页面与组件无需改动。
 */

/** 去过 / 住过的城市 */
export const travelPlaces: TravelPlace[] = [
  {
    id: 'beijing',
    name: '北京市',
    status: 'lived',
    visits: [
      { date: '2022-09-01', note: '入学北师大，一直住在海淀' },
      { date: '2023-05-01', note: '第一次在学校看演唱会' },
    ],
  },
  {
    id: 'ganzhou',
    name: '赣州市',
    aliases: ['瑞金'],
    status: 'lived',
    visits: [
      { date: '2004-01-01', note: '老家在瑞金，长大后才离开' },
      { date: '2023-07-10', note: '回乡社会实践，待了两周' },
    ],
  },
  {
    id: 'shanghai',
    name: '上海市',
    status: 'visited',
    visits: [
      { date: '2023-08-12', note: '演唱会 + 外滩夜跑' },
      { date: '2024-10-05', note: '国庆反向旅游，人少得离谱' },
    ],
  },
  {
    id: 'hangzhou',
    name: '杭州市',
    status: 'visited',
    visits: [{ date: '2025-05-03', note: '西湖 + 龙井村，走了三万步' }],
  },
  {
    id: 'nanjing',
    name: '南京市',
    status: 'visited',
    visits: [{ date: '2025-05-01', note: '先锋书店 + 明城墙' }],
  },
  {
    id: 'suzhou',
    name: '苏州市',
    status: 'visited',
    visits: [{ date: '2025-05-02', note: '拙政园，雨天反而更好看' }],
  },
  {
    id: 'chengdu',
    name: '成都市',
    status: 'visited',
    visits: [{ date: '2024-10-01', note: '看熊猫 + 吃火锅，连吃三天' }],
  },
  {
    id: 'chongqing',
    name: '重庆市',
    status: 'visited',
    visits: [{ date: '2024-10-03', note: '8D 魔幻地形，导航彻底失灵' }],
  },
  {
    id: 'xian',
    name: '西安市',
    status: 'visited',
    visits: [{ date: '2024-01-20', note: '寒假环城墙骑行一圈' }],
  },
  {
    id: 'changsha',
    name: '长沙市',
    status: 'visited',
    visits: [{ date: '2024-04-05', note: '为看一场演出专程跑来' }],
  },
  {
    id: 'nanchang',
    name: '南昌市',
    status: 'visited',
    visits: [{ date: '2023-07-25', note: '社会实践返程中转' }],
  },
  {
    id: 'xiamen',
    name: '厦门市',
    status: 'visited',
    visits: [{ date: '2025-01-18', note: '环岛路骑行，海风很上头' }],
  },
  {
    id: 'shenzhen',
    name: '深圳市',
    status: 'transit',
    visits: [{ date: '2024-07-08', note: '转机停留半天' }],
  },
  {
    id: 'hongkong',
    name: '香港特别行政区',
    aliases: ['香港'],
    status: 'visited',
    visits: [{ date: '2024-12-21', note: '维港夜景 + 徒步龙脊' }],
  },
  {
    id: 'lasa',
    name: '拉萨市',
    status: 'wishlist',
    visits: [],
  },
  {
    id: 'kunming',
    name: '昆明市',
    status: 'wishlist',
    visits: [],
  },
  {
    id: 'guilin',
    name: '桂林市',
    status: 'wishlist',
    visits: [],
  },
];

/**
 * 世界足迹：name 用地图数据里的中文国名（见 world-countries.json 的 n 字段）。
 * 显式写了经纬度，因此即使世界底图还没下载，跨国行程的里程也能算出来。
 * 与国内城市分开维护，两者互不影响。
 */
export const worldPlaces: TravelPlace[] = [
  {
    id: 'cn',
    name: '中国',
    lng: 104.2,
    lat: 36.9,
    status: 'lived',
    visits: [{ date: '2004-01-01', note: '出生到现在，大部分时间都在这儿' }],
  },
  {
    id: 'jp',
    name: '日本',
    lng: 139.7,
    lat: 35.7,
    region: '东京 · 京都',
    status: 'visited',
    visits: [{ date: '2024-02-14', note: '东京 + 京都，第一次出国' }],
  },
  {
    id: 'kr',
    name: '韩国',
    lng: 126.5,
    lat: 36.4,
    // region 可填任意次级地名：想去济州就写济州，会显示在详情卡上
    region: '济州 · 首尔',
    status: 'visited',
    visits: [{ date: '2024-07-20', note: '首尔看演出，顺便吃了三天烤肉' }],
  },
  {
    id: 'th',
    name: '泰国',
    lng: 100.5,
    lat: 13.8,
    region: '曼谷 · 清迈',
    status: 'visited',
    visits: [{ date: '2025-01-25', note: '曼谷 + 清迈，冬天避寒' }],
  },
  {
    id: 'sg',
    name: '新加坡',
    lng: 103.8,
    lat: 1.35,
    status: 'visited',
    visits: [{ date: '2025-01-30', note: '转机顺手玩了两天' }],
  },
  { id: 'us', name: '美国', lng: -98.6, lat: 39.8, status: 'wishlist', visits: [] },
  { id: 'uk', name: '英国', lng: -1.5, lat: 52.6, status: 'wishlist', visits: [] },
  { id: 'fr', name: '法国', lng: 2.5, lat: 46.6, status: 'wishlist', visits: [] },
  { id: 'ch', name: '瑞士', lng: 8.2, lat: 46.8, status: 'wishlist', visits: [] },
  { id: 'is', name: '冰岛', lng: -19.0, lat: 64.9, status: 'wishlist', visits: [] },
];

/** 出行记录：一次出行 = 若干段路径，每段标注交通方式 */
export const travelTrips: TravelTrip[] = [
  {
    id: 'trip-ganzhou-2023',
    title: '赣南社会实践',
    dateRange: ['2023-07-10', '2023-07-26'],
    tone: 'cardEmerald',
    scope: 'china',
    legs: [
      { id: 'l1', from: 'beijing', to: 'ganzhou', date: '2023-07-10', transport: 'train', note: 'Z 字头，睡一晚就到' },
      { id: 'l2', from: 'ganzhou', to: 'nanchang', date: '2023-07-25', transport: 'bus', note: '长途大巴 4 小时' },
      { id: 'l3', from: 'nanchang', to: 'beijing', date: '2023-07-26', transport: 'plane' },
    ],
  },
  {
    id: 'trip-chuanyu-2024',
    title: '国庆川渝行',
    dateRange: ['2024-10-01', '2024-10-07'],
    tone: 'cardAmber',
    scope: 'china',
    legs: [
      { id: 'l4', from: 'beijing', to: 'chengdu', date: '2024-10-01', transport: 'plane', note: '凌晨特价机票' },
      { id: 'l5', from: 'chengdu', to: 'chongqing', date: '2024-10-03', transport: 'train', note: '成渝高铁 1.5h' },
      { id: 'l6', from: 'chongqing', to: 'beijing', date: '2024-10-07', transport: 'plane' },
    ],
  },
  {
    id: 'trip-jiangnan-2025',
    title: '五一江南行',
    dateRange: ['2025-05-01', '2025-05-05'],
    tone: 'cardSky',
    scope: 'china',
    postId: '江南行',
    legs: [
      { id: 'l7', from: 'beijing', to: 'nanjing', date: '2025-05-01', transport: 'train' },
      { id: 'l8', from: 'nanjing', to: 'suzhou', date: '2025-05-02', transport: 'train', note: '沪宁城际' },
      { id: 'l9', from: 'suzhou', to: 'hangzhou', date: '2025-05-03', transport: 'train' },
      { id: 'l10', from: 'hangzhou', to: 'shanghai', date: '2025-05-04', transport: 'train' },
      { id: 'l11', from: 'shanghai', to: 'beijing', date: '2025-05-05', transport: 'plane' },
    ],
  },
  {
    id: 'trip-seasia-2025',
    title: '寒假东南亚',
    dateRange: ['2025-01-25', '2025-01-31'],
    tone: 'mintCyan',
    scope: 'world',
    legs: [
      { id: 'l12', from: 'beijing', to: 'th', date: '2025-01-25', transport: 'plane', note: '直飞曼谷' },
      { id: 'l13', from: 'th', to: 'sg', date: '2025-01-29', transport: 'plane' },
      { id: 'l14', from: 'sg', to: 'beijing', date: '2025-01-31', transport: 'plane' },
    ],
  },
];
