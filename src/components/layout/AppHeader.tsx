"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, LogOut, Gem, User as UserIcon, Menu } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from '@/lib/types';


interface AppHeaderProps {
  user: { name: string; tier: User['tier'], role: User['role'] } | null;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const AppLogo = () => (
    <svg 
        viewBox="0 0 32 32" 
        xmlns="http://www.w3.org/2000/svg" 
        aria-hidden="true" 
        role="presentation" 
        focusable="false" 
        className="h-8 w-8 text-primary block"
        fill="currentColor"
    >
        <path d="M16 1c2.008 0 3.937.78 5.303 2.146C22.67 4.513 23.45 6.442 23.45 8.45c0 2.007-.78 3.936-2.147 5.302-1.365 1.366-3.294 2.148-5.303 2.148-2.008 0-3.937-.782-5.302-2.148C9.33 12.385 8.55 10.456 8.55 8.45c0-2.008.78-3.937 2.148-5.304A7.495 7.495 0 0 1 16 1zm0 2c-1.506 0-2.953.585-3.996 1.628-1.043 1.042-1.628 2.49-1.628 3.997s.585 2.954 1.628 3.996c1.043 1.043 2.49 1.628 3.996 1.628s2.954-.585 3.997-1.628c1.042-1.042 1.628-2.49 1.628-3.996s-.586-2.955-1.628-3.997A5.626 5.626 0 0 0 16 3zm0 14.5a7.5 7.5 0 0 1 7.45 7.05v7.45H21.5v-7.45a5.5 5.5 0 0 0-5.5-5.5 5.5 5.5 0 0 0-5.5 5.5v7.45H8.55v-7.45A7.5 7.5 0 0 1 16 17.5z"></path>
    </svg>
);

export default function AppHeader({ user, onLogout, darkMode, setDarkMode }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
             <Link href="/" className="flex items-center gap-2">
              <AppLogo />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">MasseurPro</h1>
                <p className="text-xs text-muted-foreground -mt-1">by XRankFlow</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="outline" className="flex gap-2 items-center rounded-full pl-1 pr-3 py-1 h-auto">
                    <Menu className="w-5 h-5 text-muted-foreground" />
                    <div className="w-7 h-7 bg-muted rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-foreground"/>
                    </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <p className="font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground font-normal">Welcome back!</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user && (
                    <DropdownMenuItem disabled>
                        <div className="flex gap-2">
                            <Badge 
                                variant={user.tier === 'platinum' ? 'default' : 'secondary'} 
                                className="capitalize"
                            >
                                {user.tier} Plan
                            </Badge>
                             <Badge 
                                variant='outline'
                                className="capitalize"
                            >
                                {user.role}
                            </Badge>
                        </div>
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                    <span>Toggle Theme</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

          </div>
        </div>
      </div>
    </header>
  );
}
