
'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  UserCredential,
} from 'firebase/auth';
import { toast } from '@/hooks/use-toast';
import { getFirestore, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from './non-blocking-updates';
import type { User } from '@/lib/types';


/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): Promise<UserCredential> {
  // CRITICAL: Call signInAnonymously directly. Do NOT use 'await signInAnonymously(...)'.
  const promise = signInAnonymously(authInstance);
  promise
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
  return promise;
  // Code continues immediately. Auth state change is handled by onAuthStateChanged listener.
}
