// types/personal.ts
import { AIGoalPlan } from './ai';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  carbonFootprint?: number; // in kg CO₂
}

export interface Asset {
  name: string;
  value: number;
  color: string;
  performanceYTD?: number;
  esgRating?: number;
  description?: string;
}

export interface BudgetCategory {
    id: string;
    name: string;
    limit: number;
    spent: number;
    color: string;
}

export interface FinancialGoal {
    id: string;
    name: string;
    targetAmount: number;
    targetDate: string;
    currentAmount: number;
    iconName: string; // Corresponds to a key in an icon map
    plan: AIGoalPlan | null;
    progressHistory?: { date: string; amount: number }[];
}

export interface SavingsGoal {
  id:string;
  name: string;
  target: number;
  saved: number;
  iconName: string;
}

export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  nextPayment: string;
  iconName: string;
}

export interface LinkedAccount {
  id: string; // Institution ID
  name: string;
  mask: string; // Last 4 digits of account number
}
