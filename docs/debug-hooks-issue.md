# React Hooks Issue and Fix - Start Challenge Button

## Issue
The "Start Challenge" button in the AI Puzzle Site was not working correctly. When clicking the button, the expected behavior of navigating to the puzzle view and loading the selected use case was not happening.

## Root Cause
The issue was traced to a React hooks rule violation in the `App.tsx` file. The problem occurred in the `startNewGame` function, which was trying to use the `useDatabase` hook inside a regular function body:

```tsx
// INCORRECT implementation:
const startNewGame = (useCaseId: string) => {
  console.log('🔍 AppContent: startNewGame called with ID:', useCaseId);
  const { getUseCaseById } = useDatabase(); // Hook used inside a function body!
  
  // Use an async IIFE to fetch the use case from the database
  (async () => {
    const useCase = await getUseCaseById(useCaseId);
    // ...rest of the function
  })();
};
```

This violates one of React's [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html), which states that:
> Only Call Hooks at the Top Level. Don't call Hooks inside loops, conditions, or nested functions.

## Fix

The issue was fixed by:

1. Moving the `useDatabase()` hook call to the top level of the component.
2. Changing the `startNewGame` function to be properly async instead of using an IIFE.
3. Adding better error handling and logging.

```tsx
// CORRECT implementation:
// Access database context at the component level
const { getUseCaseById } = useDatabase(); // Hook at component top level

const startNewGame = async (useCaseId: string) => {
  console.log('🔍 AppContent: startNewGame called with ID:', useCaseId);
  
  try {
    const useCase = await getUseCaseById(useCaseId);
    console.log('🔍 AppContent: useCase retrieved:', useCase);
    if (!useCase) {
      console.error('🔍 AppContent: Use case not found:', useCaseId);
      return;
    }

    setGameState({
      currentUseCase: useCase,
      selectedTools: [],
      score: 0,
      hintsUsed: 0,
      puzzlePieces: [],
      isComplete: false
    });
    setActiveTab('puzzle');
  } catch (error) {
    console.error('🔍 AppContent: Error starting new game:', error);
  }
};
```

## Lessons Learned

1. **React Hooks Rules**: Always ensure hooks are called at the top level of React functional components, not inside nested functions, conditions, or loops.

2. **Async Functions**: When dealing with asynchronous operations in React, be careful with how you structure your async functions. Using proper async/await syntax with try/catch is preferable to nested IIFEs.

3. **Error Handling**: Always include proper error handling for asynchronous operations, especially when they involve data fetching that could fail.

4. **Component Design**: When designing React components that use hooks and pass callbacks to child components, ensure the hooks are used according to React's rules.

## Additional Resources

- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- [ESLint Plugin for React Hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) - Can automatically catch these issues during development
- [React Hooks FAQ](https://reactjs.org/docs/hooks-faq.html)
