"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cities, seasonalData } from '@/lib/data';
import type { Forecast, CompetitorData } from '@/lib/types';
import { trackCompetitors } from '@/lib/utils';
import { getOptimalPricingAction, generateItineraryAction } from '@/lib/actions';
import type { GenerateOptimalPricingOutput } from '@/ai/flows/generate-optimal-pricing';
import { BrainCircuit, Ticket, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ItineraryModal from './ItineraryModal';

interface PlannerProps {
  selectedCityName: string;
  onCitySelect: (cityName: string) => void;
  forecastData: Forecast[];
}

export default function Planner({ selectedCityName, onCitySelect, forecastData }: PlannerProps) {
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
      if (forecastData.length === 0) return;

      setIsLoading(true);
      setPricingData(null);

      const cityForecast = forecastData.find(f => f.city === selectedCity.name);
      if (!cityForecast) {
        setIsLoading(false);
        return;
      }
      
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

    getPricing();
  }, [selectedCity, selectedMonth, forecastData, toast]);

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


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Trip Planner</CardTitle>
          <CardDescription>Select a destination and month to get AI-powered insights.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Select value={selectedCityName} onValueChange={onCitySelect}>
                <SelectTrigger id="destination">
                  <SelectValue placeholder="Select a city..." />
                </SelectTrigger>
                <SelectContent>
                  {cities.map(city => (
                    <SelectItem key={city.name} value={city.name}>{city.name}, {city.state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="month">Month</Label>
              <Select value={String(selectedMonth)} onValueChange={(val) => setSelectedMonth(Number(val))}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month..." />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(seasonalData).map(([m, d]) => (
                    <SelectItem key={m} value={m}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedCityName && (
            <div className="grid md:grid-cols-2 gap-4 pt-4">
              {/* Competitor Intel */}
              <Card className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="text-base font-headline flex items-center gap-2"><Users className="w-5 h-5 text-primary"/>Competitor Intel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                    {competitorData ? (
                        <>
                            <p><strong>Active Competitors:</strong> {competitorData.totalActive}</p>
                            <p><strong>Market Saturation:</strong> <span className={competitorData.saturation === 'High' ? 'text-red-500 font-semibold' : competitorData.saturation === 'Medium' ? 'text-yellow-500 font-semibold' : 'text-green-500 font-semibold'}>{competitorData.saturation}</span></p>
                            <p><strong>Average Market Rate:</strong> ~${competitorData.avgRate}/hr</p>
                        </>
                    ) : (
                        <p>Select a city to see competitor data.</p>
                    )}
                </CardContent>
              </Card>

              {/* AI Pricing */}
              <Card className="bg-accent/50 dark:bg-accent/20">
                <CardHeader>
                    <CardTitle className="text-base font-headline flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary"/>AI Pricing Guidance</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-24">
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
                        <div className="text-center bg-background/50 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">Projected Revenue</p>
                            <p className="text-2xl font-bold text-green-600">${pricingData.projectedRevenue.toLocaleString()}</p>
                        </div>
                         <p className="text-xs text-muted-foreground italic"><strong>Reasoning:</strong> {pricingData.reasoning}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground h-24 flex items-center justify-center">Pricing analysis will appear here.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          {pricingData && !isLoading && (
            <Button onClick={handleGenerateItinerary} className="w-full font-bold" size="lg" disabled={isItineraryLoading}>
              {isItineraryLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
              ) : (
                <><Ticket className="mr-2 h-4 w-4" /> Generate Trip Itinerary</>
              )}
            </Button>
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
