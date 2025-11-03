'use server';

/**
 * @fileOverview An AI agent to predict massage demand in different cities.
 *
 * - predictMassageDemand - A function that predicts massage demand in different cities.
 * - PredictMassageDemandInput - The input type for the predictMassageDemand function.
 * - PredictMassageDemandOutput - The return type for the predictMassageDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictMassageDemandInputSchema = z.object({
  city: z.string().describe('The city for which to predict massage demand.'),
  population: z.number().describe('The population of the city.'),
  lgbtqIndex: z.number().describe('The LGBTQ+ index of the city (0-100).'),
  realTimeTrends: z
    .string()
    .optional()
    .describe('Real-time trends related to massage or wellness.'),
});
export type PredictMassageDemandInput = z.infer<typeof PredictMassageDemandInputSchema>;

const PredictMassageDemandOutputSchema = z.object({
  demandScore: z
    .number()
    .describe(
      'A score (0-100) representing the predicted demand for massage services in the city.'
    ),
  reasoning: z.string().describe('The reasoning behind the demand score.'),
});
export type PredictMassageDemandOutput = z.infer<typeof PredictMassageDemandOutputSchema>;

export async function predictMassageDemand(input: PredictMassageDemandInput): Promise<
  PredictMassageDemandOutput
> {
  return predictMassageDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictMassageDemandPrompt',
  input: {schema: PredictMassageDemandInputSchema},
  output: {schema: PredictMassageDemandOutputSchema},
  prompt: `You are an AI expert in predicting the demand for massage services in different cities.

  Based on the city's population, LGBTQ+ index, and any real-time trends, predict the demand for massage services.

  City: {{{city}}}
  Population: {{{population}}}
  LGBTQ+ Index: {{{lgbtqIndex}}}
  Real-time Trends: {{{realTimeTrends}}}

  Consider these factors and provide a demand score (0-100) and your reasoning.
  Give your answer in JSON format.
  `,
});

const predictMassageDemandFlow = ai.defineFlow(
  {
    name: 'predictMassageDemandFlow',
    inputSchema: PredictMassageDemandInputSchema,
    outputSchema: PredictMassageDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
