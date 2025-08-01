'use client';

import Link from 'next/link';

import { Clock3, GearIcon, OutlineKeyboard } from '@/components/icons';
import { ThemeToggle } from '@/components/theme';

interface AppHeaderProps {
  onKeyboardClick: () => void;
  onSettingsClick: () => void;
}

/**
 * AppHeader component displays the application header with logo, theme toggle, and buttons for keyboard shortcuts and settings.
 * It is a presentational component that receives click handlers as props.
 */
export default function AppHeader({ onKeyboardClick, onSettingsClick }: AppHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Clock3 className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-black text-foreground dark:text-primary tracking-wide">
          Trackydoro
        </h1>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={onKeyboardClick}
          className="hidden sm:block bg-card hover:bg-card/70 p-2 rounded-lg transition-all duration-200 cursor-pointer"
          aria-label="View keyboard shortcuts (Press ? key)"
          title="Keyboard shortcuts (?)"
        >
          <OutlineKeyboard className="w-5 h-5 text-primary" />
        </button>
        <button
          onClick={onSettingsClick}
          className="hidden sm:block bg-card hover:bg-card/70 p-2 rounded-lg transition-all duration-200 cursor-pointer"
          aria-label="Open settings"
          title="Settings"
        >
          <GearIcon className="w-5 h-5 text-primary" />
        </button>
      </div>
    </div>
  );
}
