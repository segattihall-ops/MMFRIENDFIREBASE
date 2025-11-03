"use client";

import type { Forecast } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface HeatmapProps {
  forecastData: Forecast[];
  isLoading: boolean;
  onCitySelect: (cityName: string) => void;
}

const getBorderColor = (score: number) => {
    if (score >= 70) return 'border-red-500 hover:bg-red-500/10';
    if (score >= 50) return 'border-yellow-500 hover:bg-yellow-500/10';
    return 'border-border hover:bg-accent';
};

const getDemandText = (score: number) => {
    if (score >= 70) return { text: 'High Demand', color: 'text-red-500'};
    if (score >= 50) return { text: 'Medium Demand', color: 'text-yellow-500'};
    return { text: 'Low Demand', color: 'text-muted-foreground' };
}

export default function Heatmap({ forecastData, isLoading, onCitySelect }: HeatmapProps) {
  const sortedForecast = [...forecastData].sort((a, b) => b.demandScore - a.demandScore);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, i) => (
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
              className={`cursor-pointer transition-all duration-200 border-2 ${getBorderColor(forecast.demandScore)}`}
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
