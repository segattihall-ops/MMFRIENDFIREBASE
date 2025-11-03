'use server';

/**
 * @fileOverview Generates optimal pricing for massage services in a given city.
 *
 * - generateOptimalPricing - A function that generates the optimal pricing.
 * - GenerateOptimalPricingInput - The input type for the generateOptimalPricing function.
 * - GenerateOptimalPricingOutput - The return type for the generateOptimalpricing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateOptimalPricingInputSchema = z.object({
  city: z.string().describe('The city for which to generate optimal pricing.'),
  state: z.string().describe('The state of the city.'),
  spikeProb: z.number().describe('The demand spike probability in percentage (0-100).'),
  lgbtqIndex: z.number().describe('The LGBTQ+ index of the city.'),
  month: z.string().describe('The month for which to generate optimal pricing.'),
  optimalDays: z.string().describe('The optimal days for the month.'),
  multiplier: z.number().describe('The seasonal multiplier for the month.'),
  competitorCount: z.number().describe('The number of active competitors in the city.'),
  saturation: z
    .enum(['Low', 'Medium', 'High'])
    .describe('The market saturation level (Low, Medium, High).'),
  avgRate: z.number().describe('The average service rate in the city.'),
});

export type GenerateOptimalPricingInput = z.infer<
  typeof GenerateOptimalPricingInputSchema
>;

const GenerateOptimalPricingOutputSchema = z.object({
  suggestedRate: z.number().describe('The AI-suggested service rate ($/hr).'),
  expectedBookings: z.number().describe('The expected number of bookings.'),
  projectedRevenue: z.number().describe('The projected revenue for the month.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested rate, bookings and revenue.'),
});

export type GenerateOptimalPricingOutput = z.infer<
  typeof GenerateOptimalPricingOutputSchema
>;

export async function generateOptimalPricing(
  input: GenerateOptimalPricingInput
): Promise<GenerateOptimalPricingOutput> {
  return generateOptimalPricingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateOptimalPricingPrompt',
  input: {schema: GenerateOptimalPricingInputSchema},
  output: {schema: GenerateOptimalPricingOutputSchema},
  prompt: `You are an AI-powered pricing strategist for professional masseurs.
  Given the following information about a city, you will calculate and provide the optimal pricing for massage services, expected bookings, and projected revenue.
  Also, provide a short explanation of why you have come up with these numbers.

  City: {{city}}, {{state}}
  Demand Spike Probability: {{spikeProb}}%
  LGBTQ+ Index: {{lgbtqIndex}}
  Month: {{month}}
  Optimal Days: {{optimalDays}}
  Seasonal Multiplier: {{multiplier}}
  Competitor Count: {{competitorCount}}
  Market Saturation: {{saturation}}
  Average Service Rate: \${{avgRate}}/hr

  Consider these factors to determine the suggested rate, expected bookings, and projected revenue. Ensure the suggested rate is competitive yet maximizes potential earnings. The explanation should be less than 100 words.
  Make sure that the suggested rate is a reasonable number.  Projected revenue should take into account the number of optimal days.
  Projected revenue must be an integer.

  Output the suggested rate, expected bookings, projected revenue, and reasoning.
  `,
});

const generateOptimalPricingFlow = ai.defineFlow(
  {
    name: 'generateOptimalPricingFlow',
    inputSchema: GenerateOptimalPricingInputSchema,
    outputSchema: GenerateOptimalPricingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
