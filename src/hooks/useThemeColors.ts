'use client';

import { useTheme } from '@/components/theme/ThemeProvider';
import { getCategoryColor, getCategoryColorPalette, CategoryColorKey } from '@/lib/theme-colors';

export function useThemeColors() {
  const { theme } = useTheme();

  // Resolve the actual theme if it's set to 'system'
  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return {
    getCategoryColor: (colorKey: CategoryColorKey) => getCategoryColor(colorKey, isDark),
    categoryColorPalette: getCategoryColorPalette(isDark),
    isDark,
  };
}
