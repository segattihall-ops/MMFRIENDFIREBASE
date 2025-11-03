"use server";

import { generateOptimalPricing, GenerateOptimalPricingInput } from "@/ai/flows/generate-optimal-pricing";
import { predictMassageDemand } from "@/ai/flows/predict-massage-demand";
import { generateTripItinerary, GenerateTripItineraryInput } from "@/ai/flows/generate-trip-itinerary";
import { cities } from "./data";
import type { Forecast } from "./types";

export async function predictAllDemandsAction(): Promise<Forecast[]> {
  const predictions = await Promise.all(
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
        console.error(`Failed to predict demand for ${city.name}:`, error);
        // Fallback to a random score if AI fails
        return {
          city: city.name,
          state: city.state,
          demandScore: Math.floor(Math.random() * 50) + 30, // Random score between 30-80
          lgbtqIndex: city.lgbtqIndex,
        };
      }
    })
  );
  return predictions;
}


export async function getOptimalPricingAction(input: GenerateOptimalPricingInput) {
    return await generateOptimalPricing(input);
}

export async function generateItineraryAction(input: GenerateTripItineraryInput) {
    return await generateTripItinerary(input);
}
