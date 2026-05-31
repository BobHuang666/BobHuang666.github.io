import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** 默认 fade-up，可选 fade、scale */
  variant?: 'fade-up' | 'fade' | 'scale';
}

/** 通用：滚动进入视口时淡入向上滑入 */
export const SectionReveal = ({
  children,
  delay = 0,
  className = '',
  variant = 'fade-up',
}: SectionRevealProps) => {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  const variants = {
    'fade-up': { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 } },
    fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
    scale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
  }[variant];

  return (
    <motion.div
      className={className}
      initial={variants.initial}
      whileInView={variants.animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};
