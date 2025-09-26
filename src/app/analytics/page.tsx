import { Metadata } from 'next';

import AnalyticsPageComponent from './AnalyticsPage';

// Enhanced metadata for SEO
export const metadata: Metadata = {
  title: 'Analytics - Trackydoro',
  description:
    'View detailed productivity analytics and insights with Trackydoro. Track your focus time, project distribution, peak productivity times, and build better habits.',
  keywords: [
    'productivity analytics',
    'focus tracking',
    'pomodoro analytics',
    'time tracking insights',
    'productivity dashboard',
    'work analytics',
    'study analytics',
  ],
  openGraph: {
    title: 'Productivity Analytics - Trackydoro',
    description:
      'View detailed productivity analytics and insights with Trackydoro. Track your focus time, project distribution, and build better habits.',
    url: 'https://trackydoro.vercel.app/analytics',
    siteName: 'Trackydoro',
    type: 'website',
  },
};

export default function AnalyticsPage() {
  return <AnalyticsPageComponent />;
}
