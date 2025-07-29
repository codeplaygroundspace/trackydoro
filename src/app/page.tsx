'use client';

import { useState, useCallback, useEffect } from 'react';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { CategoryGrid, CategoryForm } from '@/components/categories';
import { Modal, ConfirmDialog, KeyboardShortcuts } from '@/components/ui';
import { TimerSkeleton, CategoryGridSkeleton } from '@/components/ui/LoadingSkeleton';
import { useStore } from '@/hooks/useStore';
import { useKeyboardShortcuts, useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { PlusIcon } from '@/components/icons';
import AppHeader from '@/components/AppHeader';
import { Category } from '@/types';
import About from '@/components/About';
import Footer from '@/components/Footer';

export default function Home() {
  // Get state and actions from Zustand store
  const categories = useStore((state) => state.categories);
  const categoryData = useStore((state) => state.categoryData);
  const selectedCategory = useStore((state) => state.selectedCategory);
  const setSelectedCategory = useStore((state) => state.setSelectedCategory);
  const addCategory = useStore((state) => state.addCategory);
  const updateCategory = useStore((state) => state.updateCategory);
  const deleteCategory = useStore((state) => state.deleteCategory);
  const recordPomodoro = useStore((state) => state.recordPomodoro);
  const pomodoroCount = useStore((state) => state.pomodoroCount);
  const incrementPomodoroCount = useStore((state) => state.incrementPomodoroCount);
  const isLoading = useStore((state) => state.isLoading);
  const setLoading = useStore((state) => state.setLoading);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

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
    incrementPomodoroCount();
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
      <main className="min-h-screen text-foreground p-4 md:p-8 relative" role="main">
        {/* Gradient background */}
        <div className="fixed inset-0 bg-background">
          <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 via-transparent to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <AppHeader onKeyboardClick={() => setShowKeyboardShortcuts(true)} />

          {isLoading ? (
            <>
              <TimerSkeleton />
              <CategoryGridSkeleton />
            </>
          ) : (
            <>
              <PomodoroTimer
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onPomodoroComplete={handlePomodoroComplete}
                pomodoroCount={pomodoroCount}
              />

              {/* Categories Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Projects{' '}
                  {categories.length > 0 && (
                    <span className="text-muted-foreground">({categories.length})</span>
                  )}
                </h2>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="flex items-center gap-2 bg-card hover:bg-card/70 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm font-medium"
                  aria-label="Add new category (Cmd/Ctrl+N)"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Project
                </button>
              </div>

              <CategoryGrid
                categories={categories}
                categoryData={categoryData}
                editingCategory={editingCategory}
                onEdit={setEditingCategory}
                onDelete={setDeletingCategory}
                editForm={(category) => (
                  <CategoryForm
                    initialValues={category}
                    onSubmit={(name, color, target) => {
                      updateCategory(category.id, name, color, target);
                      setEditingCategory(null);
                    }}
                    onCancel={() => setEditingCategory(null)}
                  />
                )}
              />
              <About />
              <Footer />
            </>
          )}
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

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcuts
          isOpen={showKeyboardShortcuts}
          onClose={() => setShowKeyboardShortcuts(false)}
        />
      </main>
    </>
  );
}
