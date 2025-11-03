
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Instagram } from 'lucide-react';
import { addServiceListingAction } from '@/lib/actions';

const serviceListingSchema = z.object({
  serviceType: z.enum(['barber', 'hair-stylist', 'manicure-pedicure', 'fitness-training', 'meal-prep']),
  description: z.string().min(20, 'Description must be at least 20 characters long.').max(500),
  rate: z.coerce.number().min(1, 'Rate must be a positive number.'),
  location: z.string().min(3, 'Location is required.'),
  instagramUrl: z.string().url('Please enter a valid URL.').optional().or(z.literal('')),
  imageUrl: z.string().url('Please enter a valid image URL.').optional().or(z.literal('')),
});

type ServiceListingFormValues = z.infer<typeof serviceListingSchema>;

interface AddServiceListingProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  providerId: string;
}

const serviceTypes = [
  { value: 'barber', label: 'Barber' },
  { value: 'hair-stylist', label: 'Hair Stylist' },
  { value: 'manicure-pedicure', label: 'Manicure/Pedicure' },
  { value: 'fitness-training', label: 'Fitness Training' },
  { value: 'meal-prep', label: 'Meal Prep' },
] as const;

export default function AddServiceListing({ isOpen, onOpenChange, providerId }: AddServiceListingProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ServiceListingFormValues>({
    resolver: zodResolver(serviceListingSchema),
    defaultValues: {
      description: '',
      location: '',
      instagramUrl: '',
      imageUrl: '',
    },
  });

  const onSubmit = async (data: ServiceListingFormValues) => {
    setIsLoading(true);
    try {
      const result = await addServiceListingAction({
        ...data,
        providerId,
      });

      if (result.success) {
        toast({
          title: 'Service Listed!',
          description: `Your ${data.serviceType} service has been added to the marketplace.`,
        });
        form.reset();
        onOpenChange(false);
      } else {
        throw new Error(result.error || 'Failed to list service.');
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Add a Service</DialogTitle>
          <DialogDescription>
            List your professional service in the marketplace for others to discover.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="serviceType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service to offer" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {serviceTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                               <Textarea
                                    placeholder="Tell everyone about your service, your experience, and what makes you stand out..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                               <Input placeholder="https://example.com/your-service-photo.jpg" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="rate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Rate ($/hr)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="e.g., 50" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., West Hollywood, CA" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                 <FormField
                    control={form.control}
                    name="instagramUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Instagram Profile (Optional)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-9" placeholder="https://instagram.com/your-username" {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="pt-4">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        List My Service
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    