
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Briefcase } from "lucide-react";

interface ServicesMarketplaceProps {
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function ServicesMarketplace({ userTier }: ServicesMarketplaceProps) {
  if (userTier !== 'platinum') {
      return (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">This is a Platinum Feature</CardTitle>
            <CardDescription className="my-4">
              Upgrade to the Platinum plan to access the Services Marketplace, where you can find and advertise related professional services.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/subscribe">
              <Button>Upgrade to Platinum</Button>
            </Link>
          </CardContent>
        </Card>
      )
  }

  return (
    <div className="space-y-6">
       <div className="text-center max-w-2xl mx-auto">
        <Briefcase className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline mt-4">Services Marketplace</h1>
        <p className="text-lg text-muted-foreground mt-2">Feature coming soon! Find and advertise services like barbers, trainers, and more.</p>
      </div>
    </div>
  );
}
