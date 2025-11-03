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

export default function AppHeader({ user, onLogout, darkMode, setDarkMode }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-purple-500 to-accent rounded-lg flex items-center justify-center shrink-0">
              <span className="text-2xl" role="img" aria-label="Massage">💆</span>
            </div>
            <div>
              <h1 className="text-xl font-bold font-headline text-primary dark:text-primary-foreground">MasseurPro</h1>
              <p className="text-xs text-muted-foreground">Hey {user?.name || 'User'}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {user && (
              <Badge variant={user.tier === 'platinum' ? 'default' : 'secondary'} className="capitalize">
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
