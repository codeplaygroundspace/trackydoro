# Trackydoro

A beautiful Pomodoro timer combined with visual habit tracking. Track your focus time, build consistent habits, and achieve your goals.

## Features

- 🍅 **Pomodoro Timer**: Stay focused with 25-minute work sessions and regular breaks
- 📊 **Visual Habit Tracking**: GitHub-style activity squares for daily progress visualization
- 🎯 **Multiple Categories**: Track different activities like Study, Work, Exercise, Reading
- 💾 **Persistent Data**: All your data is saved locally in your browser
- 🌓 **Dark/Light Theme**: Beautiful theme system with automatic switching based on system preference
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Theme System

Trackydoro includes a comprehensive theme system with light and dark modes:

- **Automatic theme switching** based on system preference
- **Manual toggle** available in the header
- **CSS variables** for consistent theming across components
- **Smooth transitions** between themes

The theme system uses Tailwind CSS v4 with CSS variables, ensuring a consistent and beautiful experience across all color modes.

## Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Technologies

- **Next.js 15.4.2** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first CSS framework
- **React 19** - Latest React features

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles and theme variables
├── components/            # React components
│   ├── categories/        # Category-related components
│   ├── pomodoro/          # Pomodoro timer components
│   ├── theme/             # Theme system components
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## Deploy on Vercel

[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
