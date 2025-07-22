import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme';
import './globals.css';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('trackydoro-theme') || 'dark';
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  document.documentElement.classList.add(systemTheme);
                } else {
                  document.documentElement.classList.add(theme);
                }
              } catch {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}
