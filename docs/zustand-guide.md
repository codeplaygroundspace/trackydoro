# Zustand State Management Guide

## 📦 What is a Store?

Think of a store as a **container** that holds:

- **State** = Your app's data (like a box of variables)
- **Actions** = Functions that change the data (like buttons)

## 🎯 Breaking Down Your Store

### 1️⃣ State (Your Data)

```typescript
// These are like variables that store your app's information
categories: Category[];        // Your projects (Study, Work, etc.)
categoryData: CategoryData[];  // Tracking data (pomodoros per day)
selectedCategory: string;      // Which project is active
pomodoroCount: number;        // Total pomodoros completed
isLoading: boolean;           // Is the app loading?
```

### 2️⃣ Actions (Your Functions)

Actions are functions that **change the state**. Think of them as "verbs" - things you can DO:

```typescript
addCategory(); // CREATE a new project
updateCategory(); // EDIT a project
deleteCategory(); // DELETE a project
setSelectedCategory(); // SWITCH active project
recordPomodoro(); // SAVE completed pomodoro
```

## 🔧 How Actions Work

Let's look at the `addCategory` action:

```typescript
addCategory: (name, color, target) => {
  // 1. Create new category object
  const newCategory: Category = {
    id: Date.now().toString(), // Unique ID from timestamp
    name, // "Study"
    color, // "#3b82f6"
    target, // 90 minutes
  };

  // 2. Update the state
  set((state) => ({
    categories: [...state.categories, newCategory], // Add to array
    selectedCategory: state.categories.length === 0 ? newCategory.id : state.selectedCategory,
  }));
};
```

**What `set()` does:**

- Takes the current state
- Returns new state
- Zustand automatically updates your components!

## 🎬 Real Example

When user clicks "Add Project":

```typescript
// In your component
const addCategory = useStore((state) => state.addCategory);

// User fills form and clicks submit
addCategory('Meditation', '#purple', 30);

// This happens:
// 1. Creates new category object
// 2. Adds it to categories array
// 3. Auto-saves to localStorage
// 4. Re-renders components using categories
```

## 💾 The `persist` Wrapper

```typescript
export const useStore = create<PomodoroStore>()(
  persist(
    (set) => ({ ... }),
    {
      name: 'pomodoro-storage',  // localStorage key
    }
  )
);
```

This automatically:

- Saves your state to `localStorage['pomodoro-storage']`
- Loads it when app starts
- No manual saving needed!

**Think of it like:** Your app has a memory that survives even when you close the browser! 🧠

## 📚 Usage in Components

### Getting State

```typescript
// Single value - component only re-renders when categories change
const categories = useStore((state) => state.categories);

// Multiple values
const { categories, selectedCategory } = useStore();
```

### Calling Actions

```typescript
const addCategory = useStore((state) => state.addCategory);
addCategory('New Project', '#ff6b6b', 60);
```

## 🚀 Performance Tips

```typescript
// ✅ Good - Only re-renders when categories change
const categories = useStore((state) => state.categories);

// ❌ Bad - Re-renders on ANY state change
const store = useStore();
```

## 🔄 State Management Flow

1. **User Action** → Clicks button
2. **Call Action** → `addCategory('Study', '#blue', 90)`
3. **Update State** → Zustand updates internal store
4. **Auto Save** → Persist middleware saves to localStorage
5. **Re-render** → Components using that state update automatically

## 🎯 Benefits Over useState

| useState            | Zustand                |
| ------------------- | ---------------------- |
| Local to component  | Global state           |
| Manual prop passing | Direct access anywhere |
| No persistence      | Auto localStorage save |
| Multiple hooks      | One central store      |
| Props drilling      | Import and use         |
