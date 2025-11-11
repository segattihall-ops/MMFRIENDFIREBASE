

export type FirebaseTimestamp = {
  seconds: number;
  nanoseconds: number;
};

export type City = {
  name: string;
  state: string;
  population: number;
  lgbtqIndex: number;
  stayArea1: string;
  stayArea2: string;
};

export type SeasonalData = {
  [key: number]: {
    name: string;
    optimalDays: string;
    multiplier: number;
  };
};

export type Forecast = {
  city: string;
  state: string;
  demandScore: number;
  lgbtqIndex: number;
};

export type CompetitorData = {
    totalActive: number;
    saturation: 'High' | 'Medium' | 'Low';
    avgRate: number;
};

export type ActiveTab = 'dashboard' | 'planner' | 'road-trip' | 'revenue' | 'clients' | 'community' | 'admin' | 'safety' | 'profile' | 'services' | 'masseurbnb';

export type User = {
  id: string;
  email: string;
  role: 'admin' | 'customer' | 'provider';
  tier: 'gold' | 'platinum' | 'silver' | 'free';
  status: 'active' | 'canceled';
  revenue: number;
  isAdmin?: boolean;
};

export type Review = {
    id: string;
    reviewerId: string;
    revieweeId: string;
    rating: number;
    comment: string;
    createdAt: FirebaseTimestamp; 
}

export type ServiceListing = {
  id: string;
  providerId: string;
  serviceType: 'barber' | 'hair-stylist' | 'manicure-pedicure' | 'fitness-training' | 'meal-prep';
  description: string;
  rate: number;
  location: string;
  instagramUrl?: string;
  imageUrl?: string;
  createdAt: FirebaseTimestamp;
}

    