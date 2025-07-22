import { startOfWeek, endOfWeek, format, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';

// Timer formatting
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Date display formatting
export const getDateDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Days array generation for calendar views
export const getDaysArray = (view: 'month' | 'week' = 'month', weekDate?: Date): string[] => {
  const result = [];

  if (view === 'week') {
    // For week view, return 7 days starting from Monday
    const date = weekDate || new Date();
    const weekDays = getWeekDays(date);
    return weekDays.map((day) => day.toISOString().split('T')[0]);
  } else {
    // Month view - all days of current month
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      result.push(date.toISOString().split('T')[0]);
    }
  }

  return result;
};

// Week-specific utilities
export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getCurrentWeek = (): Date[] => {
  return getWeekDays(new Date());
};

export const formatWeekRange = (date: Date): string => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  if (start.getMonth() === end.getMonth()) {
    return `${format(start, 'MMM d')}-${format(end, 'd')}`;
  } else {
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
  }
};

export const getNextWeek = (date: Date): Date => {
  return addWeeks(date, 1);
};

export const getPreviousWeek = (date: Date): Date => {
  return subWeeks(date, 1);
};

export const isCurrentWeek = (date: Date): boolean => {
  const now = new Date();
  const currentWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const dateWeekStart = startOfWeek(date, { weekStartsOn: 1 });
  return currentWeekStart.getTime() === dateWeekStart.getTime();
};
