import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { City } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const trackCompetitors = (city: City) => {
  const baseCount = Math.floor((city.population / 100000) * (city.lgbtqIndex / 10));
  const activeCount = Math.floor(baseCount * (0.6 + Math.random() * 0.4));
  const avgRate = 180;
  return {
    totalActive: activeCount,
    saturation: activeCount > 50 ? 'High' : (activeCount > 20 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
    avgRate,
  };
};
