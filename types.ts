// types.ts
// This file has been refactored to act as a central barrel file.
// It aggregates and exports all type definitions from the new, modularized
// files located in the `/types` directory. This approach improves organization
// and maintainability while ensuring that all existing component imports
// continue to work without any changes.

// FIX: Re-pointing barrel file to the new modularized 'models' directory to complete the refactoring and fix all type import errors.
export * from './types/models';
