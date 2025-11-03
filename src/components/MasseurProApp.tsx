
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { ActiveTab, Forecast } from '@/lib/types';
import { predictAllDemandsAction } from '@/lib/actions';
import LoginScreen from './auth/LoginScreen';
import AppHeader from './layout/AppHeader';
import AppNav from './layout/AppNav';
import Dashboard from './dashboard/Dashboard';
import Heatmap from './heatmap/Heatmap';
import Planner from './planner/Planner';
import RevenueDashboard from './revenue/RevenueDashboard';
import ClientCrm from './crm/ClientCrm';
import CommunityForum from './community/CommunityForum';
import { useToast } from '@/hooks/use-toast';

export default function MasseurProApp() {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState<{ name: string; tier: 'platinum' | 'gold' } | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);
  const [customLocation, setCustomLocation] = useState('');
  
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
    if (email === 'admin@masseurfriend.com') {
      setUser({ name: 'Admin', tier: 'platinum' });
    } else {
      setUser({ name: 'Demo User', tier: 'gold' });
    }
    setShowLogin(false);
    toast({
        title: "Login Successful",
        description: `Welcome back, ${email === 'admin@masseurfriend.com' ? 'Admin' : 'Demo User'}!`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
  };
  
  const handleCitySelect = useCallback((cityName: string) => {
    setCustomLocation(cityName);
    setActiveTab('planner');
  }, []);

  useEffect(() => {
    if (!showLogin) {
      const fetchForecasts = async () => {
        setIsLoadingForecast(true);
        setForecastData([]);
        try {
          const forecasts = await predictAllDemandsAction();
          setForecastData(forecasts);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not fetch market demand data. Please try again later.",
            });
        } finally {
            setIsLoadingForecast(false);
        }
      };
      fetchForecasts();
    }
  }, [showLogin, toast]);

  if (showLogin) {
    return <LoginScreen onLogin={handleLogin} darkMode={darkMode} setDarkMode={setDarkMode} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      <AppNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'heatmap' && <Heatmap forecastData={forecastData} isLoading={isLoadingForecast} onCitySelect={handleCitySelect} />}
        {activeTab === 'planner' && <Planner selectedCityName={customLocation} onCitySelect={handleCitySelect} forecastData={forecastData} />}
        {activeTab === 'revenue' && <RevenueDashboard />}
        {activeTab === 'clients' && <ClientCrm />}
        {activeTab === 'community' && <CommunityForum />}
      </main>
    </div>
  );
}
