
import { initializeApp, getApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

<<<<<<< HEAD
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: App;
let firestore: Firestore;

export function initializeFirebase(): { app: App, firestore: Firestore } {
  if (!getApps().length) {
    app = initializeApp({
      credential: serviceAccount ? cert(serviceAccount) : undefined,
=======
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
>>>>>>> 6750567f0863c5a823e918f1d2c266696fa45ab6
    });
    firestore = getFirestore(app);
  } else {
    app = getApp();
    firestore = getFirestore(app);
  }
<<<<<<< HEAD
=======

  const app = getApp();
  const firestore = getFirestore(app);
>>>>>>> 6750567f0863c5a823e918f1d2c266696fa45ab6
  return { app, firestore };
}
