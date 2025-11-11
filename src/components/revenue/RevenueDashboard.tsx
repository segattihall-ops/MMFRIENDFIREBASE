
"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, BadgePercent, Wallet } from "lucide-react";
import Link from 'next/link';

interface RevenueDashboardProps {
    userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function RevenueDashboard({ userTier }: RevenueDashboardProps) {
  if (userTier !== 'platinum') {
      return (
        <Card className="text-center p-8">
          <CardTitle className="font-headline text-2xl">This is a Premium Feature</CardTitle>
          <CardDescription className="my-4">
            Upgrade to a Platinum plan to unlock advanced revenue analytics, expense tracking, and profit analysis.
          </CardDescription>
          <Link href="/subscribe">
            <Button>Upgrade Plan</Button>
          </Link>
        </Card>
      )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lifetime Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-headline">$0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rate</CardTitle>
              <BadgePercent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-headline">$0/hr</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Payout</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold font-headline">$0.00</div>
            </CardContent>
          </Card>
      </div>
       <Card>
        <CardHeader>
            <CardTitle className="font-headline">Future Revenue Analytics</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">This section is a placeholder for future revenue tracking features. Imagine connecting your payment processor to see live revenue data, expense tracking, and profit analysis over time.</p>
        </CardContent>
      </Card>
    </div>
  );
}
