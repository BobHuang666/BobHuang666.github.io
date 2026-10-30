/**
 * giscus 评论配置；启用步骤见 README。
 * repoId 或 categoryId 为空时，评论区显示「未启用」提示。
 */
export const giscusConfig = {
  repo: 'BobHuang666/BobHuang666.github.io' as `${string}/${string}`,
  repoId: 'R_kgDOPdtXIg',
  category: 'General',
  categoryId: 'DIC_kwDOPdtXIs4C-Nls',
  mapping: 'pathname' as const,
  strict: '0' as const,
  reactionsEnabled: '1' as const,
  emitMetadata: '0' as const,
  inputPosition: 'top' as const,
  lang: 'zh-CN' as const,
  loading: 'lazy' as const,
};

export const isGiscusEnabled = () =>
  Boolean(giscusConfig.repoId && giscusConfig.categoryId);
