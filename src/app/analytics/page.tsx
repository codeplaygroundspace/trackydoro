'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { ProjectDistribution, StatCard, WeeklyChart } from '@/components/analytics';
import AppHeader from '@/components/AppHeader';
import { CategoryForm, CategoryGrid } from '@/components/categories';
import Footer from '@/components/Footer';
import { ChevronLeftIcon, CollapseIcon, PlusIcon } from '@/components/icons';
import { Settings } from '@/components/Settings';
import { ConfirmDialog, KeyboardShortcuts, Modal } from '@/components/ui';
import { CategoryGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/hooks/useStore';
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
  const isLoading = useStore((state) => state.isLoading);
  const setLoading = useStore((state) => state.setLoading);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isProjectsExpanded, setIsProjectsExpanded] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [setLoading]);

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  // Generate analytics data
  const generateAnalyticsData = () => {
    // Today's stats
    const todaysStats = {
      focusTime: '3h 25m',
      pomodoros: '8',
      projects: categories.length.toString(),
      streak: '5 days',
    };

    // Weekly data (last 7 days)
    const weeklyData = [
      { day: 'Mon', minutes: 150, hours: '2h 30m' },
      { day: 'Tue', minutes: 200, hours: '3h 20m' },
      { day: 'Wed', minutes: 125, hours: '2h 5m' },
      { day: 'Thu', minutes: 175, hours: '2h 55m' },
      { day: 'Fri', minutes: 225, hours: '3h 45m' },
      { day: 'Sat', minutes: 100, hours: '1h 40m' },
      { day: 'Sun', minutes: 75, hours: '1h 15m' },
    ];

    // Project distribution data
    const projectData = categories
      .map((category, index) => {
        // Mock data - in real app, this would come from categoryData
        const mockMinutes = [180, 120, 90, 60, 45][index] || 30;
        const hours = Math.floor(mockMinutes / 60);
        const mins = mockMinutes % 60;
        return {
          name: category.name,
          minutes: mockMinutes,
          color: `oklch(var(--category-${category.colorKey}) / 1)`,
          hours: `${hours}h ${mins}m`,
        };
      })
      .slice(0, 5); // Show max 5 projects

    return { todaysStats, weeklyData, projectData };
  };

  const { todaysStats, weeklyData, projectData } = generateAnalyticsData();

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
    <>
      <main className="text-foreground relative" role="main">
        {/* Background */}
        <div className="fixed inset-0 bg-background">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/img/wallpaper02.jpeg)' }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Header - Fixed at top */}
        <div className="relative z-10 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <AppHeader
              onKeyboardClick={() => setShowKeyboardShortcuts(true)}
              onSettingsClick={() => setShowSettings(true)}
              onAnalyticsClick={() => router.push('/analytics')}
            />
          </div>
        </div>

        {/* Analytics Content */}
        <div className="relative z-10 min-h-screen">
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
                        <div className="text-xl">No Project Data Yet</div>
                        <div className="text-sm mt-2">
                          Add some projects above to see project distribution analytics
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Footer />
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
      </main>
    </>
  );
}
