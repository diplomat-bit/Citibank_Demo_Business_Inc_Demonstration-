// types.ts
// This file is the grand codex, the laws of physics for the Demo Bank universe.
// It defines the shape and structure of every piece of data that can exist.
// A robust and explicit type system is the foundation of a scalable and maintainable application.

// ================================================================================================
// NAVIGATION & UI STATE
// ================================================================================================

/**
 * @description Defines every possible view/page in the application.
 * This enum is the single source of truth for navigation state.
 */
export enum View {
    // Personal Finance
    Dashboard = 'dashboard',
    Transactions = 'transactions',
    SendMoney = 'send-money',
    Budgets = 'budgets',
    Investments = 'investments',
    FinancialGoals = 'financial-goals',
    RewardsHub = 'rewards-hub',
    CreditHealth = 'credit-health',
    
    // AI & Platform
    AIAdvisor = 'ai-advisor',
    QuantumWeaver = 'quantum-weaver',
    AIAdStudio = 'ai-ad-studio',
    
    // Advanced Features
    Crypto = 'crypto',
    Marketplace = 'marketplace',
    Personalization = 'personalization',
    CardCustomization = 'card-customization',
    
    // Corporate Finance
    CorporateDashboard = 'corporate-dashboard',
    PaymentOrders = 'payment-orders',
    Counterparties = 'counterparties',
    Invoices = 'invoices',
    Compliance = 'compliance',
    AnomalyDetection = 'anomaly-detection',

    // System & Settings
    Security = 'security',
    OpenBanking = 'open-banking',
    APIStatus = 'api-status',
    TheWinningVision = 'the-winning-vision',
    Settings = 'settings',
}

/**
 * @description Defines the type of dynamic, reality-bending background effect.
 */
export type IllusionType = 'none' | 'aurora';

// ================================================================================================
// CORE PERSONAL FINANCE TYPES
// ================================================================================================

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

// ================================================================================================
// GAMIFICATION & REWARDS TYPES
// ================================================================================================

export interface GamificationState {
    score: number;
    level: number;
    levelName: string;
    progress: number; // Percentage to next level
    credits: number;
}

export interface RewardPoints {
    balance: number;
    lastEarned: number;
    lastRedeemed: number;
    currency: string;
}

export interface RewardItem {
    id: string;
    name: string;
    cost: number; // in reward points
    type: 'cashback' | 'giftcard' | 'impact';
    description: string;
    iconName: string;
}

// ================================================================================================
// CREDIT & HEALTH TYPES
// ================================================================================================

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

// ================================================================================================
// AI & MACHINE LEARNING TYPES
// ================================================================================================

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  urgency: 'low' | 'medium' | 'high';
  chartData?: { name: string; value: number }[];
}

export interface AIQuestion {
    id: string;
    question: string;
    category: string;
}

export enum WeaverStage {
    Pitch = 'pitch',
    Analysis = 'analysis',
    Test = 'test',
    FinalReview = 'final_review',
    Approved = 'approved',
    Error = 'error',
}

export interface QuantumWeaverState {
    stage: WeaverStage;
    businessPlan: string;
    feedback: string;
    questions: AIQuestion[];
    loanAmount: number;
    coachingPlan: AIPlan | null;
    error: string | null;
}

export interface AIPlanStep {
    title: string;
    description: string;
    timeline: string;
}

export interface AIPlan {
    title: string;
    summary: string;
    steps: AIPlanStep[];
}

export interface AIGoalPlanStep {
    title: string;
    description: string;
    category: 'Savings' | 'Budgeting' | 'Investing' | 'Income';
}

export interface AIGoalPlan {
    feasibilitySummary: string;
    monthlyContribution: number;
    steps: AIGoalPlanStep[];
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  aiJustification: string;
}

export interface DetectedSubscription {
  name: string;
  estimatedAmount: number;
  lastCharged: string;
}


// ================================================================================================
// CRYPTO & WEB3 TYPES
// ================================================================================================

export interface CryptoAsset {
  ticker: string;
  name: string;
  value: number; // Total value in USD
  amount: number; // Amount of the asset owned
  color: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  imageUrl: string;
  contractAddress: string;
}

export interface VirtualCard {
  cardNumber: string;
  cvv: string;
  expiry: string;
  holderName: string;
}

export type PaymentOperationStatus = 'Initiated' | 'Processing' | 'Completed' | 'Failed';

export interface PaymentOperation {
  id: string;
  description: string;
  amount: number;
  status: PaymentOperationStatus;
  type: 'ACH' | 'Wire' | 'Crypto';
  date: string;
}

// ================================================================================================
// CORPORATE FINANCE TYPES
// ================================================================================================

export interface CorporateCardControls {
    atm: boolean;
    contactless: boolean;
    online: boolean;
    monthlyLimit: number;
}

export interface CorporateCard {
    id: string;
    holderName: string;
    cardNumberMask: string;
    status: 'Active' | 'Suspended' | 'Lost';
    frozen: boolean;
    controls: CorporateCardControls;
}

export interface CorporateTransaction {
    id: string;
    cardId: string;
    holderName: string;
    merchant: string;
    amount: number;
    status: 'Pending' | 'Approved';
    timestamp: string;
}

export interface Counterparty {
    id: string;
    name: string;
    email: string;
    status: 'Verified' | 'Pending';
    createdDate: string;
}

export type PaymentOrderStatus = 'needs_approval' | 'approved' | 'processing' | 'completed' | 'denied' | 'returned';

export interface PaymentOrder {
    id: string;
    counterpartyName: string;
    amount: number;
    currency: 'USD';
    direction: 'credit' | 'debit';
    status: PaymentOrderStatus;
    date: string;
    type: 'ACH' | 'Wire' | 'RTP';
}

export type InvoiceStatus = 'unpaid' | 'paid' | 'overdue' | 'voided';

export interface Invoice {
    id: string;
    invoiceNumber: string;
    counterpartyName: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}

export interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    action: 'flag_for_review' | 'block';
    active: boolean;
}

export interface ComplianceCase {
    id: string;
    reason: string;
    entityType: 'PaymentOrder' | 'Counterparty';
    entityId: string;
    status: 'open' | 'closed';
    openedDate: string;
}

export type AnomalySeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AnomalyStatus = 'New' | 'Under Review' | 'Dismissed' | 'Resolved';
export type AnomalyEntityType = 'PaymentOrder' | 'Transaction' | 'Counterparty' | 'CorporateCard';

export interface FinancialAnomaly {
    id: string;
    description: string;
    details: string; // AI-generated explanation
    severity: AnomalySeverity;
    status: AnomalyStatus;
    entityType: AnomalyEntityType;
    entityId: string;
    entityDescription: string;
    timestamp: string;
    riskScore: number; // 0-100
}


// ================================================================================================
// SYSTEM & MISC TYPES
// ================================================================================================

export interface Notification {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    view?: View;
}

export type APIProvider = 'Plaid' | 'Stripe' | 'Marqeta' | 'Modern Treasury' | 'Google Gemini';

export interface APIStatus {
    provider: APIProvider;
    status: 'Operational' | 'Degraded Performance' | 'Partial Outage' | 'Major Outage';
    responseTime: number; // in ms
}

export interface MarketMover {
    ticker: string;
    name: string;
    change: number;
    price: number;
}
