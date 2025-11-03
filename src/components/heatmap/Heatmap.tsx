
"use client";

import { useState } from 'react';
import type { Forecast } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Flame, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface HeatmapProps {
  forecastData: Forecast[];
  isLoading: boolean;
  onCitySelect: (cityName: string) => void;
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

const getBorderColor = (score: number) => {
    if (score >= 70) return 'border-primary/80 hover:bg-primary/5 shadow-primary/20';
    if (score >= 50) return 'border-orange-400/80 hover:bg-orange-400/5 shadow-orange-400/20';
    return 'border-border hover:bg-accent';
};

const getDemandText = (score: number) => {
    if (score >= 70) return { text: 'High Demand', color: 'text-primary/90'};
    if (score >= 50) return { text: 'Medium Demand', color: 'text-orange-500'};
    return { text: 'Low Demand', color: 'text-muted-foreground' };
}

export default function Heatmap({ forecastData, isLoading, onCitySelect, userTier }: HeatmapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const sortedForecast = [...forecastData].sort((a, b) => b.demandScore - a.demandScore);
  
  const filteredForecast = sortedForecast.filter(forecast => 
    forecast.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    forecast.state.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">Find Your Next Destination</h1>
        <p className="text-lg text-muted-foreground mt-2">AI-powered demand insights for top US cities.</p>
      </div>
      
      {userTier === 'free' && (
        <Card className="bg-muted/30 text-center p-6">
          <CardTitle className="font-headline text-xl">Unlock Your Full Potential</CardTitle>
          <CardDescription className="mb-4 mt-1">You are on the Free plan. Upgrade to unlock the Trip Planner and more.</CardDescription>
          <Link href="/subscribe">
            <Button>Upgrade to a Platinum Plan</Button>
          </Link>
        </Card>
      )}

      <div className="relative max-w-lg mx-auto">
        <Input
            type="text"
            placeholder="Search by city or state..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 15 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-1/2" />
                    <Skeleton className="h-4 w-3/4 mt-2" />
                </CardContent>
            </Card>
          ))
        ) : (
          filteredForecast.map((forecast) => (
            <Card
              key={forecast.city}
              className={`cursor-pointer transition-all duration-300 border-2 hover:shadow-lg hover:-translate-y-1 ${getBorderColor(forecast.demandScore)}`}
              onClick={() => onCitySelect(forecast.city)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline">{forecast.city}</CardTitle>
                <CardDescription>{forecast.state}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3" />Demand Score</p>
                <p className="text-3xl font-bold">{forecast.demandScore}</p>
                <p className={`text-xs font-semibold ${getDemandText(forecast.demandScore).color}`}>{getDemandText(forecast.demandScore).text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
