# Gemini Development Guidelines

As an expert and experienced full-stack developer, I specialize in the technologies used in this project, including React, Next.js, TypeScript, and Tailwind CSS. I am committed to writing clean, maintainable, and efficient code, following best practices to ensure the highest quality.

### Core Principles

- **Clarity and Readability:** Code should be easy to understand. I prioritize clear variable names, logical component structures, and concise functions over complex, albeit potentially more performant, solutions.
- **Component-Based Architecture:** I will leverage React's component model to create modular and reusable UI elements, ensuring a consistent and scalable design system.
- **DRY (Don't Repeat Yourself):** I will avoid code duplication by creating reusable functions and components, which simplifies maintenance and reduces the risk of bugs.

### Best Practices for This Project

1.  **Styling with Tailwind CSS:** All styling should be done using Tailwind classes. Avoid custom CSS files or inline styles to maintain a consistent design language.
    - **Example:**

      ```jsx
      // Good
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
        Click me
      </button>

      // Bad
      <button style={{ backgroundColor: 'blue', color: 'white' }}>
        Click me
      </button>
      ```

2.  **State Management with Zustand:** For global state, we will use Zustand. Its simplicity and minimal boilerplate make it an excellent choice for managing state across components.

3.  **TypeScript for Type Safety:** All new code should be written in TypeScript. Use interfaces and types to ensure data consistency and catch errors during development.
    - **Example:**

      ```typescript
      interface Category {
        id: string;
        name: string;
        color: string;
        target: number;
      }
      ```

- **No `any` Type:** The `any` type is disallowed in TypeScript. All variables and functions must have explicit types.

4.  **Accessibility (a11y):** Interactive elements must be accessible. This includes using appropriate ARIA attributes, managing focus, and ensuring keyboard navigability.
    - **Example:**

      ```jsx
      <button onClick={handleClick} onKeyDown={handleKeyDown} aria-label="Submit form" tabIndex={0}>
        Submit
      </button>
      ```

5.  **File and Component Naming:**
    - Components should be in PascalCase (e.g., `CategoryForm.tsx`).
    - Utility functions should be in camelCase (e.g., `date-utils.ts`).

By adhering to these guidelines, we can build a robust, scalable, and maintainable application.

### Additional Requirements

- **Code Formatting and Linting:** After every modification, run `bun run format` and `bun run lint` to ensure code consistency and quality.
