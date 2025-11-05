
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, Pencil, ShieldCheck, Loader2 } from 'lucide-react';
import { useDoc, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import type { User, Review } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import ReviewForm from './ReviewForm';
import ReviewItem from './ReviewItem';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { updateUserAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  userId: string;
  onViewProfile: (userId: string) => void;
  isAdmin: boolean;
}

const UserProfile = ({ userId, onViewProfile, isAdmin }: UserProfileProps) => {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const { toast } = useToast();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<User['tier'] | ''>('');
  const [selectedRole, setSelectedRole] = useState<User['role'] | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  const userDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'users', userId) : null
  , [firestore, userId]);
  
  const reviewsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'users', userId, 'reviews'), orderBy('createdAt', 'desc')) : null
  , [firestore, userId]);

  const { data: user, isLoading: isLoadingUser, error: userError } = useDoc<User>(userDocRef);
  const { data: reviews, isLoading: isLoadingReviews } = useCollection<Review>(reviewsQuery);
  
  useEffect(() => {
    if (user) {
      setSelectedTier(user.tier || 'free');
      setSelectedRole(user.role || 'customer');
    }
  }, [user]);

  const hasAlreadyReviewed = reviews?.some(review => review.reviewerId === currentUser?.uid);
  const canReview = currentUser && currentUser.uid !== userId && !hasAlreadyReviewed;

  const averageRating = (reviews || []).reduce((acc, r) => acc + r.rating, 0) / (reviews?.length || 1);

  const handleSaveChanges = async () => {
    if (!selectedTier || !selectedRole || !user) return;
    setIsSaving(true);
    try {
        const result = await updateUserAction({ id: user.id, tier: selectedTier, role: selectedRole });
        if(result.success) {
            toast({ title: "User Updated", description: `${user.email}'s profile has been updated.` });
        } else {
            throw new Error(result.error || 'An unknown error occurred.');
        }
    } catch (error: any) {
        toast({ variant: 'destructive', title: "Update Failed", description: error.message });
    } finally {
        setIsSaving(false);
    }
  };

  const hasChanges = user ? selectedTier !== user.tier || selectedRole !== user.role : false;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
            {isLoadingUser ? (
                <>
                    <Skeleton className="w-24 h-24 rounded-full mb-4" />
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-5 w-32 mt-2" />
                </>
            ) : user ? (
                <>
                    <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
                        <AvatarImage src={`https://picsum.photos/seed/${user.id}/200/200`} alt={user.email} />
                        <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-3xl font-bold font-headline">{user.email.split('@')[0]}</CardTitle>
                    <CardDescription className="text-muted-foreground">{user.email}</CardDescription>
                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="font-bold">{averageRating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">({reviews?.length || 0} reviews)</span>
                        </div>
                    </div>
                </>
            ) : (
                <p>User not found.</p>
            )}
        </CardHeader>
        {user && canReview && (
          <CardFooter className="justify-center">
            <Button onClick={() => setIsReviewFormOpen(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {isAdmin && user && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-destructive" />
              Admin Controls
            </CardTitle>
            <CardDescription>Manage user subscription and role.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subscription Tier</label>
                <Select value={selectedTier} onValueChange={(value) => setSelectedTier(value as User['tier'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">User Role</label>
                <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as User['role'])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="provider">Provider</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveChanges} disabled={isSaving || !hasChanges}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            User Reviews
          </CardTitle>
          <CardDescription>What others are saying about {user?.email.split('@')[0] || 'this user'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {isLoadingReviews ? (
                Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2 border-b pb-4 last:border-b-0">
                        <div className="flex items-center gap-2">
                             <Skeleton className="w-8 h-8 rounded-full" />
                             <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full ml-10" />
                        <Skeleton className="h-4 w-1/2 ml-10" />
                    </div>
                ))
            ) : reviews && reviews.length > 0 ? (
                reviews.map((review) => <ReviewItem key={review.id} review={review} onViewProfile={onViewProfile} />)
            ) : (
                <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
            )}
        </CardContent>
      </Card>
      
      {currentUser && user && (
        <ReviewForm 
            isOpen={isReviewFormOpen}
            onOpenChange={setIsReviewFormOpen}
            revieweeId={user.id}
            revieweeName={user.email.split('@')[0]}
            reviewerId={currentUser.uid}
        />
      )}
    </div>
  );
};

export default UserProfile;
