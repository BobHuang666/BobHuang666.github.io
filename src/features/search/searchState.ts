/** 搜索开关状态 Context 与 useSearch Hook */
import { createContext, useContext } from 'react';

export interface SearchContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const SearchContext = createContext<SearchContextValue | undefined>(undefined);

/** 访问搜索开关状态；必须在 SearchProvider 内使用 */
export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
