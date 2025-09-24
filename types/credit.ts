// types/credit.ts

export interface CreditScore {
  score: number;
  change: number; // Point change in the last period
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

export interface CreditFactor {
    name: 'Payment History' | 'Credit Utilization' | 'Credit Age' | 'New Credit' | 'Credit Mix';
    status: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    description: string;
}
