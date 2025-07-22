# Trackydoro

A beautiful and modern Pomodoro timer combined with visual habit tracking. Track your focus time, build consistent habits, and achieve your goals with an intuitive interface inspired by GitHub's contribution graph.

![Trackydoro Screenshot](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## ✨ Features

### Core Features

- 🍅 **Pomodoro Timer**: Stay focused with 25-minute work sessions and smart break intervals
- 📊 **Visual Progress Tracking**: GitHub-style activity squares show your daily progress at a glance
- 🎯 **Category Management**: Track different activities with custom categories, colors, and daily targets
- 🔄 **Session Persistence**: Resume your timer exactly where you left off, even after closing the browser
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices

### Timer Features

- ⏱️ Work sessions (25 minutes)
- ☕ Short breaks (5 minutes)
- 🌴 Long breaks (15 minutes after 4 pomodoros)
- 🔊 Audio notifications for session completion
- ⏸️ Pause/Resume functionality
- 🔄 Session state persistence across page reloads

### Visual Features

- 🌓 **Theme System**: Beautiful light and dark themes with smooth transitions
- 📅 **View Modes**: Toggle between month and week views for progress tracking
- 🎨 **Custom Colors**: Personalize categories with your preferred colors
- ✨ **Loading States**: Smooth skeleton loaders for better UX
- 🎯 **Progress Indicators**: Visual feedback for daily target achievement

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/trackydoro.git
cd trackydoro
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Theme System

Trackydoro features a sophisticated theme system with carefully crafted light and dark modes:

### Dark Theme

- Deep blue background with warm yellow accents
- High contrast for reduced eye strain
- Vibrant colors that pop against the dark background

### Light Theme

- Clean, minimal design with strong contrast
- Pure white cards on subtle gray background
- Professional color palette optimized for readability

### Features

- 🔄 **Automatic switching** based on system preference
- 🎨 **CSS variables** for consistent theming
- ✨ **OKLCH color space** for perceptually uniform colors

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🛠️ Tech Stack

- **[Next.js 15.4.2](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with improved performance
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Modern utility-first CSS
- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library

## 📁 Project Structure

```
trackydoro/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Main application page
│   │   └── globals.css        # Global styles & theme
│   ├── components/
│   │   ├── categories/        # Category tracking components
│   │   │   ├── CategoryGrid.tsx
│   │   │   ├── CategoryRow.tsx
│   │   │   └── CategorySquare.tsx
│   │   ├── pomodoro/          # Timer components
│   │   │   ├── PomodoroTimer.tsx
│   │   │   ├── TimerDisplay.tsx
│   │   │   └── TimerControls.tsx
│   │   ├── theme/             # Theme system
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ThemeToggle.tsx
│   │   └── ui/                # Reusable UI components
│   │       ├── Modal.tsx
│   │       ├── LoadingSkeleton.tsx
│   │       └── ViewToggle.tsx
│   ├── hooks/                 # Custom React hooks
│   │   ├── useTimer.ts        # Timer logic
│   │   ├── useAudio.ts        # Sound management
│   │   ├── useCategories.ts   # Category state
│   │   └── useLocalStorage.ts # Persistence
│   ├── lib/                   # Utilities
│   │   └── date-utils.ts      # Date formatting
│   └── types/                 # TypeScript types
│       └── index.ts           # Type definitions
├── public/
│   └── sounds/                # Audio files
└── package.json
```

### Manual Deployment

1. Build the application:

```bash
npm run build
```

2. Start the production server:

```bash
npm run start
```

### Environment Variables

No environment variables are required for basic functionality. All data is stored locally in the browser.

## 💾 Data Storage

Trackydoro uses browser localStorage to persist:

- Timer state and current session
- Categories and their settings
- Daily progress and statistics
- Theme preference
- View preferences

No data is sent to external servers, ensuring complete privacy.
