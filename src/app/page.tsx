'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import About from '@/components/About';
import AppHeader from '@/components/AppHeader';
import { CategoryForm, CategoryGrid } from '@/components/categories';
import Footer from '@/components/Footer';
import { CollapseIcon, PlusIcon } from '@/components/icons';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { Settings } from '@/components/Settings';
import { ConfirmDialog, KeyboardShortcuts, Modal } from '@/components/ui';
import { CategoryGridSkeleton, TimerSkeleton } from '@/components/ui/LoadingSkeleton';
import { useGlobalKeyboardShortcuts, useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useStore } from '@/hooks/useStore';
import { Category } from '@/types';

export default function Home() {
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

  const handlePomodoroComplete = (categoryId: string) => {
    recordPomodoro(categoryId);
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
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
    <>
      <main className="text-foreground relative" role="main">
        {/* Wallpaper background */}
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

        {/* Full-height timer section */}
        <div className="relative z-10 min-h-screen">
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <TimerSkeleton />
            </div>
          ) : (
            <PomodoroTimer
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onPomodoroComplete={handlePomodoroComplete}
            />
          )}
        </div>

        {/* Projects section - Scrollable below timer */}
        <div className="relative z-10 bg-background/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {!isLoading && (
              <>
                {/* Categories Section Header */}
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
                <About />
                <Footer />
              </>
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
