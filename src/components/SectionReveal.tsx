import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** 动画变体 */
  variant?: 'fade-up' | 'fade' | 'scale' | 'slide-left' | 'slide-right';
  /** 自定义 margin，用于提前/延迟触发 */
  margin?: string;
}

const VARIANTS = {
  'fade-up':    { initial: { opacity: 0, y: 28 },       animate: { opacity: 1, y: 0 } },
  'fade':       { initial: { opacity: 0 },               animate: { opacity: 1 } },
  'scale':      { initial: { opacity: 0, scale: 0.94 },  animate: { opacity: 1, scale: 1 } },
  'slide-left': { initial: { opacity: 0, x: -32 },       animate: { opacity: 1, x: 0 } },
  'slide-right':{ initial: { opacity: 0, x: 32 },        animate: { opacity: 1, x: 0 } },
};

/** 通用：滚动进入视口时渐入动画，支持多种方向 */
export const SectionReveal = ({
  children,
  delay = 0,
  className = '',
  variant = 'fade-up',
  margin = '-60px',
}: SectionRevealProps) => {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  const { initial, animate } = VARIANTS[variant];

  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.22, 1, 0.36, 1], // custom ease-out-expo
      }}
    >
      {children}
    </motion.div>
  );
};
