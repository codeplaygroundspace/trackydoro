# Trackydoro

A beautiful and modern Pomodoro timer combined with visual habit tracking. Track your focus time, build consistent habits, and achieve your goals with an intuitive interface inspired by GitHub's contribution graph.

![Trackydoro Screenshot](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

![Trackydoro Screenshot](screenshot.png)

## ✨ Features

- 🍅 **Pomodoro Timer**: Stay focused with 25-minute work sessions and break intervals
- 📊 **Visual Progress Tracking**: GitHub-style activity squares show your daily progress
- 🔄 **Session Persistence**: Resume your timer exactly where you left off, even after closing the browser
- 🎯 **Project Management**: Create, edit, and organize your projects with custom colors
- 🔀 **Drag & Drop Reordering**: Easily reorder projects with smooth animations (mobile & desktop)
- 📈 **Analytics Dashboard**: Detailed insights into your productivity patterns and focus time
- 📱 **Responsive Design**: Optimized for both mobile and desktop experiences
- 🌓 **Theme System**: Beautiful light and dark themes with smooth transitions
- 🎨 **Custom Colors**: Personalise categories with your preferred colors
- ☁️ **Cloud Sync**: Seamlessly sync your data across devices with Firebase authentication

### Timer Features

- ⏱️ Work sessions (25 minutes)
- ☕ Short breaks (5 minutes)
- 🌴 Long breaks (15 minutes after 4 pomodoros)
- 🔊 Audio notifications for session completion
- ⏸️ Pause/Resume functionality
- 🔄 Session state persistence across page reloads

### Analytics Features

- 📊 **Daily Progress Tracking**: Visual calendar grid showing your daily activity
- 📈 **Weekly Charts**: Track your focus time trends over the past 7 days
- 🎯 **Project Distribution**: See how you spend time across different projects
- ⏰ **Peak Productivity Times**: Identify your most productive hours of the day
- 🔥 **Streak Tracking**: Monitor consecutive days of productivity
- 📋 **Project Management**: Drag and drop to reorder projects by priority

## 📝 Available Scripts

```bash
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint errors
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
```

## 🛠️ Tech Stack

- **[Next.js 15.4.2](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with improved performance
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Modern utility-first CSS
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready motion library for React
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service for authentication and cloud storage
- **[date-fns](https://date-fns.org/)** - Modern JavaScript date utility library
- **[Zustand](https://zustand-demo.pmnd.rs/)** - A small, fast and scalable bearbones state-management solution
- **[Recharts](https://recharts.org/)** - Composable charting library for React

### Manual Deployment

1. Build the application:

```bash
bun run build
```

2. Start the production server:

```bash
bun run start
```

### Environment Variables

For basic functionality, no environment variables are required. However, for cloud sync features, you'll need to configure Firebase:

```bash
# Firebase Configuration (optional - for cloud sync)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Without Firebase configuration, all data is stored locally in the browser.

## 💾 Data Storage

Trackydoro offers flexible data storage options:

### Local Storage (Default)

- Timer state and current session
- Projects and their settings
- Daily progress and statistics
- Theme preference
- Project order and customizations

### Cloud Storage (Optional)

When Firebase is configured, data is automatically synced across devices:

- **Smart Merging**: Intelligently combines local and cloud data
- **Conflict Resolution**: Timestamp-based resolution for data conflicts
- **Cross-Device Sync**: Access your data from any device
- **Automatic Backup**: Your progress is safely stored in the cloud

### Data Migration

The app seamlessly handles data migration between local and cloud storage, ensuring no progress is lost when switching between devices or enabling cloud sync.

## 🤝 Contributing

We love your input! We want to make contributing to Trackydoro as easy and transparent as possible, whether it's:

- 🐛 Reporting a bug
- 💡 Discussing the current state of the code
- 🔧 Submitting a fix
- 🚀 Proposing new features
- 👩‍💻 Becoming a maintainer

### Reporting Bugs

We welcome your feedback. Use the /bug command to report issues directly within Trackydoro, or file a [GitHub issue](https://github.com/codeplaygroundspace/trackydoro/issues).

### Development process

- Fork the repo and create your branch from main
- If you've added code that should be tested, add tests
- If you've changed APIs, update the documentation
- Ensure the test suite passes
- Make sure your code lints
- Issue that pull request!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
