/**
 * 图片优化脚本：为 Lighthouse 生成现代格式 + 右尺寸的图片资源
 *
 * 1. 项目图（public/img/projects/*）：缩放到 maxWidth，原格式覆盖写，
 *    并生成同名 .webp / .avif（SmartImage 的 autoModernFormats 会自动命中）。
 * 2. 头像（public/static/img/avatar.jpg）：缩放到 maxAvatar 覆盖写，另存 .webp。
 * 3. 追星头像（public/img/fandom/*）：统一转 .webp 并删除原文件（数据里只引用 .webp）。
 *
 * 用法：node scripts/optimize-images.mjs
 */
import { createRequire } from 'node:module';
import { statSync, unlinkSync, writeFileSync, renameSync } from 'node:fs';
import { join, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const sharp = require('sharp');

/** Windows 下目标文件可能被同步/杀软短暂锁住：先写临时文件再改名 */
function atomicWrite(file, buf) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, buf);
  renameSync(tmp, file);
}

const ROOT = resolve(process.cwd(), 'public');
const KB = 1024;

/** [文件, 最大宽度, webp 质量] */
const PROJECT_IMAGES = [
  ['img/projects/inkruler.png', 1280, 82],
  ['img/projects/igem.png', 1280, 82],
  ['img/projects/ledger.png', 1280, 82],
  ['img/projects/aicv.jpg', 1280, 82],
];

const FANDOM_IMAGES = [
  'img/fandom/idol-lay.jpg',
  'img/fandom/group-red.jpg',
  'img/fandom/group-exo.jpg',
  'img/fandom/group-nct.jpg',
  'img/fandom/group-redvelvet.jpg',
  'img/fandom/group-superjunior.jpg',
  'img/fandom/idol-taeyeon.jpg',
];

async function report(label, bufBefore, bufAfter) {
  console.log(
    `${label}: ${(bufBefore / KB).toFixed(0)}KB -> ${(bufAfter / KB).toFixed(0)}KB`,
  );
}

async function processProjectImage(rel, maxWidth, quality) {
  const file = join(ROOT, rel);
  const before = statSync(file).size;
  const base = rel.replace(/\.(png|jpe?g)$/i, '');
  const img = sharp(file);
  const meta = await img.metadata();
  const resized = meta.width > maxWidth ? img.resize({ width: maxWidth }) : img;
  const buf = await resized.toBuffer();
  const isJpg = /\.jpe?g$/i.test(rel);

  // 原格式覆盖写（作为 <img> 的兜底源）
  atomicWrite(file, isJpg
    ? await sharp(buf).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
    : buf);
  // 同名 .webp / .avif（SmartImage 自动推断）
  atomicWrite(join(ROOT, `${base}.webp`), await sharp(buf).webp({ quality }).toBuffer());
  atomicWrite(join(ROOT, `${base}.avif`), await sharp(buf).avif({ quality: Math.max(45, quality - 30) }).toBuffer());
  await report(rel, before, statSync(file).size);
}

async function processAvatar() {
  const rel = 'static/img/avatar.jpg';
  const file = join(ROOT, rel);
  const before = statSync(file).size;
  const buf = await sharp(file).resize({ width: 512 }).toBuffer();
  atomicWrite(file, await sharp(buf).jpeg({ quality: 85, mozjpeg: true }).toBuffer());
  atomicWrite(join(ROOT, 'static/img/avatar.webp'), await sharp(buf).webp({ quality: 85 }).toBuffer());
  await report(rel, before, statSync(file).size);
}

async function processFandom(rel) {
  const file = join(ROOT, rel);
  const before = statSync(file).size;
  const base = rel.replace(/\.(png|jpe?g)$/i, '');
  const out = join(ROOT, `${base}.webp`);
  try {
    const buf = await sharp(file).resize({ width: 320, withoutEnlargement: true }).toBuffer();
    atomicWrite(out, await sharp(buf).webp({ quality: 85 }).toBuffer());
  } catch (err) {
    console.warn(`  !! ${rel} 无法转码（${err.message}），保留原文件`);
    return;
  }
  const after = statSync(out).size;
  if (after < before) {
    try { unlinkSync(file); } catch { console.warn(`  !! ${rel} 删除失败，可手动删除`); } // 仅在确实更小时删除原文件
  }
  await report(`${rel} -> ${base}.webp`, before, after);
}

for (const [rel, w, q] of PROJECT_IMAGES) await processProjectImage(rel, w, q);
await processAvatar();
for (const rel of FANDOM_IMAGES) await processFandom(rel);
console.log('done');
