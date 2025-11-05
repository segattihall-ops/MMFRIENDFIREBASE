
'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { User, Review } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ReviewItemProps {
    review: Review;
    onViewProfile: (userId: string) => void;
}

export default function ReviewItem({ review, onViewProfile }: ReviewItemProps) {
    const firestore = useFirestore();

    const reviewerDocRef = useMemoFirebase(
        () => (firestore ? doc(firestore, 'users', review.reviewerId) : null),
        [firestore, review.reviewerId]
    );
    const { data: reviewer } = useDoc<User>(reviewerDocRef);

    return (
        <div className="border-b pb-4 last:border-b-0">
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 cursor-pointer" onClick={() => onViewProfile(review.reviewerId)}>
                        <AvatarImage src={`https://picsum.photos/seed/rev${review.reviewerId}/40/40`} alt={reviewer?.email} />
                        <AvatarFallback>{reviewer ? reviewer.email.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold cursor-pointer" onClick={() => onViewProfile(review.reviewerId)}>{reviewer?.email.split('@')[0] || 'Anonymous'}</p>
                </div>
                <div className="flex items-center shrink-0">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                    ))}
                </div>
            </div>
            <p className="text-muted-foreground pl-10">{review.comment}</p>
            <p className="text-xs text-muted-foreground pl-10 mt-1">
                {review.createdAt ? formatDistanceToNow(new Date(review.createdAt.seconds * 1000), { addSuffix: true }) : ''}
            </p>
        </div>
    );
}
