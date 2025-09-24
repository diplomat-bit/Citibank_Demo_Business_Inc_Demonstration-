// types.ts
// This file has been refactored to act as a central barrel file.
// It aggregates and exports all type definitions from the new, modularized
// files located in the `/types` directory. This approach improves organization
// and maintainability while ensuring that all existing component imports
// continue to work without any changes.

export * from './types/ai';
export * from './types/corporate';
export * from './types/credit';
export * from './types/crypto';
export * from './types/gamification';
export * from './types/personal';
export * from './types/system';
export * from './types/ui';
export * from './types/dashboard';
