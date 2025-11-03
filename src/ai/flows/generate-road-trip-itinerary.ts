'use server';

/**
 * @fileOverview Generates a road trip itinerary for a masseur, suggesting profitable stops along the way.
 *
 * - generateRoadTripItinerary - A function that generates the road trip itinerary.
 * - GenerateRoadTripItineraryInput - The input type for the generateRoadTripItinerary function.
 * - GenerateRoadTripItineraryOutput - The return type for the generateRoadTripItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRoadTripItineraryInputSchema = z.object({
  origin: z.string().describe('The starting city and state for the road trip (e.g., Dallas, TX).'),
  destination: z.string().describe('The final destination city and state for the road trip (e.g., San Francisco, CA).'),
  travelMode: z.enum(['car', 'bus', 'plane', 'mix']).describe('The mode of transportation for the trip.'),
  stops: z.number().describe('The desired number of overnight stops along the route.'),
});

export type GenerateRoadTripItineraryInput = z.infer<
  typeof GenerateRoadTripItineraryInputSchema
>;

const GenerateRoadTripItineraryOutputSchema = z.object({
  itinerary: z
    .string()
    .describe('A detailed, day-by-day road trip itinerary with suggested stops, driving times, and potential work opportunities.'),
});

export type GenerateRoadTripItineraryOutput = z.infer<
  typeof GenerateRoadTripItineraryOutputSchema
>;

export async function generateRoadTripItinerary(
  input: GenerateRoadTripItineraryInput
): Promise<GenerateRoadTripItineraryOutput> {
  return generateRoadTripItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRoadTripItineraryPrompt',
  input: {schema: GenerateRoadTripItineraryInputSchema},
  output: {schema: GenerateRoadTripItineraryOutputSchema},
  prompt: `You are an AI assistant that creates optimized road trip itineraries for traveling masseurs.
  Your goal is to plan a route that includes profitable overnight stops in cities with good market demand.

  Generate a detailed, day-by-day road trip plan based on the following user inputs:
  Origin: {{origin}}
  Destination: {{destination}}
  Travel Mode: {{travelMode}}
  Number of Overnight Stops: {{stops}}

  The itinerary should include:
  1.  A logical route from the origin to the destination.
  2.  Suggestions for {{stops}} overnight stops in cities that are known to have good demand for massage services.
  3.  Estimated driving times between each leg of the journey.
  4.  For each suggested stop, provide a brief rationale for why it's a good choice (e.g., "High demand, vibrant LGBTQ+ community").
  5.  Keep the output concise, well-structured, and easy to read.
  `,
});

const generateRoadTripItineraryFlow = ai.defineFlow(
  {
    name: 'generateRoadTripItineraryFlow',
    inputSchema: GenerateRoadTripItineraryInputSchema,
    outputSchema: GenerateRoadTripItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
