
"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ActiveTab, Forecast, User } from '@/lib/types';
import { predictAllDemandsAction } from '@/lib/actions';
import AppHeader from './layout/AppHeader';
import AppNav from './layout/AppNav';
import Heatmap from './heatmap/Heatmap';
import Planner from './planner/Planner';
import RoadTripPlanner from './road-trip/RoadTripPlanner';
import RevenueDashboard from './revenue/RevenueDashboard';
import ClientCrm from './crm/ClientCrm';
import CommunityForum from './community/CommunityForum';
import SafetyReport from './safety/SafetyReport';
import AdminDashboard from './admin/AdminDashboard';
import UserProfile from './profile/UserProfile';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { signOut } from 'firebase/auth';
import MasseurBnb from './masseurbnb/MasseurBnb';
import ServicesMarketplace from './services/ServicesMarketplace';
import { doc } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function MasseurProApp() {
  const { user, isLoading: isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userDoc, isLoading: isUserDocLoading } = useDoc<User>(userDocRef);
  
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  
  const [forecastData, setForecastData] = useState<Forecast[]>([]);
  const [isLoadingForecast, setIsLoadingForecast] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const appUser = useMemo(() => {
    if (!user || !userDoc) return null;
    
    const role = userDoc.role || 'customer';
    // Admins should always have platinum access.
    const tier = role === 'admin' ? 'platinum' : userDoc.tier || 'free';

    return {
      name: user.email?.split('@')[0] || 'User',
      tier,
      role,
    };
  }, [user, userDoc]);

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
      // Clear any local state first
      setSelectedCity(null);
      setViewingProfileId(null);
      setActiveTab('dashboard');

      await signOut(auth);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });

      router.push('/login');
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
      setViewingProfileId(null);
    }
    setActiveTab(tab);
  }

  const handleViewProfile = (userId: string) => {
    setViewingProfileId(userId);
    setActiveTab('profile');
  };

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

    if (activeTab === 'profile' && viewingProfileId) {
        return <UserProfile 
            userId={viewingProfileId} 
            onViewProfile={handleViewProfile} 
            isAdmin={appUser?.role === 'admin' || false}
        />;
    }

    switch (activeTab) {
        case 'dashboard':
            return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={userTier}
            />;
        case 'road-trip':
            return <RoadTripPlanner userTier={userTier} />;
        case 'masseurbnb':
            return <MasseurBnb userTier={userTier} />;
        case 'services':
            return <ServicesMarketplace userTier={userTier} onViewProfile={handleViewProfile} />;
        case 'safety':
            return <SafetyReport userTier={userTier} />;
        case 'revenue':
            return <RevenueDashboard userTier={userTier} />;
        case 'clients':
            return <ClientCrm userTier={userTier} />;
        case 'community':
            return <CommunityForum userTier={userTier} />;
        case 'admin':
            return appUser?.role === 'admin' ? <AdminDashboard onViewProfile={handleViewProfile} /> : <p>Access Denied</p>;
        default:
             return <Heatmap 
                forecastData={forecastData} 
                isLoading={isLoadingForecast} 
                onCitySelect={handleCitySelect} 
                userTier={userTier}
            />;
    }
  }

  // If the user has been confirmed to be logged out, return null immediately.
  // The withAuth HOC or a page-level effect will handle the redirect.
  if (!isUserLoading && !user) {
    return null;
  }

  // This is the main loading gate. It waits for both auth and the user document.
  if (isUserLoading || isUserDocLoading || !appUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
