'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { getFirestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import type { User } from '@/lib/types';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  signInAnonymously(authInstance).catch(error => {
    toast({
        variant: "destructive",
        title: "Anonymous Sign-In Failed",
        description: error.message,
    });
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call createUserWithEmailAndPassword directly. Do NOT use 'await createUserWithEmailAndPassword(...)'.
  createUserWithEmailAndPassword(authInstance, email, password)
  .then(userCredential => {
    // After user is created in Auth, create their document in Firestore.
    const user = userCredential.user;
    const db = getFirestore(authInstance.app);
    const userRef = doc(db, 'users', user.uid);
    const newUser: User = {
        id: user.uid,
        email: user.email || '',
        tier: 'free',
        status: 'active',
        revenue: 0,
    };
    setDocumentNonBlocking(userRef, newUser, { merge: false });
  })
  .catch(error => {
    let description = error.message;
    if (error.code === 'auth/email-already-in-use') {
        description = "This email is already in use. Please sign in or use a different email.";
    }
    toast({
        variant: "destructive",
        title: "Sign-Up Failed",
        description,
    });
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  signInWithEmailAndPassword(authInstance, email, password).catch(error => {
     let description = error.message;
     if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        description = "Invalid credentials. Please check your email and password and try again.";
     }
    toast({
        variant: "destructive",
        title: "Sign-In Failed",
        description,
    });
  });
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
