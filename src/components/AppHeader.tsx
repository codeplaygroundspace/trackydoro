'use client';

import Link from 'next/link';

import { AnalyticsIcon, Clock3, GearIcon, OutlineKeyboard } from '@/components/icons';

interface AppHeaderProps {
  onKeyboardClick: () => void;
  onSettingsClick: () => void;
  onAnalyticsClick: () => void;
  isHomePage?: boolean;
}

/**
 * AppHeader component displays the application header with logo and settings.
 * It is a presentational component
 */
export default function AppHeader({
  onKeyboardClick,
  onSettingsClick,
  onAnalyticsClick,
  isHomePage = true,
}: AppHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Clock3 className="w-6 h-6 text-primary" />
        <h1 className="font-black text-foreground dark:text-primary tracking-wide">Trackydoro</h1>
      </Link>
      <div className="flex items-center gap-2">
        {isHomePage && (
          <>
            <button
              onClick={onKeyboardClick}
              className="hidden sm:block bg-card hover:bg-card/70 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="View keyboard shortcuts (Press ? key)"
              title="Keyboard shortcuts (?)"
            >
              <OutlineKeyboard className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={onAnalyticsClick}
              className="bg-card hover:bg-card/70 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="View analytics"
              title="Analytics"
            >
              <AnalyticsIcon className="w-5 h-5 text-primary" />
            </button>
            <button
              onClick={onSettingsClick}
              className="bg-card hover:bg-card/70 p-2 rounded-lg transition-all duration-200 cursor-pointer"
              aria-label="Open settings"
              title="Settings"
            >
              <GearIcon className="w-5 h-5 text-primary" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
