/**
 * 名片 SVG 生成器。
 *
 * 同一个 SVG 同时用于「屏幕预览」与「导出 PNG」，保证所见即所得。
 * 不依赖任何第三方库，纯字符串拼装，便于通过 <canvas> 转成图片下载。
 *
 * 结构：顶部「个人名片」标题 + 装饰条，下面按勾选顺序渲染字段列表，
 * 每个字段 = 彩色圆标 + 标题（小字）+ 内容（大字）。
 */

export interface CardField {
  key: string;
  label: string;
  value: string;
}

export interface CardContent {
  title: string;
  fields: CardField[];
}

export interface CardSvgResult {
  svg: string;
  width: number;
  height: number;
}

// 标题用衬线（宋体/思源宋体）做出编辑排版的气质；正文用无衬线保证可读性。
// 只用系统可用字体——SVG 导出到 canvas 时不会加载外部 webfont。
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

/** 按字符宽度（CJK=1，半角=0.55）估算折行，避免长地址 / 链接溢出 */
function wrapText(text: string, maxUnits: number): string[] {
  const lines: string[] = [];
  let cur = '';
  let units = 0;
  for (const ch of text) {
    const w = isCJK(ch) ? 1 : 0.55;
    if (units + w > maxUnits && cur) {
      lines.push(cur);
      cur = ch;
      units = w;
    } else {
      cur += ch;
      units += w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [''];
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
  const maxUnits = (contentRight - valueX) / valueFontSize; // ≈ 27.7

  let rowY = rowsStart;
  const rows: string[] = [];

  content.fields.forEach((f, idx) => {
    const lines = wrapText(f.value, Math.floor(maxUnits));
    const isLast = idx === content.fields.length - 1;

    const labelBaseline = rowY + 26;
    const valueTop = rowY + 60;
    const lastValueY = valueTop + (lines.length - 1) * valueLineH;
    const blockH = lastValueY - rowY + 24;
    const iconCy = rowY + blockH / 2;

    const iconPath = ICONS[f.key] ?? ICONS.name;
    const iconSvg = `<g transform="translate(${contentX},${iconCy - 12})" fill="none" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPath}"/></g>`;

    let textSvg = `<text x="${valueX}" y="${labelBaseline}" font-size="${labelFontSize}" font-weight="500" letter-spacing="2" fill="#8a939c" font-family="${SANS}">${esc(f.label)}</text>`;
    lines.forEach((ln, i) => {
      textSvg += `<text x="${valueX}" y="${valueTop + i * valueLineH}" font-size="${valueFontSize}" font-weight="600" letter-spacing="0.3" fill="#eae6df" font-family="${SANS}">${esc(ln)}</text>`;
    });

    const sepY = rowY + blockH + 18;
    const separator = isLast
      ? ''
      : `<line x1="${contentX}" y1="${sepY}" x2="${contentRight}" y2="${sepY}" stroke="#ffffff" stroke-opacity="0.07" stroke-width="1.5"/>`;

    rows.push(`<g>${iconSvg}${textSvg}</g>${separator}`);
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
  <text x="${contentX}" y="${kickerY}" font-size="20" font-weight="500" letter-spacing="6" fill="${accent}" font-family="${SANS}">PERSONAL CARD</text>
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
