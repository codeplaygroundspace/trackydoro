'use client';

import { useState } from 'react';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { CategoryGrid, CategoryForm } from '@/components/categories';
import { Modal, ConfirmDialog } from '@/components/ui';
import { useCategories, usePomodoroTracking } from '@/hooks';
import { Category } from '@/types';

export default function Home() {
  const {
    categories,
    categoryData,
    selectedCategory,
    setSelectedCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    recordPomodoro,
  } = useCategories();

  const { pomodoroCount, incrementPomodoro } = usePomodoroTracking();

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const handlePomodoroComplete = (categoryId: string) => {
    recordPomodoro(categoryId);
    incrementPomodoro();
  };

  const handleDeleteCategory = () => {
    if (deletingCategory) {
      deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Trackydoro
          </h1>
          <button
            onClick={() => setShowAddCategory(true)}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-all duration-200"
            aria-label="Add category"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        <PomodoroTimer
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onPomodoroComplete={handlePomodoroComplete}
          pomodoroCount={pomodoroCount}
        />

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

        {/* Progress Legend */}
        <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map((value) => (
              <div
                key={value}
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor:
                    value === 0
                      ? '#1f2937'
                      : `#3b82f6${Math.round((value / 100) * 255)
                          .toString(16)
                          .padStart(2, '0')}`,
                }}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Add Category Modal */}
      <Modal isOpen={showAddCategory} onClose={() => setShowAddCategory(false)}>
        <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
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
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This will remove all tracking data for this category and cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}
