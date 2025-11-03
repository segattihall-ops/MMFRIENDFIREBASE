
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Home } from "lucide-react";

interface MasseurBnbProps {
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
}

export default function MasseurBnb({ userTier }: MasseurBnbProps) {
  if (userTier !== 'platinum') {
      return (
        <Card className="text-center p-8">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">This is a Platinum Feature</CardTitle>
                <CardDescription className="my-4">
                Upgrade to the Platinum plan to access MasseurBnB for short-term housing and room sharing.
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
        <Home className="mx-auto h-12 w-12 text-primary" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline mt-4">MasseurBnB</h1>
        <p className="text-lg text-muted-foreground mt-2">Feature coming soon! Find rooms to rent or share while you travel.</p>
      </div>
    </div>
  );
}
