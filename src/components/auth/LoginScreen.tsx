
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn, initiateGoogleSignIn, initiateAppleSignIn } from '@/firebase/non-blocking-login';
import PasswordResetModal from './PasswordResetModal';

const AppLogo = () => (
    <svg 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true" 
        role="presentation" 
        focusable="false" 
        className="h-12 w-12 text-primary block"
        fill="currentColor"
    >
        <path d="M16 1c2.008 0 3.937.78 5.303 2.146C22.67 4.513 23.45 6.442 23.45 8.45c0 2.007-.78 3.936-2.147 5.302-1.365 1.366-3.294 2.148-5.303 2.148-2.008 0-3.937-.782-5.302-2.148C9.33 12.385 8.55 10.456 8.55 8.45c0-2.008.78-3.937 2.148-5.304A7.495 7.495 0 0 1 16 1zm0 2c-1.506 0-2.953.585-3.996 1.628-1.043 1.042-1.628 2.49-1.628 3.997s.585 2.954 1.628 3.996c1.043 1.043 2.49 1.628 3.996 1.628s2.954-.585 3.997-1.628c1.042-1.042 1.628-2.49 1.628-3.996s-.586-2.955-1.628-3.997A5.626 5.626 0 0 0 16 3zm0 14.5a7.5 7.5 0 0 1 7.45 7.05v7.45H21.5v-7.45a5.5 5.5 0 0 0-5.5-5.5 5.5 5.5 0 0 0-5.5 5.5v7.45H8.55v-7.45A7.5 7.5 0 0 1 16 17.5z"></path>
    </svg>
);


interface LoginScreenProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function LoginScreen({ darkMode, setDarkMode }: LoginScreenProps) {
  const auth = useAuth();
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  const handleLogin = () => {
    setActionInProgress(true);
    initiateAnonymousSignIn(auth).finally(() => {
      setActionInProgress(false);
    });
  };

  const handleGoogleSignIn = () => {
    setActionInProgress(true);
    initiateGoogleSignIn(auth)
      .catch(() => {
        // Error handling is done in the initiateGoogleSignIn function
      })
      .finally(() => {
        setActionInProgress(false);
      });
  };

  const handleAppleSignIn = () => {
    setActionInProgress(true);
    initiateAppleSignIn(auth)
      .catch(() => {
        // Error handling is done in the initiateAppleSignIn function
      })
      .finally(() => {
        setActionInProgress(false);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-300">
      <Card className="w-full max-w-sm shadow-2xl border-none">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <AppLogo />
            </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome to MasseurPro</CardTitle>
          <CardDescription>AI market intelligence by XRankFlow MG.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-center text-muted-foreground">Click the button below to start your session.</p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <Button onClick={handleLogin} className="w-full font-bold" size="lg" disabled={actionInProgress}>
            {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enter Anonymously
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            className="w-full"
            size="lg"
            variant="outline"
            disabled={actionInProgress}
          >
            {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>

          <Button
            onClick={handleAppleSignIn}
            className="w-full"
            size="lg"
            variant="outline"
            disabled={actionInProgress}
          >
            {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="apple" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"></path>
            </svg>
            Apple
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-4 right-4"
            aria-label="Toggle dark mode"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </CardFooter>
      </Card>
      <PasswordResetModal 
        isOpen={showPasswordReset} 
        onClose={() => setShowPasswordReset(false)} 
      />
    </div>
  );
}
