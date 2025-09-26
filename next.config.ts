import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable experimental features for better SEO
  experimental: {
    optimizePackageImports: ['recharts', 'zustand'],
  },

  // Optimize images for better Core Web Vitals
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Add compression and static optimization
  compress: true,

  // Enable strict mode for better development
  reactStrictMode: true,

  // Optimization for better SEO performance
  poweredByHeader: false,

  // Headers for better SEO and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO (handle common misspellings)
  async redirects() {
    return [
      {
        source: '/pomodoro',
        destination: '/',
        permanent: true,
      },
      {
        source: '/timer',
        destination: '/',
        permanent: true,
      },
      {
        source: '/productivity',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
