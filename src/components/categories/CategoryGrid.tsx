'use client';

import { Category, CategoryData } from '@/types';

import { CategoryRow } from './CategoryRow';

interface CategoryGridProps {
  categories: Category[];
  categoryData: CategoryData[];
  editingCategory: string | null;
  onEdit: (categoryId: string) => void;
  onDelete: (category: Category) => void;
  editForm: (category: Category) => React.ReactNode;
}

export function CategoryGrid({
  categories,
  categoryData,
  editingCategory,
  onEdit,
  onDelete,
  editForm,
}: CategoryGridProps) {
  const getCategoryData = (categoryId: string) => {
    const data = categoryData.find((c) => c.categoryId === categoryId);
    return data?.days || [];
  };

  if (categories.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="text-6xl mb-4">📝</div>
        <div className="text-xl">No projects yet!</div>
        <div className="text-sm mt-2">Click &quot;Add Project&quot; to get started</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <CategoryRow
          key={category.id}
          category={category}
          categoryData={getCategoryData(category.id)}
          onEdit={() => onEdit(category.id)}
          onDelete={onDelete}
          isEditing={editingCategory === category.id}
          editForm={editingCategory === category.id ? editForm(category) : undefined}
        />
      ))}
    </div>
  );
}
