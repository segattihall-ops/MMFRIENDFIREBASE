
"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sun, Moon, Loader2 } from 'lucide-react';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { useToast } from '@/hooks/use-toast';
import { AuthError, onAuthStateChanged } from 'firebase/auth';

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
  const { toast } = useToast();
  const [email, setEmail] = useState('test@masseurfriend.com');
  const [password, setPassword] = useState('password');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(false);


  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsLoading(false);
        setActionInProgress(false);
        if (user) {
            toast({
                title: "Login Successful",
                description: `Welcome back, ${user.email}!`,
            });
        }
    }, (error: AuthError) => {
        setIsLoading(false);
        setActionInProgress(false);
        toast({
            variant: "destructive",
            title: "Authentication Error",
            description: error.message,
        });
    });

    return () => unsubscribe();
  }, [auth, toast]);

  const handleAuthAction = (action: 'signIn' | 'signUp') => {
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Missing fields",
            description: "Please enter both email and password.",
        });
      return;
    }

    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    } else {
        localStorage.removeItem('rememberedEmail');
    }
    
    setActionInProgress(true);

    if (action === 'signIn') {
        initiateEmailSignIn(auth, email, password);
    } else {
        initiateEmailSignUp(auth, email, password);
    }
  };
  
  if (isLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

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
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@masseurfriend.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuthAction('signIn')}
              disabled={actionInProgress}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuthAction('signIn')}
               disabled={actionInProgress}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={actionInProgress}
            />
            <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
           <Button onClick={() => handleAuthAction('signIn')} className="w-full font-bold" size="lg" disabled={actionInProgress}>
            {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
           <Button onClick={() => handleAuthAction('signUp')} className="w-full" size="lg" variant="secondary" disabled={actionInProgress}>
             {actionInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign Up
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
