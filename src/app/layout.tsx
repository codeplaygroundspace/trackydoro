import './globals.css';

import type { Metadata } from 'next';
import {
  Fira_Code,
  Open_Sans,
  Orbitron,
  Press_Start_2P,
  Rubik_Mono_One,
  Share_Tech_Mono,
  VT323,
} from 'next/font/google';

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
});

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start-2p',
  fallback: ['ui-monospace', 'monospace'],
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  fallback: ['ui-monospace', 'monospace'],
});

const rubikMonoOne = Rubik_Mono_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik-mono-one',
  fallback: ['ui-monospace', 'monospace'],
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-share-tech-mono',
  fallback: ['ui-monospace', 'monospace'],
});

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  fallback: ['ui-monospace', 'monospace'],
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  fallback: ['ui-monospace', 'monospace'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#303c62' },
  ],
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${openSans.variable} ${pressStart2P.variable} ${orbitron.variable} ${rubikMonoOne.variable} ${shareTechMono.variable} ${vt323.variable} ${firaCode.variable} dark`}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${openSans.className} antialiased`}>{children}</body>
    </html>
  );
}
