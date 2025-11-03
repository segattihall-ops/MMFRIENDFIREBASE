
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Star } from 'lucide-react';
import { submitReviewAction } from '@/lib/actions';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating is required').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long.').max(500),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  revieweeId: string;
  revieweeName: string;
  reviewerId: string;
}

const StarRating = ({ field }: { field: any }) => {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
            <button
                type="button"
                key={ratingValue}
                onClick={() => field.onChange(ratingValue)}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
                className="focus:outline-none"
            >
                <Star
                className={cn(
                    'h-8 w-8 cursor-pointer transition-colors',
                    ratingValue <= (hover || field.value)
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-gray-300'
                )}
                />
            </button>
            );
        })}
        </div>
    );
};


export default function ReviewForm({ isOpen, onOpenChange, revieweeId, revieweeName, reviewerId }: ReviewFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    setIsLoading(true);
    try {
      const result = await submitReviewAction({
        ...data,
        revieweeId,
        reviewerId,
      });

      if (result.success) {
        toast({
          title: 'Review Submitted!',
          description: `Your review for ${revieweeName} has been posted.`,
        });
        form.reset();
        onOpenChange(false);
      } else {
        throw new Error(result.error || 'Failed to submit review.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Write a Review for {revieweeName}</DialogTitle>
          <DialogDescription>
            Share your experience. Your feedback helps others in the community.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Overall Rating</FormLabel>
                            <FormControl>
                                <StarRating field={field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                
                 <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Comment</FormLabel>
                            <FormControl>
                               <Textarea
                                    placeholder={`Share details of your experience with ${revieweeName}...`}
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />

                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Review
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
