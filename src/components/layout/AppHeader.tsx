"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, LogOut } from "lucide-react";

interface AppHeaderProps {
  user: { name: string; tier: 'platinum' | 'gold' } | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const AppLogo = () => (
    <svg
      viewBox="0 0 1000 1000"
      role="img"
      aria-label="MasseurPro Logo"
      className="h-8 w-8 text-primary"
      fill="currentColor"
    >
      <path d="M499.3 125.7C293.1 125.7 125 294.2 125 500.8s168.1 375.1 374.3 375.1S875 707.4 875 500.8c0-206.6-168.1-375.1-375.7-375.1zM499.3 805.4c-168.1 0-304.9-137-304.9-304.6 0-167.6 136.8-304.6 304.9-304.6s304.9 137 304.9 304.6c0 167.6-136.8 304.6-304.9 304.6zm136.2-416.5c-29.3-33-72.3-51.4-118-49.4-44.1 2-86.4 20.3-116.5 51.5-30.1 31.1-46.7 73-44.7 117.1 2 44.1 20.3 86.4 51.4 116.5 31.1 30.1 73 46.7 117.1 44.7 44.1-2 86.4-20.3 116.5-51.4 30.1-31.1 46.7-73 44.7-117.1-2.1-44.1-20.4-86.4-50.5-111.9zm-136.2 249.7c-61.9 0-112.3-50.5-112.3-112.3S437.2 414 499.1 414s112.3 50.5 112.3 112.3-50.4 112.3-112.3 112.3z" />
    </svg>
);

export default function AppHeader({ user, onLogout, darkMode, setDarkMode }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <AppLogo />
            <h1 className="text-xl font-bold text-foreground">MasseurPro</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-muted-foreground hidden sm:block">
              Welcome, {user?.name || 'User'}!
            </p>
            {user && (
              <Badge 
                variant={user.tier === 'platinum' ? 'default' : 'secondary'} 
                className="capitalize border-transparent"
              >
                {user.tier}
              </Badge>
            )}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
            >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onLogout} aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
