
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ServiceListing, User } from "@/lib/types";
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Skeleton } from "../ui/skeleton";
import { Star, Instagram } from "lucide-react";
import Link from 'next/link';

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
        <Card className="flex flex-col overflow-hidden">
            {listing.imageUrl ? (
                <div className="relative aspect-video w-full">
                    <Image
                        src={listing.imageUrl}
                        alt={serviceLabels[listing.serviceType]}
                        fill
                        className="object-cover"
                    />
                </div>
            ) : (
                <div className="aspect-video w-full bg-muted flex items-center justify-center">
                    <p className="text-xs text-muted-foreground">No image</p>
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-start gap-4">
                    <CardTitle className="font-headline text-xl">{serviceLabels[listing.serviceType]}</CardTitle>
                    <Badge variant="secondary" className="text-base">${listing.rate}/hr</Badge>
                </div>
                <CardDescription>in {listing.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{listing.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center bg-muted/50 p-3 rounded-b-lg">
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
                         <Avatar className="w-10 h-10 border cursor-pointer" onClick={() => onViewProfile(listing.providerId)}>
                            <AvatarImage src={`https://picsum.photos/seed/${provider.id}/40/40`} alt={provider.email} />
                            <AvatarFallback>{provider.email.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-semibold text-sm cursor-pointer hover:underline" onClick={() => onViewProfile(listing.providerId)}>{provider.email.split('@')[0]}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                <span>5.0 (12)</span>
                            </div>
                        </div>
                    </div>
                ): null}
                <div className="flex items-center gap-1">
                    {listing.instagramUrl && (
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                           <Link href={listing.instagramUrl} target="_blank" rel="noopener noreferrer">
                                <Instagram className="w-4 h-4" />
                           </Link>
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => onViewProfile(listing.providerId)}>
                        Profile
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}

    