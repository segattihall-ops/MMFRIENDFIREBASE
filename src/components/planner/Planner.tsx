
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cities, seasonalData } from '@/lib/data';
import type { Forecast, CompetitorData } from '@/lib/types';
import { trackCompetitors } from '@/lib/utils';
import { getOptimalPricingAction, generateItineraryAction } from '@/lib/actions';
import type { GenerateOptimalPricingOutput } from '@/ai/flows/generate-optimal-pricing';
import { BrainCircuit, Ticket, Users, Loader2, ArrowLeft, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ItineraryModal from './ItineraryModal';
import GoogleTrendsWidget from './GoogleTrendsWidget';
import Link from 'next/link';

interface PlannerProps {
  selectedCityName: string;
  onCitySelect: (cityName: string | null) => void;
  forecastData: Forecast[];
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function Planner({ selectedCityName, onCitySelect, forecastData, userTier }: PlannerProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [isLoading, setIsLoading] = useState(false);
  const [pricingData, setPricingData] = useState<GenerateOptimalPricingOutput | null>(null);
  const [competitorData, setCompetitorData] = useState<CompetitorData | null>(null);
  const [isItineraryModalOpen, setIsItineraryModalOpen] = useState(false);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [isItineraryLoading, setIsItineraryLoading] = useState(false);

  const { toast } = useToast();

  const selectedCity = useMemo(() => cities.find(c => c.name === selectedCityName), [selectedCityName]);

  useEffect(() => {
    const getPricing = async () => {
      if (!selectedCity) return;
      
      const cityForecast = forecastData.find(f => f.city === selectedCity.name);
      if (!cityForecast) {
          if (forecastData.length > 0 && forecastData.length < cities.length){
            setIsLoading(true);
          } else {
            setIsLoading(false);
          }
          return;
      }

      setIsLoading(true);
      setPricingData(null);
      
      const competitors = trackCompetitors(selectedCity);
      setCompetitorData(competitors);

      const season = seasonalData[selectedMonth];

      try {
        const result = await getOptimalPricingAction({
          city: selectedCity.name,
          state: selectedCity.state,
          spikeProb: cityForecast.demandScore,
          lgbtqIndex: selectedCity.lgbtqIndex,
          month: season.name,
          optimalDays: season.optimalDays,
          multiplier: season.multiplier,
          competitorCount: competitors.totalActive,
          saturation: competitors.saturation,
          avgRate: competitors.avgRate,
        });
        setPricingData(result);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "AI Pricing Error",
          description: "Could not generate pricing recommendations. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (userTier === 'gold' || userTier === 'platinum') {
        getPricing();
    }
  }, [selectedCity, selectedMonth, forecastData, toast, userTier]);

  const handleGenerateItinerary = async () => {
    if (!selectedCity || !pricingData) return;

    setIsItineraryModalOpen(true);
    setIsItineraryLoading(true);
    setItinerary(null);
    
    try {
        const result = await generateItineraryAction({
            city: selectedCity.name,
            numberOfDays: parseInt(seasonalData[selectedMonth].optimalDays.split('-')[1]),
            estimatedEarnings: pricingData.projectedRevenue,
            stayArea: selectedCity.stayArea1
        });
        setItinerary(result.itinerary);
    } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "AI Itinerary Error",
          description: "Could not generate a trip itinerary. Please try again.",
        });
        setIsItineraryModalOpen(false);
    } finally {
        setIsItineraryLoading(false);
    }
  };

  const isPlatinum = userTier === 'platinum';

  if (!selectedCity) {
    return (
        <div className="flex flex-col items-center justify-center text-center h-full min-h-[50vh]">
            <div className="p-8 rounded-lg bg-muted/50">
                <Plane className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold font-headline">Select a City</h2>
                <p className="text-muted-foreground mt-2">Choose a destination from the Dashboard to start planning your trip.</p>
                <Button onClick={() => onCitySelect(null)} className="mt-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="font-headline text-3xl">Trip Planner: {selectedCityName}</CardTitle>
                        <CardDescription>AI-powered insights for your trip to {selectedCityName}.</CardDescription>
                    </div>
                     <Button variant="ghost" onClick={() => onCitySelect(null)}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Dashboard
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
                 <div className="grid lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline flex items-center gap-2"><Users className="w-5 h-5 text-primary"/>Competitor Intel</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            {competitorData ? (
                                <>
                                    <p><strong>Active Competitors:</strong> {competitorData.totalActive}</p>
                                    <p><strong>Market Saturation:</strong> <span className={competitorData.saturation === 'High' ? 'text-destructive' : competitorData.saturation === 'Medium' ? 'text-yellow-500' : 'text-green-600'}>{competitorData.saturation}</span></p>
                                    <p><strong>Average Market Rate:</strong> ~${competitorData.avgRate}/hr</p>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-24">
                                <p className="text-sm text-muted-foreground">Select a city to see competitor data.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary"/>AI Pricing Guidance</CardTitle>
                        </CardHeader>
                        <CardContent>
                        {(userTier === 'free' || userTier === 'silver') && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <p className="font-semibold">This is a Gold feature</p>
                                <p className="text-sm text-muted-foreground mb-4">Upgrade to unlock AI-powered pricing.</p>
                                <Link href="/subscribe"><Button size="sm">Upgrade Now</Button></Link>
                            </div>
                        )}
                        {(userTier === 'gold' || userTier === 'platinum') && (
                            <>
                            {isLoading ? (
                                <div className="flex items-center justify-center h-40">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : pricingData ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Suggested Rate</p>
                                            <p className="text-3xl font-bold text-primary">${pricingData.suggestedRate}<span className="text-base font-normal">/hr</span></p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Est. Bookings</p>
                                            <p className="text-3xl font-bold text-primary">{pricingData.expectedBookings}</p>
                                        </div>
                                    </div>
                                    <div className="text-center bg-primary/10 rounded-lg p-3">
                                        <p className="text-sm text-primary/80">Projected Revenue</p>
                                        <p className="text-2xl font-bold text-primary">${pricingData.projectedRevenue.toLocaleString()}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic p-2 bg-muted/50 rounded"><strong>Reasoning:</strong> {pricingData.reasoning}</p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-40">
                                <p className="text-sm text-muted-foreground text-center">Pricing analysis will appear here. {forecastData.length > 0 && forecastData.length < cities.length ? 'Loading market data...' : 'Select a city and month.'}</p>
                                </div>
                            )}
                            </>
                        )}
                        </CardContent>
                    </Card>
                </div>
                
                {isPlatinum && pricingData && !isLoading && (
                    <Button onClick={handleGenerateItinerary} className="w-full font-bold" size="lg" disabled={isItineraryLoading}>
                    {isItineraryLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                    ) : (
                        <><Ticket className="mr-2 h-4 w-4" /> Generate Trip Itinerary</>
                    )}
                    </Button>
                )}
                 {userTier !== 'platinum' && pricingData && !isLoading && (
                     <Card className="text-center p-6 bg-muted/30">
                        <CardTitle className="font-headline text-lg">AI Itinerary is a Platinum Feature</CardTitle>
                        <CardDescription className="mb-4 mt-1">Upgrade to get a fully-planned trip schedule!</CardDescription>
                        <Link href="/subscribe">
                            <Button>Upgrade to Platinum</Button>
                        </Link>
                    </Card>
                )}

                {isPlatinum && selectedCity && (
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-lg font-headline flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary"/>Real-Time Demand Trends</CardTitle>
                             <CardDescription>90-day search interest for "massage therapy" in {selectedCity.state}.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <GoogleTrendsWidget
                                keyword="massage therapy"
                                geo={`US-${selectedCity.state}`}
                            />
                        </CardContent>
                    </Card>
                )}
            </CardContent>
        </Card>

        <ItineraryModal
            isOpen={isItineraryModalOpen}
            onOpenChange={setIsItineraryModalOpen}
            itinerary={itinerary}
            isLoading={isItineraryLoading}
            cityName={selectedCity?.name || ''}
        />
    </div>
  );
}
