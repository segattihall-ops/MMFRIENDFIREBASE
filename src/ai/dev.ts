import { config } from 'dotenv';
config();

import '@/ai/flows/predict-massage-demand.ts';
import '@/ai/flows/generate-trip-itinerary.ts';
import '@/ai/flows/generate-optimal-pricing.ts';
import '@/ai/flows/generate-road-trip-itinerary.ts';
