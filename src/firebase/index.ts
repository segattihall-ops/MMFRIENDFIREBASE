'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initializes the Firebase application and its services in an idempotent manner.
 * Includes error handling to catch potential initialization failures.
 * @returns {FirebaseApp} The initialized Firebase App instance.
 */
function initializeFirebaseApp(): FirebaseApp {
  try {
    if (getApps().length === 0) {
      // If no app is initialized, initialize one with the provided config.
      return initializeApp(firebaseConfig);
    } else {
      // If an app is already initialized, return it.
      return getApp();
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    // Re-throw the error to make the failure visible to the developer.
    throw new Error('Firebase initialization failed. Please check your configuration and network connection.');
  }
}

// Initialize and assign the singleton instances.
firebaseApp = initializeFirebaseApp();
auth = getAuth(firebaseApp);
firestore = getFirestore(firebaseApp);

/**
 * A function that returns the singleton instances of the Firebase services.
 * This can be used for dependency injection or in parts of the app where hooks aren't suitable.
 * @returns An object containing the initialized firebaseApp, auth, and firestore services.
 */
export function initializeFirebaseServices(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
    return {
        firebaseApp,
        auth,
        firestore,
    };
}

// Direct exports for simpler, direct imports in other modules (e.g., `import { auth } from '@/firebase'`).
export { firebaseApp, auth, firestore };

// Re-export everything from other Firebase modules for a single, consistent import point.
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';