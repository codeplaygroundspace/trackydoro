'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

import { ProjectDistribution, StatCard, WeeklyChart } from '@/components/analytics';
import { CategoryForm, CategoryGrid } from '@/components/categories';
import { ChevronLeftIcon, CollapseIcon, PlusIcon } from '@/components/icons';
import { AppLayout } from '@/components/layouts';
import { Settings } from '@/components/Settings';
import { ConfirmDialog, KeyboardShortcuts, Modal } from '@/components/ui';
import { CategoryGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { useAppLoading } from '@/hooks';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/store/useStore';
import { Category } from '@/types';

export default function Analytics() {
  const router = useRouter();

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
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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

    return { todaysStats, weeklyData, projectData };
  };

  const { todaysStats, weeklyData, projectData } = generateAnalyticsData();

  // Development helper: Add sample data if no pomodoros have been completed yet
  const addSampleData = () => {
    if (process.env.NODE_ENV === 'development') {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Add some sample pomodoros for different categories
      recordPomodoro('1'); // Study
      recordPomodoro('1');
      recordPomodoro('2'); // Work
      recordPomodoro('2');
      recordPomodoro('2');
      recordPomodoro('3'); // Exercise
    }
  };

  const { modifierKey } = useGlobalKeyboardShortcuts();

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
      {
        key: '?',
        handler: () => setShowKeyboardShortcuts(true),
      },
      {
        key: 's',
        handler: () => setShowSettings(true),
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
    <AppLayout
      onKeyboardShortcuts={() => setShowKeyboardShortcuts(true)}
      onSettings={() => setShowSettings(true)}
    >
      {/* Analytics Content */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* Back button and page title */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 bg-card hover:bg-card/70 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium"
              aria-label="Back to timer"
            >
              <ChevronLeftIcon className="w-4 h-4" />
              Back to Timer
            </button>
            <h1 className="text-2xl font-bold text-foreground">Analytics & Projects</h1>
          </div>

          {!isLoading ? (
            <>
              {/* Projects Section */}
              <div className="bg-background/95 backdrop-blur-sm rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsProjectsExpanded(!isProjectsExpanded)}
                      className="p-1 hover:bg-card/50 rounded transition-colors cursor-pointer"
                      aria-label={isProjectsExpanded ? 'Collapse projects' : 'Expand projects'}
                    >
                      <CollapseIcon
                        className="w-4 h-4 text-muted-foreground"
                        isExpanded={isProjectsExpanded}
                      />
                    </button>
                    <h2 className="text-lg font-semibold text-foreground">
                      Projects{' '}
                      {categories.length > 0 && (
                        <span className="text-muted-foreground">({categories.length})</span>
                      )}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowAddCategory(true)}
                    className="flex items-center gap-2 bg-card hover:bg-card/70 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium"
                    aria-label="Add new category (Cmd/Ctrl+N)"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Project
                  </button>
                </div>

                {isProjectsExpanded && (
                  <CategoryGrid
                    categories={categories}
                    categoryData={categoryData}
                    editingCategory={editingCategory}
                    onEdit={setEditingCategory}
                    onDelete={setDeletingCategory}
                    editForm={(category) => (
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
                )}
              </div>

              {/* Analytics Dashboard */}
              <div className="space-y-6">
                {/* Today's Summary */}
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    Today&apos;s Summary
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard title="Focus Time" value={todaysStats.focusTime} icon="⏱️" />
                    <StatCard title="Pomodoros" value={todaysStats.pomodoros} icon="🍅" />
                    <StatCard title="Projects" value={todaysStats.projects} icon="📝" />
                    <StatCard title="Streak" value={todaysStats.streak} icon="🔥" />
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <WeeklyChart data={weeklyData} />
                  {projectData.length > 0 && <ProjectDistribution data={projectData} />}
                </div>

                {projectData.length === 0 && (
                  <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="text-6xl mb-4">📊</div>
                      <div className="text-xl">No Analytics Data Yet</div>
                      <div className="text-sm mt-2">
                        Complete some pomodoros to see your analytics and progress
                      </div>
                      {process.env.NODE_ENV === 'development' && (
                        <button
                          onClick={addSampleData}
                          className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          Add Sample Data (Dev Only)
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <CategoryGridSkeleton />
            </div>
          )}
        </div>
      </div>

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

      {/* Keyboard modal */}
      <Modal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)}>
        <KeyboardShortcuts onClose={() => setShowKeyboardShortcuts(false)} />
      </Modal>

      {/* Settings modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)}>
        <Settings onClose={() => setShowSettings(false)} />
      </Modal>
    </AppLayout>
  );
}
