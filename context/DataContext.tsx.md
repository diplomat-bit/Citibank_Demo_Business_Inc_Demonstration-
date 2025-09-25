# DataContext.tsx

This file establishes the global state management for the application using React Context. The `DataProvider` component holds all shared state (like transactions, assets, user settings) and provides functions to modify that state. This allows any component in the application to access and manipulate data from a single source of truth, avoiding prop drilling.