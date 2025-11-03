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

export type ActiveTab = 'dashboard' | 'planner' | 'revenue' | 'clients' | 'community' | 'admin' | 'safety';

export type User = {
  id: string;
  email: string;
  tier: 'gold' | 'platinum' | 'silver' | 'free';
  status: 'active' | 'canceled';
  revenue: number;
};
