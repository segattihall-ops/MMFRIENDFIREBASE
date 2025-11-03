// This is a server-side file.
'use server';

/**
 * @fileOverview Generates a trip itinerary for a masseur based on location and duration preferences.
 *
 * - generateTripItinerary - A function that generates the trip itinerary.
 * - GenerateTripItineraryInput - The input type for the generateTripItinerary function.
 * - GenerateTripItineraryOutput - The return type for the generateTripItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTripItineraryInputSchema = z.object({
  city: z.string().describe('The city for the trip.'),
  numberOfDays: z.number().describe('The number of days for the trip.'),
  estimatedEarnings: z.number().describe('The estimated earnings per day'),
  stayArea: z.string().describe('The ideal stay area of the location')
});
export type GenerateTripItineraryInput = z.infer<typeof GenerateTripItineraryInputSchema>;

const GenerateTripItineraryOutputSchema = z.object({
  itinerary: z.string().describe('The generated trip itinerary.'),
});
export type GenerateTripItineraryOutput = z.infer<typeof GenerateTripItineraryOutputSchema>;

export async function generateTripItinerary(input: GenerateTripItineraryInput): Promise<GenerateTripItineraryOutput> {
  return generateTripItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTripItineraryPrompt',
  input: {schema: GenerateTripItineraryInputSchema},
  output: {schema: GenerateTripItineraryOutputSchema},
  prompt: `You are an AI assistant that generates trip itineraries for masseurs.

  Generate a trip itinerary for the following trip:
  City: {{city}}
  Number of Days: {{numberOfDays}}
  Estimated Earnings per day: {{estimatedEarnings}}
  Ideal Stay Area: {{stayArea}}
  
  The itinerary should include details such as daily schedule, pricing strategies, location tips, and revenue goals.
  The itinerary should be concise, and easy to follow.
  `,
});

const generateTripItineraryFlow = ai.defineFlow(
  {
    name: 'generateTripItineraryFlow',
    inputSchema: GenerateTripItineraryInputSchema,
    outputSchema: GenerateTripItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
