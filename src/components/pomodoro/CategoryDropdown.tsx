'use client';

import { cn } from '@/lib/utils';
import { Category, TimerState } from '@/types';

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategory: string;
  timerState: TimerState;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryDropdown({
  categories,
  selectedCategory,
  timerState,
  onCategoryChange,
}: CategoryDropdownProps) {
  if (categories.length === 0) {
    return <div className="text-muted-foreground text-xs">Add a project to get started</div>;
  }

  return (
    <select
      value={selectedCategory || ''}
      onChange={(e) => onCategoryChange(e.target.value)}
      disabled={timerState !== 'idle'}
      className={cn(
        'bg-secondary text-secondary-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-xs font-medium',
        timerState !== 'idle' ? 'opacity-50 cursor-not-allowed' : '',
      )}
      aria-label="Select project for timer"
    >
      <option value="" disabled>
        Select a project
      </option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
  );
}
