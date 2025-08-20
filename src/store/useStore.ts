'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { type CategoryColorKey, COLOR_MIGRATION_MAP } from '@/lib/theme-colors';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Category, CategoryData } from '@/types';

interface PomodoroStore {
  // State
  categories: Category[];
  categoryData: CategoryData[];
  selectedCategory: string;
  isLoading: boolean;

  // Actions
  addCategory: (name: string, colorKey: CategoryColorKey, target: number) => void;
  updateCategory: (id: string, name: string, colorKey: CategoryColorKey, target: number) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategory: (id: string) => void;
  recordPomodoro: (categoryId: string) => void;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Study', colorKey: 'blue', target: 90 },
  { id: '2', name: 'Work', colorKey: 'purple', target: 120 },
  { id: '3', name: 'Exercise', colorKey: 'emerald', target: 60 },
  { id: '4', name: 'Reading', colorKey: 'amber', target: 30 },
];

export const useStore = create<PomodoroStore>()(
  persist(
    (set) => ({
      // Initial state
      categories: DEFAULT_CATEGORIES,
      categoryData: [],
      selectedCategory: '',
      isLoading: false,

      // Actions
      addCategory: (name, colorKey, target) => {
        const newCategory: Category = {
          id: Date.now().toString(),
          name,
          colorKey,
          target,
        };

        set((state) => ({
          categories: [...state.categories, newCategory],
          selectedCategory: state.categories.length === 0 ? newCategory.id : state.selectedCategory,
        }));
      },

      updateCategory: (id, name, colorKey, target) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, name, colorKey, target } : cat,
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => {
          const newCategories = state.categories.filter((cat) => cat.id !== id);
          const newCategoryData = state.categoryData.filter((data) => data.categoryId !== id);

          let newSelectedCategory = state.selectedCategory;
          if (state.selectedCategory === id && newCategories.length > 0) {
            newSelectedCategory = newCategories[0].id;
          }

          return {
            categories: newCategories,
            categoryData: newCategoryData,
            selectedCategory: newSelectedCategory,
          };
        });
      },

      setSelectedCategory: (id) => set({ selectedCategory: id }),

      recordPomodoro: (categoryId) => {
        const today = new Date().toISOString().split('T')[0];
        const { pomodoro } = useSettingsStore.getState();

        set((state) => {
          const updatedData = [...state.categoryData];
          const categoryIndex = updatedData.findIndex((c) => c.categoryId === categoryId);

          if (categoryIndex === -1) {
            updatedData.push({
              categoryId,
              days: [{ date: today, minutes: pomodoro, pomodoros: 1 }],
            });
          } else {
            const dayIndex = updatedData[categoryIndex].days.findIndex((d) => d.date === today);
            if (dayIndex === -1) {
              updatedData[categoryIndex].days.push({
                date: today,
                minutes: pomodoro,
                pomodoros: 1,
              });
            } else {
              updatedData[categoryIndex].days[dayIndex].minutes += pomodoro;
              updatedData[categoryIndex].days[dayIndex].pomodoros += 1;
            }
          }

          return { categoryData: updatedData };
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'pomodoro-storage',
      version: 1,
      migrate: (persistedState: any) => {
        if (!persistedState || !Array.isArray(persistedState.categories)) return persistedState;

        const migratedCategories = persistedState.categories.map((cat: any) => {
          if (cat && typeof cat === 'object') {
            if ('colorKey' in cat) return cat; // already migrated
            const hex: string | undefined = cat.color;
            const colorKey: CategoryColorKey =
              (hex && COLOR_MIGRATION_MAP[hex.toLowerCase() as keyof typeof COLOR_MIGRATION_MAP]) ||
              'blue';
            const { color: _omit, ...rest } = cat;
            return { ...rest, colorKey };
          }
          return cat;
        });

        return {
          ...persistedState,
          categories: migratedCategories,
        };
      },
    },
  ),
);

export const selectTodaySummary = (state: PomodoroStore) => {
  const today = new Date().toISOString().split('T')[0];
  let totalPomodoros = 0;
  let totalMinutes = 0;

  state.categoryData.forEach((category) => {
    const todayData = category.days.find((day) => day.date === today);
    if (todayData) {
      totalPomodoros += todayData.pomodoros;
      totalMinutes += todayData.minutes;
    }
  });

  return { totalPomodoros, totalMinutes };
};
