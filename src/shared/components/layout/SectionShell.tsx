/**
 * 通用 section 外壳：统一"洗色背景 + 可选纹理层 + mono 编号眉题 + 流式标题"的区块骨架。
 * 只负责视觉编排，不携带任何业务语义；纹理/洗色类定义在 index.css（layer 外，防 purge）。
 */
import { SectionReveal } from '@/shared/components/effects/SectionReveal';

export type SectionTint = 'indigo' | 'violet' | 'sky' | 'amber' | 'emerald' | 'rose';
export type SectionTexture = 'dots' | 'blueprint';

const TINT_CLASS: Record<SectionTint, string> = {
  indigo: 'tint-indigo',
  violet: 'tint-violet',
  sky: 'tint-sky',
  amber: 'tint-amber',
  emerald: 'tint-emerald',
  rose: 'tint-rose',
};

const TEXTURE_CLASS: Record<SectionTexture, string> = {
  dots: 'bg-dots',
  blueprint: 'bg-blueprint',
};

interface SectionShellProps {
  /** 锚点 id（保持原 section 的 id 语义，如 projects / contact） */
  id?: string;
  /** 区块编号（mono 显示，如 "01"） */
  no?: string;
  /** 眉题文本，与编号一起渲染为 "01 / 精选项目" */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  tint?: SectionTint;
  /** 洗色改为从底部升起 */
  tintBottom?: boolean;
  texture?: SectionTexture;
  /** 纹理层上下淡出（避免与相邻区块的纹理生硬相接） */
  textureFade?: boolean;
  /** 透传给内容容器的额外类（如 max-w-5xl 收窄） */
  containerClassName?: string;
  /** 标题区下方留白收紧（默认 mb-10/14，紧凑场景可传 mb-6/8） */
  headerSpacing?: 'default' | 'tight';
  /** 内容收窄到 max-w-5xl（内容少的区块避免大容器显得空旷） */
  narrow?: boolean;
  children: React.ReactNode;
}

export const SectionShell = ({
  id,
  no,
  eyebrow,
  title,
  subtitle,
  tint,
  tintBottom,
  texture,
  textureFade,
  containerClassName,
  headerSpacing = 'default',
  narrow,
  children,
}: SectionShellProps) => (
  <section
    id={id}
    className={`relative overflow-hidden scroll-mt-20 ${tint ? TINT_CLASS[tint] : ''} ${tintBottom ? 'tint-bottom' : ''}`}
  >
    {texture && (
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none ${TEXTURE_CLASS[texture]} ${
          textureFade
            ? '[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]'
            : ''
        }`}
      />
    )}

    <div
      className={`relative ${narrow ? 'max-w-5xl' : 'max-w-7xl'} mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 ${containerClassName ?? ''}`}
    >
      <SectionReveal>
        <header className={headerSpacing === 'default' ? 'mb-10 md:mb-14' : 'mb-6 md:mb-8'}>
          {(no || eyebrow) && (
            <p className="eyebrow mb-3">
              {no && <span>{no}</span>}
              {no && eyebrow && <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />}
              {eyebrow && <span>{eyebrow}</span>}
            </p>
          )}
          <h2 className="shell-title">{title}</h2>
          {subtitle && <p className="shell-subtitle">{subtitle}</p>}
        </header>
      </SectionReveal>

      {children}
    </div>
  </section>
);
