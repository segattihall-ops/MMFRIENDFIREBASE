
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';

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

  const handleLogin = () => {
    setActionInProgress(true);
    initiateAnonymousSignIn(auth).finally(() => {
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
    </div>
  );
}
