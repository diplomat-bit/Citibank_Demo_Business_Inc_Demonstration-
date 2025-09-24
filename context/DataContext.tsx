import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Add missing corporate finance types to the context interface to resolve errors in CorporateCommandView.
import type { Transaction, Asset, BudgetCategory, GamificationState, IllusionType, LinkedAccount, QuantumWeaverState, AIPlan, AIQuestion, Subscription, CreditScore, UpcomingBill, SavingsGoal, MarketMover, MarketplaceProduct, FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, AIInsight, CorporateCard, CorporateTransaction, RewardPoints, Notification, NFTAsset, RewardItem, APIStatus, CreditFactor, CorporateCardControls, PaymentOrder, Invoice, ComplianceCase, FinancialAnomaly, AnomalyStatus, Counterparty, PaymentOrderStatus } from '../types';
import { View, WeaverStage } from '../types';
// FIX: Add state for the new corporate finance data to make it available through the context.
import { MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_IMPACT_INVESTMENTS, MOCK_BUDGETS, MOCK_SUBSCRIPTIONS, MOCK_CREDIT_SCORE, MOCK_UPCOMING_BILLS, MOCK_SAVINGS_GOALS, MOCK_MARKET_MOVERS, MOCK_FINANCIAL_GOALS, MOCK_CRYPTO_ASSETS, MOCK_PAYMENT_OPERATIONS, MOCK_CORPORATE_CARDS, MOCK_CORPORATE_TRANSACTIONS, MOCK_REWARD_POINTS, MOCK_NOTIFICATIONS, MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_CREDIT_FACTORS, MOCK_PAYMENT_ORDERS, MOCK_INVOICES, MOCK_COMPLIANCE_CASES, MOCK_ANOMALIES, MOCK_COUNTERPARTIES } from '../data';

const LEVEL_NAMES = ["Financial Novice", "Budgeting Apprentice", "Savings Specialist", "Investment Adept", "Wealth Master"];
const SCORE_PER_LEVEL = 200;

interface WalletInfo {
    address: string;
    balance: number; // ETH for simplicity
}

interface IDataContext {
  transactions: Transaction[];
  assets: Asset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  gamification: GamificationState;
  impactData: {
    treesPlanted: number;
    spendingForNextTree: number;
    progressToNextTree: number;
  };
  customBackgroundUrl: string | null;
  setCustomBackgroundUrl: (url: string) => void;
  addTransaction: (tx: Transaction) => void;
  activeIllusion: IllusionType;
  setActiveIllusion: (illusion: IllusionType) => void;
  linkedAccounts: LinkedAccount[];
  unlinkAccount: (id: string) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  weaverState: QuantumWeaverState;
  pitchBusinessPlan: (plan: string) => Promise<void>;
  simulateTestPass: () => Promise<void>;
  subscriptions: Subscription[];
  creditScore: CreditScore;
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  marketMovers: MarketMover[];
  marketplaceProducts: MarketplaceProduct[];
  fetchMarketplaceProducts: () => Promise<void>;
  isMarketplaceLoading: boolean;
  addProductToTransactions: (product: MarketplaceProduct) => void;
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  cryptoAssets: CryptoAsset[];
  paymentOperations: PaymentOperation[];
  walletInfo: WalletInfo | null;
  virtualCard: VirtualCard | null;
  connectWallet: () => void;
  issueCard: () => void;
  buyCrypto: (usdAmount: number, cryptoTicker: string) => void;
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCard: (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => void;
  rewardPoints: RewardPoints;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  isImportingData: boolean;
  nftAssets: NFTAsset[];
  mintNFT: (name: string, imageUrl: string) => void;
  mintToken: (name: string, ticker: string, amount: number) => void;
  initiatePayment: (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => void;
  rewardItems: RewardItem[];
  redeemReward: (item: RewardItem) => boolean;
  apiStatus: APIStatus[];
  creditFactors: CreditFactor[];
  // FIX: Add missing corporate finance data types to the context interface to resolve errors in CorporateCommandView.
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  financialAnomalies: FinancialAnomaly[];
  updateAnomalyStatus: (id: string, status: AnomalyStatus) => void;
  counterparties: Counterparty[];
  updatePaymentOrderStatus: (id: string, status: PaymentOrderStatus) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const COST_PER_TREE = 250;

  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const [impactInvestments] = useState<Asset[]>(MOCK_IMPACT_INVESTMENTS);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS);
  const [treesPlanted, setTreesPlanted] = useState<number>(12);
  const [spendingForNextTree, setSpendingForNextTree] = useState<number>(170);
  const [gamification, setGamification] = useState<GamificationState>({
      score: 450,
      level: 3,
      levelName: "Savings Specialist",
      progress: 25,
      credits: 225,
  });
  const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => {
      return localStorage.getItem('customBackgroundUrl');
  });
  const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(
    () => (localStorage.getItem('activeIllusion') as IllusionType) || 'none'
  );
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [weaverState, setWeaverState] = useState<QuantumWeaverState>({
    stage: WeaverStage.Pitch,
    businessPlan: '',
    feedback: '',
    questions: [],
    loanAmount: 0,
    coachingPlan: null,
    error: null,
  });

  // State for new dashboard widgets
  const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [creditScore] = useState<CreditScore>(MOCK_CREDIT_SCORE);
  const [upcomingBills] = useState<UpcomingBill[]>(MOCK_UPCOMING_BILLS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);
  const [marketMovers] = useState<MarketMover[]>(MOCK_MARKET_MOVERS);
  const [rewardPoints, setRewardPoints] = useState<RewardPoints>(MOCK_REWARD_POINTS);
  
  // State for Plato's Marketplace
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);

  // State for Financial Goals
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS);

  // State for Crypto & Web3 Hub
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(MOCK_CRYPTO_ASSETS);
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>(MOCK_PAYMENT_OPERATIONS);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);

  // State for dynamic AI insights
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [isImportingData, setIsImportingData] = useState(false);

  // State for Corporate Command Center
  const [corporateCards, setCorporateCards] = useState<CorporateCard[]>(MOCK_CORPORATE_CARDS);
  const [corporateTransactions] = useState<CorporateTransaction[]>(MOCK_CORPORATE_TRANSACTIONS);

  // State for new interactive features
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  // State for new views
  const [rewardItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
  const [apiStatus] = useState<APIStatus[]>(MOCK_API_STATUS);
  const [creditFactors] = useState<CreditFactor[]>(MOCK_CREDIT_FACTORS);

  // FIX: Add state for the new corporate finance data to make it available through the context.
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>(MOCK_PAYMENT_ORDERS);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [complianceCases] = useState<ComplianceCase[]>(MOCK_COMPLIANCE_CASES);
  const [financialAnomalies, setFinancialAnomalies] = useState<FinancialAnomaly[]>(MOCK_ANOMALIES);
  const [counterparties] = useState<Counterparty[]>(MOCK_COUNTERPARTIES);


  const setCustomBackgroundUrl = (url: string) => {
      localStorage.setItem('customBackgroundUrl', url);
      setCustomBackgroundUrlState(url);
      localStorage.setItem('activeIllusion', 'none');
      setActiveIllusionState('none');
  };

  const setActiveIllusion = (illusion: IllusionType) => {
    localStorage.setItem('activeIllusion', illusion);
    setActiveIllusionState(illusion);
    if (illusion !== 'none') {
      localStorage.removeItem('customBackgroundUrl');
      setCustomBackgroundUrlState(null);
    }
  };
  
  const updateGamification = (points: number) => {
    setGamification(prev => {
        const newScore = prev.score + points;
        const newLevel = Math.floor(newScore / SCORE_PER_LEVEL) + 1;
        const newProgress = ((newScore % SCORE_PER_LEVEL) / SCORE_PER_LEVEL) * 100;
        const newLevelName = LEVEL_NAMES[Math.min(newLevel - 1, LEVEL_NAMES.length - 1)];
        const newCredits = prev.credits + (points > 0 ? Math.floor(points / 2) : 0);

        return { score: newScore, level: newLevel, levelName: newLevelName, progress: newProgress, credits: newCredits };
    });
  };

  const generateDashboardInsights = useCallback(async () => {
    setIsInsightsLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const recentTransactionsSummary = transactions.slice(0, 10).map(t => `${t.description}: $${t.amount.toFixed(2)} (${t.type})`).join(', ');
        
        const prompt = `You are Quantum, a proactive AI financial advisor. Analyze the user's recent transactions to generate 3 diverse, actionable insights. Your insights must be concise. If an insight is about high spending, provide chartData for the top 3 items. Format your response as a JSON object that strictly adheres to the provided schema. Do not include any text outside of the JSON object.

Recent Transactions: ${recentTransactionsSummary}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        insights: {
                            type: Type.ARRAY,
                            description: "A list of 3 diverse financial insights.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING, description: "A unique identifier for the insight, e.g., 'insight_1'." },
                                    title: { type: Type.STRING, description: "A short, catchy title for the insight (max 10 words)." },
                                    description: { type: Type.STRING, description: "A concise, user-friendly description of the insight (max 2 sentences)." },
                                    urgency: { type: Type.STRING, description: "The urgency level of the insight.", enum: ['low', 'medium', 'high'] },
                                    chartData: {
                                        type: Type.ARRAY,
                                        description: "Optional. If the insight is about spending, provide data for a bar chart. Include the top 3 items.",
                                        nullable: true,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                name: { type: Type.STRING, description: "The name of the item for the chart (e.g., a specific transaction description)." },
                                                value: { type: Type.NUMBER, description: "The value (amount) for the chart." }
                                            },
                                            required: ["name", "value"]
                                        }
                                    }
                                },
                                required: ["id", "title", "description", "urgency"]
                            }
                        }
                    },
                    required: ["insights"]
                }
            }
        });
        
        const parsedResponse = JSON.parse(response.text);
        if (parsedResponse.insights) {
            setAiInsights(parsedResponse.insights);
        }

    } catch (error) {
        console.error("Failed to generate AI insights:", error);
        // Fallback to a default insight on error
        setAiInsights([{ id: 'error_1', title: 'Analysis Paused', description: 'Could not fetch fresh insights at this time. Displaying last known data.', urgency: 'low' }]);
    } finally {
        setIsInsightsLoading(false);
    }
}, [transactions]); // Dependency on transactions ensures it can re-run with new data

useEffect(() => {
    generateDashboardInsights(); // Initial generation
    const intervalId = setInterval(generateDashboardInsights, 35000); // Auto-refresh every 35 seconds
    return () => clearInterval(intervalId);
}, [generateDashboardInsights]);

  const handlePlaidSuccess = (publicToken: string, metadata: any) => {
    setIsImportingData(true);
    console.log("Plaid Link Success!", { publicToken, metadata });

    const newAccount: LinkedAccount = {
        id: metadata.institution.institution_id,
        name: metadata.institution.name,
        mask: metadata.accounts[0].mask,
    };
    
    if (!linkedAccounts.some(acc => acc.id === newAccount.id)) {
        setLinkedAccounts(prev => [...prev, newAccount]);
    }
    
    setTimeout(() => {
        const plaidTransactions: Transaction[] = [
            { id: `plaid_${Date.now()}`, type: 'expense', category: 'Shopping', description: `Zara`, amount: 152.34, date: '2024-03-22', carbonFootprint: 10.1 },
            { id: `plaid_${Date.now()+1}`, type: 'expense', category: 'Dining', description: `The Cheesecake Factory`, amount: 85.50, date: '2024-03-21', carbonFootprint: 8.2 },
            { id: `plaid_${Date.now()+2}`, type: 'income', category: 'Salary', description: `Paycheck`, amount: 2500.00, date: '2024-03-20' },
            { id: `plaid_${Date.now()+3}`, type: 'expense', category: 'Groceries', description: `Whole Foods`, amount: 210.40, date: '2024-03-19', carbonFootprint: 21.8 },
            { id: `plaid_${Date.now()+4}`, type: 'expense', category: 'Transport', description: `Uber`, amount: 25.10, date: '2024-03-18', carbonFootprint: 2.1 },
            { id: `plaid_${Date.now()+5}`, type: 'expense', category: 'Utilities', description: `Con Edison`, amount: 112.00, date: '2024-03-15', carbonFootprint: 25.3 },
            { id: `plaid_${Date.now()+6}`, type: 'expense', category: 'Entertainment', description: `Netflix Subscription`, amount: 15.99, date: '2024-03-12', carbonFootprint: 0.5 },
            { id: `plaid_${Date.now()+7}`, type: 'expense', category: 'Dining', description: `Starbucks`, amount: 7.80, date: '2024-03-11', carbonFootprint: 0.8 },
        ];
        
        setTransactions(prev => [...plaidTransactions, ...prev]);
        
        updateGamification(100);
        
        // The generateDashboardInsights function will automatically re-run due to the dependency change,
        // but we can call it here to ensure immediate feedback after import simulation.
        generateDashboardInsights();
        
        setIsImportingData(false);
    }, 4000);
  };

  const unlinkAccount = (id: string) => {
      setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
  };

  const pitchBusinessPlan = async (plan: string) => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.Analysis, businessPlan: plan, error: null }));
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const prompt = `Analyze the following business plan. Provide brief, constructive initial feedback (1-2 sentences) and generate exactly 5 sample assessment questions based on the plan's potential weaknesses or key areas. The questions should cover different categories like Market, Finance, Operations, etc.

Business Plan: "${plan}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    feedback: { type: Type.STRING },
                    questions: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                id: { type: Type.STRING },
                                question: { type: Type.STRING },
                                category: { type: Type.STRING }
                            },
                            required: ["id", "question", "category"]
                        }
                    }
                },
                 required: ["feedback", "questions"]
            }
        }
      });
      
      const parsedResponse = JSON.parse(response.text);
      setWeaverState(prev => ({
        ...prev,
        stage: WeaverStage.Test,
        feedback: parsedResponse.feedback,
        questions: parsedResponse.questions,
      }));

    } catch (err) {
      console.error("Error analyzing business plan:", err);
      setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Plato AI encountered an issue analyzing your plan. Please try again." }));
    }
  };

  const simulateTestPass = async () => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.FinalReview, error: null }));

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const prompt = `Based on this business plan, you have approved a seed loan. Determine a realistic loan amount (between $50,000 and $250,000). Then, generate a 3-step coaching plan to guide the founder. The plan should be high-level and encouraging.

Business Plan: "${weaverState.businessPlan}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    loanAmount: { type: Type.NUMBER },
                    coachingPlan: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            steps: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        title: { type: Type.STRING },
                                        description: { type: Type.STRING },
                                        timeline: { type: Type.STRING }
                                    },
                                    required: ["title", "description", "timeline"]
                                }
                            }
                        },
                        required: ["title", "summary", "steps"]
                    }
                },
                required: ["loanAmount", "coachingPlan"]
            }
        }
      });

      const parsedResponse = JSON.parse(response.text);
      const { loanAmount, coachingPlan } = parsedResponse;

      setWeaverState(prev => ({
        ...prev,
        stage: WeaverStage.Approved,
        loanAmount,
        coachingPlan,
      }));
      
      const loanTx: Transaction = {
          id: `loan_${new Date().toISOString()}`,
          type: 'income',
          category: 'Loan',
          description: `QuantumWeaver Seed Loan`,
          amount: loanAmount,
          date: new Date().toLocaleDateString('en-CA'),
      };
      addTransaction(loanTx);

    } catch (err) {
        console.error("Error finalizing loan:", err);
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "Plato AI couldn't finalize the funding package. Please try again." }));
    }
  };

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (tx.type === 'expense') {
        setSpendingForNextTree(prev => {
            const newSpending = prev + tx.amount;
            if (newSpending >= COST_PER_TREE) {
                setTreesPlanted(p => p + Math.floor(newSpending / COST_PER_TREE));
                return newSpending % COST_PER_TREE;
            }
            return newSpending;
        });

        const budgetToUpdate = budgets.find(b => b.name.toLowerCase() === tx.category.toLowerCase());
        if (budgetToUpdate) {
            setBudgets(prev => prev.map(b => b.id === budgetToUpdate.id ? { ...b, spent: b.spent + tx.amount } : b));
        }
    }
    updateGamification(tx.type === 'income' ? 20 : 10);
  };

  const addProductToTransactions = (product: MarketplaceProduct) => {
      const tx: Transaction = {
          id: `mkt_${product.id}_${Date.now()}`,
          type: 'expense',
          category: product.category,
          description: product.name,
          amount: product.price,
          date: new Date().toLocaleDateString('en-CA'),
          carbonFootprint: 2.5 // Placeholder value
      };
      addTransaction(tx);
  };

  const addBudget = (budget: Omit<BudgetCategory, '