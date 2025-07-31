'use client';

import { useEffect, useState } from 'react';

import { MoonIcon,SunIcon } from '@/components/icons';

import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-card hover:bg-card/70 transition-colors cursor-pointer"
        aria-label="Toggle theme"
      >
        <div className="w-5 h-5" />
      </button>
    );
  }

  // Resolve the actual theme if it's set to 'system'
  const resolvedTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg bg-card hover:bg-card/70 transition-colors cursor-pointer"
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className="w-5 h-5 text-primary" />
      ) : (
        <MoonIcon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}
