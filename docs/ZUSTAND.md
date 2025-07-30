Let's forget the code for a second and use an analogy.

# The House Analogy for State Management

Imagine your application is a house.

- The Living Room Wall: This is your Zustand Store (`useStore.ts`). On this
  wall, you write down information that everyone in the house needs to know or
  use. Things like:
  - The WiFi password.
  - The family's shared grocery list.
  - The setting on the central thermostat.
  - A list of all the people who live in the house.

- Your Bedroom: This is a Local Component (`PomodoroTimer.tsx`) and its own
  private state (useState or a local hook like useTimer.ts). In your bedroom,
  you keep things that only you care about. Things like:
  - The book on your nightstand.
  - The alarm you've set for tomorrow morning.
  - The clothes you've laid out to wear.

You would never write "My alarm is set for 7:00 AM" on the living room wall,
because nobody else in the house needs to know that. It would just create
clutter.

---

## Applying the Analogy to Your Project

Now, let's apply this "Living Room vs. Bedroom" rule to your app's data.

What belongs on the "Living Room Wall" (useStore.ts)?

This is for shared, global data.

### Ask the question: "Do multiple, unrelated components need this information?"

1.  `categories`: YES.
    - The CategoryGrid needs it to display all the categories.
    - The CategoryForm needs it to add a new one.
    - The PomodoroTimer needs to know about them to link a session to a
      category.
    - Conclusion: This is global. It belongs in useStore. (It's already there, which is great!)

2.  `categoryData` (Your statistics): YES.
    - The CategoryGrid needs this to draw the colored squares for each day.
    - A future "Year in Review" page would need this.
    - A future "Charts" page would need this.
    - Conclusion: This is global. It belongs in useStore. (Correctly implemented!)

3.  `selectedCategory`: YES.
    - The CategoryGrid needs to know which category to highlight with a border.
    - The PomodoroTimer needs to know which category to save a completed session to.
    - Conclusion: This is global. It belongs in useStore. (Correctly implemented!)

## What belongs in the "Bedroom" (useTimer.ts)?

This is for local, component-specific data. Ask the question: "Does anyone
outside of the Pomodoro timer itself care about this?"

1.  `timeLeft` (The 25:00 countdown): NO.
    - Does the AppHeader care that there are 17 minutes and 42 seconds left? No.
    - Does the CategoryForm care? No.
    - Only the TimerDisplay component needs this information to show the numbers
      on the screen.
    - Conclusion: This is local. It belongs in useTimer.ts.

2.  `timerState` ('working', 'paused', 'break'): NO.
    - This is the internal state of the timer "machine." It's the alarm clock in
      your bedroom. No other part of the app needs to know if the timer is
      currently paused.
    - Conclusion: This is local. It belongs in useTimer.ts.
