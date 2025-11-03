
"use server";

import { generateOptimalPricing, GenerateOptimalPricingInput } from "@/ai/flows/generate-optimal-pricing";
import { predictMassageDemand } from "@/ai/flows/predict-massage-demand";
import { generateTripItinerary, GenerateTripItineraryInput } from "@/ai/flows/generate-trip-itinerary";
import { generateRoadTripItinerary, GenerateRoadTripItineraryInput } from "@/ai/flows/generate-road-trip-itinerary";
import { cities } from "./data";
import type { Forecast, Review } from "./types";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase/server-init";

export async function predictAllDemandsAction(): Promise<Forecast[]> {
  // Return mock data directly to avoid hitting API rate limits or incurring costs.
  const forecasts: Forecast[] = cities.map(city => ({
      city: city.name,
      state: city.state,
      demandScore: Math.floor(Math.random() * 70) + 30, // Random score between 30-100
      lgbtqIndex: city.lgbtqIndex,
  }));
  return Promise.resolve(forecasts);
}

export async function getOptimalPricingAction(input: GenerateOptimalPricingInput) {
    return await generateOptimalPricing(input);
}

export async function generateItineraryAction(input: GenerateTripItineraryInput) {
    return await generateTripItinerary(input);
}

export async function generateRoadTripAction(input: GenerateRoadTripItineraryInput) {
    return await generateRoadTripItinerary(input);
}

export async function submitReviewAction(reviewData: Omit<Review, 'id' | 'createdAt'>) {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }

    try {
        const reviewWithTimestamp = {
            ...reviewData,
            createdAt: serverTimestamp(),
        };
        const reviewsCollectionRef = collection(firestore, 'users', reviewData.revieweeId, 'reviews');
        const docRef = await addDoc(reviewsCollectionRef, reviewWithTimestamp);
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error("Error submitting review: ", error);
        return { success: false, error: error.message };
    }
}
