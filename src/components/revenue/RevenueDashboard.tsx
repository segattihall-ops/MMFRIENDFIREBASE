
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, BadgePercent, Wallet } from "lucide-react";
import Link from 'next/link';

const revenueData = [
  { title: "Total Revenue", value: "$14,500", icon: DollarSign, color: "text-green-600", bg: "bg-green-500/10" },
  { title: "Expenses", value: "$2,900", icon: BadgePercent, color: "text-red-600", bg: "bg-red-500/10" },
  { title: "Net Profit", value: "$11,600", icon: Wallet, color: "text-blue-600", bg: "bg-blue-500/10" },
];

interface RevenueDashboardProps {
    userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function RevenueDashboard({ userTier }: RevenueDashboardProps) {
  if (userTier !== 'platinum') {
      return (
        <Card className="text-center p-8">
          <CardTitle className="font-headline text-2xl">This is a Platinum Feature</CardTitle>
          <CardDescription className="my-4">
            Upgrade to the Platinum plan to unlock advanced revenue analytics, expense tracking, and profit analysis.
          </CardDescription>
          <Link href="/subscribe">
            <Button>Upgrade to Platinum</Button>
          </Link>
        </Card>
      )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {revenueData.map((item) => (
          <Card key={item.title} className={item.bg}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className={`h-4 w-4 text-muted-foreground ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold font-headline ${item.color}`}>{item.value}</div>
            </CardContent>
          </Card>
        ))}
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
