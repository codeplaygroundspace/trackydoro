'use client';

import { getDateDisplay } from '@/lib/utils';

interface CategorySquareProps {
  date: string;
  minutes: number;
  pomodoros: number;
  color: string;
  isToday: boolean;
}

export function CategorySquare({ date, minutes, pomodoros, color, isToday }: CategorySquareProps) {
  return (
    <div
      className={`
        w-10 h-10 rounded-lg relative group transition-all duration-200
        ${isToday ? 'ring-2 ring-white shadow-lg' : ''}
        hover:transform hover:scale-110
      `}
      style={{ backgroundColor: color }}
    >
      {pomodoros > 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {pomodoros}
        </div>
      )}

      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
        <div className="font-semibold">{getDateDisplay(date)}</div>
        <div>
          {minutes} min / {pomodoros} 🍅
        </div>
      </div>
    </div>
  );
}
