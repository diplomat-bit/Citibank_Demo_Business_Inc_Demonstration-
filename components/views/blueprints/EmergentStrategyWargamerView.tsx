```typescript
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid'; // Standard UUID library. Vendor if not available.
import sha256 from 'crypto-js/sha256'; // Standard crypto library. Vendor if not available.

/**
 * This module implements the Emergent Strategy Wargamer View, a high-fidelity business simulation
 * that allows decision-makers to test strategic directives in a dynamic, AI-driven market environment.
 * Business Value: This simulation provides a safe, accelerated, and deterministic sandbox for
 * exploring complex strategic choices in the FinTech and AI sectors. It enables executive teams
 * to refine their "agentic" decision-making frameworks, evaluate the impact of "token rails"
 * and "digital identity" integration on market dynamics, and optimize "real-time payments"
 * infrastructure investments. By modeling competitor reactions and market shifts, it helps
 * identify high-ROI initiatives, mitigate risks, and uncover emergent strategies that can yield
 * millions in competitive advantage, revenue growth, and operational efficiency without real-world
 * expenditure or consequence. It's an indispensable tool for strategic planning, talent development,
 * and pre-validating innovative business models at scale.
 */

// Vendor `uuid` and `crypto-js/sha256` if not in repo. For this exercise, assume they are available or vendor them minimally.
// For example, a minimal uuid4:
// export const generateUUID = (): string => {
//   let d = new Date().getTime();
//   if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
//       d += performance.now(); //use high-precision timer if available
//   }
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//       const r = (d + Math.random() * 16) % 16 | 0;
//       d = Math.floor(d / 16);
//       return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//   });
// };
// And a minimal SHA256 (or use Web Crypto API if available in browser context, or Node.js crypto in backend):
// For client-side, using Web Crypto API is preferred for actual crypto. For simulation, a simple string hash for UI demo.
// export const simulateSha256 = (str: string): string => {
//   let hash = 0;
//   if (str.length === 0) return "0";
//   for (let i = 0; i < str.length; i++) {
//     const char = str.charCodeAt(i);
//     hash = ((hash << 5) - hash) + char;
//     hash |= 0; // Convert to 32bit integer
//   }
//   return Math.abs(hash).toString(16); // Simple non-cryptographic hash for simulation
// };

// Using imported UUID and sha256 for now, with a note to vendor if necessary.
export const generateUUID = (): string => uuidv4();
export const simulateSignature = (data: string): string => sha256(data).toString();

// --- UTILITY TYPES & HELPER FUNCTIONS ---
export type ValueRange = [number, number]; // [min, max]

/**
 * Generates a random number within a specified range and with a given number of decimal places.
 * @param min - The minimum value for the random number.
 * @param max - The maximum value for the random number.
 * @param decimals - The number of decimal places to round the result to.
 * @returns A random number within the specified range.
 */
export const generateRandomNumber = (min: number, max: number, decimals: number = 0): number => {
  const factor = Math.pow(10, decimals);
  return Math.round((Math.random() * (max - min) + min) * factor) / factor;
};

/**
 * Formats a numeric amount as a currency string.
 * @param amount - The numeric amount to format.
 * @param currency - The currency symbol to prepend (default is '$').
 * @returns A formatted currency string.
 */
export const formatCurrency = (amount: number, currency: string = '$'): string => {
  return `${currency}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Returns an emoji representing market sentiment based on a given score.
 * @param sentiment - The sentiment score (0-100).
 * @returns An emoji corresponding to the sentiment level.
 */
export const getMarketSentimentEmoji = (sentiment: number): string => {
  if (sentiment > 80) return '🚀';
  if (sentiment > 60) return '😊';
  if (sentiment > 40) return '😐';
  if (sentiment > 20) return '😟';
  return '📉';
};

/**
 * Picks a random item from a list based on associated weights.
 * @template T - The type of the item.
 * @param items - An array of objects, each containing an item and its weight.
 * @returns A randomly selected item.
 */
export const weightedRandomPick = <T>(items: Array<{ item: T, weight: number }>): T => {
  const totalWeight = items.reduce((sum, { weight }) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  for (const { item, weight } of items) {
    if (random < weight) {
      return item;
    }
    random -= weight;
  }
  return items[0].item; // Fallback in case of edge issues
};

/**
 * Calculates the status of a Key Performance Indicator (KPI) relative to a target.
 * @param value - The current value of the KPI.
 * @param target - The target value for the KPI.
 * @param higherIsBetter - A boolean indicating if a higher value is better (default is true).
 * @returns 'good', 'neutral', or 'bad' based on comparison.
 */
export const calculateKPI = (value: number, target: number, higherIsBetter: boolean = true): 'good' | 'neutral' | 'bad' => {
  if (value === target) return 'neutral';
  if (higherIsBetter) {
    return value > target ? 'good' : 'bad';
  } else {
    return value < target ? 'good' : 'bad';
  }
};

/**
 * Calculates the percentage growth rate between a current and previous value.
 * @param current - The current value.
 * @param previous - The previous value.
 * @returns The growth rate as a percentage.
 */
export const calculateGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? Infinity : 0;
  return ((current - previous) / previous) * 100;
};

// --- CORE GAME INTERFACES ---

/**
 * Defines the allocation percentages for different departmental budgets.
 * This structure is critical for operational efficiency and strategic focus,
 * directly impacting cost structures and competitive positioning.
 */
export interface ResourceAllocation {
  rd: number; // R&D budget percentage
  marketing: number; // Marketing budget percentage
  sales: number; // Sales budget percentage
  operations: number; // Operations efficiency budget percentage
  hr: number; // HR & Talent budget percentage
  customerService: number; // Customer Service budget percentage
  capitalInvestment: number; // Capital expenditure percentage
}

/**
 * Represents a specific feature of a product line, detailing its development and market impact.
 * Features drive product differentiation, customer satisfaction, and innovation leadership,
 * directly influencing market share and revenue potential.
 */
export interface ProductFeature {
  id: string;
  name: string;
  developmentCost: number;
  developmentTimeYears: number;
  marketImpact: ValueRange; // Range for potential market share boost
  customerSatisfactionBoost: ValueRange;
  innovationScore: number; // 0-100
  status: 'planned' | 'developing' | 'launched' | 'obsolete';
  launchYear?: number;
}

/**
 * Defines a product line within a company's portfolio, including its financial performance,
 * features, and market positioning. Product lines are the primary revenue generators,
 * and their management directly impacts a company's financial health and market standing.
 */
export interface ProductLine {
  id: string;
  name: string;
  type: 'AI_Platform' | 'FinTech_App' | 'Data_Analytics' | 'Consulting_Service';
  baseCost: number; // Per unit/customer operational cost
  basePrice: number;
  marketShare: number; // Market share for this specific product line
  customerCount: number;
  revenue: number;
  profit: number;
  features: ProductFeature[];
  innovationLevel: number; // 0-100, impacts adoption
  qualityScore: number; // 0-100
  lifecycleStage: 'introduction' | 'growth' | 'maturity' | 'decline';
  targetMarketSegmentIds: string[];
}

/**
 * Describes a distinct market segment, including its size, growth potential,
 * and sensitivities. Understanding market segments is crucial for targeted strategies,
 * efficient resource allocation, and maximizing market penetration.
 */
export interface MarketSegment {
  id: string;
  name: string;
  totalSize: number; // Total potential customers/revenue in this segment
  growthRate: ValueRange; // Annual growth rate range
  sensitivityToPrice: number; // 0-1, higher means more price-sensitive
  sensitivityToInnovation: number; // 0-1, higher means more innovation-driven
  currentPlayerPenetration: number; // Player's share of this segment
  competitorPenetration: { [competitorId: string]: number };
  customerLoyalty: number; // 0-100
}

/**
 * Represents a competitor's profile, including their strategic approach, market performance,
 * and recent actions. Competitive intelligence is vital for anticipating market shifts
 * and formulating effective counter-strategies.
 */
export interface CompetitorProfile {
  id: string;
  name: string;
  description: string;
  marketShare: number;
  financialStrength: number; // 0-100
  innovationFocus: number; // 0-100
  marketingAggression: number; // 0-100
  strategy: 'innovate' | 'cost_leadership' | 'market_capture' | 'niche_focus' | 'adapt_to_player'; // Added 'adapt_to_player'
  productOfferings: { id: string; name: string; type: ProductLine['type'] }[];
  recentActions: string[];
  identityId: string; // Link to an AgentIdentity
}

/**
 * Defines the player's strategic decisions for a given year.
 * This directive is the core mechanism for guiding the company,
 * impacting all aspects from R&D to market positioning.
 */
export interface PlayerStrategicDirective {
  overallFocus: 'innovation' | 'cost_reduction' | 'market_expansion' | 'customer_retention' | 'risk_management';
  resourceAllocation: ResourceAllocation;
  newProductDevelopment: {
    name: string;
    type: ProductLine['type'];
    targetMarketSegmentIds: string[];
    featuresToDevelop: string[]; // IDs of features
  }[];
  marketingCampaigns: {
    name: string;
    targetSegmentIds: string[];
    budget: number; // Absolute budget
    message: string;
  }[];
  pricingAdjustments: {
    productId: string;
    newPrice: number;
  }[];
  hrInitiatives: 'training' | 'hiring' | 'downsizing' | 'none';
  riskMitigation: string[]; // e.g., ['cybersecurity_investment', 'regulatory_compliance']
  targetAcquisitions: string[]; // Competitor IDs
  divestProductLines: string[]; // Product IDs
}

/**
 * Summarizes the company's financial performance over a period.
 * The income statement is crucial for assessing profitability and operational efficiency.
 */
export interface FinancialStatement {
  revenue: number;
  cogs: number; // Cost of Goods Sold
  grossProfit: number;
  rdExpenses: number;
  marketingExpenses: number;
  salesExpenses: number;
  operationsExpenses: number;
  hrExpenses: number;
  customerServiceExpenses: number;
  depreciation: number;
  operatingProfit: number;
  interestExpenses: number;
  taxes: number;
  netProfit: number;
}

/**
 * Provides a snapshot of the company's assets, liabilities, and equity at a specific point in time.
 * The balance sheet is fundamental for understanding financial stability and capital structure.
 */
export interface BalanceSheet {
  cash: number;
  accountsReceivable: number;
  inventory: number;
  fixedAssets: number;
  totalAssets: number;
  accountsPayable: number;
  shortTermDebt: number;
  longTermDebt: number;
  totalLiabilities: number;
  equity: number;
  totalLiabilitiesAndEquity: number;
}

/**
 * Reports the cash generated and used by a company over a period, categorized by operating,
 * investing, and financing activities. The cash flow statement is vital for assessing
 * liquidity and solvency, providing insights beyond accrual accounting.
 */
export interface CashFlowStatement {
  operatingActivities: number;
  investingActivities: number;
  financingActivities: number;
  netChangeInCash: number;
  beginningCash: number;
  endingCash: number;
}

/**
 * Represents the current state of a wargame company, including its financials,
 * product portfolio, and strategic attributes. This comprehensive snapshot enables
 * granular analysis of performance and strategic impact.
 */
export interface WargameCompanyState {
  id: string;
  name: string;
  yearEstablished: number;
  cash: number;
  marketShare: number;
  revenue: number;
  profit: number;
  employeeCount: number;
  rdBudget: number;
  marketingBudget: number;
  salesBudget: number;
  operationsBudget: number;
  hrBudget: number;
  customerServiceBudget: number;
  capitalInvestmentBudget: number;
  brandReputation: number; // 0-100
  customerSatisfaction: number; // 0-100
  productLines: ProductLine[];
  strategicFocus: PlayerStrategicDirective['overallFocus'];
  financials: {
    incomeStatement: FinancialStatement;
    balanceSheet: BalanceSheet;
    cashFlowStatement: CashFlowStatement;
  };
  identityId: string; // Link to an AgentIdentity
}

/**
 * Contains a summary of events and outcomes at the end of a simulation year.
 * Year-end reports are crucial for performance review, identifying key trends,
 * and informing future strategic adjustments.
 */
export interface YearEndReport {
  year: number;
  companyState: WargameCompanyState;
  competitorActions: string[];
  marketNewsEvents: string[];
  playerDecisionsSummary: PlayerStrategicDirective;
  kpis: {
    marketShareGrowth: number;
    revenueGrowth: number;
    profitMargin: number;
    customerAcquisitionCost: number; // hypothetical
    customerRetentionRate: number; // hypothetical
    innovationIndex: number; // hypothetical
    employeeMorale: number; // hypothetical
    transactionEfficiencyScore?: number; // New KPI for payment infra
  };
  keyInsights: string[];
  recommendations: string[];
}

/**
 * Captures the entire state of the wargame at any given point.
 * This global state object orchestrates all simulation elements,
 * providing the context for decision-making and outcome analysis.
 */
export interface GameState {
  currentYear: number;
  playerCompany: WargameCompanyState;
  competitors: CompetitorProfile[];
  marketSegments: MarketSegment[];
  historicalReports: YearEndReport[];
  globalMarketSentiment: number; // 0-100
  auditLog: AuditLogEntry[]; // Centralized audit log for all agentic actions
  seededIdentities: { [id: string]: AgentIdentity }; // Store all agent identities
}

/**
 * Represents a digital identity for an agent (player or competitor).
 * Essential for attributing actions and decisions, and for simulated secure
 * transactions within the token rails layer.
 */
export interface AgentIdentity {
  id: string;
  name: string;
  role: 'Player' | 'Competitor' | 'System';
  publicKey: string; // Simulated public key (e.g., a hash string)
  signingKey: string; // Simulated private key (e.g., another hash string)
  createdAt: number; // Timestamp
}

/**
 * Records an auditable action taken by an agent within the simulation.
 * This is crucial for governance, transparency, and understanding the causal
 * chain of events, simulating tamper-evident properties through hashing.
 */
export interface AuditLogEntry {
  id: string;
  timestamp: number;
  agentId: string; // ID of the agent (player, competitor, or system)
  agentName: string;
  action: string; // e.g., 'SetStrategicFocus', 'LaunchProduct', 'ProcessPayment'
  details: any; // Structured details of the action
  signature: string; // Simulated cryptographic signature of the action details
}

/**
 * Defines a simulated financial transaction within the game's payment infrastructure.
 * This interface enables conceptual modeling of token rail interactions, including
 * various transaction types and simulated costs.
 */
export interface PaymentTransaction {
  id: string;
  senderId: string;
  receiverId: string;
  amount: number;
  currency: string;
  type: 'budget_allocation' | 'product_sale' | 'acquisition' | 'divestment' | 'payroll' | 'marketing_spend';
  railUsed: 'rail_fast' | 'rail_batch' | 'internal_ledger';
  processingFee: number;
  settlementTime: number; // in simulated years/turns
  status: 'pending' | 'settled' | 'failed';
  timestamp: number;
}

/**
 * Simulates the underlying payments infrastructure and token rail layer.
 * Business Value: This component allows the Wargamer to model the impact of
 * varying payment rail efficiencies, costs, and transactional guarantees on
 * overall business performance. By abstracting the complexities of real-time
 * gross settlement (RTGS) vs. batch processing, and internal ledger movements,
 * it enables strategic decision-making around payment infrastructure investments,
 * liquidity management, and optimizing transaction costs. It's a critical tool
 * for understanding how payment choices affect cash flow, operational overhead,
 * and customer experience in a multi-rail, tokenized future.
 */
export class PaymentProcessorSimulator {
  private transactions: PaymentTransaction[] = [];
  private fees: { [rail: string]: number } = {
    'rail_fast': 0.01, // 1% fee for fast rail
    'rail_batch': 0.001, // 0.1% fee for batch rail
    'internal_ledger': 0.0001, // 0.01% for internal ledger (very efficient)
  };
  private latencies: { [rail: string]: number } = {
    'rail_fast': 0.1, // Settles within current turn (fast)
    'rail_batch': 0.5, // Might take half a turn or more
    'internal_ledger': 0.05, // Instant within the simulation context
  };

  /**
   * Processes a simulated payment, choosing the best rail based on transaction type and amount.
   * @param senderId - The ID of the sending agent.
   * @param receiverId - The ID of the receiving agent.
   * @param amount - The amount of the transaction.
   * @param type - The type of payment (e.g., 'budget_allocation').
   * @param currentYear - The current simulation year.
   * @returns The created payment transaction.
   */
  public processPayment(senderId: string, receiverId: string, amount: number, type: PaymentTransaction['type'], currentYear: number): PaymentTransaction {
    // Predictive routing: Simple AI-enhanced selector
    let railUsed: PaymentTransaction['railUsed'] = 'internal_ledger';
    if (type === 'acquisition' || type === 'divestment' || amount > 1000000) {
      // High-value, critical transactions might prefer fast rails
      railUsed = weightedRandomPick([
        { item: 'rail_fast', weight: 0.7 },
        { item: 'rail_batch', weight: 0.2 },
        { item: 'internal_ledger', weight: 0.1 }
      ]);
    } else if (type === 'marketing_spend' || type === 'product_sale' || amount > 100000) {
      // Medium value, balance cost and speed
      railUsed = weightedRandomPick([
        { item: 'rail_fast', weight: 0.3 },
        { item: 'rail_batch', weight: 0.5 },
        { item: 'internal_ledger', weight: 0.2 }
      ]);
    } else {
      // Small value, prefer batch/internal for cost
      railUsed = weightedRandomPick([
        { item: 'rail_fast', weight: 0.1 },
        { item: 'rail_batch', weight: 0.6 },
        { item: 'internal_ledger', weight: 0.3 }
      ]);
    }

    const processingFee = amount * this.fees[railUsed];
    const settlementTime = this.latencies[railUsed]; // Simplified: fractional years

    const transaction: PaymentTransaction = {
      id: generateUUID(),
      senderId,
      receiverId,
      amount,
      currency: '$',
      type,
      railUsed,
      processingFee,
      settlementTime,
      status: 'settled', // For simplicity, assume all settle within the simulation turn
      timestamp: Date.now(),
    };

    // Risk scoring/fraud detection module (simplified)
    if (amount > 5000000 && Math.random() < 0.05) { // 5% chance of large transaction being flagged
      transaction.status = 'failed';
      console.warn(`[FRAUD_DETECTION] Transaction ${transaction.id} flagged for review: large amount from ${senderId} to ${receiverId}. Status set to FAILED.`);
    }

    this.transactions.push(transaction);
    return transaction;
  }

  /**
   * Retrieves all simulated transactions.
   * @returns An array of all processed payment transactions.
   */
  public getTransactions(): PaymentTransaction[] {
    return this.transactions;
  }

  /**
   * Calculates the overall transaction efficiency score based on processed payments.
   * Business Value: This metric provides critical feedback on the performance of the
   * payment infrastructure and the strategic choices made regarding rail utilization.
   * A high efficiency score indicates optimized transaction routing, minimized fees,
   * and swift settlements, directly translating to improved cash flow, reduced operational
   * costs, and better financial agility for the company, saving potentially millions in
   * avoidable transaction costs and enhancing liquidity.
   * @returns An average efficiency score (0-100).
   */
  public calculateEfficiencyScore(): number {
    if (this.transactions.length === 0) return 100;

    let totalScore = 0;
    this.transactions.forEach(tx => {
      // Reward low fees and fast settlement
      const feeImpact = 1 - (tx.processingFee / tx.amount); // Higher for lower fees
      const speedImpact = 1 - (tx.settlementTime / 1); // Max settlement time 1 year, lower is better

      totalScore += (feeImpact * 0.7 + speedImpact * 0.3) * 100;
    });

    return totalScore / this.transactions.length;
  }
}

// --- MOCK DATA GENERATION ---

/**
 * Generates initial digital identities for the player and core competitors.
 * This is the foundation of the digital identity layer, enabling attributed
 * actions and simulated secure communication/transactions.
 * @returns An object containing all seeded AgentIdentity instances.
 */
export const generateSeededIdentities = (): { [id: string]: AgentIdentity } => {
  const identities: { [id: string]: AgentIdentity } = {};

  const createIdentity = (name: string, role: AgentIdentity['role']): AgentIdentity => {
    const id = `${role.toLowerCase()}_${name.toLowerCase().replace(/\s/g, '_').replace('.', '')}`;
    const publicKey = simulateSignature(id + name + role + Date.now()); // Simple mock key
    const signingKey = simulateSignature(publicKey + 'private_seed'); // Simple mock key
    return { id, name, role, publicKey, signingKey, createdAt: Date.now() };
  };

  const playerIdentity = createIdentity('Nexus Innovations', 'Player');
  identities[playerIdentity.id] = playerIdentity;

  const comp1Identity = createIdentity('FinFuture Inc.', 'Competitor');
  identities[comp1Identity.id] = comp1Identity;

  const comp2Identity = createIdentity('Innovatech Solutions', 'Competitor');
  identities[comp2Identity.id] = comp2Identity;

  const comp3Identity = createIdentity('CustomerCare Co.', 'Competitor');
  identities[comp3Identity.id] = comp3Identity;

  // Add system identities for audit logging of non-agent events
  identities['system_internal'] = createIdentity('Internal System', 'System');
  identities['system_rd_dept'] = createIdentity('R&D Department', 'System');
  identities['system_marketing_agency'] = createIdentity('Marketing Agency', 'System');
  identities['system_sales_commission'] = createIdentity('Sales Commission', 'System');
  identities['system_operations'] = createIdentity('Operations Department', 'System');
  identities['system_hr_dept'] = createIdentity('HR Department', 'System');
  identities['system_customer_service'] = createIdentity('Customer Service Department', 'System');
  identities['system_buyer'] = createIdentity('Market Buyer', 'System');
  identities['system_market_event'] = createIdentity('Market Event System', 'System');
  identities['system_report_generator'] = createIdentity('Report Generator', 'System');


  return identities;
};

/**
 * Generates the initial set of competitor profiles for the simulation.
 * Each competitor is endowed with a unique strategy and market attributes,
 * designed to interact dynamically with the player's decisions.
 * @param seededIdentities - Pre-generated digital identities for all agents.
 * @returns An array of CompetitorProfile objects.
 */
export const generateInitialCompetitors = (seededIdentities: { [id: string]: AgentIdentity }): CompetitorProfile[] => [
  {
    id: 'comp1_finfuture',
    name: 'FinFuture Inc.',
    description: 'A large, established fintech player known for broad market reach and aggressive marketing.',
    marketShare: 35,
    financialStrength: 85,
    innovationFocus: 60,
    marketingAggression: 90,
    strategy: 'market_capture',
    productOfferings: [
      { id: 'prod_aiwallet', name: 'AI Wallet', type: 'FinTech_App' },
      { id: 'prod_corpfinance', name: 'Corporate Finance Suite', type: 'AI_Platform' },
    ],
    recentActions: [],
    identityId: seededIdentities['competitor_finfuture_inc'].id,
  },
  {
    id: 'comp2_innovatech',
    name: 'Innovatech Solutions',
    description: 'A challenger focused on bleeding-edge AI and data analytics, often first to market with new tech.',
    marketShare: 15,
    financialStrength: 60,
    innovationFocus: 95,
    marketingAggression: 50,
    strategy: 'innovate',
    productOfferings: [
      { id: 'prod_datapredict', name: 'Data Predictor AI', type: 'Data_Analytics' },
      { id: 'prod_edgeai', name: 'Edge AI Platform', type: 'AI_Platform' },
    ],
    recentActions: [],
    identityId: seededIdentities['competitor_innovatech_solutions'].id,
  },
  {
    id: 'comp3_customercare',
    name: 'CustomerCare Co.',
    description: 'Known for exceptional customer service and strong loyalty, targets specific niche segments.',
    marketShare: 10,
    financialStrength: 70,
    innovationFocus: 40,
    marketingAggression: 60,
    strategy: 'niche_focus',
    productOfferings: [
      { id: 'prod_loyaltyapp', name: 'Loyalty Rewards App', type: 'FinTech_App' },
      { id: 'prod_smesupport', name: 'SME Consulting', type: 'Consulting_Service' },
    ],
    recentActions: [],
    identityId: seededIdentities['competitor_customercare_co'].id,
  },
];

/**
 * Initializes the market segments that comprise the overall market.
 * These segments have distinct characteristics and growth profiles,
 * influencing the effectiveness of product and marketing strategies.
 * @returns An array of MarketSegment objects.
 */
export const generateInitialMarketSegments = (): MarketSegment[] => [
  {
    id: 'segment_consumer_mass',
    name: 'Mass Market Consumers',
    totalSize: 50000000,
    growthRate: [0.03, 0.07],
    sensitivityToPrice: 0.7,
    sensitivityToInnovation: 0.3,
    currentPlayerPenetration: 0.05,
    competitorPenetration: {
      'comp1_finfuture': 0.30,
      'comp2_innovatech': 0.05,
      'comp3_customercare': 0.08,
    },
    customerLoyalty: 60,
  },
  {
    id: 'segment_enterprise_smb',
    name: 'Small & Medium Businesses',
    totalSize: 5000000,
    growthRate: [0.05, 0.10],
    sensitivityToPrice: 0.5,
    sensitivityToInnovation: 0.6,
    currentPlayerPenetration: 0.02,
    competitorPenetration: {
      'comp1_finfuture': 0.15,
      'comp2_innovatech': 0.10,
      'comp3_customercare': 0.05,
    },
    customerLoyalty: 70,
  },
  {
    id: 'segment_enterprise_large',
    name: 'Large Enterprises',
    totalSize: 500000,
    growthRate: [0.02, 0.05],
    sensitivityToPrice: 0.3,
    sensitivityToInnovation: 0.8,
    currentPlayerPenetration: 0.01,
    competitorPenetration: {
      'comp1_finfuture': 0.10,
      'comp2_innovatech': 0.20,
      'comp3_customercare': 0.02,
    },
    customerLoyalty: 80,
  },
  {
    id: 'segment_developer_api',
    name: 'Developer & API Integrators',
    totalSize: 1000000,
    growthRate: [0.08, 0.15],
    sensitivityToPrice: 0.4,
    sensitivityToInnovation: 0.9,
    currentPlayerPenetration: 0.005,
    competitorPenetration: {
      'comp1_finfuture': 0.05,
      'comp2_innovatech': 0.15,
      'comp3_customercare': 0.01,
    },
    customerLoyalty: 75,
  },
];

/**
 * Creates the initial state for the player's company, Nexus Innovations.
 * This baseline configuration defines the starting resources, products,
 * and financial position for the wargame.
 * @param playerIdentity - The digital identity of the player's company.
 * @returns A WargameCompanyState object representing the player's company.
 */
export const generateInitialPlayerCompany = (playerIdentity: AgentIdentity): WargameCompanyState => {
  const initialProductFeatures: ProductFeature[] = [
    {
      id: 'core_data_analytics_v1',
      name: 'Basic Data Analytics',
      developmentCost: 500000,
      developmentTimeYears: 0,
      marketImpact: [0.01, 0.02],
      customerSatisfactionBoost: [5, 10],
      innovationScore: 40,
      status: 'launched',
      launchYear: 2024,
    },
    {
      id: 'core_fintech_app_v1',
      name: 'Basic Budgeting App',
      developmentCost: 750000,
      developmentTimeYears: 0,
      marketImpact: [0.015, 0.025],
      customerSatisfactionBoost: [7, 12],
      innovationScore: 50,
      status: 'launched',
      launchYear: 2024,
    },
    {
      id: 'next_gen_ai_feature_a',
      name: 'Predictive Spending AI (Planned)',
      developmentCost: 2000000,
      developmentTimeYears: 2,
      marketImpact: [0.03, 0.06],
      customerSatisfactionBoost: [15, 25],
      innovationScore: 80,
      status: 'planned',
    },
    {
      id: 'enterprise_api_integration_feature_b',
      name: 'Enterprise API Gateway (Planned)',
      developmentCost: 1500000,
      developmentTimeYears: 1,
      marketImpact: [0.02, 0.04],
      customerSatisfactionBoost: [10, 20],
      innovationScore: 70,
      status: 'planned',
    },
  ];

  const initialProductLines: ProductLine[] = [
    {
      id: 'player_fintech_suite',
      name: 'FinTech Suite Basic',
      type: 'FinTech_App',
      baseCost: 5,
      basePrice: 15,
      marketShare: 0.05,
      customerCount: 100000,
      revenue: 1500000,
      profit: 750000,
      features: initialProductFeatures.filter(f => f.id.includes('fintech')),
      innovationLevel: 55,
      qualityScore: 70,
      lifecycleStage: 'growth',
      targetMarketSegmentIds: ['segment_consumer_mass'],
    },
    {
      id: 'player_data_analytics',
      name: 'Data Insights Platform',
      type: 'Data_Analytics',
      baseCost: 20,
      basePrice: 50,
      marketShare: 0.02,
      customerCount: 10000,
      revenue: 500000,
      profit: 200000,
      features: initialProductFeatures.filter(f => f.id.includes('data_analytics')),
      innovationLevel: 60,
      qualityScore: 75,
      lifecycleStage: 'introduction',
      targetMarketSegmentIds: ['segment_enterprise_smb', 'segment_developer_api'],
    },
  ];

  const initialIncomeStatement: FinancialStatement = {
    revenue: 2000000,
    cogs: 800000,
    grossProfit: 1200000,
    rdExpenses: 200000,
    marketingExpenses: 300000,
    salesExpenses: 150000,
    operationsExpenses: 100000,
    hrExpenses: 200000,
    customerServiceExpenses: 50000,
    depreciation: 50000,
    operatingProfit: 150000,
    interestExpenses: 20000,
    taxes: 30000,
    netProfit: 100000,
  };

  const initialBalanceSheet: BalanceSheet = {
    cash: 5000000,
    accountsReceivable: 100000,
    inventory: 0,
    fixedAssets: 1000000,
    totalAssets: 6100000,
    accountsPayable: 50000,
    shortTermDebt: 200000,
    longTermDebt: 1000000,
    totalLiabilities: 1250000,
    equity: 4850000,
    totalLiabilitiesAndEquity: 6100000,
  };

  const initialCashFlowStatement: CashFlowStatement = {
    operatingActivities: 100000,
    investingActivities: -50000,
    financingActivities: 0,
    netChangeInCash: 50000,
    beginningCash: 4950000,
    endingCash: 5000000,
  };

  return {
    id: 'player_company',
    name: 'Nexus Innovations',
    yearEstablished: 2024,
    cash: 5000000,
    marketShare: 0.07, // 7% initial total market share
    revenue: 2000000,
    profit: 100000,
    employeeCount: 150,
    rdBudget: 200000,
    marketingBudget: 300000,
    salesBudget: 150000,
    operationsBudget: 100000,
    hrBudget: 200000,
    customerServiceBudget: 50000,
    capitalInvestmentBudget: 0,
    brandReputation: 65,
    customerSatisfaction: 70,
    productLines: initialProductLines,
    strategicFocus: 'innovation',
    financials: {
      incomeStatement: initialIncomeStatement,
      balanceSheet: initialBalanceSheet,
      cashFlowStatement: initialCashFlowStatement,
    },
    identityId: playerIdentity.id,
  };
};

/**
 * Assembles the complete initial game state, including player company,
 * competitors, market segments, and global conditions.
 * @returns A GameState object for the start of the simulation.
 */
export const getInitialGameState = (): GameState => {
  const seededIdentities = generateSeededIdentities();
  const playerIdentity = seededIdentities['player_nexus_innovations'];
  const initialPlayerCompany = generateInitialPlayerCompany(playerIdentity);

  return {
    currentYear: 2024,
    playerCompany: initialPlayerCompany,
    competitors: generateInitialCompetitors(seededIdentities),
    marketSegments: generateInitialMarketSegments(),
    historicalReports: [],
    globalMarketSentiment: 60,
    auditLog: [],
    seededIdentities,
  };
};

// --- SIMULATION ENGINE CORE ---

/**
 * The core simulation engine for the Emergent Strategy Wargamer.
 * Business Value: This engine is the strategic brain of the simulation, orchestrating
 * complex market dynamics, competitor interactions, and financial flows. It offers
 * a high-performance, deterministic environment for 'build phase' architecture testing.
 * By integrating agentic AI (competitors), conceptual token rails (payment processing),
 * and digital identity (audit logging), it enables granular analysis of strategic
 * decisions. It empowers businesses to model multi-million dollar investments,
 * predict market reactions, and validate new FinTech product launches with unparalleled
 * analytical depth and speed, significantly de-risking real-world deployments and
 * accelerating time-to-market for innovative financial solutions.
 */
export class SimulationEngine {
  private gameState: GameState;
  private currentDirective: PlayerStrategicDirective | null = null;
  private paymentProcessor: PaymentProcessorSimulator;

  /**
   * Constructs the simulation engine with an initial game state.
   * @param initialState - The starting state of the game.
   */
  constructor(initialState: GameState) {
    this.gameState = JSON.parse(JSON.stringify(initialState)); // Deep copy to prevent mutations
    this.paymentProcessor = new PaymentProcessorSimulator();
  }

  /**
   * Sets the strategic directive provided by the player for the upcoming year.
   * @param directive - The player's strategic decisions.
   */
  public setPlayerDirective(directive: PlayerStrategicDirective) {
    this.currentDirective = directive;
  }

  /**
   * Advances the simulation by one year, processing all strategic directives,
   * market dynamics, and financial calculations.
   * @returns A Promise that resolves with the YearEndReport for the completed year.
   * @throws Error if a player directive is not set before advancing.
   */
  public async advanceYear(): Promise<YearEndReport> {
    if (!this.currentDirective) {
      throw new Error('Player strategic directive must be set before advancing year.');
    }

    const prevCompanyState = JSON.parse(JSON.stringify(this.gameState.playerCompany));
    const prevCompetitorStates = JSON.parse(JSON.stringify(this.gameState.competitors));
    const prevMarketSegments = JSON.parse(JSON.stringify(this.gameState.marketSegments));

    // 1. Record Player's Strategic Directive to Audit Log
    this.recordAuditLog(
      this.gameState.playerCompany.identityId,
      'SetStrategicDirective',
      { year: this.gameState.currentYear + 1, directive: this.currentDirective }
    );

    // 2. Apply Player's Strategic Directive and simulate immediate financial impacts
    this.applyPlayerStrategy(this.gameState.playerCompany, this.currentDirective);

    // 3. Simulate R&D Outcomes, including associated payments
    this.simulateRD(this.gameState.playerCompany);

    // 4. Simulate Agentic Competitor Actions & AI
    const competitorActions = this.simulateAgenticCompetitorStrategy(this.gameState.competitors, this.gameState.playerCompany, this.gameState.marketSegments);

    // 5. Simulate Market Dynamics & Customer Behavior
    this.simulateMarketDynamics(this.gameState.playerCompany, this.gameState.competitors, this.gameState.marketSegments, this.currentDirective, this.gameState.globalMarketSentiment);

    // 6. Simulate Marketing & Sales Effectiveness, including associated payments
    this.simulateMarketingAndSales(this.gameState.playerCompany, this.currentDirective, this.gameState.marketSegments);

    // 7. Simulate Operations and HR, including associated payments
    this.simulateOperationsAndHR(this.gameState.playerCompany, this.currentDirective);

    // 8. Generate Random News and Global Events
    const marketNewsEvents = this.generateMarketNewsEvents();
    this.applyGlobalEvents(marketNewsEvents);

    // 9. Calculate Financials
    this.calculateAllFinancials(this.gameState.playerCompany);

    // 10. Update Global Game State
    this.gameState.currentYear++;
    this.gameState.globalMarketSentiment = generateRandomNumber(
      Math.max(0, this.gameState.globalMarketSentiment - 10),
      Math.min(100, this.gameState.globalMarketSentiment + 10),
      0
    );

    // 11. Generate Year-End Report
    const yearEndReport = this.generateYearEndReport(
      prevCompanyState,
      prevCompetitorStates,
      prevMarketSegments,
      this.gameState.playerCompany,
      competitorActions,
      marketNewsEvents,
      this.currentDirective
    );
    this.gameState.historicalReports.push(yearEndReport);

    // Reset directive for next year
    this.currentDirective = null;
    return yearEndReport;
  }

  /**
   * Records an action to the centralized audit log.
   * @param agentId - The ID of the agent performing the action.
   * @param action - A descriptive name of the action.
   * @param details - An object containing specific details of the action.
   */
  private recordAuditLog(agentId: string, action: string, details: any) {
    const agent = this.gameState.seededIdentities[agentId];
    if (!agent) {
      console.error(`AuditLog: Agent with ID ${agentId} not found.`);
      return;
    }
    const dataToSign = JSON.stringify({ timestamp: Date.now(), agentId, action, details });
    const signature = simulateSignature(dataToSign + agent.signingKey); // Simulated private key signing
    this.gameState.auditLog.push({
      id: generateUUID(),
      timestamp: Date.now(),
      agentId,
      agentName: agent.name,
      action,
      details,
      signature,
    });
  }

  /**
   * Simulates the generation of a secure key pair for an agent.
   * In a real system, this would involve robust cryptographic key generation
   * and secure storage. Here, it's a conceptual placeholder.
   * @param agentId - The ID of the agent for whom keys are generated.
   * @returns An object containing simulated public and signing keys.
   */
  private simulateSecureKeyGeneration(agentId: string): { publicKey: string; signingKey: string } {
    const publicKey = simulateSignature(agentId + 'public' + Date.now().toString() + generateRandomNumber(0, 100000));
    const signingKey = simulateSignature(agentId + 'private' + Date.now().toString() + generateRandomNumber(0, 100000));
    this.recordAuditLog(agentId, 'KeyGeneration', { publicKeyHash: simulateSignature(publicKey), keyType: 'ECDSA_SIMULATED' });
    return { publicKey, signingKey };
  }

  /**
   * Verifies a simulated cryptographic signature.
   * In a real system, this would involve public-key cryptography algorithms.
   * Here, it's a conceptual check for demonstration.
   * @param data - The original data that was signed.
   * @param signature - The simulated signature.
   * @param publicKey - The simulated public key of the signer.
   * @returns True if the signature is valid, false otherwise.
   */
  private verifySignature(data: string, signature: string, publicKey: string): boolean {
    const expectedSignature = simulateSignature(data + this.gameState.seededIdentities[publicKey].signingKey); // This is a simplified check, not real crypto
    return expectedSignature === signature;
  }

  /**
   * Applies the player's strategic directive, impacting the company's financials
   * and product portfolio. All financial changes are routed through the payment processor.
   * @param company - The player's company state.
   * @param directive - The player's strategic decisions.
   */
  private applyPlayerStrategy(company: WargameCompanyState, directive: PlayerStrategicDirective) {
    company.strategicFocus = directive.overallFocus;

    // Allocate budgets based on percentages
    const totalBudget = company.cash * 0.2; // Example: 20% of cash as annual operational budget

    const budgetAllocation: ResourceAllocation = {
      rd: totalBudget * (directive.resourceAllocation.rd / 100),
      marketing: totalBudget * (directive.resourceAllocation.marketing / 100),
      sales: totalBudget * (directive.resourceAllocation.sales / 100),
      operations: totalBudget * (directive.resourceAllocation.operations / 100),
      hr: totalBudget * (directive.resourceAllocation.hr / 100),
      customerService: totalBudget * (directive.resourceAllocation.customerService / 100),
      capitalInvestment: totalBudget * (directive.resourceAllocation.capitalInvestment / 100),
    };

    company.rdBudget = budgetAllocation.rd;
    company.marketingBudget = budgetAllocation.marketing;
    company.salesBudget = budgetAllocation.sales;
    company.operationsBudget = budgetAllocation.operations;
    company.hrBudget = budgetAllocation.hr;
    company.customerServiceBudget = budgetAllocation.customerService;
    company.capitalInvestmentBudget = budgetAllocation.capitalInvestment;

    // Deduct total budget from cash (initial allocation) via payment processor
    if (totalBudget > 0) {
      const paymentTx = this.paymentProcessor.processPayment(
        company.identityId,
        'system_internal', // Representing internal budget allocation
        totalBudget,
        'budget_allocation',
        this.gameState.currentYear
      );
      if (paymentTx.status === 'settled') {
        company.cash -= totalBudget + paymentTx.processingFee;
        this.recordAuditLog(company.identityId, 'BudgetAllocation', { year: this.gameState.currentYear + 1, totalBudget, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
      } else {
        this.recordAuditLog(company.identityId, 'BudgetAllocationFailed', { year: this.gameState.currentYear + 1, totalBudget, reason: 'Payment failed' });
      }
    }

    // Handle new product development (initial setup, actual launch happens after dev time)
    directive.newProductDevelopment.forEach(newProd => {
      const existingProduct = company.productLines.find(p => p.name === newProd.name);
      if (!existingProduct) {
        const productBaseCost = generateRandomNumber(10, 30);
        const productBasePrice = generateRandomNumber(40, 100);
        const newFeatures: ProductFeature[] = [];
        newProd.featuresToDevelop.forEach(featureId => {
          newFeatures.push({
            id: `${newProd.name}_${featureId}`,
            name: `Feature: ${featureId}`,
            developmentCost: generateRandomNumber(100000, 1000000),
            developmentTimeYears: generateRandomNumber(1, 3, 0),
            marketImpact: [0.01, 0.05],
            customerSatisfactionBoost: [5, 15],
            innovationScore: generateRandomNumber(60, 95),
            status: 'planned', // New features start as planned
          });
        });

        const newProductLine: ProductLine = {
          id: `prod_${newProd.name.toLowerCase().replace(/\s/g, '_')}_${generateUUID().substring(0, 4)}`,
          name: newProd.name,
          type: newProd.type,
          baseCost: productBaseCost,
          basePrice: productBasePrice,
          marketShare: 0,
          customerCount: 0,
          revenue: 0,
          profit: 0,
          features: newFeatures,
          innovationLevel: generateRandomNumber(50, 70),
          qualityScore: generateRandomNumber(60, 80),
          lifecycleStage: 'introduction',
          targetMarketSegmentIds: newProd.targetMarketSegmentIds,
        };
        company.productLines.push(newProductLine);
        this.recordAuditLog(company.identityId, 'PlannedNewProduct', { productId: newProductLine.id, productName: newProductLine.name, features: newFeatures.map(f => f.id) });
      }
    });

    // Handle pricing adjustments
    directive.pricingAdjustments.forEach(adjustment => {
      const product = company.productLines.find(p => p.id === adjustment.productId);
      if (product) {
        const oldPrice = product.basePrice;
        product.basePrice = adjustment.newPrice;
        // Impact customer satisfaction/market share immediately (simplified)
        const priceChangeEffect = (adjustment.newPrice - oldPrice) / oldPrice;
        product.customerCount *= (1 - priceChangeEffect * 0.1); // Small immediate effect
        this.recordAuditLog(company.identityId, 'AdjustedProductPricing', { productId: product.id, oldPrice, newPrice: adjustment.newPrice });
      }
    });

    // Handle divest product lines
    directive.divestProductLines.forEach(productId => {
      const productToDivest = company.productLines.find(p => p.id === productId);
      if (productToDivest) {
        company.productLines = company.productLines.filter(p => p.id !== productId);
        // Simulate cash inflow from divestment via payment processor
        const divestmentAmount = generateRandomNumber(500000, 2000000);
        const paymentTx = this.paymentProcessor.processPayment(
          'system_buyer', // Conceptual buyer
          company.identityId,
          divestmentAmount,
          'divestment',
          this.gameState.currentYear
        );
        if (paymentTx.status === 'settled') {
          company.cash += divestmentAmount - paymentTx.processingFee;
          this.recordAuditLog(company.identityId, 'DivestedProductLine', { productId, amount: divestmentAmount, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
        } else {
          this.recordAuditLog(company.identityId, 'DivestmentFailed', { productId, amount: divestmentAmount, reason: 'Payment failed' });
        }
      }
    });

    // Handle target acquisitions (simplified - just remove competitor)
    directive.targetAcquisitions.forEach(competitorId => {
      const acquiredComp = this.gameState.competitors.find(c => c.id === competitorId);
      if (acquiredComp) {
        this.gameState.competitors = this.gameState.competitors.filter(c => c.id !== competitorId);
        // Simulate cash outflow for acquisition via payment processor
        const acquisitionCost = generateRandomNumber(10000000, 50000000);
        const paymentTx = this.paymentProcessor.processPayment(
          company.identityId,
          acquiredComp.identityId,
          acquisitionCost,
          'acquisition',
          this.gameState.currentYear
        );
        if (paymentTx.status === 'settled') {
          company.cash -= acquisitionCost + paymentTx.processingFee;
          company.brandReputation = Math.min(100, company.brandReputation + generateRandomNumber(5, 15));
          // Add acquired products to player's portfolio (simplified)
          acquiredComp.productOfferings.forEach(p => {
            company.productLines.push({
              id: `acquired_${p.id}_${generateUUID().substring(0, 4)}`,
              name: `Acquired ${p.name} from ${acquiredComp.name}`,
              type: p.type,
              baseCost: generateRandomNumber(5, 20),
              basePrice: generateRandomNumber(20, 80),
              marketShare: generateRandomNumber(0.01, 0.03),
              customerCount: generateRandomNumber(50000, 200000),
              revenue: generateRandomNumber(1000000, 5000000),
              profit: generateRandomNumber(200000, 1000000),
              features: [], // Simplified: no specific features for acquired products initially
              innovationLevel: generateRandomNumber(40, 70),
              qualityScore: generateRandomNumber(60, 80),
              lifecycleStage: 'maturity',
              targetMarketSegmentIds: this.gameState.marketSegments.map(s => s.id), // All segments for simplicity
            });
          });
          this.recordAuditLog(company.identityId, 'AcquiredCompetitor', { competitorId, cost: acquisitionCost, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
        } else {
          this.recordAuditLog(company.identityId, 'AcquisitionFailed', { competitorId, cost: acquisitionCost, reason: 'Payment failed' });
        }
      }
    });
  }

  /**
   * Simulates the R&D activities for the company, including feature development
   * and overall innovation. R&D expenses are processed through the payment processor.
   * @param company - The player's company state.
   */
  private simulateRD(company: WargameCompanyState) {
    const actualRDCost = company.rdBudget * generateRandomNumber(0.8, 1.2); // Actual spend fluctuates

    // Process R&D budget payment
    if (actualRDCost > 0) {
      const paymentTx = this.paymentProcessor.processPayment(
        company.identityId,
        'system_rd_dept', // Conceptual R&D department
        actualRDCost,
        'budget_allocation',
        this.gameState.currentYear
      );
      if (paymentTx.status === 'settled') {
        company.cash -= actualRDCost + paymentTx.processingFee;
        this.recordAuditLog(company.identityId, 'RDBudgetSpend', { amount: actualRDCost, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
      } else {
        this.recordAuditLog(company.identityId, 'RDBudgetSpendFailed', { amount: actualRDCost, reason: 'Payment failed' });
      }
    }

    company.productLines.forEach(product => {
      product.features.forEach(feature => {
        if (feature.status === 'developing') {
          feature.developmentTimeYears--;
          if (feature.developmentTimeYears <= 0) {
            feature.status = 'launched';
            feature.launchYear = this.gameState.currentYear + 1; // Launches next year
            product.innovationLevel = Math.min(100, product.innovationLevel + generateRandomNumber(feature.innovationScore / 20, feature.innovationScore / 10));
            product.qualityScore = Math.min(100, product.qualityScore + generateRandomNumber(feature.innovationScore / 25, feature.innovationScore / 15));
            company.customerSatisfaction = Math.min(100, company.customerSatisfaction + generateRandomNumber(feature.customerSatisfactionBoost[0], feature.customerSatisfactionBoost[1]));
            this.recordAuditLog(company.identityId, 'ProductFeatureLaunched', { productId: product.id, featureId: feature.id, launchYear: feature.launchYear });
          }
        }
      });
      // General innovation boost from RD budget
      product.innovationLevel = Math.min(100, product.innovationLevel + actualRDCost / 500000 * generateRandomNumber(0.1, 0.5));
    });
  }

  /**
   * Simulates the effectiveness of marketing and sales efforts, impacting market share
   * and customer acquisition. Marketing and sales budgets are processed through payments.
   * @param company - The player's company state.
   * @param directive - The player's strategic decisions.
   * @param marketSegments - The current market segments.
   */
  private simulateMarketingAndSales(company: WargameCompanyState, directive: PlayerStrategicDirective, marketSegments: MarketSegment[]) {
    const actualMarketingSpend = company.marketingBudget * generateRandomNumber(0.8, 1.2);
    const actualSalesSpend = company.salesBudget * generateRandomNumber(0.8, 1.2);

    // Process marketing budget payment
    if (actualMarketingSpend > 0) {
      const paymentTx = this.paymentProcessor.processPayment(
        company.identityId,
        'system_marketing_agency',
        actualMarketingSpend,
        'marketing_spend',
        this.gameState.currentYear
      );
      if (paymentTx.status === 'settled') {
        company.cash -= actualMarketingSpend + paymentTx.processingFee;
        this.recordAuditLog(company.identityId, 'MarketingBudgetSpend', { amount: actualMarketingSpend, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
      }
    }
    // Process sales budget payment
    if (actualSalesSpend > 0) {
      const paymentTx = this.paymentProcessor.processPayment(
        company.identityId,
        'system_sales_commission',
        actualSalesSpend,
        'budget_allocation', // Could be 'sales_commission'
        this.gameState.currentYear
      );
      if (paymentTx.status === 'settled') {
        company.cash -= actualSalesSpend + paymentTx.processingFee;
        this.recordAuditLog(company.identityId, 'SalesBudgetSpend', { amount: actualSalesSpend, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
      }
    }

    let totalBrandReputationBoost = 0;

    // Apply general marketing budget effects
    totalBrandReputationBoost += (actualMarketingSpend / 1000000) * generateRandomNumber(1, 3);
    company.brandReputation = Math.min(100, company.brandReputation + totalBrandReputationBoost);
    company.customerSatisfaction = Math.min(100, company.customerSatisfaction + (actualMarketingSpend / 1000000) * generateRandomNumber(0.5, 1));

    // Apply specific marketing campaign effects
    directive.marketingCampaigns.forEach(campaign => {
      const effectiveBudget = campaign.budget * generateRandomNumber(0.8, 1.2);
      // Campaign budget already deducted through total budget allocation or specific marketing spend processing
      // company.cash -= effectiveBudget; // Deduct campaign budget (already handled by total marketing spend)

      campaign.targetSegmentIds.forEach(segmentId => {
        const segment = marketSegments.find(s => s.id === segmentId);
        if (segment) {
          const campaignEffect = (effectiveBudget / 100000) * generateRandomNumber(0.001, 0.005); // Small market share gain per 100k budget
          segment.currentPlayerPenetration = Math.min(1, segment.currentPlayerPenetration + campaignEffect);
          company.brandReputation = Math.min(100, company.brandReputation + campaignEffect * 100);
          this.recordAuditLog(company.identityId, 'MarketingCampaignLaunch', { campaignName: campaign.name, targetSegment: segment.name, budget: effectiveBudget });
        }
      });
    });

    // Sales efforts translate to direct customer acquisition
    company.productLines.forEach(product => {
      product.targetMarketSegmentIds.forEach(segmentId => {
        const segment = marketSegments.find(s => s.id === segmentId);
        if (segment) {
          const acquisitionRate = (actualSalesSpend / 1000000) * generateRandomNumber(0.01, 0.05) * segment.sensitivityToPrice * (company.brandReputation / 100) * (product.innovationLevel / 100);
          const potentialCustomers = segment.totalSize * (1 - segment.currentPlayerPenetration); // Customers not yet acquired by player
          const newCustomers = Math.min(potentialCustomers, potentialCustomers * acquisitionRate);
          product.customerCount += newCustomers;
          segment.currentPlayerPenetration += newCustomers / segment.totalSize; // Update segment penetration
          company.customerSatisfaction = Math.min(100, company.customerSatisfaction + (actualSalesSpend / 1000000) * generateRandomNumber(0.1, 0.3));
          if (newCustomers > 0) {
            this.recordAuditLog(company.identityId, 'CustomerAcquisition', { productId: product.id, segmentId: segment.id, newCustomers: Math.round(newCustomers) });
          }
        }
      });
    });
  }

  /**
   * Simulates the impact of operations and HR decisions on efficiency and employee morale.
   * Budgets for these departments are processed via the payment processor.
   * @param company - The player's company state.
   * @param directive - The player's strategic decisions.
   */
  private simulateOperationsAndHR(company: WargameCompanyState, directive: PlayerStrategicDirective) {
    const actualOperationsSpend = company.operationsBudget * generateRandomNumber(0.8, 1.2);
    const actualHRSpend = company.hrBudget * generateRandomNumber(0.8, 1.2);
    const actualCustomerServiceSpend = company.customerServiceBudget * generateRandomNumber(0.8, 1.2);

    // Process budget payments
    [
      { amount: actualOperationsSpend, type: 'budget_allocation', recipient: 'system_operations' },
      { amount: actualHRSpend, type: 'payroll', recipient: 'system_hr_dept' },
      { amount: actualCustomerServiceSpend, type: 'budget_allocation', recipient: 'system_customer_service' },
    ].forEach(({ amount, type, recipient }) => {
      if (amount > 0) {
        const paymentTx = this.paymentProcessor.processPayment(company.identityId, recipient, amount, type, this.gameState.currentYear);
        if (paymentTx.status === 'settled') {
          company.cash -= amount + paymentTx.processingFee;
          this.recordAuditLog(company.identityId, `${type === 'payroll' ? 'PayrollExpense' : 'OperationalSpend'}`, { department: recipient, amount, fee: paymentTx.processingFee, rail: paymentTx.railUsed });
        }
      }
    });

    // Operational efficiency impacts COGS and quality
    company.productLines.forEach(product => {
      product.baseCost *= (1 - (actualOperationsSpend / 1000000) * generateRandomNumber(0.01, 0.03)); // Reduce cost
      product.qualityScore = Math.min(100, product.qualityScore + (actualOperationsSpend / 1000000) * generateRandomNumber(0.5, 1.5));
    });

    // HR initiatives
    switch (directive.hrInitiatives) {
      case 'hiring':
        company.employeeCount = Math.round(company.employeeCount * generateRandomNumber(1.05, 1.15));
        company.customerSatisfaction = Math.min(100, company.customerSatisfaction + generateRandomNumber(2, 5));
        company.brandReputation = Math.min(100, company.brandReputation + generateRandomNumber(1, 3));
        this.recordAuditLog(company.identityId, 'HRInitiative', { initiative: 'hiring', employeeChange: company.employeeCount - this.gameState.playerCompany.employeeCount });
        break;
      case 'training':
        company.customerSatisfaction = Math.min(100, company.customerSatisfaction + generateRandomNumber(3, 7));
        company.productLines.forEach(p => p.qualityScore = Math.min(100, p.qualityScore + generateRandomNumber(2, 5)));
        this.recordAuditLog(company.identityId, 'HRInitiative', { initiative: 'training' });
        break;
      case 'downsizing':
        company.employeeCount = Math.round(company.employeeCount * generateRandomNumber(0.85, 0.95));
        company.customerSatisfaction = Math.max(0, company.customerSatisfaction - generateRandomNumber(5, 10));
        company.brandReputation = Math.max(0, company.brandReputation - generateRandomNumber(3, 7));
        this.recordAuditLog(company.identityId, 'HRInitiative', { initiative: 'downsizing', employeeChange: company.employeeCount - this.gameState.playerCompany.employeeCount });
        break;
      case 'none':
      default:
        // Stable
        break;
    }

    // Customer service budget impacts satisfaction
    company.customerSatisfaction = Math.min(100, company.customerSatisfaction + (actualCustomerServiceSpend / 500000) * generateRandomNumber(0.5, 2));
  }

  /**
   * Simulates the actions of competitor agents, with their strategies adapting
   * to market conditions and player actions.
   * @param competitors - The array of competitor profiles.
   * @param playerCompany - The player's company state.
   * @param marketSegments - The current market segments.
   * @returns A list of actions taken by competitors.
   */
  private simulateAgenticCompetitorStrategy(competitors: CompetitorProfile[], playerCompany: WargameCompanyState, marketSegments: MarketSegment[]): string[] {
    const actions: string[] = [];

    competitors.forEach(comp => {
      const rand = Math.random();
      comp.recentActions = []; // Clear previous actions

      let effectiveStrategy = comp.strategy;
      // Competitor AI: Simple adaptation logic
      if (playerCompany.marketShare > comp.marketShare * 1.2 && rand < 0.3) {
        // Player is significantly outperforming, competitor might shift focus
        effectiveStrategy = weightedRandomPick([
          { item: 'market_capture', weight: 0.5 },
          { item: 'innovate', weight: 0.3 },
          { item: 'cost_leadership', weight: 0.2 }
        ]);
        comp.recentActions.push(`${comp.name} adapted its strategy to 'market capture' due to player's growth.`);
        this.recordAuditLog(comp.identityId, 'StrategyAdaptation', { oldStrategy: comp.strategy, newStrategy: effectiveStrategy, trigger: 'PlayerOutperformance' });
      } else if (playerCompany.productLines.some(p => p.innovationLevel > comp.innovationFocus && p.innovationLevel > 80) && rand < 0.2) {
        // Player has a highly innovative product
        effectiveStrategy = 'innovate';
        comp.recentActions.push(`${comp.name} shifted focus to 'innovation' to counter player's high innovation.`);
        this.recordAuditLog(comp.identityId, 'StrategyAdaptation', { oldStrategy: comp.strategy, newStrategy: effectiveStrategy, trigger: 'PlayerInnovation' });
      }


      let actionTaken = '';
      switch (effectiveStrategy) {
        case 'innovate':
          if (rand < 0.4) {
            actionTaken = `${comp.name} launched a new AI-driven feature for their leading product.`;
            comp.innovationFocus = Math.min(100, comp.innovationFocus + generateRandomNumber(5, 10));
            comp.marketShare += generateRandomNumber(0.005, 0.015);
            playerCompany.marketShare = Math.max(0, playerCompany.marketShare - generateRandomNumber(0.001, 0.005));
          } else if (rand < 0.7) {
            actionTaken = `${comp.name} announced a major investment in next-gen R&D, committing ${formatCurrency(generateRandomNumber(1000000, 5000000))} to future products.`;
            comp.financialStrength = Math.max(0, comp.financialStrength - generateRandomNumber(2, 5)); // Cost of investment
            comp.innovationFocus = Math.min(100, comp.innovationFocus + generateRandomNumber(2, 5));
          } else {
            actionTaken = `${comp.name} filed several new patents in AI.`;
            comp.innovationFocus = Math.min(100, comp.innovationFocus + generateRandomNumber(1, 3));
          }
          break;
        case 'cost_leadership':
          if (rand < 0.5) {
            const priceReduction = generateRandomNumber(5, 15, 0);
            actionTaken = `${comp.name} reduced prices across their core product lines by ${priceReduction}%.`;
            comp.marketShare += generateRandomNumber(0.008, 0.02);
            playerCompany.marketShare = Math.max(0, playerCompany.marketShare - generateRandomNumber(0.003, 0.01));
            playerCompany.productLines.forEach(p => p.basePrice *= generateRandomNumber(0.98, 1.02)); // Player might react
          } else {
            actionTaken = `${comp.name} announced new operational efficiency initiatives, expecting to save ${formatCurrency(generateRandomNumber(500000, 2000000))} annually.`;
            comp.financialStrength = Math.min(100, comp.financialStrength + generateRandomNumber(1, 3));
          }
          break;
        case 'market_capture':
          if (rand < 0.6) {
            actionTaken = `${comp.name} launched an aggressive new marketing campaign targeting new customer segments.`;
            comp.marketingAggression = Math.min(100, comp.marketingAggression + generateRandomNumber(5, 10));
            comp.marketShare += generateRandomNumber(0.01, 0.03);
            playerCompany.marketShare = Math.max(0, playerCompany.marketShare - generateRandomNumber(0.005, 0.015));
          } else {
            actionTaken = `${comp.name} expanded into a new geographical market, increasing their global footprint.`;
            comp.marketShare += generateRandomNumber(0.005, 0.01);
          }
          break;
        case 'niche_focus':
          if (rand < 0.5) {
            const nicheSegment = weightedRandomPick(marketSegments.filter(s => s.name.includes('Small') || s.name.includes('Developer')).map(s => ({ item: s, weight: 1 })));
            if (nicheSegment) {
              actionTaken = `${comp.name} intensified focus on the ${nicheSegment.name} segment with tailored offerings.`;
              comp.marketShare += generateRandomNumber(0.002, 0.008); // Smaller gains, but solidifies position
              playerCompany.marketShare = Math.max(0, playerCompany.marketShare - generateRandomNumber(0.0005, 0.002));
            }
          } else {
            actionTaken = `${comp.name} enhanced customer support for their specialized clientele.`;
            comp.financialStrength = Math.min(100, comp.financialStrength + generateRandomNumber(1, 2));
          }
          break;
        case 'adapt_to_player': // A new strategy type for highly reactive AI
          // This strategy makes the competitor directly mimic or counter player's primary focus
          switch (playerCompany.strategicFocus) {
            case 'innovation':
              if (rand < 0.7) {
                actionTaken = `${comp.name} directly countered player's innovation focus by accelerating their own R&D.`;
                comp.innovationFocus = Math.min(100, comp.innovationFocus + generateRandomNumber(7, 12));
              } else {
                actionTaken = `${comp.name} attempted to poach key R&D talent from the player.`;
              }
              break;
            case 'market_expansion':
              if (rand < 0.7) {
                actionTaken = `${comp.name} launched a defensive marketing campaign in player's target segments.`;
                comp.marketingAggression = Math.min(100, comp.marketingAggression + generateRandomNumber(8, 15));
                playerCompany.marketShare = Math.max(0, playerCompany.marketShare - generateRandomNumber(0.002, 0.008));
              } else {
                actionTaken = `${comp.name} strategically lowered prices to defend market share.`;
                playerCompany.productLines.forEach(p => p.basePrice *= 0.99); // Slight price pressure
              }
              break;
            case 'cost_reduction':
              if (rand < 0.7) {
                actionTaken = `${comp.name} intensified operational efficiency programs to maintain cost competitiveness.`;
                comp.financialStrength = Math.min(100, comp.financialStrength + generateRandomNumber(3, 7));
              } else {
                actionTaken = `${comp.name} invested in automation to further reduce COGS.`;
              }
              break;
            default:
              actionTaken = `${comp.name} observed player's strategy and made a general market adjustment.`;
              break;
          }
          break;
      }
      if (actionTaken) {
        comp.recentActions.push(actionTaken);
        actions.push(`${comp.name}: ${actionTaken}`);
        this.recordAuditLog(comp.identityId, 'CompetitorAction', { competitorName: comp.name, action: actionTaken, strategy: effectiveStrategy });
      }
      comp.marketShare = Math.max(0, Math.min(100, comp.marketShare + generateRandomNumber(-0.5, 0.5))); // General fluctuation
    });

    // Recalculate player market share based on competitor movement
    const totalCompetitorShare = competitors.reduce((sum, c) => sum + c.marketShare, 0);
    playerCompany.marketShare = 100 - totalCompetitorShare - generateRandomNumber(5, 15); // Assume some unclaimed or smaller player share

    // Ensure total market share doesn't exceed 100% (simple normalization)
    const totalCurrentShare = playerCompany.marketShare + totalCompetitorShare;
    if (totalCurrentShare > 100) {
      const overflow = totalCurrentShare - 100;
      playerCompany.marketShare -= overflow * 0.5;
      competitors.forEach(c => c.marketShare -= overflow * 0.5 / competitors.length);
    }
    playerCompany.marketShare = Math.max(0, playerCompany.marketShare);

    return actions;
  }

  /**
   * Simulates market dynamics, including segment growth, customer churn,
   * acquisition, and competitor penetration adjustments.
   * @param company - The player's company state.
   * @param competitors - The array of competitor profiles.
   * @param marketSegments - The current market segments.
   * @param directive - The player's strategic decisions.
   * @param globalSentiment - The current global market sentiment.
   */
  private simulateMarketDynamics(company: WargameCompanyState, competitors: CompetitorProfile[], marketSegments: MarketSegment[], directive: PlayerStrategicDirective, globalSentiment: number) {
    marketSegments.forEach(segment => {
      // Segment growth
      segment.totalSize = Math.round(segment.totalSize * (1 + generateRandomNumber(segment.growthRate[0], segment.growthRate[1])));

      // General churn and acquisition dynamics
      let playerNetChange = 0;
      let totalSegmentPenetration = 0;

      // Player's market share in this segment
      const playerProductIdsInSegment = company.productLines
        .filter(p => p.targetMarketSegmentIds.includes(segment.id))
        .map(p => p.id);

      let playerSegmentCustomers = company.productLines
        .filter(p => playerProductIdsInSegment.includes(p.id))
        .reduce((sum, p) => sum + p.customerCount, 0);

      // Churn (based on satisfaction, quality, competitor activity)
      const churnRate = (100 - company.customerSatisfaction) / 200 + (100 - segment.customerLoyalty) / 300 + generateRandomNumber(0.01, 0.03);
      const churnedCustomers = playerSegmentCustomers * churnRate;
      playerNetChange -= churnedCustomers;
      if (churnedCustomers > 0) {
        this.recordAuditLog(company.identityId, 'CustomerChurn', { segmentId: segment.id, churnedCustomers: Math.round(churnedCustomers) });
      }

      // New acquisitions (from market growth, marketing campaigns, innovation)
      const innovationPull = (company.productLines.filter(p => playerProductIdsInSegment.includes(p.id)).reduce((sum, p) => sum + p.innovationLevel, 0) / (playerProductIdsInSegment.length || 1)) / 100;
      const marketingPush = (directive.marketingCampaigns.filter(c => c.targetSegmentIds.includes(segment.id)).reduce((sum, c) => sum + c.budget, 0) / 1000000);
      const salesEfficiency = (company.salesBudget / 1000000);

      const acquisitionRate = (innovationPull * segment.sensitivityToInnovation * 0.02) + (marketingPush * 0.01) + (salesEfficiency * 0.005) + (globalSentiment / 100 * 0.005);
      const potentialNewCustomers = Math.max(0, segment.totalSize - playerSegmentCustomers - Object.values(segment.competitorPenetration).reduce((a, b) => a + b, 0) * segment.totalSize);
      const newCustomers = potentialNewCustomers * acquisitionRate;
      playerNetChange += newCustomers;

      // Apply net change to products in segment (distribute proportionally)
      const totalInitialCustomerCountForSegment = company.productLines
        .filter(p => playerProductIdsInSegment.includes(p.id))
        .reduce((sum, p) => sum + p.customerCount, 0);

      if (totalInitialCustomerCountForSegment > 0) {
        company.productLines.forEach(product => {
          if (playerProductIdsInSegment.includes(product.id)) {
            const proportion = product.customerCount / totalInitialCustomerCountForSegment;
            product.customerCount = Math.max(0, product.customerCount + (playerNetChange * proportion));
            product.customerCount = Math.round(product.customerCount);
          }
        });
      } else if (playerNetChange > 0 && company.productLines.length > 0) {
        // If no products initially, but gain customers, assign to a random product
        const productToAssign = company.productLines.find(p => p.targetMarketSegmentIds.includes(segment.id)) || company.productLines[0];
        if (productToAssign) productToAssign.customerCount += Math.round(playerNetChange);
      }


      // Update segment penetration based on new customer counts
      playerSegmentCustomers = company.productLines
        .filter(p => playerProductIdsInSegment.includes(p.id))
        .reduce((sum, p) => sum + p.customerCount, 0);
      segment.currentPlayerPenetration = Math.min(1, playerSegmentCustomers / segment.totalSize);

      // Competitor segment penetration changes (simplified)
      for (const compId in segment.competitorPenetration) {
        segment.competitorPenetration[compId] = Math.max(0, Math.min(1, segment.competitorPenetration[compId] + generateRandomNumber(-0.005, 0.005)));
      }

      totalSegmentPenetration = segment.currentPlayerPenetration + Object.values(segment.competitorPenetration).reduce((a, b) => a + b, 0);
      // Normalize if over 100%
      if (totalSegmentPenetration > 1.0) {
        const excess = totalSegmentPenetration - 1.0;
        segment.currentPlayerPenetration = Math.max(0, segment.currentPlayerPenetration - excess / (Object.keys(segment.competitorPenetration).length + 1));
        for (const compId in segment.competitorPenetration) {
          segment.competitorPenetration[compId] = Math.max(0, segment.competitorPenetration[compId] - excess / (Object.keys(segment.competitorPenetration).length + 1));
        }
      }
      segment.currentPlayerPenetration = Math.max(0, segment.currentPlayerPenetration);
      for (const compId in segment.competitorPenetration) {
        segment.competitorPenetration[compId] = Math.max(0, segment.competitorPenetration[compId]);
      }
    });

    // Update overall company market share based on product performance and segment penetration
    let newOverallMarketShare = 0;
    company.productLines.forEach(product => {
      product.revenue = product.customerCount * product.basePrice;
      product.profit = product.customerCount * (product.basePrice - product.baseCost);
      if (product.customerCount > 0 && product.revenue > 0) {
        // Simulate payment for each product sale
        this.paymentProcessor.processPayment(
          product.id, // Conceptual product ID as sender
          company.identityId,
          product.revenue,
          'product_sale',
          this.gameState.currentYear
        );
      }

      const productImpactOnMarketShare = product.customerCount / (marketSegments.reduce((sum, s) => sum + s.totalSize, 0) / (company.productLines.length || 1)); // Very simplified
      newOverallMarketShare += productImpactOnMarketShare;
    });

    company.marketShare = newOverallMarketShare * 100; // Convert to percentage
    company.marketShare = Math.max(0, Math.min(100, company.marketShare)); // Clamp

    // Global sentiment impacts customer satisfaction and brand reputation
    company.customerSatisfaction = Math.min(100, company.customerSatisfaction + (globalSentiment - 50) / 10);
    company.brandReputation = Math.min(100, company.brandReputation + (globalSentiment - 50) / 15);
  }

  /**
   * Generates random market news and global events that can impact the simulation.
   * These events introduce an element of unpredictability and risk.
   * @returns A list of market news event descriptions.
   */
  private generateMarketNewsEvents(): string[] {
    const events: string[] = [];
    const eventProb = Math.random();

    if (eventProb < 0.1) {
      events.push(`Major Tech Breakthrough: A new quantum computing standard could disrupt current AI infrastructure within 3-5 years. This could make existing AI platforms obsolete, leading to a scramble for new R&D and potential acquisitions.`);
      this.gameState.globalMarketSentiment = Math.max(0, this.gameState.globalMarketSentiment - generateRandomNumber(10, 20));
      this.recordAuditLog('system_market_event', 'TechDisruptionWarning', { type: 'QuantumComputing' });
    } else if (eventProb < 0.2) {
      events.push(`Global Economic Boom: Analysts predict significant growth, boosting consumer spending power and enterprise investment across all sectors.`);
      this.gameState.globalMarketSentiment = Math.min(100, this.gameState.globalMarketSentiment + generateRandomNumber(10, 20));
      this.recordAuditLog('system_market_event', 'EconomicBoom', { impact: 'Positive' });
    } else if (eventProb < 0.3) {
      events.push(`New Regulatory Scrutiny: Governments are increasing oversight on data privacy and AI ethics in the FinTech sector, potentially increasing compliance costs and delaying new product launches.`);
      this.gameState.globalMarketSentiment = Math.max(0, this.gameState.globalMarketSentiment - generateRandomNumber(5, 10));
      this.recordAuditLog('system_market_event', 'RegulatoryScrutiny', { sector: 'FinTech/AI' });
    } else if (eventProb < 0.4) {
      events.push(`Talent Shortage Crisis: The demand for AI engineers and data scientists continues to outpace supply, driving up salaries and making talent acquisition a critical challenge.`);
      this.recordAuditLog('system_market_event', 'TalentShortage', { field: 'AI/Data Science' });
    } else if (eventProb < 0.5) {
      events.push(`Major Cybersecurity Incident: A prominent tech firm suffered a data breach, compromising millions of customer records. This incident raises industry-wide concerns about digital identity security and trust.`);
      this.gameState.playerCompany.brandReputation = Math.max(0, this.gameState.playerCompany.brandReputation - generateRandomNumber(3, 7)); // Player might get affected
      this.gameState.globalMarketSentiment = Math.max(0, this.gameState.globalMarketSentiment - generateRandomNumber(5, 10));
      this.recordAuditLog('system_market_event', 'CybersecurityBreach', { industryImpact: 'Negative' });
    } else if (eventProb < 0.6) {
      events.push(`Consumer Trust Rebound: Public confidence in digital finance solutions, especially those leveraging secure token rails and verifiable digital identities, is at an all-time high.`);
      this.gameState.globalMarketSentiment = Math.min(100, this.gameState.globalMarketSentiment + generateRandomNumber(5, 10));
      this.recordAuditLog('system_market_event', 'ConsumerTrustSurge', { focus: 'DigitalFinance' });
    } else if (eventProb < 0.7) {
      events.push(`Rise of New Market Segment: "Green Finance" initiatives are gaining traction, driven by investor demand for sustainable and ethically-aligned financial products, creating new revenue opportunities.`);
      this.recordAuditLog('system_market_event', 'NewMarketOpportunity', { segment: 'Green Finance' });
    } else {
      events.push(`Routine Market Fluctuations: General stability observed, with minor shifts in sector performance and no significant external shocks.`);
      this.recordAuditLog('system_market_event', 'MarketStability', { description: 'Minor fluctuations' });
    }

    return events;
  }

  /**
   * Applies direct state changes based on global events, if any.
   * This method serves as a hook for integrating more complex event-driven logic.
   * @param events - A list of market news events.
   */
  private applyGlobalEvents(events: string[]) {
    // This method is primarily for direct state changes due to events
    // Most event impacts are already integrated into the `generateMarketNewsEvents`
    // and `simulateMarketDynamics` where globalSentiment is used.
    // Additional direct impacts could be added here if needed, e.g.,
    // if a specific event forces a direct change to a company's budget or product status.
  }

  /**
   * Recalculates all financial statements for the company based on the current year's activities.
   * This provides a comprehensive financial overview and updates cash reserves.
   * @param company - The player's company state.
   */
  private calculateAllFinancials(company: WargameCompanyState) {
    let totalRevenue = 0;
    let totalCogs = 0;
    company.productLines.forEach(p => {
      totalRevenue += p.revenue;
      totalCogs += p.customerCount * p.baseCost;
    });

    const incomeStatement: FinancialStatement = {
      revenue: totalRevenue,
      cogs: totalCogs,
      grossProfit: totalRevenue - totalCogs,
      rdExpenses: company.rdBudget,
      marketingExpenses: company.marketingBudget,
      salesExpenses: company.salesBudget,
      operationsExpenses: company.operationsBudget,
      hrExpenses: company.hrBudget,
      customerServiceExpenses: company.customerServiceBudget,
      depreciation: generateRandomNumber(50000, 100000), // Simplified
      operatingProfit: 0,
      interestExpenses: generateRandomNumber(10000, 30000), // Simplified
      taxes: 0,
      netProfit: 0,
    };
    incomeStatement.operatingProfit = incomeStatement.grossProfit - incomeStatement.rdExpenses - incomeStatement.marketingExpenses - incomeStatement.salesExpenses - incomeStatement.operationsExpenses - incomeStatement.hrExpenses - incomeStatement.customerServiceExpenses - incomeStatement.depreciation;
    incomeStatement.taxes = incomeStatement.operatingProfit > 0 ? incomeStatement.operatingProfit * generateRandomNumber(0.2, 0.3) : 0;
    incomeStatement.netProfit = incomeStatement.operatingProfit - incomeStatement.interestExpenses - incomeStatement.taxes;

    // Update company cash based on net profit (simplified - ignoring full cash flow)
    company.cash += incomeStatement.netProfit - incomeStatement.capitalInvestmentBudget;
    company.cash = Math.max(0, company.cash); // Cannot go below zero

    // Update company revenue and profit directly
    company.revenue = incomeStatement.revenue;
    company.profit = incomeStatement.netProfit;

    // Simplified Balance Sheet Update
    const balanceSheet: BalanceSheet = {
      ...company.financials.balanceSheet, // Start with previous year's balance sheet
      cash: company.cash,
      accountsReceivable: totalRevenue * generateRandomNumber(0.05, 0.1), // 5-10% of revenue outstanding
      fixedAssets: company.financials.balanceSheet.fixedAssets + company.capitalInvestmentBudget - incomeStatement.depreciation,
    };
    balanceSheet.totalAssets = balanceSheet.cash + balanceSheet.accountsReceivable + balanceSheet.inventory + balanceSheet.fixedAssets;
    balanceSheet.accountsPayable = totalCogs * generateRandomNumber(0.02, 0.05); // 2-5% of COGS outstanding
    balanceSheet.shortTermDebt = company.financials.balanceSheet.shortTermDebt * generateRandomNumber(0.95, 1.05);
    balanceSheet.longTermDebt = company.financials.balanceSheet.longTermDebt * generateRandomNumber(0.98, 1.02);
    balanceSheet.totalLiabilities = balanceSheet.accountsPayable + balanceSheet.shortTermDebt + balanceSheet.longTermDebt;
    balanceSheet.equity = balanceSheet.totalAssets - balanceSheet.totalLiabilities;
    balanceSheet.totalLiabilitiesAndEquity = balanceSheet.totalLiabilities + balanceSheet.equity;


    // Simplified Cash Flow Statement
    const cashFlowStatement: CashFlowStatement = {
      beginningCash: company.financials.balanceSheet.cash,
      operatingActivities: incomeStatement.netProfit // Simplified: Net profit as a proxy
        + incomeStatement.depreciation // Add back non-cash expenses
        + (balanceSheet.accountsPayable - company.financials.balanceSheet.accountsPayable) // Change in AP
        - (balanceSheet.accountsReceivable - company.financials.balanceSheet.accountsReceivable), // Change in AR
      investingActivities: -company.capitalInvestmentBudget,
      financingActivities: generateRandomNumber(-50000, 50000), // Simple debt repayment/issuance
      netChangeInCash: 0,
      endingCash: 0,
    };
    cashFlowStatement.netChangeInCash = cashFlowStatement.operatingActivities + cashFlowStatement.investingActivities + cashFlowStatement.financingActivities;
    cashFlowStatement.endingCash = cashFlowStatement.beginningCash + cashFlowStatement.netChangeInCash;

    company.financials = { incomeStatement, balanceSheet, cashFlowStatement };
    this.recordAuditLog(company.identityId, 'FinancialsCalculated', { year: this.gameState.currentYear + 1, netProfit: company.profit, cash: company.cash });
  }

  /**
   * Generates a detailed year-end report summarizing the year's performance,
   * insights, and recommendations.
   * @param prevCompany - The company state from the previous year.
   * @param prevCompetitors - The competitor states from the previous year.
   * @param prevMarketSegments - The market segments from the previous year.
   * @param currentCompany - The company state at the end of the current year.
   * @param competitorActions - A summary of competitor activities.
   * @param marketNewsEvents - A list of market news and events.
   * @param directive - The player's strategic decisions for the year.
   * @returns A complete YearEndReport object.
   */
  private generateYearEndReport(
    prevCompany: WargameCompanyState,
    prevCompetitors: CompetitorProfile[],
    prevMarketSegments: MarketSegment[],
    currentCompany: WargameCompanyState,
    competitorActions: string[],
    marketNewsEvents: string[],
    directive: PlayerStrategicDirective
  ): YearEndReport {
    const marketShareGrowth = calculateGrowthRate(currentCompany.marketShare, prevCompany.marketShare);
    const revenueGrowth = calculateGrowthRate(currentCompany.revenue, prevCompany.revenue);
    const profitMargin = (currentCompany.revenue === 0) ? 0 : (currentCompany.profit / currentCompany.revenue) * 100;
    const previousCustomerCount = prevCompany.productLines.reduce((sum, p) => sum + p.customerCount, 0);
    const currentCustomerCount = currentCompany.productLines.reduce((sum, p) => sum + p.customerCount, 0);
    const newCustomersAcquired = currentCustomerCount - previousCustomerCount;
    const customerAcquisitionCost = newCustomersAcquired > 0 ? currentCompany.marketingBudget / newCustomersAcquired : 0;
    const customerRetentionRate = Math.min(100, currentCompany.customerSatisfaction + generateRandomNumber(50, 80)); // Simplified
    const innovationIndex = currentCompany.productLines.reduce((sum, p) => sum + p.innovationLevel, 0) / (currentCompany.productLines.length || 1);
    const employeeMorale = currentCompany.customerSatisfaction; // Proxy for now
    const transactionEfficiencyScore = this.paymentProcessor.calculateEfficiencyScore();

    const keyInsights: string[] = [];
    const recommendations: string[] = [];

    if (marketShareGrowth > 5) keyInsights.push('Significant market share growth achieved, outperforming competitors and expanding market presence.');
    else if (marketShareGrowth < -2) keyInsights.push('Market share declined, indicating strong competitor pressure or ineffective strategy. Re-evaluation is critical.');

    if (profitMargin > 10) keyInsights.push('Healthy profit margins reflect efficient operations and strong pricing power, driving robust financial performance.');
    else if (profitMargin < 2) keyInsights.push('Low profit margins suggest cost issues or intense price competition, requiring urgent operational review.');

    if (innovationIndex > 70) keyInsights.push('Strong innovation pipeline driving future growth potential and maintaining a competitive edge in rapidly evolving markets.');
    else if (innovationIndex < 50) keyInsights.push('Innovation lagging, risking obsolescence in a dynamic market. Immediate investment in R&D and new features is advised.');

    if (currentCompany.cash < 0) keyInsights.push('Critical: Company is out of cash and requires immediate financing. Operations may be severely impacted.');
    if (currentCompany.cash < 1000000 && prevCompany.cash >= 1000000) recommendations.push('Consider securing additional funding or divesting non-core assets to improve liquidity and avoid financial distress.');
    if (transactionEfficiencyScore < 70) recommendations.push('Review payment rail usage: transaction efficiency is low, suggesting higher costs or slower settlements. Optimize routing policies.');

    // Recommendations based on insights
    if (marketShareGrowth < 0 && directive.overallFocus !== 'market_expansion') {
      recommendations.push('Re-evaluate strategic focus: Market expansion initiatives may be necessary to counter competitor gains and reclaim market share.');
    }
    if (currentCompany.customerSatisfaction < 60 && directive.hrInitiatives !== 'training' && directive.overallFocus !== 'customer_retention') {
      recommendations.push('Invest in customer service training and product quality to boost satisfaction and reduce churn, aligning with customer retention goals.');
    }
    if (currentCompany.rdBudget < 100000 && directive.overallFocus === 'innovation') {
      recommendations.push('Increase R&D allocation to align with innovation focus and remain competitive, ensuring a robust product pipeline.');
    }
    if (directive.riskMitigation.length === 0 && this.gameState.globalMarketSentiment < 40) {
      recommendations.push('Strengthen risk mitigation strategies; global market sentiment is low, indicating potential volatility and increased external risks.');
    }


    this.recordAuditLog('system_report_generator', 'YearEndReportGenerated', { year: this.gameState.currentYear, summaryKpis: { marketShareGrowth, profitMargin } });

    return {
      year: this.gameState.currentYear,
      companyState: JSON.parse(JSON.stringify(currentCompany)),
      competitorActions,
      marketNewsEvents,
      playerDecisionsSummary: directive,
      kpis: {
        marketShareGrowth,
        revenueGrowth,
        profitMargin,
        customerAcquisitionCost,
        customerRetentionRate,
        innovationIndex,
        employeeMorale,
        transactionEfficiencyScore,
      },
      keyInsights,
      recommendations,
    };
  }

  /**
   * Provides access to the current game state.
   * @returns The current GameState object.
   */
  public getGameState(): GameState {
    return this.gameState;
  }
}

// --- REACT COMPONENTS FOR UI ---

/**
 * React component for inputting the player's strategic decisions for the upcoming year.
 * Business Value: This interactive form is the primary control panel for the "agentic AI"
 * (player as agent) in the simulation. It centralizes all strategic levers—resource allocation,
 * product development, marketing, pricing, HR, and risk management—into a single, intuitive
 * interface. By enabling rapid iteration on strategic directives, it streamlines the process
 * of planning and decision-making, allowing leaders to quickly model multi-million dollar
 * portfolio shifts and market interventions. Its clear feedback on resource distribution
 * ensures optimal utilization of capital, directly contributing to financial prudence
 * and maximized ROI from strategic initiatives.
 */
export const StrategyInputForm: React.FC<{
  currentStrategy: PlayerStrategicDirective | null;
  onStrategyChange: (strategy: PlayerStrategicDirective) => void;
  companyCash: number;
  productLines: ProductLine[];
  marketSegments: MarketSegment[];
  competitors: CompetitorProfile[];
}> = ({ currentStrategy, onStrategyChange, companyCash, productLines, marketSegments, competitors }) => {
  const [overallFocus, setOverallFocus] = useState<PlayerStrategicDirective['overallFocus']>(currentStrategy?.overallFocus || 'innovation');
  const [rdAllocation, setRdAllocation] = useState(currentStrategy?.resourceAllocation.rd || 25);
  const [marketingAllocation, setMarketingAllocation] = useState(currentStrategy?.resourceAllocation.marketing || 25);
  const [salesAllocation, setSalesAllocation] = useState(currentStrategy?.resourceAllocation.sales || 15);
  const [operationsAllocation, setOperationsAllocation] = useState(currentStrategy?.resourceAllocation.operations || 10);
  const [hrAllocation, setHrAllocation] = useState(currentStrategy?.resourceAllocation.hr || 10);
  const [customerServiceAllocation, setCustomerServiceAllocation] = useState(currentStrategy?.resourceAllocation.customerService || 5);
  const [capitalInvestmentAllocation, setCapitalInvestmentAllocation] = useState(currentStrategy?.resourceAllocation.capitalInvestment || 5);

  const [newProductDevelopment, setNewProductDevelopment] = useState<PlayerStrategicDirective['newProductDevelopment']>(currentStrategy?.newProductDevelopment || []);
  const [marketingCampaigns, setMarketingCampaigns] = useState<PlayerStrategicDirective['marketingCampaigns']>(currentStrategy?.marketingCampaigns || []);
  const [pricingAdjustments, setPricingAdjustments] = useState<PlayerStrategicDirective['pricingAdjustments']>(currentStrategy?.pricingAdjustments || []);
  const [hrInitiatives, setHrInitiatives] = useState<PlayerStrategicDirective['hrInitiatives']>(currentStrategy?.hrInitiatives || 'none');
  const [riskMitigation, setRiskMitigation] = useState<string[]>(currentStrategy?.riskMitigation || []);
  const [targetAcquisitions, setTargetAcquisitions] = useState<string[]>(currentStrategy?.targetAcquisitions || []);
  const [divestProductLines, setDivestProductLines] = useState<string[]>(currentStrategy?.divestProductLines || []);

  const totalAllocation = useMemo(() => {
    return rdAllocation + marketingAllocation + salesAllocation + operationsAllocation + hrAllocation + customerServiceAllocation + capitalInvestmentAllocation;
  }, [rdAllocation, marketingAllocation, salesAllocation, operationsAllocation, hrAllocation, customerServiceAllocation, capitalInvestmentAllocation]);

  useEffect(() => {
    // If allocations exceed 100%, adjust proportionally or flag an error
    if (totalAllocation > 100) {
      // Simple proportional scaling back to 100
      const scaleFactor = 100 / totalAllocation;
      setRdAllocation(prev => Math.round(prev * scaleFactor));
      setMarketingAllocation(prev => Math.round(prev * scaleFactor));
      setSalesAllocation(prev => Math.round(prev * scaleFactor));
      setOperationsAllocation(prev => Math.round(prev * scaleFactor));
      setHrAllocation(prev => Math.round(prev * scaleFactor));
      setCustomerServiceAllocation(prev => Math.round(prev * scaleFactor));
      setCapitalInvestmentAllocation(prev => Math.round(prev * scaleFactor));
    }
  }, [totalAllocation]); // Only re-run if totalAllocation changes

  const handleAllocationChange = useCallback((setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
    setter(Math.max(0, Math.min(100, value)));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    if (totalAllocation !== 100) {
      alert(`Resource allocations must sum to 100%. Current: ${totalAllocation}%`);
      return;
    }

    const newDirective: PlayerStrategicDirective = {
      overallFocus,
      resourceAllocation: {
        rd: rdAllocation,
        marketing: marketingAllocation,
        sales: salesAllocation,
        operations: operationsAllocation,
        hr: hrAllocation,
        customerService: customerServiceAllocation,
        capitalInvestment: capitalInvestmentAllocation,
      },
      newProductDevelopment,
      marketingCampaigns,
      pricingAdjustments,
      hrInitiatives,
      riskMitigation,
      targetAcquisitions,
      divestProductLines,
    };
    onStrategyChange(newDirective);
  }, [
    overallFocus, rdAllocation, marketingAllocation, salesAllocation, operationsAllocation, hrAllocation, customerServiceAllocation, capitalInvestmentAllocation,
    newProductDevelopment, marketingCampaigns, pricingAdjustments, hrInitiatives, riskMitigation, targetAcquisitions, divestProductLines,
    totalAllocation, onStrategyChange
  ]);

  // Helper for adding/updating single new product development entry for simplicity
  const handleNewProductChange = useCallback((field: string, value: any) => {
    setNewProductDevelopment(prev => {
      const existing = prev[0] || { name: '', type: 'FinTech_App', targetMarketSegmentIds: [], featuresToDevelop: [] };
      return [{ ...existing, [field]: value }];
    });
  }, []);

  // Helper for adding/updating single marketing campaign entry for simplicity
  const handleMarketingCampaignChange = useCallback((field: string, value: any) => {
    setMarketingCampaigns(prev => {
      const existing = prev[0] || { name: '', targetSegmentIds: [], budget: 0, message: '' };
      return [{ ...existing, [field]: value }];
    });
  }, []);

  // Helper for adding/updating single pricing adjustment entry for simplicity
  const handlePricingAdjustmentChange = useCallback((field: string, value: any) => {
    setPricingAdjustments(prev => {
      const existing = prev[0] || { productId: '', newPrice: 0 };
      return [{ ...existing, [field]: value }];
    });
  }, []);

  // Basic styling for demo
  const formStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '20px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '20px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '5px',
    backgroundColor: '#fff',
  };

  const inputStyle: React.CSSProperties = {
    width: 'calc(100% - 10px)',
    padding: '8px',
    margin: '5px 0',
    borderRadius: '4px',
    border: '1px solid #ddd',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 'bold',
    display: 'block',
    marginBottom: '5px',
    marginTop: '10px',
  };

  const sliderContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const sliderLabelStyle: React.CSSProperties = {
    flex: '2',
    marginRight: '10px',
  };

  const sliderInputStyle: React.CSSProperties = {
    flex: '3',
    marginRight: '10px',
  };

  const sliderValueStyle: React.CSSProperties = {
    flex: '1',
    textAlign: 'right',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
    width: '100%',
  };

  const errorStyle: React.CSSProperties = {
    color: 'red',
    marginTop: '10px',
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Player Strategic Directive</h2>
      <p>Current Cash: {formatCurrency(companyCash)}</p>

      <div style={sectionStyle}>
        <label style={labelStyle}>Overall Strategic Focus:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {['innovation', 'cost_reduction', 'market_expansion', 'customer_retention', 'risk_management'].map(focus => (
            <label key={focus} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="overallFocus"
                value={focus}
                checked={overallFocus === focus}
                onChange={(e) => setOverallFocus(e.target.value as PlayerStrategicDirective['overallFocus'])}
                style={{ marginRight: '5px' }}
              />
              {focus.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </label>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>Resource Allocation (Total: {totalAllocation}%)</h3>
        {totalAllocation !== 100 && (
          <p style={errorStyle}>Total allocation must be 100%.</p>
        )}
        {[
          { label: 'R&D', value: rdAllocation, setter: setRdAllocation },
          { label: 'Marketing', value: marketingAllocation, setter: setMarketingAllocation },
          { label: 'Sales', value: salesAllocation, setter: setSalesAllocation },
          { label: 'Operations', value: operationsAllocation, setter: setOperationsAllocation },
          { label: 'HR & Talent', value: hrAllocation, setter: setHrAllocation },
          { label: 'Customer Service', value: customerServiceAllocation, setter: setCustomerServiceAllocation },
          { label: 'Capital Investment', value: capitalInvestmentAllocation, setter: setCapitalInvestmentAllocation },
        ].map(({ label, value, setter }) => (
          <div key={label} style={sliderContainerStyle}>
            <label style={sliderLabelStyle}>{label}:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleAllocationChange(setter, parseInt(e.target.value))}
              style={sliderInputStyle}
            />
            <input
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleAllocationChange(setter, parseInt(e.target.value))}
              style={{ ...sliderValueStyle, width: '50px' }}
            />%
          </div>
        ))}
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>New Product Development (Simplified: one entry at a time)</h3>
        <label style={labelStyle}>Product Name:</label>
        <input
          type="text"
          value={newProductDevelopment[0]?.name || ''}
          onChange={(e) => handleNewProductChange('name', e.target.value)}
          placeholder="e.g., Quantum FinTech AI"
          style={inputStyle}
        />
        <label style={labelStyle}>Product Type:</label>
        <select
          value={newProductDevelopment[0]?.type || 'FinTech_App'}
          onChange={(e) => handleNewProductChange('type', e.target.value as ProductLine['type'])}
          style={inputStyle}
        >
          <option value="AI_Platform">AI Platform</option>
          <option value="FinTech_App">FinTech App</option>
          <option value="Data_Analytics">Data Analytics</option>
          <option value="Consulting_Service">Consulting Service</option>
        </select>
        <label style={labelStyle}>Target Market Segments:</label>
        <select
          multiple
          value={newProductDevelopment[0]?.targetMarketSegmentIds || []}
          onChange={(e) => handleNewProductChange('targetMarketSegmentIds', Array.from(e.target.selectedOptions, option => option.value))}
          style={{ ...inputStyle, height: '80px' }}
        >
          {marketSegments.map(segment => (
            <option key={segment.id} value={segment.id}>{segment.name}</option>
          ))}
        </select>
        <label style={labelStyle}>Features to Develop (e.g., predictive_ai, real_time_analytics):</label>
        <input
          type="text"
          value={newProductDevelopment[0]?.featuresToDevelop.join(', ') || ''}
          onChange={(e) => handleNewProductChange('featuresToDevelop', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
          placeholder="Comma separated feature IDs"
          style={inputStyle}
        />
        {/* Placeholder for adding more products; for simplicity, only one is managed in this demo */}
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>Marketing Campaigns (Simplified: one entry at a time)</h3>
        <label style={labelStyle}>Campaign Name:</label>
        <input
          type="text"
          value={marketingCampaigns[0]?.name || ''}
          onChange={(e) => handleMarketingCampaignChange('name', e.target.value)}
          placeholder="e.g., New Customer Onboarding Drive"
          style={inputStyle}
        />
        <label style={labelStyle}>Target Market Segments:</label>
        <select
          multiple
          value={marketingCampaigns[0]?.targetSegmentIds || []}
          onChange={(e) => handleMarketingCampaignChange('targetSegmentIds', Array.from(e.target.selectedOptions, option => option.value))}
          style={{ ...inputStyle, height: '80px' }}
        >
          {marketSegments.map(segment => (
            <option key={segment.id} value={segment.id}>{segment.name}</option>
          ))}
        </select>
        <label style={labelStyle}>Budget ({formatCurrency(companyCash)} available):</label>
        <input
          type="number"
          value={marketingCampaigns[0]?.budget || 0}
          onChange={(e) => handleMarketingCampaignChange('budget', parseInt(e.target.value) || 0)}
          min="0"
          max={companyCash}
          style={inputStyle}
        />
        <label style={labelStyle}>Message:</label>
        <textarea
          value={marketingCampaigns[0]?.message || ''}
          onChange={(e) => handleMarketingCampaignChange('message', e.target.value)}
          placeholder="e.g., 'Revolutionizing your finance with AI!'"
          style={{ ...inputStyle, height: '60px' }}
        />
        {/* Placeholder for adding more campaigns */}
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginTop: 0 }}>Pricing Adjustments (Simplified: one entry at a time)</h3>
        <label style={labelStyle}>Product to Adjust:</label>
        <select
          value={pricingAdjustments[0]?.productId || ''}
          onChange={(e) => handlePricingAdjustmentChange('productId', e.target.value)}
          style={inputStyle}
        >
          <option value="">-- Select Product --</option>
          {productLines.map(product => (
            <option key={product.id} value={product.id}>{product.name} ({formatCurrency(product.basePrice)})</option>
          ))}
        </select>
        <label style={labelStyle}>New Price:</label>
        <input
          type="number"
          value={pricingAdjustments[0]?.newPrice || 0}
          onChange={(e) => handlePricingAdjustmentChange('newPrice', parseFloat(e.target.value) || 0)}
          min="0"
          step="0.01"
          style={inputStyle}
        />
        {/* Placeholder for adding more pricing adjustments */}
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>HR Initiatives:</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {['training', 'hiring', 'downsizing', 'none'].map(initiative => (
            <label key={initiative} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="radio"
                name="hrInitiatives"
                value={initiative}
                checked={hrInitiatives === initiative}
                onChange={(e) => setHrInitiatives(e.target.value as PlayerStrategicDirective['hrInitiatives'])}
                style={{ marginRight: '5px' }}
              />
              {initiative.charAt(0).toUpperCase() + initiative.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Risk Mitigation Strategies (select all that apply):</label>
        <select
          multiple
          value={riskMitigation}
          onChange={(e) => setRiskMitigation(Array.from(e.target.selectedOptions, option => option.value))}
          style={{ ...inputStyle, height: '100px' }}
        >
          <option value="cybersecurity_investment">Cybersecurity Investment</option>
          <option value="regulatory_compliance">Enhanced Regulatory Compliance</option>
          <option value="diversity_initiatives">Diversity & Inclusion Initiatives</option>
          <option value="supply_chain_resilience">Supply Chain Resilience</option>
          <option value="geopolitical_monitoring">Geopolitical Monitoring</option>
          <option value="market_diversification">Market Diversification</option>
        </select>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Target Acquisitions (select competitor IDs):</label>
        <select
          multiple
          value={targetAcquisitions}
          onChange={(e) => setTargetAcquisitions(Array.from(e.target.selectedOptions, option => option.value))}
          style={{ ...inputStyle, height: '80px' }}
        >
          {competitors.map(comp => (
            <option key={comp.id} value={comp.id}>{comp.name}</option>
          ))}
        </select>
        <p style={{ fontSize: '0.8em', color: '#666' }}>Note: Acquisitions are very costly and will significantly deplete cash.</p>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Divest Product Lines (select product IDs to sell off):</label>
        <select
          multiple
          value={divestProductLines}
          onChange={(e) => setDivestProductLines(Array.from(e.target.selectedOptions, option => option.value))}
          style={{ ...inputStyle, height: '80px' }}
        >
          {productLines.map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <p style={{ fontSize: '0.8em', color: '#666' }}>Note: Divestment generates cash but may reduce market presence.</p>
      </div>

      <button type="submit" style={buttonStyle}>Submit Strategic Directive</button>
    </form>
  );
};

/**
 * React component to display the current state of the wargame.
 * Business Value: This dashboard provides a consolidated, real-time view of the simulation's
 * most critical metrics and state variables. It's an executive-level summary that allows
 * decision-makers to quickly grasp company performance, market conditions, and competitive
 * landscape. By visualizing complex data points—financials, market share, product health,
 * and global sentiment—it facilitates rapid situational awareness and supports agile
 * strategic adjustments. This visual feedback loop is invaluable for learning, enabling
 * teams to understand the direct consequences of their 'agentic' actions and refine their
 * strategic thinking without the lag and cost of real-world experimentation.
 */
export const WargameDashboard: React.FC<{ gameState: GameState; onAdvanceYear: (directive: PlayerStrategicDirective) => Promise<YearEndReport | void>; onResetGame: () => void }> = ({ gameState, onAdvanceYear, onResetGame }) => {
  const [playerDirective, setPlayerDirective] = useState<PlayerStrategicDirective | null>(null);
  const [report, setReport] = useState<YearEndReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdvanceYear = useCallback(async () => {
    if (!playerDirective) {
      alert('Please set your strategic directive before advancing the year.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const yearEndReport = await onAdvanceYear(playerDirective);
      setReport(yearEndReport);
      setPlayerDirective(null); // Reset directive after year advance
    } catch (e: any) {
      setError(e.message || 'An error occurred during simulation.');
    } finally {
      setLoading(false);
    }
  }, [playerDirective, onAdvanceYear]);

  const currentCompany = gameState.playerCompany;
  const globalSentimentEmoji = getMarketSentimentEmoji(gameState.globalMarketSentiment);

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  };

  const kpiValueStyle: React.CSSProperties = {
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#333',
  };

  const kpiLabelStyle: React.CSSProperties = {
    fontSize: '0.9em',
    color: '#666',
  };

  const kpiGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  };

  const productLineCardStyle: React.CSSProperties = {
    border: '1px solid #f0f0f0',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fdfdfd',
  };

  const competitorCardStyle: React.CSSProperties = {
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#f8f8f8',
  };

  const marketSegmentCardStyle: React.CSSProperties = {
    border: '1px solid #e9e9e9',
    borderRadius: '6px',
    padding: '10px',
    marginBottom: '10px',
    backgroundColor: '#fafafa',
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '20px auto', padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '10px' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Emergent Strategy Wargamer View</h1>

      <div style={headerStyle}>
        <h2 style={{ margin: 0 }}>Year: {gameState.currentYear}</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onResetGame} style={{ padding: '10px 15px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f0f0f0', cursor: 'pointer' }}>Reset Game</button>
          <button
            onClick={handleAdvanceYear}
            disabled={loading}
            style={{ padding: '10px 15px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: 'white', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? 'Advancing Year...' : 'Advance Year'}
          </button>
        </div>
      </div>

      {error && <p style={errorStyle}>Error: {error}</p>}

      <StrategyInputForm
        currentStrategy={playerDirective}
        onStrategyChange={setPlayerDirective}
        companyCash={currentCompany.cash}
        productLines={currentCompany.productLines}
        marketSegments={gameState.marketSegments}
        competitors={gameState.competitors}
      />

      {report && (
        <div style={{ ...cardStyle, borderLeft: '5px solid #007bff' }}>
          <h3>Year {report.year} End Report</h3>
          <p><strong>Key Insights:</strong></p>
          <ul>
            {report.keyInsights.map((insight, i) => <li key={i}>{insight}</li>)}
          </ul>
          <p><strong>Recommendations:</strong></p>
          <ul>
            {report.recommendations.map((rec, i) => <li key={i}>{rec}</li>)}
          </ul>
          <div style={kpiGridStyle}>
            <div>
              <div style={kpiValueStyle}>{report.kpis.marketShareGrowth.toFixed(2)}%</div>
              <div style={kpiLabelStyle}>Market Share Growth</div>
            </div>
            <div>
              <div style={kpiValueStyle}>{report.kpis.revenueGrowth.toFixed(2)}%</div>
              <div style={kpiLabelStyle}>Revenue Growth</div>
            </div>
            <div>
              <div style={kpiValueStyle}>{report.kpis.profitMargin.toFixed(2)}%</div>
              <div style={kpiLabelStyle}>Profit Margin</div>
            </div>
            <div>
              <div style={kpiValueStyle}>{formatCurrency(report.kpis.customerAcquisitionCost)}</div>
              <div style={kpiLabelStyle}>CAC (per new customer)</div>
            </div>
            <div>
              <div style={kpiValueStyle}>{report.kpis.customerRetentionRate.toFixed(2)}%</div>
              <div style={kpiLabelStyle}>Customer Retention Rate</div>
            </div>
            <div>
              <div style={kpiValueStyle}>{report.kpis.innovationIndex.toFixed(2)}</div>
              <div style={kpiLabelStyle}>Innovation Index</div>
            </div>
            <div>
              <div style={kpiValueStyle}>{report.kpis.employeeMorale.toFixed(2)}</div>
              <div style={kpiLabelStyle}>Employee Morale</div>
            </div>
            {report.kpis.transactionEfficiencyScore !== undefined && (
              <div>
                <div style={kpiValueStyle}>{report.kpis.transactionEfficiencyScore.toFixed(2)}</div>
                <div style={kpiLabelStyle}>Transaction Efficiency Score</div>
              </div>
            )}
          </div>
          <p><strong>Competitor Actions:</strong></p>
          <ul>
            {report.competitorActions.map((action, i) => <li key={i}>{action}</li>)}
          </ul>
          <p><strong>Market News:</strong></p>
          <ul>
            {report.marketNewsEvents.map((news, i) => <li key={i}>{news}</li>)}
          </ul>
        </div>
      )}

      <div style={cardStyle}>
        <h3>Your Company: {currentCompany.name}</h3>
        <div style={kpiGridStyle}>
          <div>
            <div style={kpiValueStyle}>{formatCurrency(currentCompany.cash)}</div>
            <div style={kpiLabelStyle}>Cash</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{currentCompany.marketShare.toFixed(2)}%</div>
            <div style={kpiLabelStyle}>Total Market Share</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{formatCurrency(currentCompany.revenue)}</div>
            <div style={kpiLabelStyle}>Revenue</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{formatCurrency(currentCompany.profit)}</div>
            <div style={kpiLabelStyle}>Profit</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{currentCompany.employeeCount}</div>
            <div style={kpiLabelStyle}>Employees</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{currentCompany.brandReputation.toFixed(0)}</div>
            <div style={kpiLabelStyle}>Brand Reputation</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{currentCompany.customerSatisfaction.toFixed(0)}</div>
            <div style={kpiLabelStyle}>Customer Satisfaction</div>
          </div>
          <div>
            <div style={kpiValueStyle}>{currentCompany.strategicFocus.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</div>
            <div style={kpiLabelStyle}>Strategic Focus</div>
          </div>
        </div>

        <h4>Your Products:</h4>
        {currentCompany.productLines.length === 0 && <p>No products launched yet.</p>}
        {currentCompany.productLines.map(product => (
          <div key={product.id} style={productLineCardStyle}>
            <strong>{product.name}</strong> ({product.type})
            <ul>
              <li>Customers: {product.customerCount.toLocaleString()}</li>
              <li>Market Share (Product): {product.marketShare.toFixed(2)}%</li>
              <li>Revenue: {formatCurrency(product.revenue)}</li>
              <li>Profit: {formatCurrency(product.profit)}</li>
              <li>Innovation: {product.innovationLevel.toFixed(0)}</li>
              <li>Quality: {product.qualityScore.toFixed(0)}</li>
              <li>Lifecycle: {product.lifecycleStage}</li>
              <li>Target Segments: {product.targetMarketSegmentIds.map(id => gameState.marketSegments.find(s => s.id === id)?.name || id).join(', ')}</li>
            </ul>
            <h5>Features:</h5>
            <ul>
              {product.features.length === 0 && <li>No features</li>}
              {product.features.map(feature => (
                <li key={feature.id}>
                  {feature.name} (Status: {feature.status}, Innovation: {feature.innovationScore})
                </li>
              ))}
            </ul>
          </div>
        ))}

        <h4>Financials:</h4>
        <details>
          <summary>Income Statement</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            Revenue: {formatCurrency(currentCompany.financials.incomeStatement.revenue)}
            <br />COGS: {formatCurrency(currentCompany.financials.incomeStatement.cogs)}
            <br />Gross Profit: {formatCurrency(currentCompany.financials.incomeStatement.grossProfit)}
            <br />- R&D Expenses: {formatCurrency(currentCompany.financials.incomeStatement.rdExpenses)}
            <br />- Marketing Expenses: {formatCurrency(currentCompany.financials.incomeStatement.marketingExpenses)}
            <br />- Sales Expenses: {formatCurrency(currentCompany.financials.incomeStatement.salesExpenses)}
            <br />- Operations Expenses: {formatCurrency(currentCompany.financials.incomeStatement.operationsExpenses)}
            <br />- HR Expenses: {formatCurrency(currentCompany.financials.incomeStatement.hrExpenses)}
            <br />- Customer Service Expenses: {formatCurrency(currentCompany.financials.incomeStatement.customerServiceExpenses)}
            <br />- Depreciation: {formatCurrency(currentCompany.financials.incomeStatement.depreciation)}
            <br />Operating Profit: {formatCurrency(currentCompany.financials.incomeStatement.operatingProfit)}
            <br />- Interest Expenses: {formatCurrency(currentCompany.financials.incomeStatement.interestExpenses)}
            <br />- Taxes: {formatCurrency(currentCompany.financials.incomeStatement.taxes)}
            <br /><strong>Net Profit: {formatCurrency(currentCompany.financials.incomeStatement.netProfit)}</strong>
          </pre>
        </details>
        <details>
          <summary>Balance Sheet</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            Cash: {formatCurrency(currentCompany.financials.balanceSheet.cash)}
            <br />Accounts Receivable: {formatCurrency(currentCompany.financials.balanceSheet.accountsReceivable)}
            <br />Fixed Assets: {formatCurrency(currentCompany.financials.balanceSheet.fixedAssets)}
            <br />Total Assets: {formatCurrency(currentCompany.financials.balanceSheet.totalAssets)}
            <br />Accounts Payable: {formatCurrency(currentCompany.financials.balanceSheet.accountsPayable)}
            <br />Short Term Debt: {formatCurrency(currentCompany.financials.balanceSheet.shortTermDebt)}
            <br />Long Term Debt: {formatCurrency(currentCompany.financials.balanceSheet.longTermDebt)}
            <br />Total Liabilities: {formatCurrency(currentCompany.financials.balanceSheet.totalLiabilities)}
            <br />Equity: {formatCurrency(currentCompany.financials.balanceSheet.equity)}
            <br />Total Liabilities & Equity: {formatCurrency(currentCompany.financials.balanceSheet.totalLiabilitiesAndEquity)}
          </pre>
        </details>
        <details>
          <summary>Cash Flow Statement</summary>
          <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
            Beginning Cash: {formatCurrency(currentCompany.financials.cashFlowStatement.beginningCash)}
            <br />Operating Activities: {formatCurrency(currentCompany.financials.cashFlowStatement.operatingActivities)}
            <br />Investing Activities: {formatCurrency(currentCompany.financials.cashFlowStatement.investingActivities)}
            <br />Financing Activities: {formatCurrency(currentCompany.financials.cashFlowStatement.financingActivities)}
            <br />Net Change In Cash: {formatCurrency(currentCompany.financials.cashFlowStatement.netChangeInCash)}
            <br />Ending Cash: {formatCurrency(currentCompany.financials.cashFlowStatement.endingCash)}
          </pre>
        </details>
      </div>

      <div style={cardStyle}>
        <h3>Competitors:</h3>
        {gameState.competitors.map(comp => (
          <div key={comp.id} style={competitorCardStyle}>
            <strong>{comp.name}</strong> ({comp.description})
            <ul>
              <li>Market Share: {comp.marketShare.toFixed(2)}%</li>
              <li>Strategy: {comp.strategy.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</li>
              <li>Innovation Focus: {comp.innovationFocus}</li>
              <li>Marketing Aggression: {comp.marketingAggression}</li>
              <li>Recent Actions: {comp.recentActions.length > 0 ? comp.recentActions.join('; ') : 'None'}</li>
            </ul>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h3>Market Segments:</h3>
        {gameState.marketSegments.map(segment => (
          <div key={segment.id} style={marketSegmentCardStyle}>
            <strong>{segment.name}</strong>
            <ul>
              <li>Total Size: {segment.totalSize.toLocaleString()}</li>
              <li>Growth Rate: {(segment.growthRate[0] * 100).toFixed(1)}% - {(segment.growthRate[1] * 100).toFixed(1)}%</li>
              <li>Your Penetration: {(segment.currentPlayerPenetration * 100).toFixed(2)}%</li>
              <li>Competitor Penetration:
                <ul>
                  {Object.entries(segment.competitorPenetration).map(([id, penetration]) => (
                    <li key={id}>{(gameState.competitors.find(c => c.id === id)?.name || id)}: {(penetration * 100).toFixed(2)}%</li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <h3>Global Market Sentiment: {gameState.globalMarketSentiment.toFixed(0)} {globalSentimentEmoji}</h3>
        <p style={{ fontSize: '0.9em', color: '#666' }}>Influences customer behavior and overall market receptivity.</p>
      </div>

      <details style={cardStyle}>
        <summary><h3>Audit Log ({gameState.auditLog.length} entries)</h3></summary>
        <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '5px', backgroundColor: '#fdfdfd' }}>
          {gameState.auditLog.slice().reverse().map(entry => (
            <div key={entry.id} style={{ borderBottom: '1px dashed #eee', padding: '8px 0', fontSize: '0.85em' }}>
              <strong>[{new Date(entry.timestamp).toLocaleTimeString()}] {entry.agentName} ({entry.agentId}):</strong> {entry.action} - <pre style={{ display: 'inline' }}>{JSON.stringify(entry.details).substring(0, 100)}...</pre>
              <br /><span style={{ color: '#999' }}>Signature: {entry.signature.substring(0, 15)}...</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

/**
 * Main application component to initialize and manage the Wargamer simulation.
 * This component acts as the orchestrator for the entire simulation, holding the
 * central game state and providing the interface to interact with the simulation engine.
 */
const EmergentStrategyWargamer: React.FC = () => {
  const [simulationEngine, setSimulationEngine] = useState<SimulationEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize the game state and simulation engine
  useEffect(() => {
    const initializeGame = () => {
      console.log("Initializing game state...");
      const initialGameState = getInitialGameState();
      const engine = new SimulationEngine(initialGameState);
      setSimulationEngine(engine);
      setGameState(engine.getGameState());
      setLoading(false);
      console.log("Game initialized.", initialGameState);
    };
    initializeGame();
  }, []); // Run once on component mount

  const handleAdvanceYear = useCallback(async (directive: PlayerStrategicDirective): Promise<YearEndReport | void> => {
    if (!simulationEngine) return;
    try {
      setSimulationEngine(prevEngine => {
        if (prevEngine) {
          prevEngine.setPlayerDirective(directive);
        }
        return prevEngine;
      });
      const report = await simulationEngine.advanceYear();
      setGameState(simulationEngine.getGameState()); // Update UI with new state
      return report;
    } catch (error) {
      console.error("Error advancing year:", error);
      throw error;
    }
  }, [simulationEngine]);

  const handleResetGame = useCallback(() => {
    setLoading(true);
    const initialGameState = getInitialGameState();
    const newEngine = new SimulationEngine(initialGameState);
    setSimulationEngine(newEngine);
    setGameState(newEngine.getGameState());
    setLoading(false);
    console.log("Game reset to initial state.");
  }, []);

  if (loading || !gameState || !simulationEngine) {
    return <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', padding: '50px' }}>Loading Emergent Strategy Wargamer...</div>;
  }

  return (
    <WargameDashboard
      gameState={gameState}
      onAdvanceYear={handleAdvanceYear}
      onResetGame={handleResetGame}
    />
  );
};

export default EmergentStrategyWargamer;
```