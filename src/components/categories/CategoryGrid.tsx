'use client';

import { Reorder } from 'framer-motion';

import { DragIcon, EditIcon, TrashIcon } from '@/components/icons';
import {
  getCategoryBackgroundColor,
  getCategoryData,
  getDayData,
  getSquareColor,
  getTodayProgress,
  getTodayString,
  WEEKDAY_HEADERS,
} from '@/lib/category-utils';
import { formatTarget, getCalendarGrid } from '@/lib/date-utils';
import { Category, CategoryData } from '@/types';

import { CategorySquare } from './CategorySquare';

interface CategoryGridProps {
  categories: Category[];
  categoryData: CategoryData[];
  editingCategory: string | null;
  onEdit: (categoryId: string) => void;
  onDelete: (category: Category) => void;
  onReorder: (newOrder: Category[]) => void;
  editForm: (category: Category) => React.ReactNode;
}

export function CategoryGrid({
  categories,
  categoryData,
  editingCategory,
  onEdit,
  onDelete,
  onReorder,
  editForm,
}: CategoryGridProps) {
  const calendarWeeks = getCalendarGrid();
  const today = getTodayString();

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
    <Reorder.Group axis="y" values={categories} onReorder={onReorder} className="space-y-6">
      {categories.map((category) => (
        <Reorder.Item
          key={category.id}
          value={category}
          className="bg-card backdrop-blur rounded-xl p-4 hover:bg-card transition-all duration-200 cursor-grab active:cursor-grabbing"
          whileDrag={{
            scale: 1.02,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            zIndex: 1000,
          }}
        >
          {/* Category Header */}
          <div className="flex items-center justify-between mb-4">
            {editingCategory === category.id ? (
              editForm(category)
            ) : (
              <>
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: getCategoryBackgroundColor(category) }}
                  />
                  {category.name}
                </h2>
                <div className="flex gap-2">
                  <button
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-grab active:cursor-grabbing focus:outline-none focus:ring-2 focus:ring-ring rounded p-1"
                    aria-label={`Drag to reorder ${category.name} project`}
                    tabIndex={0}
                  >
                    <DragIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(category.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEdit(category.id);
                      }
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    aria-label={`Edit ${category.name} project`}
                    tabIndex={0}
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(category)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onDelete(category);
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring rounded"
                    aria-label={`Delete ${category.name} project`}
                    tabIndex={0}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Calendar Grid */}
          <div className="space-y-1">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAY_HEADERS.map((day, index) => (
                <div
                  key={index}
                  className="text-center text-[8px] text-muted-foreground/60 font-medium py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Weeks */}
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((date, dayIndex) => (
                  <div key={dayIndex} className="flex justify-center">
                    {date ? (
                      <CategorySquare
                        date={date}
                        minutes={getDayData(categoryData, category.id, date).minutes}
                        pomodoros={getDayData(categoryData, category.id, date).pomodoros}
                        color={getSquareColor(categoryData, category, date)}
                        isToday={date === today}
                      />
                    ) : (
                      <div className="w-8 h-8" /> // Empty cell for padding
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Category Stats */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 pt-3 border-t border-border/20">
            <span>Target: {formatTarget(category.target)}/day</span>
            <span>{getTodayProgress(categoryData, category, today)}% of target today</span>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
