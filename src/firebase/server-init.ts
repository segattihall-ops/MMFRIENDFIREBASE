
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

export function initializeFirebase() {
  if (!getApps().length) {
    const app = initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
    });
    const firestore = getFirestore(app);
    return { app, firestore };
  }
  const app = getApp();
  const firestore = getFirestore(app);
  return { app, firestore };
}
