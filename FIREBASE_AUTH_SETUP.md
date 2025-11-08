# Firebase Authentication Setup Guide

This guide explains how Firebase Authentication is configured in this Next.js web application. The implementation provides a comprehensive authentication system with multiple sign-in methods.

## 1. Initialize Firebase and Listen for Auth State

Firebase is initialized in the application, and the most crucial step is listening for authentication state changes. This allows the app to react immediately when a user signs in or out, updating the UI accordingly.

### Firebase Initialization

Located in `src/firebase/index.ts`:

```typescript
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Initialize Firebase App (idempotent)
const firebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Auth and Firestore services
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

export { firebaseApp, auth, firestore };
```

### Auth State Listener

Located in `src/firebase/provider.tsx`:

The `FirebaseProvider` component listens for authentication state changes and provides the user state to the entire application:

```typescript
import { onAuthStateChanged } from 'firebase/auth';

// Inside FirebaseProvider component
useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    (firebaseUser) => {
      // User is signed in
      setUserAuthState({
        user: firebaseUser,
        isUserLoading: false,
        userError: null
      });
    },
    (error) => {
      // Auth listener error
      console.error("Auth error:", error);
      setUserAuthState({
        user: null,
        isUserLoading: false,
        userError: error
      });
    }
  );

  return () => unsubscribe(); // Cleanup on unmount
}, [auth]);
```

### Using Auth State in Components

```typescript
import { useUser } from '@/firebase';

function MyComponent() {
  const { user, isUserLoading, userError } = useUser();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (user) {
    console.log("User signed in:", user.uid);
    // Navigate to main app content
  } else {
    console.log("No user signed in");
    // Navigate to login screen
  }
}
```

## 2. Authentication Methods

All authentication methods are implemented as non-blocking functions in `src/firebase/non-blocking-login.tsx`. They return promises but don't use `await`, allowing the UI to remain responsive. The `onAuthStateChanged` listener handles the state updates.

### Email and Password

#### Sign Up

```typescript
import { auth } from '@/firebase';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';

// Create a new user account
initiateEmailSignUp(auth, email, password)
  .then(userCredential => {
    // Success - auth state listener will handle the user update
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

#### Sign In

```typescript
import { auth } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';

// Sign in with existing account
initiateEmailSignIn(auth, email, password)
  .then(userCredential => {
    // Success - auth state listener will handle the user update
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

### Google Sign-In

Google Sign-In uses a popup window for authentication:

```typescript
import { auth } from '@/firebase';
import { initiateGoogleSignIn } from '@/firebase/non-blocking-login';

// Sign in with Google
initiateGoogleSignIn(auth)
  .then(userCredential => {
    // Success - user info and ID token available
    const user = userCredential.user;
    console.log("Google user:", user.displayName);
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

**Note:** Ensure your Firebase project has Google as an enabled sign-in provider in the Firebase Console under Authentication > Sign-in method.

### Sign in with Apple

Apple Sign-In also uses a popup window for authentication:

```typescript
import { auth } from '@/firebase';
import { initiateAppleSignIn } from '@/firebase/non-blocking-login';

// Sign in with Apple
initiateAppleSignIn(auth)
  .then(userCredential => {
    // Success - user info available
    const user = userCredential.user;
    console.log("Apple user:", user.email);
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

**Note:**
- Ensure your Firebase project has Apple as an enabled sign-in provider in the Firebase Console
- For web, you'll need to configure your Apple Developer account with a Service ID
- Add your domain to the authorized domains list in Firebase Console

### Phone Number Authentication

Phone authentication is a two-step process that requires reCAPTCHA verification:

#### Step 1: Setup reCAPTCHA and Send Verification Code

```typescript
import { auth } from '@/firebase';
import { setupRecaptcha, initiatePhoneSignIn } from '@/firebase/non-blocking-login';

// In your component, add a div with an ID for reCAPTCHA
// <div id="recaptcha-container"></div>

// Setup reCAPTCHA verifier
const recaptchaVerifier = setupRecaptcha(auth, 'recaptcha-container');

// Send verification code to phone number (E.164 format)
const phoneNumber = "+15551234567";
initiatePhoneSignIn(auth, phoneNumber, recaptchaVerifier)
  .then(confirmationResult => {
    // SMS sent - store confirmationResult for step 2
    window.confirmationResult = confirmationResult;
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

#### Step 2: Verify Code and Complete Sign-In

```typescript
import { confirmPhoneSignIn } from '@/firebase/non-blocking-login';

// User enters the SMS code
const verificationCode = "123456";

// Verify the code and sign in
confirmPhoneSignIn(window.confirmationResult, verificationCode)
  .then(userCredential => {
    // Success - user is now signed in
    const user = userCredential.user;
    console.log("Phone user:", user.phoneNumber);
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

**Note:**
- Phone numbers must be in E.164 format (e.g., +15551234567)
- Ensure Phone as an enabled sign-in provider in the Firebase Console
- reCAPTCHA verification is required to prevent abuse

## 3. Sign Out

Sign out the currently authenticated user:

```typescript
import { auth } from '@/firebase';
import { initiateSignOut } from '@/firebase/non-blocking-login';

// Sign out the user
initiateSignOut(auth)
  .then(() => {
    console.log("User signed out successfully");
  })
  .catch(error => {
    // Error is automatically displayed via toast notification
  });
```

## 4. Protected Routes

Use the `withAuth` higher-order component to protect routes that require authentication:

```typescript
import withAuth from '@/components/auth/withAuth';

function DashboardPage() {
  // This page is only accessible to authenticated users
  return <div>Dashboard Content</div>;
}

export default withAuth(DashboardPage);
```

Alternatively, use the `useUser` hook to check authentication status:

```typescript
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';

function MyPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return <div>Loading...</div>;
  }

  return <div>Protected Content</div>;
}
```

## 5. Architecture Overview

### Key Files

- `src/firebase/index.ts` - Firebase initialization and service exports
- `src/firebase/config.ts` - Firebase configuration
- `src/firebase/provider.tsx` - FirebaseProvider component with auth state listener
- `src/firebase/non-blocking-login.tsx` - Authentication utility functions
- `src/firebase/auth/use-user.tsx` - useUser hook for accessing auth state
- `src/components/auth/LoginScreen.tsx` - Login UI component
- `src/components/auth/withAuth.tsx` - HOC for protecting routes
- `src/app/layout.tsx` - Root layout wrapping app with FirebaseClientProvider

### Data Flow

1. **App Initialization**: `FirebaseClientProvider` wraps the entire app in `layout.tsx`
2. **Auth State Monitoring**: `FirebaseProvider` subscribes to `onAuthStateChanged`
3. **User Actions**: Components call authentication functions from `non-blocking-login.tsx`
4. **State Updates**: Auth state changes are automatically detected and propagated
5. **UI Updates**: Components using `useUser` hook automatically re-render with new auth state

### User Document Creation

When a user signs up or signs in with a new provider, a user document is automatically created in Firestore:

```typescript
const newUser = {
  id: user.uid,
  email: user.email || '',
  tier: 'free',
  status: 'active',
  revenue: 0,
};

// Saved to Firestore at /users/{userId}
setDocumentNonBlocking(userRef, newUser, { merge: true });
```

## 6. Configuration Checklist

To enable all authentication methods, ensure the following are configured in your Firebase Console:

### Firebase Console Setup

1. **Email/Password**:
   - Navigate to Authentication > Sign-in method
   - Enable "Email/Password" provider

2. **Google**:
   - Navigate to Authentication > Sign-in method
   - Enable "Google" provider
   - No additional configuration needed for web

3. **Apple**:
   - Navigate to Authentication > Sign-in method
   - Enable "Apple" provider
   - Configure Service ID in Apple Developer Console
   - Add authorized domains in Firebase Console

4. **Phone**:
   - Navigate to Authentication > Sign-in method
   - Enable "Phone" provider
   - Configure reCAPTCHA settings
   - Add test phone numbers if needed (for development)

### Security Rules

Ensure your Firestore security rules allow authenticated users to access their own data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Error Handling

All authentication functions include built-in error handling with user-friendly toast notifications. Common errors are translated to readable messages:

- `auth/email-already-in-use` → "This email is already in use..."
- `auth/invalid-credential` → "Invalid credentials. Please check..."
- `auth/popup-closed-by-user` → "Sign-in popup was closed..."
- `auth/invalid-phone-number` → "Invalid phone number format..."
- `auth/invalid-verification-code` → "Invalid verification code..."

## 8. Best Practices

1. **Never block the UI**: All auth functions are non-blocking and return promises
2. **Use auth state listener**: Don't manually check auth state; rely on `onAuthStateChanged`
3. **Secure sensitive operations**: Use Firebase Security Rules to protect data
4. **Handle loading states**: Always show loading indicators during auth operations
5. **Clean up listeners**: Unsubscribe from auth listeners on component unmount
6. **Validate input**: Always validate email, password, and phone number formats
7. **Use HTTPS**: Ensure your production app uses HTTPS for all auth operations

## 9. Testing

For development, you can use test credentials:

```typescript
// Default test credentials (from LoginScreen.tsx)
const email = 'test@masseurfriend.com';
const password = 'password';
```

Or add test phone numbers in Firebase Console under Authentication > Sign-in method > Phone > Test phone numbers.

## Conclusion

This Firebase Authentication setup provides a robust, production-ready authentication system with multiple sign-in methods, automatic state management, and comprehensive error handling. The architecture ensures a responsive UI and seamless user experience across all authentication flows.
