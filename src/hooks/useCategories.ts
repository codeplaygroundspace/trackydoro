'use client';

import { useState, useEffect } from 'react';
import { Category, CategoryData, TIMER_CONSTANTS } from '@/types';
import { useLocalStorage } from './useLocalStorage';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Study', color: '#3b82f6', target: 90 },
  { id: '2', name: 'Work', color: '#8b5cf6', target: 120 },
  { id: '3', name: 'Exercise', color: '#10b981', target: 60 },
  { id: '4', name: 'Reading', color: '#f59e0b', target: 30 },
];

export function useCategories() {
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', DEFAULT_CATEGORIES);
  const [categoryData, setCategoryData] = useLocalStorage<CategoryData[]>('lifeTrackerData', []);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data (in a real app, this would be an API call)
    const loadData = async () => {
      setIsLoading(true);

      // Small delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Only set selected category after hydration
      if (!isInitialized && categories.length > 0) {
        setSelectedCategory(categories[0].id);
        setIsInitialized(true);
      }

      setIsLoading(false);
    };

    loadData();
  }, [categories.length, isInitialized]);

  const addCategory = (name: string, color: string, target: number) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      target,
    };

    setCategories((prev) => [...prev, newCategory]);

    if (categories.length === 0) {
      setSelectedCategory(newCategory.id);
    }
  };

  const updateCategory = (id: string, name: string, color: string, target: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name, color, target } : cat)),
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));

    if (selectedCategory === id && categories.length > 1) {
      const remaining = categories.filter((cat) => cat.id !== id);
      if (remaining.length > 0) {
        setSelectedCategory(remaining[0].id);
      }
    }

    setCategoryData((prev) => prev.filter((data) => data.categoryId !== id));
  };

  const recordPomodoro = (categoryId: string) => {
    const today = new Date().toISOString().split('T')[0];

    setCategoryData((prev) => {
      const updated = [...prev];
      const categoryIndex = updated.findIndex((c) => c.categoryId === categoryId);

      if (categoryIndex === -1) {
        updated.push({
          categoryId,
          days: [{ date: today, minutes: TIMER_CONSTANTS.WORK_MINUTES, pomodoros: 1 }],
        });
      } else {
        const dayIndex = updated[categoryIndex].days.findIndex((d) => d.date === today);
        if (dayIndex === -1) {
          updated[categoryIndex].days.push({
            date: today,
            minutes: TIMER_CONSTANTS.WORK_MINUTES,
            pomodoros: 1,
          });
        } else {
          updated[categoryIndex].days[dayIndex].minutes += TIMER_CONSTANTS.WORK_MINUTES;
          updated[categoryIndex].days[dayIndex].pomodoros += 1;
        }
      }

      return updated;
    });
  };

  return {
    categories,
    categoryData,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    recordPomodoro,
    isLoading,
  };
}
