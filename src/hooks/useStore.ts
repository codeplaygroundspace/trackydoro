import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, CategoryData, TIMER_CONSTANTS } from '@/types';

interface PomodoroStore {
  // State
  categories: Category[];
  categoryData: CategoryData[];
  selectedCategory: string;
  pomodoroCount: number;
  isLoading: boolean;
  
  // Actions
  addCategory: (name: string, color: string, target: number) => void;
  updateCategory: (id: string, name: string, color: string, target: number) => void;
  deleteCategory: (id: string) => void;
  setSelectedCategory: (id: string) => void;
  recordPomodoro: (categoryId: string) => void;
  incrementPomodoroCount: () => void;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Study', color: '#3b82f6', target: 90 },
  { id: '2', name: 'Work', color: '#8b5cf6', target: 120 },
  { id: '3', name: 'Exercise', color: '#10b981', target: 60 },
  { id: '4', name: 'Reading', color: '#f59e0b', target: 30 },
];

export const useStore = create<PomodoroStore>()(
  persist(
    (set) => ({
      // Initial state
      categories: DEFAULT_CATEGORIES,
      categoryData: [],
      selectedCategory: '',
      pomodoroCount: 0,
      isLoading: false,
      
      // Actions
      addCategory: (name, color, target) => {
        const newCategory: Category = {
          id: Date.now().toString(),
          name,
          color,
          target,
        };
        
        set((state) => ({
          categories: [...state.categories, newCategory],
          selectedCategory: state.categories.length === 0 ? newCategory.id : state.selectedCategory,
        }));
      },
      
      updateCategory: (id, name, color, target) => {
        set((state) => ({
          categories: state.categories.map((cat) =>
            cat.id === id ? { ...cat, name, color, target } : cat
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
        
        set((state) => {
          const updatedData = [...state.categoryData];
          const categoryIndex = updatedData.findIndex((c) => c.categoryId === categoryId);
          
          if (categoryIndex === -1) {
            updatedData.push({
              categoryId,
              days: [{ date: today, minutes: TIMER_CONSTANTS.WORK_MINUTES, pomodoros: 1 }],
            });
          } else {
            const dayIndex = updatedData[categoryIndex].days.findIndex((d) => d.date === today);
            if (dayIndex === -1) {
              updatedData[categoryIndex].days.push({
                date: today,
                minutes: TIMER_CONSTANTS.WORK_MINUTES,
                pomodoros: 1,
              });
            } else {
              updatedData[categoryIndex].days[dayIndex].minutes += TIMER_CONSTANTS.WORK_MINUTES;
              updatedData[categoryIndex].days[dayIndex].pomodoros += 1;
            }
          }
          
          return { categoryData: updatedData };
        });
      },
      
      incrementPomodoroCount: () => {
        set((state) => ({ pomodoroCount: state.pomodoroCount + 1 }));
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'pomodoro-storage',
    }
  )
);