"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon } from 'lucide-react';

const AppLogo = () => (
    <svg
      viewBox="0 0 1000 1000"
      role="img"
      aria-label="MasseurPro Logo"
      className="h-16 w-16 text-primary"
      fill="currentColor"
    >
      <path d="M499.3 125.7C293.1 125.7 125 294.2 125 500.8s168.1 375.1 374.3 375.1S875 707.4 875 500.8c0-206.6-168.1-375.1-375.7-375.1zM499.3 805.4c-168.1 0-304.9-137-304.9-304.6 0-167.6 136.8-304.6 304.9-304.6s304.9 137 304.9 304.6c0 167.6-136.8 304.6-304.9 304.6zm136.2-416.5c-29.3-33-72.3-51.4-118-49.4-44.1 2-86.4 20.3-116.5 51.5-30.1 31.1-46.7 73-44.7 117.1 2 44.1 20.3 86.4 51.4 116.5 31.1 30.1 73 46.7 117.1 44.7 44.1-2 86.4-20.3 116.5-51.4 30.1-31.1 46.7-73 44.7-117.1-2.1-44.1-20.4-86.4-50.5-111.9zm-136.2 249.7c-61.9 0-112.3-50.5-112.3-112.3S437.2 414 499.1 414s112.3 50.5 112.3 112.3-50.4 112.3-112.3 112.3z" />
    </svg>
);


interface LoginScreenProps {
  onLogin: (email: string, pass: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function LoginScreen({ onLogin, darkMode, setDarkMode }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background transition-colors duration-300">
      <Card className="w-full max-w-sm shadow-2xl border-none">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4">
                <AppLogo />
            </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome to MasseurPro</CardTitle>
          <CardDescription>Your AI market intelligence platform.</CardDescription>
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
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="admin123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>
           <CardDescription className="text-xs text-center pt-2">
            <strong>Demo:</strong> use `admin@masseurfriend.com` and `admin123` or any other credentials.
          </CardDescription>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={handleSignIn} className="w-full font-bold" size="lg">
            Sign In
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
