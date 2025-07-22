'use client';

import { getDateDisplay } from '@/lib/date-utils';

interface CategorySquareProps {
  date: string;
  minutes: number;
  pomodoros: number;
  color: string;
  isToday: boolean;
  size?: 'small' | 'large';
}

export function CategorySquare({
  date,
  minutes,
  pomodoros,
  color,
  isToday,
  size = 'small',
}: CategorySquareProps) {
  const sizeClasses =
    size === 'large' ? 'w-12 h-12 md:w-16 md:h-16 text-sm md:text-base flex-1' : 'w-8 h-8';

  const dayLabel =
    size === 'large' ? new Date(date).toLocaleDateString('en-US', { weekday: 'short' }) : null;

  return (
    <div className={size === 'large' ? 'flex flex-col items-center gap-1' : ''}>
      {dayLabel && <span className="text-xs text-muted-foreground font-medium">{dayLabel}</span>}
      <div
        className={`
          ${sizeClasses} rounded-lg relative group transition-all duration-200
          hover:transform hover:scale-110 cursor-pointer
        `}
        style={{
          backgroundColor: color,
          ...(isToday ? { boxShadow: '0 0 0 2px var(--primary)' } : {}),
        }}
      >
        {pomodoros > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
            {pomodoros}
          </div>
        )}

        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10 border border-border">
          <div className="font-semibold">{getDateDisplay(date)}</div>
          <div>
            {minutes} min / {pomodoros} 🍅
          </div>
        </div>
      </div>
    </div>
  );
}
