"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ActiveTab, User, Forecast } from '@/lib/types';
import { predictAllDemandsAction } from '@/lib/actions';
import LoginScreen from './auth/LoginScreen';
import AppHeader from './layout/AppHeader';
import AppNav from './layout/AppNav';
import Heatmap from './heatmap/Heatmap';
import Planner from './planner/Planner';
import RevenueDashboard from './revenue/RevenueDashboard';
import ClientCrm from './crm/ClientCrm';
import CommunityForum from './community/CommunityForum';
import AdminDashboard from './admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';

export default function MasseurProApp() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<{ name: string; tier: 'platinum' | 'gold' | 'silver' | 'free', isAdmin: boolean } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-foreground', 'hsl(355.7 100% 97.3%)');
    document.documentElement.style.setProperty('--primary', 'hsl(346.8 77.2% 49.8%)');
    document.documentElement.style.setProperty('--background', darkMode ? 'hsl(224 71.4% 4.1%)' : 'hsl(0 0% 100%)');
    document.documentElement.style.setProperty('--foreground', darkMode ? 'hsl(210 20% 98%)' : 'hsl(224 71.4% 4.1%)');
    document.documentElement.style.setProperty('--muted', darkMode ? 'hsl(215 27.9% 16.9%)' : 'hsl(220 14.3% 95.9%)');
    document.documentElement.style.setProperty('--muted-foreground', darkMode ? 'hsl(217.9 10.6% 64.9%)' : 'hsl(220 8.9% 46.1%)');
    document.documentElement.style.setProperty('--accent', darkMode ? 'hsl(215 27.9% 16.9%)' : 'hsl(220 14.3% 95.9%)');
    document.documentElement.style.setProperty('--accent-foreground', darkMode ? 'hsl(210 20% 98%)' : 'hsl(220.9 39.3% 11%)');
    document.documentElement.style.setProperty('--border', darkMode ? 'hsl(215 27.9% 16.9%)' : 'hsl(220 13% 91%)');

    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = (email: string) => {
    let loggedInUser;
    if (email.toLowerCase() === 'admin@masseurfriend.com') {
      loggedInUser = { name: 'Admin', tier: 'platinum', isAdmin: true };
      setActiveTab('admin');
    } else {
      const tiers: ('free' | 'silver' | 'gold' | 'platinum')[] = ['free', 'silver', 'gold', 'platinum'];
      const randomTier = tiers[Math.floor(Math.random() * tiers.length)];
      loggedInUser = { name: 'Demo User', tier: randomTier, isAdmin: false };
      setActiveTab('dashboard');
    }
    setUser(loggedInUser);
    setShowLogin(false);
    toast({
        title: "Login Successful",
        description: `Welcome back, ${loggedInUser.name}! You are on the ${loggedInUser.tier} plan.`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    setSelectedCity(null);
    setActiveTab('dashboard');
  };
  
  const handleCitySelect = useCallback((cityName: string | null) => {
    setSelectedCity(cityName);
    if (cityName) {
      setActiveTab('planner');
    } else {
      setActiveTab('dashboard');
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'dashboard' && !selectedCity) {
      // Logic for non-heatmap tabs can go here
    }
     if (activeTab === 'dashboard') {
      setSelectedCity(null);
    }
  }, [activeTab, selectedCity]);

  useEffect(() => {
    if (showLogin) return;
    
    let isCancelled = false;

    const fetchForecasts = async () => {
        setIsLoadingForecast(true);
        setForecastData([]);
        try {
            const forecasts = await predictAllDemandsAction();
            if (!isCancelled) {
                setForecastData(forecasts);
            }
        } catch (error) {
            console.error(error);
            if (!isCancelled) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not fetch market demand data. Please try again later.",
                });
            }
        } finally {
            if (!isCancelled) {
                setIsLoadingForecast(false);
            }
        }
    };
    
    fetchForecasts();

    return () => {
        isCancelled = true;
    };
  }, [showLogin, toast]);

  const renderContent = () => {
    if (activeTab === 'planner' && selectedCity) {
       return <Planner 
            selectedCityName={selectedCity} 
            onCitySelect={handleCitySelect} 
            forecastData={forecastData}
            userTier={user!.tier}
        />
    }

    switch (activeTab) {
        case 'dashboard':
            return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={user!.tier}
            />;
        case 'revenue':
            return <RevenueDashboard />;
        case 'clients':
            return <ClientCrm />;
        case 'community':
            return <CommunityForum />;
        case 'admin':
            return user?.isAdmin ? <AdminDashboard /> : <p>Access Denied</p>;
        default:
             return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={user!.tier}
            />;
    }
  }

  if (showLogin) {
    return <LoginScreen onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      <AppNav activeTab={activeTab} setActiveTab={setActiveTab} user={user} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <footer className="border-t mt-12 py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center gap-4 mb-4">
                <a href="#" className="hover:text-primary">Terms of Service</a>
                <a href="#" className="hover:text-primary">Privacy Policy</a>
                <a href="#" className="hover:text-primary">Help Center</a>
            </div>
            <p>&copy; {new Date().getFullYear()} MasseurPro. All rights reserved.</p>
            <p className="mt-2 text-xs">Disclaimer: All data is for informational purposes only and does not guarantee income or safety. Use your professional judgment.</p>
        </div>
      </footer>
    </div>
  );
}
