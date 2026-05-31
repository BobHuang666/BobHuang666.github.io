import { useState } from 'react';

interface Props {
  src?: string;
  alt: string;
  className?: string;
  /** 没有图片时显示的标题 */
  fallbackTitle?: string;
  /** 渐变色（Tailwind from-xxx via-xxx to-xxx 片段） */
  fallbackGradient?: string;
  /** 同名 WebP / AVIF 源（自动按浏览器支持挑选）。
   * 例：src="/img/cover.jpg" + 自动尝试 cover.webp / cover.avif
   * 也可通过 `sources` 显式传入 */
  sources?: { srcSet: string; type: string }[];
  /** 自动从 src 推断 .webp / .avif 路径 */
  autoModernFormats?: boolean;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

/**
 * 智能图片：
 * - 有 src 时正常渲染，支持 lazy load / WebP / AVIF
 * - src 不存在 / 加载失败时降级为渐变背景 + 标题水印
 */
export const SmartImage = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackGradient = 'from-indigo-500 via-purple-500 to-pink-500',
  sources,
  autoModernFormats = true,
  loading = 'lazy',
  width,
  height,
}: Props) => {
  const [failed, setFailed] = useState(false);
  const showFallback = !src || failed;

  if (showFallback) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${fallbackGradient} text-white relative overflow-hidden ${className}`}
        aria-label={alt}
        role="img"
      >
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,white_0%,transparent_50%)]" />
        <span className="relative z-10 text-sm font-semibold px-4 text-center drop-shadow line-clamp-2">
          {fallbackTitle ?? alt}
        </span>
      </div>
    );
  }

  // 自动推断现代格式
  const autoSources: { srcSet: string; type: string }[] = [];
  if (autoModernFormats && src) {
    const base = src.replace(/\.(jpg|jpeg|png)$/i, '');
    if (base !== src) {
      autoSources.push({ srcSet: `${base}.avif`, type: 'image/avif' });
      autoSources.push({ srcSet: `${base}.webp`, type: 'image/webp' });
    }
  }

  const allSources = [...(sources ?? []), ...autoSources];

  return (
    <picture>
      {allSources.map((s) => (
        <source key={s.srcSet} srcSet={s.srcSet} type={s.type} />
      ))}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        width={width}
        height={height}
        onError={() => setFailed(true)}
        className={className}
      />
    </picture>
  );
};
