"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ItineraryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itinerary: string | null;
  isLoading: boolean;
  cityName: string;
}

export default function ItineraryModal({ isOpen, onOpenChange, itinerary, isLoading, cityName }: ItineraryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">AI-Generated Trip Itinerary for {cityName}</DialogTitle>
          <DialogDescription>
            Here is a suggested itinerary to maximize your success.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-md border p-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {itinerary && (
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-body">
              {itinerary}
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
