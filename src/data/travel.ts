import type { TravelPlace, TravelTrip } from '../types';

/**
 * 旅行足迹示例数据。
 *
 * 约定：
 * 1. name 必须与中国地级行政区全称一致（见 public/static/geo/china-cities.json 的 n 字段），
 *    例如「北京市」「延边朝鲜族自治州」——写「北京」会匹配不上。
 * 2. status 决定地图着色与标记样式；visits 至少一条，首条日期作为首次抵达时间。
 * 3. 换成你自己的足迹时，只需改本文件，页面与组件无需改动。
 * 4. 日期统一用「年.月.日」形式，如 '2025.09.09'。
 */

/** 住过的城市（按时间顺序） */
export const travelPlaces: TravelPlace[] = [
  {
    id: 'chaozhou',
    name: '潮州市',
    status: 'lived',
    visits: [{ date: '2004.01.01', note: '出生' }],
  },
  {
    id: 'shantou',
    name: '汕头市',
    status: 'lived',
    visits: [
      { date: '2020.09.01', note: '高中' },
      { date: '2023.06.19', note: '南澳岛' },
    ],
  },
  {
    id: 'zhuhai',
    name: '珠海市',
    status: 'lived',
    visits: [{ date: '2023.08.27', note: '本科' }],
  },
  {
    id: 'shenzhen',
    name: '深圳市',
    status: 'lived',
    visits: [
      { date: '2026.07.01', note: '实习' },
      { date: '2028.09.01', note: '实习' },
    ],
  },
  {
    id: 'beijing',
    name: '北京市',
    status: 'lived',
    visits: [
      { date: '2027.09.01', note: '研一' },
      { date: '2026.09.05', note: '天安门升旗、北京师范大学（海淀校园）、北京电影学院、中央戏剧学院、什刹海' },
    ],
  },
  {
    id: 'hongkong',
    name: '香港特别行政区',
    aliases: ['香港'],
    status: 'visited',
    visits: [
      { date: '2025.09.10', note: '经香港机场飞济州' },
      { date: '2025.09.14', note: '济州返程经香港机场回珠海' },
    ],
  },
  {
    id: 'guangzhou',
    name: '广州市',
    status: 'visited',
    visits: [{ date: '2024.07.04' }],
  },
  {
    id: 'jingzhou',
    name: '荆州市',
    status: 'visited',
    visits: [{ date: '2024.07.04', note: '楚王车马阵、荆州博物馆、章华寺' }],
  },
  {
    id: 'jingmen',
    name: '荆门市',
    status: 'visited',
    visits: [{ date: '2024.07.07', note: '荆门园博园、城市规划馆' }],
  },
  {
    id: 'wuhan',
    name: '武汉市',
    status: 'visited',
    visits: [{ date: '2024.07.10', note: '与高中同学短聚，武汉大学、江汉路、琴台大剧院、琴台钢琴博物馆、武汉美术馆、黎黄陂路、八七会议会址' }],
  },
  {
    id: 'suzhou',
    name: '苏州市',
    status: 'visited',
    visits: [{ date: '2024.07.11', note: 'CCiC中国地区iGEMer交流会（西交利物浦大学），东方之门、苏州大学、寒山寺、山塘街、虎丘山、淮海街、拙政园' }],
  },
  {
    id: 'shanghai',
    name: '上海市',
    status: 'visited',
    visits: [{ date: '2024.07.15', note: '东方明珠、南京路、复旦大学、上海交通大学、B站大楼、世博馆、梅赛德斯一奔驰文化中心、肯德基汇宝店（《极限挑战》肯德基事变旧址）、白莲泾公园（《莲》舞蹈版拍摄地）' }],
  },
  {
    id: 'jiaxing',
    name: '嘉兴市',
    status: 'visited',
    visits: [{ date: '2024.07.17', note: '南湖景区、南湖革命纪念馆' }],
  },
  {
    id: 'hangzhou',
    name: '杭州市',
    status: 'visited',
    visits: [{ date: '2024.07.17', note: '浙江大学、西湖、灵隐寺飞来峰景区' }],
  },
  {
    id: 'ganzhou',
    name: '赣州市',
    status: 'visited',
    visits: [{ date: '2025.07.06', note: '中央革命根据地历史博物馆、中华苏维埃共和国临时中央政府旧址、长征第一山、长征渡口、吃水不忘挖井人、洪都大拇指奶茶厂' }],
  },
  {
    id: 'chongqing',
    name: '重庆市',
    status: 'visited',
    visits: [{ date: '2025.11.27', note: 'CCPC区域赛（重庆大学）、解放碑、重庆市人民大礼堂、重庆博物馆、李子坝地铁站、皇冠大扶梯、长江索道、重庆火锅' }],
  },
  {
    id: 'shanwei',
    name: '汕尾市',
    status: 'visited',
    visits: [{ date: '2026.09.21', note: '二马路，金町湾，红海湾' }],
  },
  {
    id: 'aomen',
    name: '澳门特别行政区',
    aliases: ['澳门'],
    status: 'visited',
    visits: [{ date: '2025.01.17' }],
  },
  {
    id: 'zhongshan',
    name: '中山市',
    status: 'visited',
    visits: [{ date: '2024.11.03', note: '三乡5km欢乐跑' }],
  },
  {
    id: 'jieyang',
    name: '揭阳市',
    status: 'visited',
    visits: [
      { date: '2023.07.09' },
      { date: '2015.08.18' },
    ],
  },
  {
    id: 'guilin',
    name: '桂林市',
    status: 'visited',
    visits: [{ date: '2023.07.09' }],
  },
  {
    id: 'xianyang',
    name: '咸阳市',
    status: 'visited',
    visits: [
      { date: '2023.07.09' },
      { date: '2015.08.13' },
    ],
  },
  {
    id: 'xian',
    name: '西安市',
    status: 'visited',
    visits: [
      { date: '2023.07.10', note: '半坡博物馆、秦始皇陵、华清宫、西安博物院、赛格购物中心、大唐不夜城' },
      { date: '2015.08.13' },
    ],
  },
  {
    id: 'weinan',
    name: '渭南市',
    status: 'visited',
    visits: [{ date: '2023.07.13', note: '华山' }],
  },
  {
    id: 'huizhou',
    name: '惠州市',
    status: 'visited',
    visits: [
      { date: '2026.07.19', note: '惠州西湖、黄家祠、惠州商业步行街、合江楼、东坡祠、华贸天地，《功夫女足》' },
      { date: '2017.02.04', note: '惠州西湖，自驾 with czt' },
    ],
  },
  {
    id: 'foshan',
    name: '佛山市',
    status: 'visited',
    visits: [{ date: '2023.10.04', note: '佛山市青年公园' }],
  },
  {
    id: 'jian',
    name: '吉安市',
    status: 'visited',
    visits: [{ date: '2015.08.13' }],
  },
  {
    id: 'qingdao',
    name: '青岛市',
    status: 'visited',
    visits: [{ date: '2016.09.01' }],
  },
  {
    id: 'guiyang',
    name: '贵阳市',
    status: 'visited',
    visits: [{ date: '2017.07.01' }],
  },
  {
    id: 'xiamen',
    name: '厦门市',
    status: 'visited',
    visits: [{ date: '2013.08.08' }],
  },
  {
    id: '漳州',
    name: '漳州市',
    status: 'visited',
    visits: [{ date: '2013.08.08' }],
  },
  {
    id: 'meizhou',
    name: '梅州市',
    status: 'visited',
    visits: [{ date: '2022.08.01' }],
  },
];

/**
 * 世界足迹：name 用地图数据里的中文国名（见 world-countries.json 的 n 字段）。
 * 显式写了经纬度，因此即使世界底图还没下载，跨国行程的里程也能算出来。
 * 与国内城市分开维护，两者互不影响。
 *
 * 济州 / 西归浦是韩国济州岛上的城市，世界地图只到国家粒度，故它们统一以
 * name='韩国' 挂到韩国之下（这样「到访国家」统计只计韩国一次），
 * 用各自的经纬度定位到济州岛，region 填具体地名。
 */
export const worldPlaces: TravelPlace[] = [
  {
    id: 'cn',
    name: '中国',
    lng: 104.2,
    lat: 36.9,
    status: 'lived',
    visits: [{ date: '2004.01.01' }],
  },
  {
    id: 'kr',
    name: '韩国',
    lng: 127.87,
    lat: 36.47,
    region: '济州市 · 西归浦市',
    status: 'visited',
    visits: [{ date: '2025.09.09' }],
  },
  {
    id: 'jeju',
    name: '韩国',
    aliases: ['济州'],
    lng: 126.489,
    lat: 33.489,
    region: '济州市',
    status: 'visited',
    visits: [{ date: '2025.09.10', note: '涯月邑、JEJU LAF、东门市场、咸德海浴场'}],
  },
  {
    id: 'seogwipo',
    name: '韩国',
    aliases: ['西归浦'],
    lng: 126.561,
    lat: 33.254,
    region: '西归浦市',
    status: 'visited',
    visits: [{ date: '2025.09.12', note: '实弹射击、柱状节理带' }],
  },
];

/** 出行记录：一次出行 = 若干段路径，每段标注交通方式 */
export const travelTrips: TravelTrip[] = [
  {
    id: 'trip-changjiang-2024',
    title: '长江行',
    dateRange: ['2024.07.04', '2024.07.19'],
    tone: 'cardAmber',
    scope: 'china',
    legs: [
      { id: 'c1', from: 'chaozhou', to: 'guangzhou', date: '2024.07.04', transport: 'train' },
      { id: 'c2', from: 'guangzhou', to: 'jingzhou', date: '2024.07.04', transport: 'train' },
      { id: 'c3', from: 'jingzhou', to: 'jingmen', date: '2024.07.07', transport: 'bus' },
      { id: 'c4', from: 'jingmen', to: 'wuhan', date: '2024.07.10', transport: 'train', note: '4小时“长途”绿皮还是太难受了' },
      { id: 'c5', from: 'wuhan', to: 'suzhou', date: '2024.07.11', transport: 'train' },
      { id: 'c6', from: 'suzhou', to: 'shanghai', date: '2024.07.15', transport: 'train' },
      { id: 'c7', from: 'shanghai', to: 'jiaxing', date: '2024.07.17', transport: 'train' },
      { id: 'c8', from: 'jiaxing', to: 'hangzhou', date: '2024.07.17', transport: 'train' },
      { id: 'c9', from: 'hangzhou', to: 'chaozhou', date: '2024.07.19', transport: 'train' },
    ],
  },
  {
    id: 'trip-ganzhou-2025',
    title: '赣州红色实践',
    dateRange: ['2025.07.06', '2025.07.09'],
    tone: 'red',
    scope: 'china',
    legs: [
      { id: 'gz1', from: 'zhuhai', to: 'shenzhen', date: '2025.07.06', transport: 'bus' },
      { id: 'gz2', from: 'shenzhen', to: 'ganzhou', date: '2025.07.06', transport: 'train' },
      { id: 'gz3', from: 'ganzhou', to: 'chaozhou', date: '2025.07.09', transport: 'train' },
    ],
  },
  {
    id: 'trip-chongqing-2026',
    title: '重庆CCPC',
    dateRange: ['2025.11.27', '2025.11.30'],
    tone: 'cardSky',
    scope: 'china',
    legs: [
      { id: 'cq1', from: 'zhuhai', to: 'chongqing', date: '2025.11.27', transport: 'plane' },
      { id: 'cq2', from: 'chongqing', to: 'zhuhai', date: '2025.11.30', transport: 'plane' },
    ],
  },
  {
    id: 'trip-jeju-2025',
    title: '新手村 · 韩国济州岛',
    dateRange: ['2025.09.09', '2025.09.14'],
    tone: 'mintCyan',
    scope: 'world',
    legs: [
      { id: 'l12', from: 'zhuhai', to: 'hongkong', date: '2025.09.09', transport: 'bus' },
      { id: 'l13', from: 'hongkong', to: 'jeju', date: '2025.09.10', transport: 'plane' },
      { id: 'l14', from: 'jeju', to: 'seogwipo', date: '2025.09.12', transport: 'bus' },
      { id: 'l15', from: 'seogwipo', to: 'jeju', date: '2025.09.12', transport: 'bus' },
      { id: 'l16', from: 'jeju', to: 'hongkong', date: '2025.09.14', transport: 'plane' },
      { id: 'l17', from: 'hongkong', to: 'zhuhai', date: '2025.09.14', transport: 'bus' },
    ],
  },
  {
    id: 'trip-beijing-2026',
    title: '进京赶考',
    dateRange: ['2026.09.05', '2026.09.08'],
    tone: 'cardIndigo',
    scope: 'china',
    legs: [
      { id: 'bj1', from: 'zhuhai', to: 'beijing', date: '2026.09.05', transport: 'plane' },
      { id: 'bj2', from: 'beijing', to: 'zhuhai', date: '2026.09.08', transport: 'plane' },
    ],
  },
  {
    id: 'trip-shanwei-2026',
    title: '汕尾中秋晚会',
    dateRange: ['2026.09.20', '2026.09.22'],
    tone: 'cardSky',
    scope: 'china',
    legs: [
      { id: 'sw1', from: 'zhuhai', to: 'guangzhou', date: '2026.09.20', transport: 'bus' },
      { id: 'sw2', from: 'guangzhou', to: 'shanwei', date: '2026.09.21', transport: 'bus' },
      { id: 'sw3', from: 'shanwei', to: 'chaozhou', date: '2026.09.22', transport: 'train' },
    ],
  },
  {
    id: 'trip-hk-macau-2025',
    title: '家人港澳游',
    dateRange: ['2025.01.16', '2025.01.18'],
    tone: 'violetPurple',
    scope: 'china',
    legs: [
      { id: 'hm1', from: 'zhuhai', to: 'aomen', date: '2025.01.17', transport: 'walk' },
      { id: 'hm2', from: 'aomen', to: 'zhuhai', date: '2025.01.17', transport: 'walk' },
      { id: 'hm3', from: 'zhuhai', to: 'hongkong', date: '2025.01.18', transport: 'bus' },
      { id: 'hm4', from: 'hongkong', to: 'chaozhou', date: '2025.01.18', transport: 'train' },
    ],
  },
  {
    id: 'trip-zhongshan-2024',
    title: '中山三乡马拉松',
    dateRange: ['2024.11.03', '2024.11.03'],
    tone: 'orange',
    scope: 'china',
    legs: [
      { id: 'zs1', from: 'zhuhai', to: 'zhongshan', date: '2024.11.03', transport: 'car' },
      { id: 'zs2', from: 'zhongshan', to: 'zhuhai', date: '2024.11.03', transport: 'bus' },
    ],
  },
  {
    id: 'trip-chimelong-2023',
    title: '珠海长隆',
    dateRange: ['2023.08.24', '2023.08.27'],
    tone: 'emeraldTeal',
    scope: 'china',
    legs: [
      { id: 'cl1', from: 'chaozhou', to: 'zhuhai', date: '2023.08.24', transport: 'car' },
    ],
  },
  {
    id: 'trip-xian-2023',
    title: '谢狗粉丝群西安之旅',
    dateRange: ['2023.07.09', '2023.07.14'],
    tone: 'red',
    scope: 'china',
    legs: [
      { id: 'xa1', from: 'chaozhou', to: 'jieyang', date: '2023.07.09', transport: 'car' },
      { id: 'xa2', from: 'jieyang', to: 'guilin', date: '2023.07.09', transport: 'plane' },
      { id: 'xa3', from: 'guilin', to: 'xianyang', date: '2023.07.09', transport: 'plane' },
      { id: 'xa4', from: 'xianyang', to: 'xian', date: '2023.07.10', transport: 'bus' },
      { id: 'xa5', from: 'xian', to: 'weinan', date: '2023.07.13', transport: 'bus' },
      { id: 'xa6', from: 'weinan', to: 'xian', date: '2023.07.13', transport: 'bus' },
      { id: 'xa7', from: 'xian', to: 'shenzhen', date: '2023.07.14', transport: 'train' },
      { id: 'xa8', from: 'shenzhen', to: 'chaozhou', date: '2023.07.14', transport: 'train' },
    ],
  },
  {
    id: 'trip-nanao-2023',
    title: '四世同堂南澳之旅',
    dateRange: ['2023.06.19', '2023.06.20'],
    tone: 'rose',
    scope: 'china',
    legs: [
      { id: 'na1', from: 'chaozhou', to: 'shantou', date: '2023.06.19', transport: 'train' },
      { id: 'na2', from: 'shantou', to: 'chaozhou', date: '2023.06.20', transport: 'train' },
    ],
  },
  {
    id: 'trip-huizhou-2026',
    title: '惠州周末一日游',
    dateRange: ['2026.07.19', '2026.07.19'],
    tone: 'mintGreen',
    scope: 'china',
    legs: [
      { id: 'hz1', from: 'shenzhen', to: 'huizhou', date: '2026.07.19', transport: 'train' },
      { id: 'hz2', from: 'huizhou', to: 'shenzhen', date: '2026.07.19', transport: 'train' },
    ],
  },
  {
    id: 'trip-foshan-2023',
    title: '佛山DNA音乐节',
    dateRange: ['2023.10.04', '2023.10.06'],
    tone: 'fuchsiaRose',
    scope: 'china',
    legs: [
      { id: 'fs1', from: 'chaozhou', to: 'guangzhou', date: '2023.10.04', transport: 'train' },
      { id: 'fs2', from: 'guangzhou', to: 'foshan', date: '2023.10.04', transport: 'train' },
      { id: 'fs3', from: 'foshan', to: 'guangzhou', date: '2023.10.05', transport: 'train' },
      { id: 'fs4', from: 'guangzhou', to: 'zhuhai', date: '2023.10.06', transport: 'bus' },
    ],
  },
  {
    id: 'trip-xian-2025',
    title: '西安之旅',
    dateRange: ['2015.08.12', '2015.08.18'],
    tone: 'cardIndigo',
    scope: 'china',
    legs: [
      { id: 'xj1', from: 'chaozhou', to: 'shenzhen', date: '2015.08.12', transport: 'train' },
      { id: 'xj2', from: 'shenzhen', to: 'jian', date: '2015.08.13', transport: 'plane' },
      { id: 'xj3', from: 'jian', to: 'xianyang', date: '2015.08.13', transport: 'plane' },
      { id: 'xj4', from: 'xianyang', to: 'xian', date: '2015.08.13', transport: 'car' },
      { id: 'xj5', from: 'xian', to: 'xianyang', date: '2015.08.18', transport: 'car' },
      { id: 'xj6', from: 'xianyang', to: 'jieyang', date: '2015.08.18', transport: 'plane' },
      { id: 'xj7', from: 'jieyang', to: 'chaozhou', date: '2015.08.18', transport: 'car' },
    ],
  },
];
