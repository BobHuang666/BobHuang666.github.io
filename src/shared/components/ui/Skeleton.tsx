/**
 * 骨架屏基础组件 + 常见布局变体
 * 使用纯 Tailwind animate-pulse，无额外依赖
 */

/** 单行骨架块 */
export const SkeletonLine = ({ className = '' }: { className?: string }) => (
  <div className={`h-3.5 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse ${className}`} />
);

/** 矩形骨架块 */
export const SkeletonRect = ({ className = '' }: { className?: string }) => (
  <div className={`rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse ${className}`} />
);

/** 博客/项目卡片骨架 */
export const CardSkeleton = () => (
  <div className="card-base p-6 space-y-4">
    <SkeletonRect className="h-40 mb-4" />
    <div className="flex gap-2">
      <SkeletonLine className="w-16" />
      <SkeletonLine className="w-10 ml-auto" />
    </div>
    <SkeletonLine className="w-3/4 h-4" />
    <SkeletonLine className="w-full" />
    <SkeletonLine className="w-5/6" />
    <SkeletonLine className="w-2/3" />
    <div className="flex gap-2 pt-2">
      <SkeletonLine className="w-14 h-6 rounded-full" />
      <SkeletonLine className="w-14 h-6 rounded-full" />
    </div>
  </div>
);

/** 页面全屏加载态（路由懒加载时的 Suspense fallback） */
export const PageSkeleton = () => (
  <div className="min-h-[60vh] px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
    {/* 标题骨架 */}
    <div className="mb-10 space-y-3">
      <SkeletonLine className="w-40 h-6" />
      <SkeletonLine className="w-72 h-4" />
    </div>
    {/* 卡片网格骨架 */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);
