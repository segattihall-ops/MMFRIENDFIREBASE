
"use server";

import { generateOptimalPricing, GenerateOptimalPricingInput } from "@/ai/flows/generate-optimal-pricing";
import { predictMassageDemand } from "@/ai/flows/predict-massage-demand";
import { generateTripItinerary, GenerateTripItineraryInput } from "@/ai/flows/generate-trip-itinerary";
import { generateRoadTripItinerary, GenerateRoadTripItineraryInput } from "@/ai/flows/generate-road-trip-itinerary";
import { cities } from "./data";
import type { Forecast, Review, ServiceListing } from "./types";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { initializeFirebase } from "@/firebase/server-init";

// Feature flag: Set to 'true' to use real AI predictions, 'false' for mock data
const USE_REAL_AI_PREDICTIONS = process.env.USE_REAL_AI_PREDICTIONS === 'true';

export async function predictAllDemandsAction(): Promise<Forecast[]> {
  if (USE_REAL_AI_PREDICTIONS) {
    // Use real AI predictions
    const forecasts: Forecast[] = await Promise.all(
      cities.map(async (city) => {
        try {
          const result = await predictMassageDemand({
            city: city.name,
            population: city.population,
            lgbtqIndex: city.lgbtqIndex,
          });
          return {
            city: city.name,
            state: city.state,
            demandScore: result.demandScore,
            lgbtqIndex: city.lgbtqIndex,
          };
        } catch (error) {
          console.error(`Error predicting demand for ${city.name}:`, error);
          // Fallback to mock data for this city
          return {
            city: city.name,
            state: city.state,
            demandScore: Math.floor(Math.random() * 70) + 30,
            lgbtqIndex: city.lgbtqIndex,
          };
        }
      })
    );
    return forecasts;
  }

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

export async function createInvitationAction(invitationData: {
    email: string;
    tier: 'gold' | 'platinum';
    couponCode?: string;
    discountPercentage?: number;
}) {
    const { firestore } = initializeFirebase();
    if (!firestore) {
        throw new Error("Firestore is not initialized.");
    }

    try {
        // Generate unique invitation code
        const inviteCode = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const invitationDocument = {
            ...invitationData,
            inviteCode,
            createdAt: serverTimestamp(),
            status: 'pending', // pending, used, expired
            usedAt: null,
            usedBy: null,
        };

        const invitationsCollectionRef = collection(firestore, 'invitations');
        const docRef = await addDoc(invitationsCollectionRef, invitationDocument);

        return {
            success: true,
            inviteCode,
            id: docRef.id
        };
    } catch (error: any) {
        console.error("Error creating invitation: ", error);
        return { success: false, error: error.message };
    }
}
