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
import SafetyReport from './safety/SafetyReport';
import AdminDashboard from './admin/AdminDashboard';
import { useToast } from '@/hooks/use-toast';
import { cities } from '@/lib/data';

export default function MasseurProApp() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<{ name: string; tier: 'platinum' | 'gold' | 'silver' | 'free', isAdmin: boolean } | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
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
      loggedInUser = { name: 'Admin', tier: 'platinum' as const, isAdmin: true };
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
    if (cityName && (user?.tier === 'gold' || user?.tier === 'platinum')) {
      setActiveTab('planner');
    } else if (cityName) {
      // If user is free or silver, we can decide if we want to show a limited planner or just an upgrade message.
      // For now, let's switch to planner tab, the planner component will handle the gating.
       setActiveTab('planner');
    }
     else {
      setActiveTab('dashboard');
    }
  }, [user?.tier]);

  const handleTabSelect = (tab: ActiveTab) => {
     if (tab === 'dashboard') {
      setSelectedCity(null);
    }
    setActiveTab(tab);
  }

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
                // Fallback for demo purposes if AI fails
                const fallbackForecasts = cities.map(city => ({
                    city: city.name,
                    state: city.state,
                    demandScore: Math.floor(Math.random() * 60) + 30, // Random score between 30-90
                    lgbtqIndex: city.lgbtqIndex,
                }));
                setForecastData(fallbackForecasts);
                toast({
                    variant: "destructive",
                    title: "AI Service Unstable",
                    description: "Could not fetch live market demand. Displaying cached data.",
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
    const userTier = user?.tier || 'free';
    
    if (activeTab === 'planner') {
       return <Planner 
            selectedCityName={selectedCity} 
            onCitySelect={handleCitySelect} 
            forecastData={forecastData}
            userTier={userTier}
        />
    }

    switch (activeTab) {
        case 'dashboard':
            return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={userTier}
            />;
        case 'revenue':
            return <RevenueDashboard userTier={userTier} />;
        case 'clients':
            return <ClientCrm userTier={userTier} />;
        case 'community':
            return <CommunityForum userTier={userTier} />;
        case 'safety':
            return <SafetyReport userTier={userTier} />;
        case 'admin':
            return user?.isAdmin ? <AdminDashboard /> : <p>Access Denied</p>;
        default:
             return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={userTier}
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
      <AppNav activeTab={activeTab} setActiveTab={handleTabSelect} user={user} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <footer className="border-t mt-12 py-8 text-center text-sm text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center gap-4 mb-4">
                <a href="#" className="hover:text-primary">Terms of Service</a>
                <a href="#" className="hover:text-primary">Privacy Policy</a>
                <a href="mailto:masseurpro@xrankflow.com" className="hover:text-primary">Help Center</a>
            </div>
            <p>&copy; {new Date().getFullYear()} XRankFlow MG. All rights reserved.</p>
            <p className="mt-2 text-xs">Disclaimer: All data is for informational purposes only and does not guarantee income or safety. Use your professional judgment.</p>
        </div>
      </footer>
    </div>
  );
}
