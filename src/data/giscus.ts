/**
 * Giscus 评论配置
 * ----------------------------------------------------------------
 * 启用步骤（参考 https://giscus.app/zh-CN）：
 * 1. 仓库需 public
 * 2. 安装 giscus app: https://github.com/apps/giscus
 * 3. 开启 Discussions
 * 4. 在 https://giscus.app/zh-CN 生成并复制配置，填到下面
 * ----------------------------------------------------------------
 * 当 repoId 或 categoryId 为空时，组件会显示"未启用"提示
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
