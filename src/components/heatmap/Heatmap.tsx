"use client";

import type { Forecast } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeatmapProps {
  forecastData: Forecast[];
  isLoading: boolean;
  onCitySelect: (cityName: string) => void;
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

const getBorderColor = (score: number) => {
    if (score >= 70) return 'border-primary/80 hover:bg-primary/10 shadow-primary/20';
    if (score >= 50) return 'border-yellow-400 hover:bg-yellow-400/10 shadow-yellow-400/20';
    return 'border-border hover:bg-accent';
};

const getDemandText = (score: number) => {
    if (score >= 70) return { text: 'High Demand', color: 'text-primary/90'};
    if (score >= 50) return { text: 'Medium Demand', color: 'text-yellow-500'};
    return { text: 'Low Demand', color: 'text-muted-foreground' };
}

export default function Heatmap({ forecastData, isLoading, onCitySelect, userTier }: HeatmapProps) {
  const sortedForecast = [...forecastData].sort((a, b) => b.demandScore - a.demandScore);
  
  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">Find Your Next Destination</h1>
        <p className="text-lg text-muted-foreground mt-2">AI-powered demand insights for top US cities.</p>
      </div>
      
      {userTier === 'free' && (
        <Card className="bg-accent/50 dark:bg-accent/20 border-primary/50 text-center p-6">
          <CardTitle className="font-headline text-xl">Unlock Your Full Potential</CardTitle>
          <CardDescription className="mb-4 mt-1">You are on the Free plan. Upgrade to unlock the Trip Planner and more.</CardDescription>
          <Link href="/subscribe">
            <Button>Upgrade to a Platinum Plan</Button>
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
          sortedForecast.map((forecast) => (
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
                <p className="text-xs text-muted-foreground">Demand Spike</p>
                <p className="text-3xl font-bold">{forecast.demandScore}%</p>
                <p className={`text-xs font-semibold ${getDemandText(forecast.demandScore).color}`}>{getDemandText(forecast.demandScore).text}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}