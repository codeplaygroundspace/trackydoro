'use client';

import { useState } from 'react';
import { Category, DayData } from '@/types';
import { CategorySquare } from './CategorySquare';
import { getDaysArray } from '@/lib/utils';
import { formatWeekRange, getNextWeek, getPreviousWeek } from '@/lib/date-utils';

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
                className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label="Edit category"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={() => onDelete(category)}
                className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                aria-label="Delete category"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {view === 'week' && (
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setCurrentWeekDate(getPreviousWeek(currentWeekDate))}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Previous week"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-sm font-medium">Week of {formatWeekRange(currentWeekDate)}</span>
          <button
            onClick={() => setCurrentWeekDate(getNextWeek(currentWeekDate))}
            className="p-1 hover:bg-secondary rounded transition-colors"
            aria-label="Next week"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
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
