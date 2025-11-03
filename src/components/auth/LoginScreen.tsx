"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon } from 'lucide-react';

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
