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
  title: {
    default: 'Trackydoro - Pomodoro Timer & Habit Tracker',
    template: '%s | Trackydoro',
  },
  description:
    'Boost your productivity with Trackydoro - a beautiful Pomodoro timer combined with visual habit tracking. Track your focus time, build consistent habits, and achieve your goals with the ultimate productivity app.',
  keywords: [
    'pomodoro timer',
    'habit tracker',
    'productivity app',
    'focus timer',
    'time tracking',
    'study timer',
    'work timer',
    'pomodoro technique',
    'time management',
    'productivity tools',
    'focus tracker',
    'task management',
    'study app',
    'work from home productivity',
    'remote work timer',
    'concentration timer',
    'block chain pomodoro',
    'habit building',
    'goal tracking',
    'productivity dashboard',
  ],
  authors: [{ name: 'Trackydoro Team', url: 'https://trackydoro.vercel.app' }],
  creator: 'Trackydoro',
  publisher: 'Trackydoro',
  applicationName: 'Trackydoro',
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  metadataBase: new URL('https://trackydoro.vercel.app'),
  category: 'productivity',
  classification: 'Business;Productivity',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trackydoro.vercel.app',
    title: 'Trackydoro - Pomodoro Timer & Habit Tracker',
    description:
      'Boost your productivity with Trackydoro - a beautiful Pomodoro timer combined with visual habit tracking. Track focus time, build habits, and achieve your goals.',
    siteName: 'Trackydoro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trackydoro - Pomodoro Timer & Habit Tracker Interface Screenshot',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@trackydoro',
    creator: '@trackydoro',
    title: 'Trackydoro - Pomodoro Timer & Habit Tracker',
    description:
      'Boost your productivity with the ultimate Pomodoro timer and habit tracker. Focus better, build habits, and achieve your goals.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://trackydoro.vercel.app',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
  other: {
    'msapplication-TileColor': '#303c62',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="robots" content="index, follow" />
        <meta
          name="googlebot"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />
        <meta name="bingbot" content="index, follow" />
        <link rel="canonical" href="https://trackydoro.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Trackydoro',
              description:
                'Boost your productivity with Trackydoro - a beautiful Pomodoro timer combined with visual habit tracking.',
              url: 'https://trackydoro.vercel.app',
              applicationCategory: 'ProductivityApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Organization',
                name: 'Trackydoro',
              },
              featureList: [
                'Pomodoro Timer',
                'Habit Tracking',
                'Focus Time Tracking',
                'Productivity Analytics',
                'Visual Progress Tracking',
              ],
              browserRequirements: {
                '@type': 'Text',
                value: 'Requires JavaScript. Requires HTML5.',
              },
            }),
          }}
        />
      </head>
      <body className={`${openSans.className} antialiased`}>{children}</body>
    </html>
  );
}
