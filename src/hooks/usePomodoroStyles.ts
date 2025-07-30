/**
 * A hook that provides dynamic Tailwind CSS classes for the Pomodoro timer
 * based on its current session type (work or break).
 *
 * @param sessionType - The current session type, either 'work' or 'break'.
 * @returns An object containing the appropriate CSS classes for the card.
 */
export const usePomodoroStyles = (sessionType: 'work' | 'break') => {
  // Apply red theme for work sessions.
  if (sessionType === 'work') {
    return {
      cardClasses: 'bg-pomodoro-red-bg dark:bg-pomodoro-red-bg-dark',
    };
  }

  // Apply green theme for break sessions.
  if (sessionType === 'break') {
    return {
      cardClasses: 'bg-pomodoro-green-bg dark:bg-pomodoro-green-bg-dark',
    };
  }

  // Default styles for an idle or other state.
  return {
    cardClasses: 'bg-card',
  };
};
