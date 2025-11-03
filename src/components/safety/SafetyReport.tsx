
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Search, MapPin } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

const safeAreas = [
    { city: "Dallas", area: "Oak Lawn" },
    { city: "Houston", area: "Montrose" },
    { city: "San Francisco", area: "The Castro" },
    { city: "Los Angeles", area: "West Hollywood" },
    { city: "New York City", area: "Chelsea & Greenwich Village" },
    { city: "Chicago", area: "Boystown (Northalsted)" },
    { city: "Atlanta", area: "Midtown" },
    { city: "Seattle", area: "Capitol Hill" },
    { city: "Washington D.C.", area: "Dupont Circle" },
];

interface SafetyReportProps {
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function SafetyReport({ userTier }: SafetyReportProps) {
  if (userTier === 'free') {
      return (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">This is a Silver Feature</CardTitle>
            <CardDescription className="my-4">
              Upgrade to the Silver plan or higher to access the Safety Report, including crime data and curated safe-zone recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/subscribe">
              <Button>Upgrade Plan</Button>
            </Link>
          </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-6">
       <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline">Safety Report</h1>
        <p className="text-lg text-muted-foreground mt-2">Check neighborhood safety scores and find recommended areas.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Neighborhood Safety Search</CardTitle>
          <CardDescription>Enter a ZIP code or address to get a safety overview. (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex w-full max-w-md items-center space-x-2">
                <Input type="text" placeholder="Enter ZIP code or address..." disabled />
                <Button type="submit" disabled>
                    <Search className="mr-2 h-4 w-4" /> Search
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
                This feature will provide mock crime data including an overall grade, violent crime stats, and property crime stats for a selected radius (0.5-5 miles).
            </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2"><HeartHandshake className="text-primary"/> Curated Safe Areas</CardTitle>
          <CardDescription>We've compiled a list of well-known LGBT-friendly neighborhoods in major cities to consider for your stay.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {safeAreas.map((item) => (
            <div key={item.city} className="bg-muted/50 p-4 rounded-lg">
                <p className="font-bold text-sm">{item.city}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><MapPin className="w-3 h-3"/>{item.area}</p>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
