
"use server";

import { generateOptimalPricing, GenerateOptimalPricingInput } from "@/ai/flows/generate-optimal-pricing";
import { predictMassageDemand } from "@/ai/flows/predict-massage-demand";
import { generateTripItinerary, GenerateTripItineraryInput } from "@/ai/flows/generate-trip-itinerary";
import { generateRoadTripItinerary, GenerateRoadTripItineraryInput } from "@/ai/flows/generate-road-trip-itinerary";
import { cities } from "./data";
import type { Forecast, Review, ServiceListing } from "./types";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase/server-init";

export async function predictAllDemandsAction(): Promise<Forecast[]> {
  const demandPromises = cities.map(city => 
    predictMassageDemand({
      city: city.name,
      population: city.population,
      lgbtqIndex: city.lgbtqIndex,
    }).then(demand => ({
      city: city.name,
      state: city.state,
      demandScore: demand.demandScore,
      lgbtqIndex: city.lgbtqIndex,
    }))
  );

  const forecasts = await Promise.all(demandPromises);
  return forecasts;
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

export async function addServiceListingAction(listingData: Omit<ServiceListing, 'id' | 'createdAt'>) {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }

    try {
        const listingWithTimestamp = {
            ...listingData,
            createdAt: serverTimestamp(),
        };
        const listingsCollectionRef = collection(firestore, 'service_listings');
        const docRef = await addDoc(listingsCollectionRef, listingWithTimestamp);
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error("Error adding service listing: ", error);
        return { success: false, error: error.message };
    }
}
