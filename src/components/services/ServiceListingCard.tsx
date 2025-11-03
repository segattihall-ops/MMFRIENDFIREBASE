
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ServiceListing, User } from "@/lib/types";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from "../ui/skeleton";
import { Star } from "lucide-react";

interface ServiceListingCardProps {
    listing: ServiceListing;
    onViewProfile: (userId: string) => void;
}

const serviceLabels: Record<ServiceListing['serviceType'], string> = {
    'barber': 'Barber',
    'hair-stylist': 'Hair Stylist',
    'manicure-pedicure': 'Nail Technician',
    'fitness-training': 'Fitness Trainer',
    'meal-prep': 'Meal Prep'
};

export default function ServiceListingCard({ listing, onViewProfile }: ServiceListingCardProps) {
    const firestore = useFirestore();

    const providerDocRef = useMemoFirebase(() => 
        firestore ? doc(firestore, 'users', listing.providerId) : null
    , [firestore, listing.providerId]);
    
    const { data: provider, isLoading: isLoadingProvider } = useDoc<User>(providerDocRef);

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="font-headline text-xl">{serviceLabels[listing.serviceType]}</CardTitle>
                    <Badge variant="secondary">${listing.rate}/hr</Badge>
                </div>
                <CardDescription>in {listing.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{listing.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-4 rounded-b-lg">
                {isLoadingProvider ? (
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                ) : provider ? (
                    <div className="flex items-center gap-3">
                         <Avatar className="w-10 h-10 border">
                            <AvatarImage src={`https://picsum.photos/seed/${provider.id}/40/40`} alt={provider.email} />
                            <AvatarFallback>{provider.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm">{provider.email.split('@')[0]}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>5.0 (12)</span>
                            </div>
                        </div>
                    </div>
                ): null}
                 <Button variant="ghost" size="sm" onClick={() => onViewProfile(listing.providerId)}>
                    View Profile
                </Button>
            </CardFooter>
        </Card>
    );
}
