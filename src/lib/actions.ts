
"use server";

import { generateOptimalPricing, GenerateOptimalPricingInput } from "@/ai/flows/generate-optimal-pricing";
import { predictMassageDemand } from "@/ai/flows/predict-massage-demand";
import { generateTripItinerary, GenerateTripItineraryInput } from "@/ai/flows/generate-trip-itinerary";
import { generateRoadTripItinerary, GenerateRoadTripItineraryInput } from "@/ai/flows/generate-road-trip-itinerary";
import { cities } from "./data";
import type { Forecast, Review, ServiceListing } from "./types";
import { initializeFirebase } from "@/firebase/server-init";
import { FieldValue } from "firebase-admin/firestore";


const USE_MOCK_DATA = true; // Set to false when you have API quota

export async function predictAllDemandsAction(): Promise<Forecast[]> {
  if (USE_MOCK_DATA) {
    return cities.map(city => ({
        city: city.name,
        state: city.state,
        demandScore: Math.floor(60 + Math.random() * 40),
        lgbtqIndex: city.lgbtqIndex,
    }));
  }

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
    if (USE_MOCK_DATA) {
        return {
            suggestedRate: Math.floor(150 + Math.random() * 100),
            expectedBookings: Math.floor(10 + Math.random() * 15),
            projectedRevenue: Math.floor(2000 + Math.random() * 3000),
            reasoning: `Based on ${input.city}'s market conditions with ${input.competitorCount} competitors and ${input.saturation} saturation, this rate balances competitiveness with profitability during ${input.month}.`
        };
    }
    return await generateOptimalPricing(input);
}

export async function generateItineraryAction(input: GenerateTripItineraryInput) {
    if (USE_MOCK_DATA) {
        return {
            itinerary: `**${input.numberOfDays}-Day Trip to ${input.city}**\n\n` +
                `**Estimated Daily Earnings:** $${Math.floor(input.estimatedEarnings)}\n\n` +
                `**Recommended Stay Area:** ${input.stayArea}\n\n` +
                `**Day 1:** Arrive and set up base in ${input.stayArea}. Scout local venues and cafes.\n\n` +
                `**Day 2-${input.numberOfDays - 1}:** Peak service days. Focus on morning and evening appointments.\n\n` +
                `**Day ${input.numberOfDays}:** Wrap up appointments and prepare for departure.\n\n` +
                `**Revenue Goal:** $${Math.floor(input.estimatedEarnings * input.numberOfDays)}\n\n` +
                `*This is mock data for development purposes.*`
        };
    }
    return await generateTripItinerary(input);
}

export async function generateRoadTripAction(input: GenerateRoadTripItineraryInput) {
     if (USE_MOCK_DATA) {
        const stops = ['Austin, TX', 'Albuquerque, NM', 'Phoenix, AZ', 'Las Vegas, NV'];
        return {
            itinerary: `**Road Trip: ${input.origin} → ${input.destination}**\n\n` +
                `**Travel Mode:** ${input.travelMode}\n` +
                `**Overnight Stops:** ${input.stops}\n\n` +
                `**Suggested Route:**\n\n` +
                stops.slice(0, input.stops).map((city, i) => 
                    `**Stop ${i + 1}: ${city}**\n` +
                    `- Drive time: ~${4 + i * 2} hours\n` +
                    `- Stay: 1-2 nights\n` +
                    `- Market: Good demand for massage services\n`
                ).join('\n') +
                `\n**Final Destination:** ${input.destination}\n\n` +
                `*This is mock data for development purposes.*`
        };
    }
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
            createdAt: FieldValue.serverTimestamp(),
        };
        const reviewsCollectionRef = firestore.collection('users').doc(reviewData.revieweeId).collection('reviews');
        const docRef = await reviewsCollectionRef.add(reviewWithTimestamp);
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
            createdAt: FieldValue.serverTimestamp(),
        };
        const listingsCollectionRef = firestore.collection('service_listings');
        const docRef = await listingsCollectionRef.add(listingWithTimestamp);
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error("Error adding service listing: ", error);
        return { success: false, error: error.message };
    }
}
