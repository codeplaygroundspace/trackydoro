import { TimerMode } from '@/types';

/**
 * A hook that provides dynamic Tailwind CSS classes for the Pomodoro timer
 * based on its current mode (pomodoro, shortBreak, or longBreak).
 *
 * @param currentMode - The current timer mode.
 * @returns An object containing the appropriate CSS classes for the card.
 */
export const usePomodoroStyles = (currentMode: TimerMode) => {
  // Apply red theme for work sessions.
  if (currentMode === 'pomodoro') {
    return {
      cardClasses: 'bg-pomodoro-red-bg dark:bg-pomodoro-red-bg-dark',
    };
  }

  // Apply green theme for break sessions.
  if (currentMode === 'shortBreak' || currentMode === 'longBreak') {
    return {
      cardClasses: 'bg-pomodoro-green-bg dark:bg-pomodoro-green-bg-dark',
    };
  }

  // Default styles for an idle or other state.
  return {
    cardClasses: 'bg-card',
  };
};
