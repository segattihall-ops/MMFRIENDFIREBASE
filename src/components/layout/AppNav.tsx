"use client";

import type { ActiveTab } from '@/lib/types';
import { cn } from '@/lib/utils';
import { LayoutGrid, Map, Plane, DollarSign, Users, MessageSquare, ShieldCheck } from 'lucide-react';

interface AppNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  user: { name: string; tier: 'platinum' | 'gold', isAdmin: boolean } | null;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'heatmap', label: 'Heatmap', icon: Map },
  { id: 'planner', label: 'Trip Planner', icon: Plane },
  { id: 'revenue', label: 'Revenue', icon: DollarSign },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'community', label: 'Community', icon: MessageSquare }
] as const;

const adminNavItem = { id: 'admin', label: 'Admin', icon: ShieldCheck } as const;


export default function AppNav({ activeTab, setActiveTab, user }: AppNavProps) {
  const allNavItems = user?.isAdmin ? [...navItems, adminNavItem] : navItems;
  
  return (
    <div className="border-b">
      <nav className="max-w-7xl mx-auto flex overflow-x-auto -mb-px" aria-label="Tabs">
        {allNavItems.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex shrink-0 items-center gap-2 px-3 sm:px-4 py-3 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300 dark:hover:border-gray-700'
            )}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            <tab.icon className="h-5 w-5" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
