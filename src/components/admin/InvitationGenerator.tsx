'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ticket, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { createInvitationAction } from '@/lib/actions';

const invitationSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  tier: z.enum(['gold', 'platinum']),
  couponCode: z.string().optional(),
  discountPercentage: z.coerce.number().min(0).max(100).optional(),
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

export default function InvitationGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invitationLink, setInvitationLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      tier: 'gold',
      couponCode: '',
    },
  });

  const onSubmit = async (values: InvitationFormValues) => {
    setIsLoading(true);
    setInvitationLink('');

    try {
      // Call server action to create invitation in Firestore
      const result = await createInvitationAction({
        email: values.email,
        tier: values.tier,
        couponCode: values.couponCode,
        discountPercentage: values.discountPercentage,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to create invitation');
      }

      // Generate invitation link with the unique code
      const params = new URLSearchParams({
        email: values.email,
        tier: values.tier,
        code: result.inviteCode!,
      });
      if (values.couponCode && values.discountPercentage) {
        params.append('coupon', values.couponCode);
        params.append('discount', values.discountPercentage.toString());
      }
      const link = `${window.location.origin}/signup?${params.toString()}`;
      setInvitationLink(link);

      toast({
        title: 'Invitation Generated!',
        description: `Invitation created successfully with code: ${result.inviteCode}`,
      });

      // Reset form after successful submission
      form.reset();
    } catch (error) {
      console.error('Error creating invitation:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to Generate Invitation',
        description: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(invitationLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation Generator</CardTitle>
        <CardDescription>
          Create and send special invitations to new users with pre-assigned tiers and discounts.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subscription Tier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a tier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="couponCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., WELCOME25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount % (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 25" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col items-start space-y-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Ticket className="mr-2 h-4 w-4" />
              Generate Invitation
            </Button>
            {invitationLink && (
              <div className="w-full space-y-2">
                <Label htmlFor="invitation-link">Generated Link:</Label>
                <div className="flex w-full items-center space-x-2">
                    <Input id="invitation-link" value={invitationLink} readOnly />
                    <Button type="button" size="icon" onClick={handleCopy}>
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
