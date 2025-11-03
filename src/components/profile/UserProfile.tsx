
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare, Pencil } from 'lucide-react';
import { useDoc, useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import type { User, Review } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import ReviewForm from './ReviewForm';

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  const firestore = useFirestore();
  const { user: currentUser } = useUser();
  const [isReviewFormOpen, setIsReviewFormOpen] = useState(false);

  const userDocRef = useMemoFirebase(() => 
    firestore ? doc(firestore, 'users', userId) : null
  , [firestore, userId]);
  
  const reviewsQuery = useMemoFirebase(() => 
    firestore ? query(collection(firestore, 'users', userId, 'reviews'), orderBy('createdAt', 'desc')) : null
  , [firestore, userId]);

  const { data: user, isLoading: isLoadingUser } = useDoc<User>(userDocRef);
  const { data: reviews, isLoading: isLoadingReviews } = useCollection<Review>(reviewsQuery);
  
  const hasAlreadyReviewed = reviews?.some(review => review.reviewerId === currentUser?.uid);
  const canReview = currentUser && currentUser.uid !== userId && !hasAlreadyReviewed;


  // Helper component for a single review
  const ReviewItem = ({ review }: { review: Review }) => {
    const reviewerDocRef = useMemoFirebase(() => firestore ? doc(firestore, 'users', review.reviewerId) : null, [firestore, review.reviewerId]);
    const { data: reviewer } = useDoc<User>(reviewerDocRef);

    return (
       <div className="border-b pb-4 last:border-b-0">
          <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                      <AvatarImage src={`https://picsum.photos/seed/rev${review.reviewerId}/40/40`} alt={reviewer?.email} />
                      <AvatarFallback>{reviewer ? reviewer.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                  <p className="font-semibold">{reviewer?.email.split('@')[0] || 'Anonymous'}</p>
              </div>
              <div className="flex items-center shrink-0">
                  {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                  ))}
              </div>
          </div>
        <p className="text-muted-foreground pl-10">{review.comment}</p>
        <p className="text-xs text-muted-foreground pl-10 mt-1">
            {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : ''}
        </p>
      </div>
    )
  }

  const averageRating = (reviews || []).reduce((acc, r) => acc + r.rating, 0) / (reviews?.length || 1);


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
                reviews.map((review) => <ReviewItem key={review.id} review={review} />)
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
