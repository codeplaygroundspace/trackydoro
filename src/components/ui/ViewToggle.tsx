'use client';

import { CalendarMonthIcon, CalendarWeekIcon } from '@/components/icons';

interface ViewToggleProps {
  view: 'month' | 'week';
  onViewChange: (view: 'month' | 'week') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const toggleView = () => {
    onViewChange(view === 'month' ? 'week' : 'month');
  };

  return (
    <button
      onClick={toggleView}
      className="p-2 rounded-lg bg-card hover:bg-card/70 transition-all duration-200 cursor-pointer"
      aria-label={`Switch to ${view === 'month' ? 'week' : 'month'} view`}
    >
      {view === 'month' ? (
        <CalendarMonthIcon className="w-5 h-5 text-primary" />
      ) : (
        <CalendarWeekIcon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
