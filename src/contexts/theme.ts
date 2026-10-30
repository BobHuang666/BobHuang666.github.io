/** 主题 Context 与 useTheme Hook */
import { createContext, useContext } from 'react';

export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'bh:theme';

export interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/** 读取 / 切换当前主题；必须在 ThemeProvider 内使用 */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
