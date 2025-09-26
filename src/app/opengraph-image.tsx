import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Trackydoro - Pomodoro Timer & Habit Tracker';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              color: '#fbbf24',
              marginBottom: '20px',
              fontFamily: 'monospace',
            }}
          >
            🍅 TrackyDoro
          </div>

          {/* Main title */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '16px',
              lineHeight: 1.2,
            }}
          >
            Pomodoro Timer & Habit Tracker
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: 24,
              color: '#94a3b8',
              marginBottom: '32px',
              textAlign: 'center',
            }}
          >
            Boost your productivity • Track focus time • Build better habits
          </div>

          {/* Feature list */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center',
              marginBottom: '32px',
              fontSize: '18px',
              color: '#e2e8f0',
            }}
          >
            <div>⌚ Focus Timer</div>
            <div>📊 Analytics</div>
            <div>🎯 Habits</div>
          </div>

          {/* Call to action style */}
          <div
            style={{
              fontSize: 20,
              color: '#60a5fa',
              fontWeight: '600',
            }}
          >
            Free • Web App • No Registration Required
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
