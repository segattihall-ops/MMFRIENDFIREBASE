"use client";

import type { ActiveTab } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LayoutGrid, Map, Plane, DollarSign, Users, MessageSquare, ShieldCheck } from 'lucide-react';

interface AppNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: { name: string; tier: 'platinum' | 'gold' | 'silver' | 'free', isAdmin: boolean } | null;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'planner', label: 'Trip Planner', icon: Plane },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'community', label: 'Community', icon: MessageSquare }
] as const;

const adminNavItem = { id: 'admin', label: 'Admin', icon: ShieldCheck } as const;


export default function AppNav({ activeTab, setActiveTab, user }: AppNavProps) {
  if (!user) return null;
  const allNavItems = user.isAdmin ? [...navItems, adminNavItem] : navItems;
  
  return (
    <div className="border-b">
      <nav className="max-w-7xl mx-auto flex justify-center overflow-x-auto -mb-px" aria-label="Tabs">
        {allNavItems.map(tab => {
          const isDisabled = 
            (tab.id === 'planner' && (user.tier === 'free' || user.tier === 'silver')) ||
            (tab.id === 'revenue' && user.tier !== 'platinum') ||
            (tab.id === 'clients' && user.tier !== 'platinum') ||
            (tab.id === 'community' && user.tier !== 'platinum');

            return (
              <button
                key={tab.id}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                disabled={isDisabled}
                className={cn(
                  'flex shrink-0 items-center gap-2 px-3 sm:px-4 py-3 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border',
                  isDisabled && 'opacity-50 cursor-not-allowed'
                )}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <tab.icon className="h-5 w-5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
        })}
      </nav>
    </div>
  );
}
