
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';

// Mock data - replace with real data from Firestore
const mockUser = {
  name: 'John D.',
  email: 'john.d@example.com',
  avatarUrl: 'https://picsum.photos/seed/user1/200/200',
  memberSince: 'January 2023',
  tier: 'Platinum',
  avgRating: 4.8,
  reviewCount: 15,
};

const mockReviews = [
  { id: 1, author: 'Mark S.', rating: 5, comment: 'Excellent service, very professional and punctual. Highly recommend!', date: '2 weeks ago' },
  { id: 2, author: 'David P.', rating: 4, comment: 'Great massage, really helped with my back pain. Would book again.', date: '1 month ago' },
  { id: 3, author: 'Chris T.', rating: 5, comment: 'One of the best massages I have ever had. John is incredibly skilled.', date: '3 months ago' },
];

interface UserProfileProps {
  userId: string;
}

const UserProfile = ({ userId }: UserProfileProps) => {
  // In the future, you would use the userId to fetch the user's data
  // and their reviews from Firestore using the useDoc and useCollection hooks.
  // For now, we'll use mock data.

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="w-24 h-24 mb-4 border-4 border-primary">
            <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
            <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-bold font-headline">{mockUser.name}</CardTitle>
          <CardDescription className="text-muted-foreground">{mockUser.email}</CardDescription>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-bold">{mockUser.avgRating}</span>
                <span className="text-sm text-muted-foreground">({mockUser.reviewCount} reviews)</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            User Reviews
          </CardTitle>
          <CardDescription>What others are saying about {mockUser.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockReviews.map((review) => (
            <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                            <AvatarImage src={`https://picsum.photos/seed/rev${review.id}/40/40`} alt={review.author} />
                            <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-semibold">{review.author}</p>
                    </div>
                     <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                        ))}
                    </div>
                </div>
              <p className="text-muted-foreground pl-10">{review.comment}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
