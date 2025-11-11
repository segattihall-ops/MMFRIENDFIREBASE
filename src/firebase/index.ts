'use client';

// Re-export everything from other Firebase modules for a single, consistent import point.
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';

// Export specific items from provider to avoid useUser conflict
export { FirebaseProvider, FirebaseContext, useFirebase, useAuth, useFirestore, useFirebaseApp, useMemoFirebase } from './provider';
export type { FirebaseContextState, FirebaseServicesAndUser } from './provider';
