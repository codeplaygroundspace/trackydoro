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

// Generate calendar grid with Monday as first day of week
export const getCalendarGrid = (): (string | null)[][] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get first day of month and adjust for Monday start (0=Sunday, 1=Monday, etc.)
  const firstDay = new Date(currentYear, currentMonth, 1);
  let firstDayOfWeek = firstDay.getDay();
  // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Get last day of month
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();

  const weeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(null);
  }

  // Add all days of the month
  for (let day = 1; day <= lastDay; day++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    const date = new Date(currentYear, currentMonth, day);
    currentWeek.push(date.toISOString().split('T')[0]);
  }

  // Fill remaining cells in last week
  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }
  weeks.push(currentWeek);

  return weeks;
};

// Format minutes into hours and minutes
export const formatMinutes = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};

// Get current month and year display
export const getCurrentMonthYear = (): string => {
  return new Date().toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

// Format target time display (e.g., "2h 30m" or "45m")
export const formatTarget = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${remainingMinutes}m`;
};
