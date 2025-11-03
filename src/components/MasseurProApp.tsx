
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ActiveTab, Forecast } from '@/lib/types';
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
import { useUser } from '@/firebase/auth/use-user';
import { signOut, Auth } from 'firebase/auth';
import { useAuth } from '@/firebase';

export default function MasseurProApp() {
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const { toast } = useToast();

  const appUser = user ? { name: user.email?.split('@')[0] || 'User', tier: 'platinum' as const, isAdmin: user.email === 'admin@masseurfriend.com' } : null;

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // useUser hook will update the user state automatically
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      setActiveTab('dashboard');
      setSelectedCity(null);
    } catch (error) {
      console.error("Logout Error:", error);
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
      });
    }
  };
  
  const handleCitySelect = useCallback((cityName: string | null) => {
    setSelectedCity(cityName);
    if (cityName) {
      setActiveTab('planner');
    }
     else {
      setActiveTab('dashboard');
    }
  }, []);

  const handleTabSelect = (tab: ActiveTab) => {
     if (tab === 'dashboard') {
      setSelectedCity(null);
    }
    setActiveTab(tab);
  }

  useEffect(() => {
    if (!user) return;
    
    let isCancelled = false;

    const fetchForecasts = async () => {
        setIsLoadingForecast(true);
        setForecastData([]);
        try {
            const forecasts = await predictAllDemandsAction();
            if (!isCancelled) {
                setForecastData(forecasts);
            }
        } catch (error: any) {
            console.error(error);
             if (!isCancelled) {
                toast({
                    variant: "destructive",
                    title: "Error Fetching Data",
                    description: "Could not fetch market demand. Please try again later.",
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
  }, [user, toast]);

  const renderContent = () => {
    const userTier = appUser?.tier || 'free';
    
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
            return appUser?.isAdmin ? <AdminDashboard /> : <p>Access Denied</p>;
        default:
             return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={userTier}
            />;
    }
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen darkMode={darkMode} setDarkMode={setDarkMode} />;
  }
  
  if (!appUser) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader user={appUser} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      <AppNav activeTab={activeTab} setActiveTab={handleTabSelect} user={appUser} />

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
