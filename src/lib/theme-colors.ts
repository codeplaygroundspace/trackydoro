/**
 * Theme-aware color palette for categories
 * Uses OKLCH color space for better color manipulation and theme adaptation
 */

export const CATEGORY_COLORS = {
  emerald: {
    light: 'oklch(69.53% 0.177 162.03)', // Vibrant green for light theme
    dark: 'oklch(78.53% 0.147 162.03)', // Brighter for dark theme
  },
  blue: {
    light: 'oklch(60.16% 0.24 265.52)', // Matches your primary blue
    dark: 'oklch(70.16% 0.20 265.52)', // Lighter for dark theme
  },
  purple: {
    light: 'oklch(59.21% 0.227 283.71)', // Rich purple
    dark: 'oklch(69.21% 0.187 283.71)', // Lighter purple
  },
  amber: {
    light: 'oklch(74.56% 0.154 70.08)', // Warm amber
    dark: 'oklch(84.56% 0.124 70.08)', // Brighter amber
  },
  red: {
    light: 'oklch(62.80% 0.231 25.34)', // Vibrant red
    dark: 'oklch(72.80% 0.181 25.34)', // Lighter red
  },
  teal: {
    light: 'oklch(64.99% 0.153 180.72)', // Cool teal
    dark: 'oklch(74.99% 0.123 180.72)', // Brighter teal
  },
  pink: {
    light: 'oklch(66.93% 0.223 358.41)', // Soft pink
    dark: 'oklch(76.93% 0.173 358.41)', // Lighter pink
  },
  indigo: {
    light: 'oklch(55.98% 0.213 274.04)', // Deep indigo
    dark: 'oklch(65.98% 0.173 274.04)', // Lighter indigo
  },
  lime: {
    light: 'oklch(74.60% 0.213 127.39)', // Fresh lime
    dark: 'oklch(84.60% 0.163 127.39)', // Brighter lime
  },
  orange: {
    light: 'oklch(68.10% 0.195 41.15)', // Warm orange
    dark: 'oklch(78.10% 0.155 41.15)', // Lighter orange
  },
} as const;

export type CategoryColorKey = keyof typeof CATEGORY_COLORS;

/**
 * Get color value based on current theme
 */
export function getCategoryColor(colorKey: CategoryColorKey, isDark: boolean): string {
  return CATEGORY_COLORS[colorKey][isDark ? 'dark' : 'light'];
}

/**
 * Get all category colors for current theme
 */
export function getCategoryColorPalette(isDark: boolean): string[] {
  return Object.values(CATEGORY_COLORS).map((color) => color[isDark ? 'dark' : 'light']);
}

/**
 * Convert old hex colors to new color keys for migration
 */
export const COLOR_MIGRATION_MAP: Record<string, CategoryColorKey> = {
  '#10b981': 'emerald',
  '#3b82f6': 'blue',
  '#8b5cf6': 'purple',
  '#f59e0b': 'amber',
  '#ef4444': 'red',
  '#14b8a6': 'teal',
  '#ec4899': 'pink',
  '#6366f1': 'indigo',
  '#84cc16': 'lime',
  '#f97316': 'orange',
};
