import type { City, SeasonalData } from './types';

export const cities: City[] = [
  { name: "New York", state: "NY", population: 8804190, lgbtqIndex: 95, stayArea1: "Chelsea", stayArea2: "Greenwich Village" },
  { name: "Los Angeles", state: "CA", population: 3898747, lgbtqIndex: 92, stayArea1: "West Hollywood", stayArea2: "Silver Lake" },
  { name: "San Francisco", state: "CA", population: 873965, lgbtqIndex: 98, stayArea1: "Castro District", stayArea2: "Mission District" },
  { name: "Chicago", state: "IL", population: 2746388, lgbtqIndex: 85, stayArea1: "Boystown", stayArea2: "Andersonville" },
  { name: "Miami", state: "FL", population: 467963, lgbtqIndex: 88, stayArea1: "South Beach", stayArea2: "Wynwood" },
  { name: "Dallas", state: "TX", population: 1343573, lgbtqIndex: 78, stayArea1: "Oak Lawn", stayArea2: "Uptown" },
  { name: "Houston", state: "TX", population: 2304580, lgbtqIndex: 82, stayArea1: "Montrose", stayArea2: "Heights" },
  { name: "Seattle", state: "WA", population: 737015, lgbtqIndex: 91, stayArea1: "Capitol Hill", stayArea2: "Fremont" },
  { name: "Atlanta", state: "GA", population: 498715, lgbtqIndex: 84, stayArea1: "Midtown", stayArea2: "Virginia Highland" },
  { name: "Boston", state: "MA", population: 685094, lgbtqIndex: 89, stayArea1: "South End", stayArea2: "Back Bay" }
];

export const seasonalData: SeasonalData = {
  0: { name: "January", optimalDays: "5-7", multiplier: 0.85 },
  1: { name: "February", optimalDays: "3-5", multiplier: 1.1 },
  2: { name: "March", optimalDays: "5-7", multiplier: 1.15 },
  3: { name: "April", optimalDays: "4-6", multiplier: 0.95 },
  4: { name: "May", optimalDays: "6-8", multiplier: 1.2 },
  5: { name: "June", optimalDays: "7-10", multiplier: 1.5 },
  6: { name: "July", optimalDays: "5-7", multiplier: 1.25 },
  7: { name: "August", optimalDays: "5-7", multiplier: 1.15 },
  8: { name: "September", optimalDays: "4-6", multiplier: 0.9 },
  9: { name: "October", optimalDays: "5-7", multiplier: 1.0 },
  10: { name: "November", optimalDays: "3-5", multiplier: 0.8 },
  11: { name: "December", optimalDays: "4-6", multiplier: 1.2 }
};
