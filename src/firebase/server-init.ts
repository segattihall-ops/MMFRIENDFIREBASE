
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export function initializeFirebase() {
  // Validate environment variable on first initialization
  if (!getApps().length) {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is required for server-side Firebase operations. ' +
        'Please set this variable with your Firebase service account JSON.'
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    } catch (error) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY must be a valid JSON string. ' +
        'Error parsing: ' + (error instanceof Error ? error.message : String(error))
      );
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
    });
    const firestore = getFirestore(app);
    return { app, firestore };
  }

  const app = getApp();
  const firestore = getFirestore(app);
  return { app, firestore };
}
