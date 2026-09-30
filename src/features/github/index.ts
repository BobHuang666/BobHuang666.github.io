/**
 * GitHub feature 的公共入口。
 * 跨 feature（如首页）只允许通过该入口引用，避免依赖内部实现文件。
 */
export { default as GitHubCard } from './GitHubCard';
export { default as GitHubHeatmap } from './GitHubHeatmap';
