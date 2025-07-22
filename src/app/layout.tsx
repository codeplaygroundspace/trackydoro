import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#111827',
};

export const metadata: Metadata = {
  title: 'Trackydoro - Pomodoro Timer & Habit Tracker',
  description:
    'Boost your productivity with Trackydoro - a beautiful Pomodoro timer combined with visual habit tracking. Track your focus time, build consistent habits, and achieve your goals.',
  keywords:
    'pomodoro timer, habit tracker, productivity app, focus timer, time tracking, study timer, work timer',
  authors: [{ name: 'Trackydoro' }],
  creator: 'Trackydoro',
  publisher: 'Trackydoro',
  applicationName: 'Trackydoro',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://trackydoro.com'),
  openGraph: {
    title: 'Trackydoro - Pomodoro Timer & Habit Tracker',
    description:
      'Boost your productivity with Trackydoro - a beautiful Pomodoro timer combined with visual habit tracking.',
    url: 'https://trackydoro.com',
    siteName: 'Trackydoro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trackydoro - Pomodoro Timer & Habit Tracker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trackydoro - Pomodoro Timer & Habit Tracker',
    description:
      'Boost your productivity with Trackydoro - a beautiful Pomodoro timer combined with visual habit tracking.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://trackydoro.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
