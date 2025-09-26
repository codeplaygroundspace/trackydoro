'use client';

import { useCallback, useState } from 'react';

import {
  PeakProductivityTimes,
  StatCard,
  WeeklyChart,
  WeeklyTimeDistribution,
} from '@/components/analytics';
import { CategoryForm, CategoryGrid } from '@/components/categories';
import Footer from '@/components/Footer';
import { PlusIcon } from '@/components/icons';
import PageHeader from '@/components/PageHeader';
import { ConfirmDialog, Modal } from '@/components/ui';
import { CategoryGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppLoading } from '@/hooks';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/store/useStore';
import { Category } from '@/types';

export default function AnalyticsPage() {
  // Get state and actions from Zustand store
  const categories = useStore((state) => state.categories);
  const categoryData = useStore((state) => state.categoryData);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const addCategory = useStore((state) => state.addCategory);
  const updateCategory = useStore((state) => state.updateCategory);
  const deleteCategory = useStore((state) => state.deleteCategory);
  const recordPomodoro = useStore((state) => state.recordPomodoro);

  // Use consolidated loading hook
  const isLoading = useAppLoading();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  // Generate analytics data from real store data
  const generateAnalyticsData = () => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Helper function to format minutes to readable time
    const formatMinutes = (minutes: number): string => {
      if (minutes === 0) return '0m';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0) return `${mins}m`;
      if (mins === 0) return `${hours}h`;
      return `${hours}h ${mins}m`;
    };

    // Calculate today's stats
    let todayTotalPomodoros = 0;
    let todayTotalMinutes = 0;

    categoryData.forEach((category) => {
      const todayData = category.days.find((day) => day.date === today);
      if (todayData) {
        todayTotalPomodoros += todayData.pomodoros;
        todayTotalMinutes += todayData.minutes;
      }
    });

    // Calculate streak (consecutive days with at least 1 pomodoro)
    let streak = 0;
    let checkDate = new Date(now);

    while (streak < 365) {
      // Max reasonable streak check
      const dateStr = checkDate.toISOString().split('T')[0];
      let dayHasPomodoros = false;

      for (const category of categoryData) {
        const dayData = category.days.find((day) => day.date === dateStr);
        if (dayData && dayData.pomodoros > 0) {
          dayHasPomodoros = true;
          break;
        }
      }

      if (dayHasPomodoros) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // If today has no pomodoros but we're checking today, continue to yesterday
        if (dateStr === today && todayTotalPomodoros === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    const todaysStats = {
      focusTime: formatMinutes(todayTotalMinutes),
      pomodoros: todayTotalPomodoros.toString(),
      projects: categories.length.toString(),
      streak: streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : '0 days',
    };

    // Generate weekly data (last 7 days)
    const weeklyData = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = dayNames[date.getDay()];

      let dayMinutes = 0;
      categoryData.forEach((category) => {
        const dayData = category.days.find((day) => day.date === dateStr);
        if (dayData) {
          dayMinutes += dayData.minutes;
        }
      });

      weeklyData.push({
        day: dayName,
        minutes: dayMinutes,
        hours: formatMinutes(dayMinutes),
      });
    }

    // Generate project distribution data
    const projectData = categories
      .map((category) => {
        // Calculate total minutes for this project across all time
        const categoryDataEntry = categoryData.find((c) => c.categoryId === category.id);
        const totalMinutes = categoryDataEntry
          ? categoryDataEntry.days.reduce((sum, day) => sum + day.minutes, 0)
          : 0;

        return {
          name: category.name,
          minutes: totalMinutes,
          color: `oklch(var(--category-${category.colorKey}) / 1)`,
          hours: formatMinutes(totalMinutes),
        };
      })
      .filter((project) => project.minutes > 0) // Only show projects with recorded time
      .sort((a, b) => b.minutes - a.minutes) // Sort by most time spent
      .slice(0, 5); // Show max 5 projects

    // Generate hourly productivity data
    // In a real app, this would come from actual timestamps of completed pomodoros
    // For now, we'll generate sample data that looks realistic
    const hourlyData = [];

    // Generate 24 hours of data
    for (let i = 0; i < 24; i++) {
      // Format hour for display (e.g., "9 AM", "2 PM")
      const displayHour =
        i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;

      // Hour for data key (00, 01, etc.)
      const hour = i.toString().padStart(2, '0');

      // Generate a realistic pattern with higher productivity during work hours
      // and lower productivity in early morning/late night
      let count = 0;

      if (i >= 9 && i <= 11) {
        // Morning peak (9 AM - 11 AM)
        count = Math.floor(Math.random() * 3) + 2; // 2-4 pomodoros
      } else if (i >= 14 && i <= 16) {
        // Afternoon peak (2 PM - 4 PM)
        count = Math.floor(Math.random() * 3) + 1; // 1-3 pomodoros
      } else if (i >= 6 && i <= 20) {
        // Regular work hours (6 AM - 8 PM)
        count = Math.floor(Math.random() * 2); // 0-1 pomodoros
      } else {
        // Late night/early morning (9 PM - 5 AM)
        count = 0; // No pomodoros
      }

      hourlyData.push({
        hour,
        displayHour,
        count,
      });
    }

    return { todaysStats, weeklyData, projectData, hourlyData };
  };

  const { todaysStats, weeklyData, projectData, hourlyData } = generateAnalyticsData();

  // Handle category navigation with arrow keys
  const handleCategoryNavigation = useCallback(
    (direction: 'up' | 'down') => {
      if (categories.length === 0) return;

      const currentIndex = categories.findIndex((cat) => cat.id === selectedCategory);
      let newIndex: number;

      if (direction === 'up') {
        newIndex = currentIndex <= 0 ? categories.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex >= categories.length - 1 ? 0 : currentIndex + 1;
      }

      setSelectedCategory(categories[newIndex].id);
    },
    [categories, selectedCategory, setSelectedCategory],
  );

  const { modifierKey } = useGlobalKeyboardShortcuts();

  // Keyboard shortcuts for category management
  useKeyboardShortcuts(
    [
      {
        key: 'n',
        ctrl: modifierKey === 'ctrl',
        cmd: modifierKey === 'cmd',
        handler: () => setShowAddCategory(true),
      },
      {
        key: 'ArrowUp',
        handler: () => handleCategoryNavigation('up'),
      },
      {
        key: 'ArrowDown',
        handler: () => handleCategoryNavigation('down'),
      },
      // Number keys for quick category selection
      ...Array.from({ length: 9 }, (_, i) => ({
        key: String(i + 1),
        handler: () => {
          if (categories[i]) {
            setSelectedCategory(categories[i].id);
          }
        },
      })),
    ],
    !isLoading,
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main background */}
      <div className="fixed inset-0 bg-background"></div>

      <main className="flex-grow text-foreground p-4 md:p-8 relative">
        <div className="max-w-7xl mx-auto">
          <PageHeader />

          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            </div>

            {!isLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Projects */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-border/20">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground">
                        Projects ({categories.length})
                      </h2>
                      <button
                        onClick={() => setShowAddCategory(true)}
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1.5 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium"
                        aria-label="Add new category (Cmd/Ctrl+N)"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add
                      </button>
                    </div>
                    <CategoryGrid
                      categories={categories}
                      categoryData={categoryData}
                      editingCategory={editingCategory}
                      onEdit={setEditingCategory}
                      onDelete={setDeletingCategory}
                      editForm={(category: Category) => (
                        <CategoryForm
                          initialValues={category}
                          onSubmit={(name, colorKey, target) => {
                            updateCategory(category.id, name, colorKey, target);
                            setEditingCategory(null);
                          }}
                          onCancel={() => setEditingCategory(null)}
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Right Column: Analytics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Today's Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Focus Time" value={todaysStats.focusTime} icon="⏱️" />
                    <StatCard title="Pomodoros" value={todaysStats.pomodoros} icon="🍅" />
                    <StatCard title="Projects" value={todaysStats.projects} icon="📝" />
                    <StatCard title="Streak" value={todaysStats.streak} icon="🔥" />
                  </div>

                  {/* Charts */}
                  <WeeklyChart data={weeklyData} />
                  <WeeklyTimeDistribution data={projectData} />
                  <PeakProductivityTimes data={hourlyData} />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <CategoryGridSkeleton />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </main>

      {/* Add Project Modal */}
      <Modal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)}>
        <h3 className="text-xl font-semibold mb-4">Add New Project</h3>
        <CategoryForm
          onSubmit={(name, color, target) => {
            addCategory(name, color, target);
            setShowAddCategory(false);
          }}
          onCancel={() => setShowAddCategory(false)}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        title={`Delete "${deletingCategory?.name}" project?`}
        message={
          <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-muted-foreground">
            <li>This cannot be undone</li>
            <li>Deletion will remove all tracking data for this project</li>
          </ul>
        }
        confirmText="Delete"
      />
    </div>
  );
}
