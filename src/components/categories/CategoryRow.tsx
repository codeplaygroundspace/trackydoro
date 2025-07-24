'use client';

import { useState } from 'react';
import { Category, DayData } from '@/types';
import { CategorySquare } from './CategorySquare';
import { getDaysArray } from '@/lib/date-utils';
import { formatWeekRange, getNextWeek, getPreviousWeek } from '@/lib/date-utils';
import { EditIcon, TrashIcon, ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';

interface CategoryRowProps {
  category: Category;
  categoryData: DayData[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  isEditing: boolean;
  editForm?: React.ReactNode;
  view: 'month' | 'week';
}

export function CategoryRow({
  category,
  categoryData,
  onEdit,
  onDelete,
  isEditing,
  editForm,
  view,
}: CategoryRowProps) {
  const [currentWeekDate, setCurrentWeekDate] = useState(new Date());
  const days = getDaysArray(view, currentWeekDate);
  const today = new Date().toISOString().split('T')[0];

  const getDayData = (date: string) => {
    const day = categoryData.find((d) => d.date === date);
    return day || { minutes: 0, pomodoros: 0 };
  };

  const getSquareColor = (date: string) => {
    const { minutes } = getDayData(date);
    if (minutes === 0) return 'var(--muted)';

    const percentage = Math.min(minutes / category.target, 1);
    const opacity = 0.2 + percentage * 0.8;

    return `${category.color}${Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0')}`;
  };

  const getTodayProgress = () => {
    const { minutes } = getDayData(today);
    return Math.round((minutes / category.target) * 100);
  };

  return (
    <div className="bg-card backdrop-blur rounded-xl p-3 md:p-4 hover:bg-card transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          editForm
        ) : (
          <>
            <h2 className="text-xl font-black flex items-center gap-2">
              <span className="w-4 h-4 rounded" style={{ backgroundColor: category.color }} />
              {category.name}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(category)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit(category);
                  }
                }}
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring rounded"
                aria-label={`Edit ${category.name} category`}
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
                aria-label={`Delete ${category.name} category`}
                tabIndex={0}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      {view === 'week' && (
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentWeekDate(getPreviousWeek(currentWeekDate))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCurrentWeekDate(getPreviousWeek(currentWeekDate));
              }
            }}
            className="p-1 hover:bg-secondary rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Previous week"
            tabIndex={0}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium">Week of {formatWeekRange(currentWeekDate)}</span>
          <button
            onClick={() => setCurrentWeekDate(getNextWeek(currentWeekDate))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCurrentWeekDate(getNextWeek(currentWeekDate));
              }
            }}
            className="p-1 hover:bg-secondary rounded transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Next week"
            tabIndex={0}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className={`flex gap-2 mb-2 ${view === 'week' ? 'justify-between' : 'flex-wrap'}`}>
        {days.map((day) => {
          const { minutes, pomodoros } = getDayData(day);

          return (
            <CategorySquare
              key={day}
              date={day}
              minutes={minutes}
              pomodoros={pomodoros}
              color={getSquareColor(day)}
              isToday={day === today}
              size={view === 'week' ? 'large' : 'small'}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Target: {category.target} min/day</span>
        <span>{getTodayProgress()}% of target</span>
      </div>
    </div>
  );
}
