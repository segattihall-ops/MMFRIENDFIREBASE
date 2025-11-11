
"use client";

import { useState, useEffect } from 'react';

// This is a browser-only hook.
// Make sure window is defined before using.
declare global {
  interface Window {
    trends?: any;
  }
}

interface UseGoogleTrendsProps {
    widgetRef: React.RefObject<HTMLDivElement>;
    type: "TIMESERIES" | "GEO_MAP";
    keyword: string;
    geo: string;
    time: string;
}

export const useGoogleTrends = ({ widgetRef, type, keyword, geo, time }: UseGoogleTrendsProps) => {
  const [isScriptLoaded, setScriptLoaded] = useState(false);
  const [isRendered, setIsRendered] = useState(false);

  const trendsGeo = `US-${geo}`;

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://ssl.gstatic.com/trends_nrtr/3620_RC01/embed_loader.js"]');

    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://ssl.gstatic.com/trends_nrtr/3620_RC01/embed_loader.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Clean up the script if the component unmounts
      // Although, in a SPA, we might want to leave it loaded.
    };
  }, []);

  useEffect(() => {
    // Ensure we run this only on the client
    if (typeof window === 'undefined' || !window.trends || !isScriptLoaded || !widgetRef.current) {
        return;
    }
    
    // Debounce or ensure it doesn't re-render excessively
    const handler = setTimeout(() => {
        if (widgetRef.current) {
             widgetRef.current.innerHTML = "";
             try {
                window.trends.embed.renderExploreWidgetTo(
                    widgetRef.current,
                    type,
                    {
                        comparisonItem: [{ keyword, geo: trendsGeo, time }],
                        category: 0,
                        property: ""
                    },
                    {
                        exploreQuery: `date=${time.replace(' ', '%20')}&geo=${trendsGeo}&q=${encodeURIComponent(keyword)}&hl=en`,
                        guestPath: "https://trends.google.com:443/trends/embed/"
                    }
                );
                setIsRendered(true);
             } catch (error) {
                console.error("Google Trends embed error:", error);
                setIsRendered(false);
             }
        }
    }, 500); // A small delay to prevent rapid re-renders on prop changes

    return () => clearTimeout(handler);
    
  }, [isScriptLoaded, keyword, trendsGeo, time, type, widgetRef]);

  return { isLoaded: isScriptLoaded && isRendered };
};

    

    
