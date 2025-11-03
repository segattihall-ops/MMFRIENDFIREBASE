
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Loader2, PlusCircle } from "lucide-react";
import AddServiceListing from './AddServiceListing';
import ServiceListingCard from './ServiceListingCard';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { ServiceListing } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface ServicesMarketplaceProps {
  userTier: 'platinum' | 'gold' | 'silver' | 'free';
  onViewProfile: (userId: string) => void;
}

export default function ServicesMarketplace({ userTier, onViewProfile }: ServicesMarketplaceProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  const listingsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'service_listings'), orderBy('createdAt', 'desc')) : null
  , [firestore]);

  const { data: listings, isLoading: isLoadingListings } = useCollection<ServiceListing>(listingsQuery);

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-bold font-headline">Services Marketplace</h1>
            <p className="text-muted-foreground">Find and advertise professional services.</p>
         </div>
         <Button onClick={() => setIsAddFormOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your Service
         </Button>
       </div>

        {isLoadingListings ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <div className="aspect-video w-full bg-muted"></div>
                        <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-1/2" />
                             <div className="flex items-center gap-2 pt-4">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                             </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        ) : listings && listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                    <ServiceListingCard key={listing.id} listing={listing} onViewProfile={onViewProfile} />
                ))}
            </div>
        ) : (
             <Card className="text-center p-12 col-span-full">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No services listed yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Be the first to add a service to the marketplace!
                </p>
             </Card>
        )}
       
       {user && (
        <AddServiceListing 
            isOpen={isAddFormOpen}
            onOpenChange={setIsAddFormOpen}
            providerId={user.uid}
        />
       )}
    </div>
  );
}
