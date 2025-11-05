'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// This function ensures Firebase is initialized only once.
function initializeFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    // If no app is initialized, initialize one.
    // In a production Firebase Hosting environment, initializeApp() might be called without args.
    // For this environment, we'll use the config.
    return initializeApp(firebaseConfig);
  } else {
    // If an app is already initialized, return it.
    return getApp();
  }
}

// Singleton instances of Firebase services
const firebaseApp = initializeFirebaseApp();
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// This function returns the initialized services. It's the main entry point for getting Firebase services.
export function initializeFirebaseServices(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
    return {
        firebaseApp,
        auth,
        firestore,
    };
}


// Re-export everything from other Firebase modules
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
export * from './auth/use-user';
