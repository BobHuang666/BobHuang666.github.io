/**
 * 搜索 feature 的公共入口。
 * 其他层只允许通过该入口引用，搜索面板的实现细节不外泄。
 */
export { SearchProvider } from './SearchProvider';
export { useSearch } from './searchState';
export { SearchButton } from './SearchButton';
