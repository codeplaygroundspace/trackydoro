import { startOfWeek, endOfWeek, format, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns';

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
