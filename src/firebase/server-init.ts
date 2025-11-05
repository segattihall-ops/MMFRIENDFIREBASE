
import { initializeApp, getApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: App;
let firestore: Firestore;

export function initializeFirebase(): { app: App, firestore: Firestore } {
  if (!getApps().length) {
    app = initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
    });
    firestore = getFirestore(app);
  } else {
    app = getApp();
    firestore = getFirestore(app);
  }
  return { app, firestore };
}
