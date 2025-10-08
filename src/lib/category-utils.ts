import type { Category, CategoryData, DayData } from '@/types';

/**
 * Category-related utility functions for data processing and calculations
 */

/**
 * Get category data by category ID
 */
export const getCategoryData = (categoryData: CategoryData[], categoryId: string): DayData[] => {
  const data = categoryData.find((c) => c.categoryId === categoryId);
  return data?.days || [];
};

/**
 * Get day data for a specific category and date
 */
export const getDayData = (
  categoryData: CategoryData[],
  categoryId: string,
  date: string | null,
): { minutes: number; pomodoros: number } => {
  if (!date) return { minutes: 0, pomodoros: 0 };
  const categoryDays = getCategoryData(categoryData, categoryId);
  const day = categoryDays.find((d) => d.date === date);
  return day || { minutes: 0, pomodoros: 0 };
};

/**
 * Calculate the color for a category square based on progress
 */
export const getSquareColor = (
  categoryData: CategoryData[],
  category: Category,
  date: string | null,
): string => {
  if (!date) return 'transparent';
  const { minutes } = getDayData(categoryData, category.id, date);
  if (minutes === 0) return 'var(--muted)';

  const percentage = Math.min(minutes / category.target, 1);
  const opacity = 0.2 + percentage * 0.8;
  return `oklch(var(--category-${category.colorKey}) / ${opacity})`;
};

/**
 * Calculate today's progress percentage for a category
 */
export const getTodayProgress = (
  categoryData: CategoryData[],
  category: Category,
  today: string,
): number => {
  const { minutes } = getDayData(categoryData, category.id, today);
  return Math.round((minutes / category.target) * 100);
};

/**
 * Get category background color
 */
export const getCategoryBackgroundColor = (category: Category): string => {
  return `oklch(var(--category-${category.colorKey}) / 1)`;
};

/**
 * Calendar constants
 */
export const WEEKDAY_HEADERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

/**
 * Get today's date string in ISO format
 */
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};
