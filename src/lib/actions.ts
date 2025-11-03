
"use server";

import { generateOptimalPricing, GenerateOptimalPricingInput } from "@/ai/flows/generate-optimal-pricing";
import { predictMassageDemand } from "@/ai/flows/predict-massage-demand";
import { generateTripItinerary, GenerateTripItineraryInput } from "@/ai/flows/generate-trip-itinerary";
import { generateRoadTripItinerary, GenerateRoadTripItineraryInput } from "@/ai/flows/generate-road-trip-itinerary";
import { cities } from "./data";
import type { Forecast } from "./types";

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
