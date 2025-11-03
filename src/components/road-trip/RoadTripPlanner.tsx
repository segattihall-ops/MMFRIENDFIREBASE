
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { generateRoadTripAction } from '@/lib/actions';
import { Loader2, Route, Sparkles } from 'lucide-react';
import type { GenerateRoadTripItineraryOutput } from '@/ai/flows/generate-road-trip-itinerary';
import Link from 'next/link';

const formSchema = z.object({
  origin: z.string().min(1, 'Origin is required.'),
  destination: z.string().min(1, 'Destination is required.'),
  travelMode: z.enum(['car', 'bus', 'plane', 'mix']),
  stops: z.number().min(1).max(5),
});

type RoadTripFormValues = z.infer<typeof formSchema>;

interface RoadTripPlannerProps {
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function RoadTripPlanner({ userTier }: RoadTripPlannerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] =
    useState<GenerateRoadTripItineraryOutput | null>(null);

  const form = useForm<RoadTripFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      origin: 'Dallas, TX',
      destination: 'San Francisco, CA',
      travelMode: 'car',
      stops: 2,
    },
  });

  const onSubmit = async (values: RoadTripFormValues) => {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generateRoadTripAction(values);
      setItinerary(result);
    } catch (error) {
      console.error('Road Trip Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error Generating Itinerary',
        description:
          'There was a problem creating your road trip. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (userTier !== 'platinum') {
    return (
      <Card className="text-center p-8">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            This is a Platinum Feature
          </CardTitle>
          <CardDescription className="my-4">
            Upgrade to the Platinum plan to unlock the AI Road Trip Planner and
            optimize your travel routes for maximum profit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/subscribe">
            <Button>Upgrade to Platinum</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">
          AI Road Trip Planner
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Turn your travel time into profitable opportunities. Plan a multi-city
          tour with AI-suggested stops.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Plan Your Route</CardTitle>
            <CardDescription>
              Tell the AI your start and end points.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Origin</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Dallas, TX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., San Francisco, CA"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="travelMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a travel mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="car">Car</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="plane">Plane</SelectItem>
                          <SelectItem value="mix">Mix</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stops"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Overnight Stops: {field.value}
                      </FormLabel>
                      <FormControl>
                        <Controller
                          name="stops"
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <Slider
                              min={1}
                              max={5}
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                            />
                          )}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Itinerary
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {isLoading && (
            <Card className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  AI is planning your optimal route...
                </p>
              </div>
            </Card>
          )}

          {!isLoading && !itinerary && (
            <Card className="flex items-center justify-center min-h-[400px]">
              <div className="text-center text-muted-foreground p-8">
                <Route className="mx-auto h-12 w-12" />
                <p className="mt-4">
                  Your personalized road trip itinerary will appear here.
                </p>
              </div>
            </Card>
          )}

          {itinerary && (
            <Card>
              <CardHeader>
                <CardTitle>Your AI-Powered Road Trip</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
                {itinerary.itinerary}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
