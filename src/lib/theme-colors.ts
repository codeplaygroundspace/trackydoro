// Category keys (we use CSS variables for actual color values)
export const CATEGORY_COLOR_KEYS = [
  'emerald',
  'blue',
  'purple',
  'amber',
  'red',
  'teal',
  'pink',
  'indigo',
  'lime',
  'orange',
] as const;

export type CategoryColorKey = (typeof CATEGORY_COLOR_KEYS)[number];

// Convert old hex colors to new color keys for migration
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
