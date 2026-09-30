import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import Lightbox from './Lightbox';

interface Props {
  src?: string;
  alt: string;
  className?: string;
  /** 没有图片时显示的标题 */
  fallbackTitle?: string;
  /** 渐变色（Tailwind from-xxx via-xxx to-xxx 片段） */
  fallbackGradient?: string;
  /** 显式指定的现代格式源，优先级高于自动推断 */
  sources?: { srcSet: string; type: string }[];
  /** 自动从 src 推断 .webp / .avif 路径 */
  autoModernFormats?: boolean;
  /** 点击后在大图浮层中打开（需要 src 存在） */
  zoomable?: boolean;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

/**
 * 智能图片：
 * - 有 src 时正常渲染，支持 lazy load / WebP / AVIF
 * - src 不存在 / 加载失败时降级为渐变背景 + 标题水印
 * - zoomable 时内置点击放大（复用 Lightbox，页面无需再自己写浮层逻辑）
 */
export const SmartImage = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackGradient = 'from-indigo-500 via-purple-500 to-pink-500',
  sources,
  autoModernFormats = true,
  zoomable = false,
  loading = 'lazy',
  width,
  height,
}: Props) => {
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
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

  const image = (
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

  if (!zoomable) return image;

  return (
    <>
      <div
        className="relative group cursor-zoom-in"
        onClick={() => setZoomed(true)}
        title="点击放大"
      >
        {image}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
          <ZoomIn className="h-8 w-8 text-white drop-shadow" />
        </div>
      </div>
      <Lightbox src={src!} alt={alt} open={zoomed} onClose={() => setZoomed(false)} />
    </>
  );
};
