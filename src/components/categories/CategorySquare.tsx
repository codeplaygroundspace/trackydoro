'use client';

import { formatMinutes, getDateDisplay } from '@/lib/date-utils';

interface CategorySquareProps {
  date: string;
  minutes: number;
  pomodoros: number;
  color: string;
  isToday: boolean;
}

export function CategorySquare({ date, minutes, pomodoros, color, isToday }: CategorySquareProps) {
  const dayNumber = new Date(date).getDate();

  return (
    <div className="flex flex-col items-center">
      {/* Date number above square */}
      <div
        className={`text-[9px] mb-1 ${isToday ? 'text-primary font-bold' : 'text-muted-foreground'}`}
      >
        {dayNumber}
      </div>

      {/* Square */}
      <div
        className={`
            w-8 h-8 rounded-lg relative group transition-all duration-200
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
            {formatMinutes(minutes)} / {pomodoros} 🍅
          </div>
        </div>
      </div>
    </div>
  );
}
