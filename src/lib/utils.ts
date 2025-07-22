export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const getDaysArray = (view: 'month' | 'week' = 'month', weekDate?: Date): string[] => {
  const result = [];

  if (view === 'week') {
    // For week view, return 7 days starting from Monday
    const date = weekDate || new Date();
    const dayOfWeek = date.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to start on Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      result.push(day.toISOString().split('T')[0]);
    }
  } else {
    // Month view - existing logic
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    // Get last day of current month
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    // Generate all days of the current month starting from day 1
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      result.push(date.toISOString().split('T')[0]);
    }
  }

  return result;
};

export const getDateDisplay = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};
