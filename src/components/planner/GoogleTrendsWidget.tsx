
"use client";

import { useRef } from 'react';
import { useGoogleTrends } from '@/hooks/useGoogleTrends';
import { Skeleton } from '@/components/ui/skeleton';

interface GoogleTrendsWidgetProps {
  keyword: string;
  geo: string;
  type?: "TIMESERIES" | "GEO_MAP";
}

const GoogleTrendsWidget = ({ keyword, geo, type = "TIMESERIES" }: GoogleTrendsWidgetProps) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Get the last 90 days
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 90);

  const startTime = startDate.toISOString().split('T')[0];
  const endTime = endDate.toISOString().split('T')[0];

  const { isLoaded } = useGoogleTrends({
    widgetRef,
    type,
    keyword,
    geo,
    time: `${startTime} ${endTime}`
  });

  return (
    <div className="relative min-h-[400px]">
        {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                <Skeleton className="w-full h-full" />
            </div>
        )}
        <div ref={widgetRef} style={{ width: "100%", minHeight: "400px" }} />
    </div>
  );
};

export default GoogleTrendsWidget;

    