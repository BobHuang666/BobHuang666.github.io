/**
 * 名片 SVG 生成器：同一份 SVG 用于屏幕预览与导出 PNG，所见即所得。
 * 纯字符串拼装，无第三方依赖，便于经 canvas 转成图片下载。
 * 结构：顶部标题 + 装饰条，下方按勾选顺序渲染字段列表。
 */

export interface CardField {
  key: string;
  label: string;
  value: string;
}

export interface CardContent {
  title: string;
  kicker?: string;
  fields: CardField[];
}

export interface CardSvgResult {
  svg: string;
  width: number;
  height: number;
}

// 标题用衬线字体做出编辑排版的气质，正文用无衬线保证可读性；
// 只用系统字体——SVG 导出到 canvas 时不会加载外部 webfont。
const SERIF =
  "'Songti SC','STSong','SimSun','Noto Serif CJK SC','Source Han Serif SC',Georgia,serif";
const SANS =
  "'PingFang SC','Microsoft YaHei','DengXian','Hiragino Sans GB','Noto Sans CJK SC',sans-serif";

/** Feather 风格描边图标（24x24 viewBox），按字段 key 索引 */
const ICONS: Record<string, string> = {
  name: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  nickname: 'M20.59 13.41 11 3.83V3H4v8l9.59 9.59a2 2 0 0 0 2.82 0l4.18-4.18a2 2 0 0 0 0-2.82Z M7.5 7.5h.01',
  school:
    'M22 10 12 5 2 10l10 5 10-5Z M6 12v5c0 1 3 3 6 3s6-2 6-3v-5',
  major:
    'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z',
  degree:
    'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z M8.5 22 12 15l3.5 7 M2 22l4-9 M22 22l-4-9',
  phone:
    'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z',
  email:
    'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z M22 6l-10 7L2 6',
  address: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
  blog: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z',
};

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isCJK(ch: string): boolean {
  // 非 Latin-1（码点 > 0xFF）按全角估算宽度，CJK / 中文标点等落入此类
  return (ch.codePointAt(0) ?? 0) > 0xff;
}

interface WordToken {
  text: string;
  w: number; // 近似像素宽度（fontSize 为单位）
  latin: boolean; // 拉丁词（按词间距对齐）还是 CJK 单字（按字间距对齐）
  spaceBefore: boolean; // 原文中该词前是否有空格
}

/**
 * 把一段文字切成「词」：CJK 逐字成词，拉丁连续字符（含数字 / 标点）成词，
 * 空格仅作为词间间距标记（不单独成词），以便后续整词换行、避免英文断词。
 */
function tokenize(para: string, fontSize: number): WordToken[] {
  const words: WordToken[] = [];
  let buf = '';
  let latin = false;
  let spaceBefore = false;
  const flush = () => {
    if (!buf) return;
    const w = [...buf].reduce((a, c) => a + (isCJK(c) ? 1 : 0.6), 0) * fontSize;
    words.push({ text: buf, w, latin, spaceBefore });
    buf = '';
    spaceBefore = false;
  };
  for (const ch of para) {
    if (ch === ' ') {
      flush();
      spaceBefore = true;
      continue;
    }
    const cjk = isCJK(ch);
    if (cjk) {
      flush();
      words.push({ text: ch, w: fontSize, latin: false, spaceBefore });
      spaceBefore = false;
    } else {
      if (buf && !latin) flush();
      buf += ch;
      latin = true;
    }
  }
  flush();
  return words;
}

/** 贪心折行：CJK 逐字换行，拉丁整词换行（不会把单词拆开） */
function wrapWords(
  words: WordToken[],
  avail: number,
  spaceW: number,
): { tk: WordToken; gap: number }[][] {
  const lines: { tk: WordToken; gap: number }[][] = [];
  let line: { tk: WordToken; gap: number }[] = [];
  let lineW = 0;
  for (const tk of words) {
    const gap = tk.spaceBefore ? spaceW : 0;
    const cost = gap + tk.w;
    if (line.length > 0 && lineW + cost > avail) {
      lines.push(line);
      line = [{ tk, gap: 0 }];
      lineW = tk.w;
    } else {
      line.push({ tk, gap });
      lineW += cost;
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

/** 渲染单行：整行渲染为单个 <text>，由浏览器按真实字体排布（左对齐，避免单词重叠） */
function renderLine(
  line: { tk: WordToken; gap: number }[],
  x0: number,
  y: number,
  fontSize: number,
  color: string,
): string {
  const n = line.length;
  if (n === 0) return '';

  // 还原成整行文本（拉丁词间补真实空格，CJK 不加空格）
  let text = '';
  line.forEach((it, i) => {
    if (i > 0 && it.tk.spaceBefore) text += ' ';
    text += it.tk.text;
  });

  return `<text x="${x0.toFixed(2)}" y="${y}" font-size="${fontSize}" font-weight="600" letter-spacing="0.3" fill="${color}" font-family="${SANS}">${esc(text)}</text>`;
}

/** 渲染一段值（支持 \n 强制换行）；返回 SVG 与总行数 */
function renderValueBlock(
  value: string,
  x0: number,
  x1: number,
  yTop: number,
  fontSize: number,
  lineH: number,
  color: string,
): { svg: string; lines: number } {
  const avail = x1 - x0;
  const spaceW = fontSize * 0.28;
  const allLines: { tk: WordToken; gap: number }[][] = [];
  for (const para of value.split('\n')) {
    allLines.push(...wrapWords(tokenize(para, fontSize), avail, spaceW));
  }
  let svg = '';
  let y = yTop;
  for (const ln of allLines) {
    svg += renderLine(ln, x0, y, fontSize, color);
    y += lineH;
  }
  return { svg, lines: allLines.length };
}

export function buildCardSvg(content: CardContent): CardSvgResult {
  const W = 1080;
  const contentX = 96;
  const contentRight = W - 96; // 984
  const accent = '#c9a875'; // 香槟金，作为全卡唯一强调色

  // 头部：小号英文 kicker + 衬线大标题 + 短金线（左对齐，编辑排版）
  const kickerY = 118;
  const titleFontSize = 64;
  const titleY = kickerY + 82; // 基线
  const ruleY = titleY + 34;
  const rowsStart = ruleY + 66;

  // 字段列表
  const valueX = contentX + 56; // 152
  const labelFontSize = 20;
  const valueFontSize = 30;
  const valueLineH = 40;

  let rowY = rowsStart;
  const rows: string[] = [];

  content.fields.forEach((f, idx) => {
    const isLast = idx === content.fields.length - 1;
    const labelBaseline = rowY + 26;
    const valueTop = rowY + 60;
    const { svg: valueSvg, lines } = renderValueBlock(
      f.value,
      valueX,
      contentRight,
      valueTop,
      valueFontSize,
      valueLineH,
      '#eae6df',
    );
    const lastValueY = valueTop + (lines - 1) * valueLineH;
    const blockH = lastValueY - rowY + 24;
    const iconCy = rowY + blockH / 2;

    const iconPath = ICONS[f.key] ?? ICONS.name;
    const iconSvg = `<g transform="translate(${contentX},${iconCy - 12})" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPath}"/></g>`;

    const labelSvg = `<text x="${valueX}" y="${labelBaseline}" font-size="${labelFontSize}" font-weight="500" letter-spacing="2" fill="#8a939c" font-family="${SANS}">${esc(f.label)}</text>`;

    const sepY = rowY + blockH + 18;
    const separator = isLast
      ? ''
      : `<line x1="${contentX}" y1="${sepY}" x2="${contentRight}" y2="${sepY}" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1.5"/>`;

    rows.push(`<g>${iconSvg}${labelSvg}${valueSvg}</g>${separator}`);
    rowY += blockH + (isLast ? 0 : 36);
  });

  const contentBottom = rowY;
  const H = contentBottom + 100;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="${SANS}">
  <defs>
    <radialGradient id="glow" cx="0.85" cy="0.02" r="0.9">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.16"/>
      <stop offset="0.6" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" stroke-opacity="0.02" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="#0f1419"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#grain)"/>
  <rect x="28" y="28" width="${W - 56}" height="${H - 56}" rx="6" fill="none" stroke="${accent}" stroke-opacity="0.35" stroke-width="1.5"/>
  <rect x="42" y="42" width="${W - 84}" height="${H - 84}" rx="4" fill="none" stroke="${accent}" stroke-opacity="0.12" stroke-width="1"/>
  <g transform="translate(${W - 96},118) rotate(45)"><rect x="-7" y="-7" width="14" height="14" fill="${accent}"/></g>
  <text x="${contentX}" y="${kickerY}" font-size="20" font-weight="500" letter-spacing="6" fill="${accent}" font-family="${SANS}">${esc(content.kicker ?? 'PERSONAL CARD')}</text>
  <text x="${contentX}" y="${titleY}" font-size="${titleFontSize}" font-weight="500" letter-spacing="4" fill="#f2ece1" font-family="${SERIF}">${esc(content.title)}</text>
  <line x1="${contentX}" y1="${ruleY}" x2="${contentX + 96}" y2="${ruleY}" stroke="${accent}" stroke-width="3"/>
  ${rows.join('\n  ')}
</svg>`;

  return { svg, width: W, height: H };
}

/** 将 SVG 字符串渲染到 canvas 并导出为 PNG 下载 */
export function downloadSvgAsPng(
  svg: string,
  width: number,
  height: number,
  filename: string,
): void {
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      URL.revokeObjectURL(url);
      return;
    }
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((out) => {
      if (out) {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(out);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      }
      URL.revokeObjectURL(url);
    }, 'image/png');
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}
