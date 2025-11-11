
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
<<<<<<< HEAD
=======
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
>>>>>>> 6750567f0863c5a823e918f1d2c266696fa45ab6
  UserCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import type { User } from '@/lib/types';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  const promise = signInAnonymously(authInstance);
  promise
<<<<<<< HEAD
    .then(userCredential => {
        // After anonymous sign-in, create their document in Firestore with admin rights.
        const user = userCredential.user;
        const db = getFirestore(authInstance.app);
        const userRef = doc(db, 'users', user.uid);
        
        // Grant admin role and platinum tier for full access.
        const adminUser: User = {
            id: user.uid,
            email: `anon-${user.uid}@masseurpro.app`, // Create a placeholder email
            role: 'admin',
            tier: 'platinum',
            status: 'active',
            revenue: 0,
        };
        // Use non-blocking write to create/update the user document.
        setDocumentNonBlocking(userRef, adminUser, { merge: true });
    })
    .catch(error => {
        toast({
            variant: "destructive",
            title: "Anonymous Sign-In Failed",
            description: error.message,
        });
    });
=======
  .then(userCredential => {
    // After user is created in Auth, create their document in Firestore.
    const user = userCredential.user;
    const db = getFirestore(authInstance.app);
    const userRef = doc(db, 'users', user.uid);
    const isAdminEmail = user.email === 'admin@masseurfriend.com';
    const newUser: User = {
        id: user.uid,
        email: user.email || '',
        tier: isAdminEmail ? 'platinum' : 'free',
        status: 'active',
        revenue: 0,
        isAdmin: isAdminEmail,
    };
    // Use merge: true to safely create or update the user document
    setDocumentNonBlocking(userRef, newUser, { merge: true });
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
  return promise;
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<UserCredential> {
  // CRITICAL: Call signInWithEmailAndPassword directly. Do NOT use 'await signInWithEmailAndPassword(...)'.
  const promise = signInWithEmailAndPassword(authInstance, email, password);
  promise
    .then(async userCredential => {
      // After successful sign-in, only create user document if it doesn't exist
      const user = userCredential.user;
      const db = getFirestore(authInstance.app);
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document already exists
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Only create document for new users
        const isAdminEmail = user.email === 'admin@masseurfriend.com';
        const userData: User = {
          id: user.uid,
          email: user.email || '',
          tier: isAdminEmail ? 'platinum' : 'free',
          status: 'active',
          revenue: 0,
          isAdmin: isAdminEmail,
        };
        setDocumentNonBlocking(userRef, userData, { merge: true });
      }
      // If document exists, do nothing - preserve existing user data
    })
    .catch(error => {
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
>>>>>>> 6750567f0863c5a823e918f1d2c266696fa45ab6
  return promise;
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}

/** Initiate Google Sign-In (non-blocking). */
export function initiateGoogleSignIn(authInstance: Auth): Promise<UserCredential> {
  const provider = new GoogleAuthProvider();
  // Optional: Add custom parameters to prompt account selection
  provider.setCustomParameters({ prompt: 'select_account' });

  const promise = signInWithPopup(authInstance, provider);
  promise
    .then(async userCredential => {
      // After successful sign-in, only create user document if it doesn't exist
      const user = userCredential.user;
      const db = getFirestore(authInstance.app);
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document already exists
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Only create document for new users
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          tier: 'free',
          status: 'active',
          revenue: 0,
        };
        setDocumentNonBlocking(userRef, newUser, { merge: true });
      }
      // If document exists, do nothing - preserve existing user data

      toast({
        title: "Google Sign-In Successful",
        description: `Welcome, ${user.displayName || user.email}!`,
      });
    })
    .catch(error => {
      let description = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        description = "Sign-in popup was closed. Please try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled, no need to show error
        return;
      }
      toast({
        variant: "destructive",
        title: "Google Sign-In Failed",
        description,
      });
    });
  return promise;
}

/** Initiate Sign in with Apple (non-blocking). */
export function initiateAppleSignIn(authInstance: Auth): Promise<UserCredential> {
  const provider = new OAuthProvider('apple.com');
  // Optional: Request additional scopes
  provider.addScope('email');
  provider.addScope('name');

  const promise = signInWithPopup(authInstance, provider);
  promise
    .then(async userCredential => {
      // After successful sign-in, only create user document if it doesn't exist
      const user = userCredential.user;
      const db = getFirestore(authInstance.app);
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document already exists
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Only create document for new users
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          tier: 'free',
          status: 'active',
          revenue: 0,
        };
        setDocumentNonBlocking(userRef, newUser, { merge: true });
      }
      // If document exists, do nothing - preserve existing user data

      toast({
        title: "Apple Sign-In Successful",
        description: `Welcome, ${user.displayName || user.email}!`,
      });
    })
    .catch(error => {
      let description = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        description = "Sign-in popup was closed. Please try again.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        // User cancelled, no need to show error
        return;
      }
      toast({
        variant: "destructive",
        title: "Apple Sign-In Failed",
        description,
      });
    });
  return promise;
}

/**
 * Setup reCAPTCHA verifier for phone authentication.
 * This should be called before initiating phone sign-in.
 * @param authInstance - The Auth instance
 * @param containerId - The ID of the HTML element where the reCAPTCHA widget will be rendered
 * @returns RecaptchaVerifier instance
 */
export function setupRecaptcha(authInstance: Auth, containerId: string): RecaptchaVerifier {
  return new RecaptchaVerifier(authInstance, containerId, {
    size: 'invisible', // or 'normal' for visible reCAPTCHA
    callback: () => {
      // reCAPTCHA solved, allow signInWithPhoneNumber
    },
    'expired-callback': () => {
      toast({
        variant: "destructive",
        title: "reCAPTCHA Expired",
        description: "Please try again.",
      });
    }
  });
}

/**
 * Initiate phone number authentication (Step 1: Send verification code).
 * Returns a ConfirmationResult that will be used in the next step.
 * @param authInstance - The Auth instance
 * @param phoneNumber - Phone number in E.164 format (e.g., "+15551234567")
 * @param recaptchaVerifier - RecaptchaVerifier instance from setupRecaptcha
 * @returns Promise<ConfirmationResult>
 */
export function initiatePhoneSignIn(
  authInstance: Auth,
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  const promise = signInWithPhoneNumber(authInstance, phoneNumber, recaptchaVerifier);

  promise
    .then(() => {
      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to ${phoneNumber}`,
      });
    })
    .catch(error => {
      let description = error.message;
      if (error.code === 'auth/invalid-phone-number') {
        description = "Invalid phone number format. Please use E.164 format (e.g., +15551234567).";
      } else if (error.code === 'auth/too-many-requests') {
        description = "Too many requests. Please try again later.";
      }
      toast({
        variant: "destructive",
        title: "Phone Sign-In Failed",
        description,
      });
    });

  return promise;
}

/**
 * Complete phone number authentication (Step 2: Verify code and sign in).
 * @param confirmationResult - The ConfirmationResult from initiatePhoneSignIn
 * @param verificationCode - The SMS code entered by the user
 * @returns Promise<UserCredential>
 */
export function confirmPhoneSignIn(
  confirmationResult: ConfirmationResult,
  verificationCode: string
): Promise<UserCredential> {
  const promise = confirmationResult.confirm(verificationCode);

  promise
    .then(async userCredential => {
      // After successful sign-in, only create user document if it doesn't exist
      const user = userCredential.user;
      const authInstance = (user as any).auth as Auth;
      const db = getFirestore(authInstance.app);
      const userRef = doc(db, 'users', user.uid);
      
      // Check if user document already exists
      const docSnap = await getDoc(userRef);
      
      if (!docSnap.exists()) {
        // Only create document for new users
        const newUser: User = {
          id: user.uid,
          email: user.email || '',
          tier: 'free',
          status: 'active',
          revenue: 0,
        };
        setDocumentNonBlocking(userRef, newUser, { merge: true });
      }
      // If document exists, do nothing - preserve existing user data

      toast({
        title: "Phone Sign-In Successful",
        description: "Welcome!",
      });
    })
    .catch(error => {
      let description = error.message;
      if (error.code === 'auth/invalid-verification-code') {
        description = "Invalid verification code. Please check and try again.";
      } else if (error.code === 'auth/code-expired') {
        description = "Verification code has expired. Please request a new one.";
      }
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description,
      });
    });

  return promise;
}

/**
 * Sign out the current user.
 * @param authInstance - The Auth instance
 * @returns Promise<void>
 */
export function initiateSignOut(authInstance: Auth): Promise<void> {
  const promise = signOut(authInstance);

  promise
    .then(() => {
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    })
    .catch(error => {
      toast({
        variant: "destructive",
        title: "Sign-Out Failed",
        description: error.message,
      });
    });

  return promise;
}

/**
 * Initiate password reset email (non-blocking).
 * Sends a password reset email to the specified email address.
 * @param authInstance - The Auth instance
 * @param email - The user's email address
 * @returns Promise<void>
 */
export function initiatePasswordReset(authInstance: Auth, email: string): Promise<void> {
  const promise = sendPasswordResetEmail(authInstance, email);

  promise
    .then(() => {
      toast({
        title: "Password Reset Email Sent",
        description: `A password reset link has been sent to ${email}. Please check your inbox.`,
      });
    })
    .catch(error => {
      let description = error.message;
      if (error.code === 'auth/user-not-found') {
        description = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        description = "Invalid email address format.";
      } else if (error.code === 'auth/too-many-requests') {
        description = "Too many requests. Please try again later.";
      }
      toast({
        variant: "destructive",
        title: "Password Reset Failed",
        description,
      });
    });

  return promise;
}
