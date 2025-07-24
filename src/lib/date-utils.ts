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
export const getDaysArray = (): string[] => {
  const result = [];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day);
    result.push(date.toISOString().split('T')[0]);
  }

  return result;
};
