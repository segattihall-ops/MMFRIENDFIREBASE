'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

/**
 * Initializes Firebase services in an idempotent manner.
 * Ensures services are initialized only once per client session.
 */
function initializeFirebaseServices(): { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { firebaseApp: app, auth, firestore };
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw new Error('Firebase initialization failed. Please check your configuration.');
  }
}

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // Use useMemo to ensure that Firebase services are initialized only once per client session.
  const { firebaseApp, auth, firestore } = useMemo(() => initializeFirebaseServices(), []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
