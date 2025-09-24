import React, { createContext, useState, ReactNode, useEffect, useCallback } from 'react';
// FIX: The import for GoogleGenAI was incorrect. The new SDK uses "@google/genai".
import { GoogleGenAI, Type } from "@google/genai";
import type { Transaction, Asset, BudgetCategory, GamificationState, IllusionType, LinkedAccount, QuantumWeaverState, Subscription, CreditScore, UpcomingBill, SavingsGoal, MarketMover, MarketplaceProduct, FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, AIInsight, CorporateCard, CorporateTransaction, RewardPoints, Notification, NFTAsset, RewardItem, APIStatus, CreditFactor, CorporateCardControls, PaymentOrder, Invoice, ComplianceCase, FinancialAnomaly, AnomalyStatus, User, Post, LendingPoolStats, CommunityLoan, AppIntegration, Counterparty, BiometricData, ExternalAccount, VirtualAccount, ToastNotification, LoginAttempt, AIAgent, SynapticVault, PostContent } from '../types';
import { View, WeaverStage } from '../types';
import { MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_IMPACT_INVESTMENTS, MOCK_BUDGETS, MOCK_SUBSCRIPTIONS, MOCK_CREDIT_SCORE, MOCK_UPCOMING_BILLS, MOCK_SAVINGS_GOALS, MOCK_MARKET_MOVERS, MOCK_FINANCIAL_GOALS, MOCK_CRYPTO_ASSETS, MOCK_PAYMENT_OPERATIONS, MOCK_CORPORATE_CARDS, MOCK_CORPORATE_TRANSACTIONS, MOCK_REWARD_POINTS, MOCK_NOTIFICATIONS, MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_CREDIT_FACTORS, MOCK_PAYMENT_ORDERS, MOCK_INVOICES, MOCK_COMPLIANCE_CASES, MOCK_ANOMALIES, MOCK_USERS, MOCK_POSTS, MOCK_LENDING_POOL, MOCK_APP_INTEGRATIONS, MOCK_COUNTERPARTIES, MOCK_BIOMETRIC_DATA, MOCK_LOGIN_ATTEMPTS, MOCK_AI_AGENTS, MOCK_SYNAPTIC_VAULTS } from '../data/mockData';

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
  paymentOrders: PaymentOrder[];
  invoices: Invoice[];
  addInvoice: (invoiceData: Omit<Invoice, 'id'|'invoiceNumber'|'status'>) => void;
  complianceCases: ComplianceCase[];
  financialAnomalies: FinancialAnomaly[];
  updateAnomalyStatus: (id: string, status: AnomalyStatus) => void;
  // New Social & P2P types
  users: User[];
  posts: Post[];
  createPost: (text: string) => void;
  lendingPool: LendingPoolStats;
  // New Corporate Suite types
  appIntegrations: AppIntegration[];
  counterparties: Counterparty[];
  createCounterparty: (name: string, type: 'business' | 'individual') => void;
  addExternalAccountToCounterparty: (counterpartyId: string, accountData: Omit<ExternalAccount, 'id'>) => void;
  createVirtualAccountForCounterparty: (counterpartyId: string, accountName: string) => void;
  biometricData: BiometricData;
  enableBiometricLock: (cardId: string) => void;
  // New Feedback system
  toastNotifications: ToastNotification[];
  // New Activated Features
  approvePaymentOrder: (orderId: string) => void;
  denyPaymentOrder: (orderId: string) => void;
  sendCashAppPayment: (cashtag: string, amount: number) => void;
  // New Control Center & AI Network state
  loginAttempts: LoginAttempt[];
  aiAgents: AIAgent[];
  synapticVaults: SynapticVault[];
  createSynapticVault: (collaboratorId: string) => void;
  // FIX: Added missing function definition to the interface.
  createPaymentOrder: (orderData: Omit<PaymentOrder, 'id' | 'status' | 'date'>) => void;
  mintPostAsNFT: (postId: string) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

// FIX: Added a return statement with the provider to satisfy the React.FC type. The component was implicitly returning void.
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
  const [savingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);
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
  const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>(MOCK_CORPORATE_TRANSACTIONS);

  // State for new interactive features
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  // State for new views
  const [rewardItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
  const [apiStatus] = useState<APIStatus[]>(MOCK_API_STATUS);
  const [creditFactors] = useState<CreditFactor[]>(MOCK_CREDIT_FACTORS);

  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>(MOCK_PAYMENT_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [complianceCases] = useState<ComplianceCase[]>(MOCK_COMPLIANCE_CASES);
  const [financialAnomalies, setFinancialAnomalies] = useState<FinancialAnomaly[]>(MOCK_ANOMALIES);

  // New state for Ecosystem Hub & P2P Lending
  const [users] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [lendingPool] = useState<LendingPoolStats>(MOCK_LENDING_POOL);

  // New state for Activated Corporate Suite
  const [appIntegrations] = useState<AppIntegration[]>(MOCK_APP_INTEGRATIONS);
  const [counterparties, setCounterparties] = useState<Counterparty[]>(MOCK_COUNTERPARTIES);
  const [biometricData] = useState<BiometricData>(MOCK_BIOMETRIC_DATA);

  // New state for feedback system
  const [toastNotifications, setToastNotifications] = useState<ToastNotification[]>([]);

  // New state for Control Center & AI Network
  const [loginAttempts] = useState<LoginAttempt[]>(MOCK_LOGIN_ATTEMPTS);
  const [aiAgents] = useState<AIAgent[]>(MOCK_AI_AGENTS);
  const [synapticVaults, setSynapticVaults] = useState<SynapticVault[]>(MOCK_SYNAPTIC_VAULTS);


  const addToast = (message: string, type: 'success' | 'error') => {
    const newToast = { id: Date.now(), message, type };
    setToastNotifications(prev => [...prev, newToast]);
    setTimeout(() => {
        setToastNotifications(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

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
                                                name: { type: Type.STRING },
                                                value: { type: Type.NUMBER }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text ?? '{}');
        if (result.insights) {
            setAiInsights(result.insights);
        }
    } catch (error) {
        console.error("Failed to generate dashboard insights:", error);
    } finally {
        setIsInsightsLoading(false);
    }
}, [transactions]);

  useEffect(() => {
      if (transactions.length > 0) {
          generateDashboardInsights();
      }
  }, [generateDashboardInsights]);
  
  const addTransaction = (tx: Transaction) => {
      // Future-state memo: This event stream should be mirrored to an analytics bus (e.g., Segment).
      setTransactions(prev => [tx, ...prev]);
      if (tx.type === 'expense') {
          setSpendingForNextTree(prev => {
              const newSpending = prev + tx.amount;
              if (newSpending >= COST_PER_TREE) {
                  setTreesPlanted(p => p + 1);
                  return newSpending % COST_PER_TREE;
              }
              return newSpending;
          });
          setBudgets(prev => prev.map(b => b.name.toLowerCase() === tx.category.toLowerCase() ? { ...b, spent: b.spent + tx.amount } : b));
          updateGamification(-5);
      } else {
          updateGamification(10);
      }
  };

  const addBudget = (budget: Omit<BudgetCategory, 'id'|'spent'|'color'>) => {
        const newBudget: BudgetCategory = {
            id: budget.name.toLowerCase().replace(' ', '-'),
            name: budget.name,
            limit: budget.limit,
            spent: 0,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        };
        setBudgets(prev => [...prev, newBudget]);
        addToast(`Budget for "${budget.name}" created!`, 'success');
  };
  
  const handlePlaidSuccess = (publicToken: string, metadata: any) => {
    setIsImportingData(true);
    // In a real app, you'd exchange the public token for an access token on your server.
    // Here we just simulate adding the account and fetching transactions.
    console.log("Plaid public token:", publicToken);
    console.log("Plaid metadata:", metadata);
    const newAccounts: LinkedAccount[] = metadata.accounts.map((acc: any) => ({
        id: acc.id,
        name: metadata.institution.name,
        mask: acc.mask
    }));
    setLinkedAccounts(prev => [...prev, ...newAccounts]);
    addToast(`${metadata.institution.name} linked successfully!`, 'success');
    
    // Simulate fetching transactions after a delay
    setTimeout(() => {
        const randomTxCount = Math.floor(Math.random() * 5) + 3;
        const newTransactions: Transaction[] = Array.from({ length: randomTxCount }, (_, i) => ({
            id: `plaid_${Date.now()}_${i}`,
            type: Math.random() > 0.3 ? 'expense' : 'income',
            category: 'Imported',
            description: `Imported from ${metadata.institution.name}`,
            amount: Math.random() * 100,
            date: new Date().toLocaleDateString('en-CA'),
        }));
        setTransactions(prev => [...newTransactions, ...prev]);
        setIsImportingData(false);
        addToast(`Imported ${randomTxCount} transactions.`, 'success');
    }, 2500);
  };
  
  const unlinkAccount = (id: string) => {
    setLinkedAccounts(prev => prev.filter(acc => acc.id !== id));
  };
  
  const pitchBusinessPlan = async (plan: string) => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.Analysis, businessPlan: plan }));
    try {
        await new Promise(res => setTimeout(res, 2000)); // Simulate analysis time
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this business plan and provide initial feedback (one sentence) and 3-4 probing questions a venture capitalist would ask.
            Plan: "${plan}"`,
        });
        
        const text = response.text ?? '';
        const feedbackMatch = text.match(/"(.*?)"/);
        const feedback = feedbackMatch ? feedbackMatch[1] : "An interesting proposal. We have some questions.";
        const questions = text.split('\n').slice(1).map((q, i) => ({
            id: `q${i}`,
            question: q.replace(/^\d+\.\s*/, '').trim(),
            category: 'Strategy', // Simplified
        })).filter(q => q.question);

        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Test, feedback, questions }));

    } catch (err) {
        console.error("Error in Weaver analysis:", err);
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "AI analysis failed." }));
    }
  };
  
  const simulateTestPass = async () => {
    setWeaverState(prev => ({ ...prev, stage: WeaverStage.FinalReview }));
    try {
        await new Promise(res => setTimeout(res, 2000)); // Simulate final review time
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on this business plan, determine a realistic seed funding amount (between $50,000 and $250,000) and generate a 3-step strategic coaching plan with a title, description, and timeline for each step. Plan: "${weaverState.businessPlan}"`,
        });

        const text = response.text ?? '';
        const loanMatch = text.match(/\$(\d{1,3}(,\d{3})*)/);
        const loanAmount = loanMatch ? parseInt(loanMatch[1].replace(/,/g, ''), 10) : 100000;
        
        const steps = [...text.matchAll(/\d+\.\s\*\*(.*?)\*\*:\s(.*?)\s\((.*?)\)/g)].map(match => ({
            title: match[1],
            description: match[2],
            timeline: match[3]
        }));

        const coachingPlan: AIGoalPlan = {
            feasibilitySummary: '', // Not used here, but required by type
            monthlyContribution: 0,
            // @ts-ignore
            steps: steps
        };
        // @ts-ignore
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Approved, loanAmount, coachingPlan }));
    } catch (err) {
        console.error("Error in Weaver final review:", err);
        setWeaverState(prev => ({ ...prev, stage: WeaverStage.Error, error: "AI final review failed." }));
    }
  };
  
   const fetchMarketplaceProducts = useCallback(async () => {
        setIsMarketplaceLoading(true);
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const transactionSummary = transactions.slice(0, 5).map(t => t.description).join(', ');
            const prompt = `Based on these recent purchases (${transactionSummary}), recommend 3 diverse products. For each, provide a name, a price (between 500-2000), a category, an image URL from unsplash.com, and a one-sentence AI justification for why the user might like it.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            products: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        id: { type: Type.STRING },
                                        name: { type: Type.STRING },
                                        price: { type: Type.NUMBER },
                                        category: { type: Type.STRING },
                                        imageUrl: { type: Type.STRING },
                                        aiJustification: { type: Type.STRING }
                                    }
                                }
                            }
                        }
                    }
                }
            });

            const result = JSON.parse(response.text ?? '{}');
            if (result.products) {
                setMarketplaceProducts(result.products);
            }
        } catch (error) {
            console.error("Failed to fetch marketplace products:", error);
        } finally {
            setIsMarketplaceLoading(false);
        }
    }, [transactions]);
    
    const addProductToTransactions = (product: MarketplaceProduct) => {
        const newTx: Transaction = {
            id: `mkt_${product.id}_${Date.now()}`,
            type: 'expense',
            category: product.category,
            description: product.name,
            amount: product.price,
            date: new Date().toLocaleDateString('en-CA'),
            carbonFootprint: Math.random() * 10,
        };
        addTransaction(newTx);
        addToast(`${product.name} purchased successfully!`, 'success');
    };
    
    const addFinancialGoal = (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => {
        const newGoal: FinancialGoal = {
            ...goalData,
            id: `goal_${Date.now()}`,
            currentAmount: 0,
            plan: null,
        };
        setFinancialGoals(prev => [newGoal, ...prev]);
        addToast(`New goal "${goalData.name}" added!`, 'success');
    };
    
    const contributeToGoal = (goalId: string, amount: number) => {
        setFinancialGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const newAmount = g.currentAmount + amount;
                addTransaction({
                    id: `contr_${goalId}_${Date.now()}`,
                    type: 'expense',
                    category: 'Savings',
                    description: `Contribution to ${g.name}`,
                    amount: amount,
                    date: new Date().toLocaleDateString('en-CA'),
                });
                return { ...g, currentAmount: Math.min(newAmount, g.targetAmount) };
            }
            return g;
        }));
    };
    
    const generateGoalPlan = async (goalId: string) => {
        const goal = financialGoals.find(g => g.id === goalId);
        if (!goal) return;
        
        try {
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY as string});
            const prompt = `Create a 3-step plan to help a user achieve this financial goal: ${JSON.stringify(goal)}. Provide a feasibility summary and a recommended monthly contribution.`;
            // Simplified for brevity, in real app would use structured JSON response
            const response = await ai.models.generateContent({model: 'gemini-2.5-flash', contents: prompt});
            
            // This is a mock plan generation based on a text response.
            const newPlan: AIGoalPlan = {
                 feasibilitySummary: "This goal is achievable with consistent effort.",
                 monthlyContribution: (goal.targetAmount - goal.currentAmount) / 24, // simplified 2-year plan
                 steps: [
                     { title: "Automate Savings", description: "Set up automatic monthly transfers.", category: 'Savings' },
                     { title: "Cut a small expense", description: "Reduce spending in one budget category.", category: 'Budgeting' },
                     { title: "Explore side income", description: "Look for opportunities to increase your income.", category: 'Income' }
                 ]
            };
            setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan: newPlan } : g));
            addToast(`AI plan generated for "${goal.name}"!`, 'success');
        } catch (error) {
            console.error("Failed to generate goal plan:", error);
            addToast(`Could not generate AI plan.`, 'error');
        }
    };
    
    const connectWallet = () => {
        setWalletInfo({ address: '0x1a2b...c3d4', balance: 4.25 });
        addToast('Web3 Wallet Connected', 'success');
    };

    const issueCard = () => {
        setVirtualCard({
            cardNumber: '5555 1234 5678 9012',
            cvv: '123',
            expiry: '12/28',
            holderName: 'The Visionary'
        });
        addToast('Crypto-backed virtual card issued!', 'success');
    };
    
    const buyCrypto = (usdAmount: number, cryptoTicker: string) => {
        const crypto = cryptoAssets.find(c => c.ticker === cryptoTicker);
        if (!crypto) return;
        
        const amountOfCrypto = usdAmount / (crypto.value / crypto.amount);
        setCryptoAssets(prev => prev.map(c => 
            c.ticker === cryptoTicker ? { ...c, amount: c.amount + amountOfCrypto } : c
        ));
        addTransaction({
            id: `crypto_${Date.now()}`,
            type: 'expense',
            category: 'Investments',
            description: `Buy ${cryptoTicker}`,
            amount: usdAmount,
            date: new Date().toLocaleDateString('en-CA'),
        });
        addToast(`Successfully bought ${amountOfCrypto.toFixed(4)} ${cryptoTicker}`, 'success');
    };
    
    const toggleCorporateCardFreeze = (cardId: string) => {
        setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, frozen: !c.frozen } : c));
    };

    const updateCorporateCard = (cardId: string, newControls: CorporateCardControls, newFrozenState: boolean) => {
        setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, controls: newControls, frozen: newFrozenState } : c));
        addToast('Card controls updated!', 'success');
    };
    
    const markNotificationRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };
    
    const mintNFT = (name: string, imageUrl: string) => {
        const newNft: NFTAsset = {
            id: `nft_${Date.now()}`,
            name: name,
            imageUrl: imageUrl,
            contractAddress: '0xabc...def'
        };
        setNftAssets(prev => [newNft, ...prev]);
        addToast(`NFT "${name}" minted!`, 'success');
    };

    const mintPostAsNFT = (postId: string) => {
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1 || posts[postIndex].nftId) {
            addToast('This post has already been minted.', 'error');
            return;
        }
    
        const postToMint = posts[postIndex];
    
        const newNft: NFTAsset = {
            id: `nft_${Date.now()}`,
            name: `Post by ${postToMint.userName}`,
            description: postToMint.content.text || 'A minted ecosystem post.',
            imageUrl: postToMint.content.imageUrl || `https://source.unsplash.com/random/400x400/?abstract&sig=${Date.now()}`,
            contractAddress: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
            sourcePostId: postToMint.id,
        };
        
        setNftAssets(prev => [newNft, ...prev]);
    
        const updatedPosts = [...posts];
        updatedPosts[postIndex] = { ...updatedPosts[postIndex], nftId: newNft.id };
        setPosts(updatedPosts);
    
        addToast(`Post minted as NFT!`, 'success');
    };
    
    const mintToken = (name: string, ticker: string, amount: number) => {
        const newToken: CryptoAsset = {
            ticker: ticker,
            name: name,
            value: amount,
            amount: amount,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        };
        setCryptoAssets(prev => [...prev, newToken]);
        addToast(`Token "${name}" minted!`, 'success');
    };

    const initiatePayment = (details: Omit<PaymentOperation, 'id' | 'status' | 'date'>) => {
        const newOp: PaymentOperation = {
            ...details,
            id: `op_${Date.now()}`,
            status: 'Initiated',
            date: new Date().toLocaleDateString('en-CA'),
        };
        setPaymentOperations(prev => [newOp, ...prev]);
        addToast('Payment initiated.', 'success');
    };

    const redeemReward = (item: RewardItem) => {
        if (rewardPoints.balance >= item.cost) {
            setRewardPoints(prev => ({
                ...prev,
                balance: prev.balance - item.cost,
                lastRedeemed: item.cost
            }));
            addToast(`Redeemed "${item.name}"!`, 'success');
            return true;
        }
        addToast('Not enough points.', 'error');
        return false;
    };
    
    const updateAnomalyStatus = (id: string, status: AnomalyStatus) => {
        setFinancialAnomalies(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };
    
    const createPost = (text: string) => {
        // Legal memo: All user-generated content is subject to moderation analysis via a future integration (e.g., Hive AI).
        const newPost: Post = {
            id: `post_${Date.now()}`,
            userId: users[0].id,
            userName: users[0].name,
            userProfilePic: users[0].profilePictureUrl,
            timestamp: 'Just now',
            content: { text: text },
            likes: 0,
            comments: [],
        };
        setPosts(prev => [newPost, ...prev]);
        addToast('Post created!', 'success');
    };
    
    const createCounterparty = (name: string, type: 'business' | 'individual') => {
        const newCp: Counterparty = {
            id: `cp_${Date.now()}`,
            name,
            type,
            riskLevel: 'Low',
            createdDate: new Date().toLocaleDateString('en-CA'),
            accounts: [],
            virtualAccounts: [],
        };
        setCounterparties(prev => [newCp, ...prev]);
        addToast(`Counterparty "${name}" created!`, 'success');
    };

    const addExternalAccountToCounterparty = (counterpartyId: string, accountData: Omit<ExternalAccount, 'id'>) => {
        const newAccount: ExternalAccount = { ...accountData, id: `ext_${Date.now()}` };
        setCounterparties(prev => prev.map(cp => 
            cp.id === counterpartyId ? { ...cp, accounts: [...cp.accounts, newAccount] } : cp
        ));
        addToast(`External account added!`, 'success');
    };

    const createVirtualAccountForCounterparty = (counterpartyId: string, accountName: string) => {
        const newAccount: VirtualAccount = {
            id: `va_${Date.now()}`,
            accountName,
            balance: 0,
            routingNumber: `${Math.floor(100000000 + Math.random() * 900000000)}`,
            accountNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        };
        setCounterparties(prev => prev.map(cp => 
            cp.id === counterpartyId ? { ...cp, virtualAccounts: [...(cp.virtualAccounts || []), newAccount] } : cp
        ));
        addToast(`Virtual account "${accountName}" created!`, 'success');
    };

    const enableBiometricLock = (cardId: string) => {
        setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, biometricLockEnabled: true } : c));
        addToast('Biometric lock enabled!', 'success');
    };
    
    const addInvoice = (invoiceData: Omit<Invoice, 'id'|'invoiceNumber'|'status'>) => {
        const newInvoice: Invoice = {
            ...invoiceData,
            id: `inv_${Date.now()}`,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
            status: 'unpaid',
        };
        setInvoices(prev => [newInvoice, ...prev]);
        addToast(`Invoice for ${invoiceData.counterpartyName} created.`, 'success');
    };
    
    const approvePaymentOrder = (orderId: string) => {
        setPaymentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'approved' } : o));
        addToast(`Payment order ${orderId} approved.`, 'success');
    };
    
    const denyPaymentOrder = (orderId: string) => {
        setPaymentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'denied' } : o));
        addToast(`Payment order ${orderId} denied.`, 'error');
    };
    
    const sendCashAppPayment = (cashtag: string, amount: number) => {
        const newTx: Transaction = {
            id: `cashapp_${Date.now()}`,
            type: 'expense',
            category: 'Transfer',
            description: `Cash App to ${cashtag}`,
            amount: amount,
            date: new Date().toLocaleDateString('en-CA'),
        };
        addTransaction(newTx);
        addToast(`$${amount} sent to ${cashtag} via Cash App!`, 'success');
    };
    
    const createSynapticVault = (collaboratorId: string) => {
        const collaborator = users.find(u => u.id === collaboratorId);
        if(!collaborator) return;
        
        const newVault: SynapticVault = {
            id: `sv_${Date.now()}`,
            ownerIds: [users[0].id, collaborator.id],
            ownerNames: [users[0].name, collaborator.name],
            status: 'active',
            masterPrivateKeyFragment: '...'+Math.random().toString(16).slice(-4),
            creationDate: new Date().toLocaleDateString('en-CA')
        };
        setSynapticVaults(prev => [newVault, ...prev]);
        addToast(`Synaptic Vault created with ${collaborator.name}!`, 'success');
    };

    // FIX: Added implementation for the missing createPaymentOrder function.
    const createPaymentOrder = (orderData: Omit<PaymentOrder, 'id' | 'status' | 'date'>) => {
        const newOrder: PaymentOrder = {
            ...orderData,
            id: `po_${Date.now()}`,
            status: 'needs_approval',
            date: new Date().toLocaleDateString('en-CA'),
        };
        setPaymentOrders(prev => [newOrder, ...prev]);
        addToast(`Payment order for ${orderData.counterpartyName} created.`, 'success');
    };


  const value: IDataContext = {
    transactions,
    assets,
    impactInvestments,
    budgets,
    addBudget,
    gamification,
    impactData: {
      treesPlanted,
      spendingForNextTree,
      progressToNextTree: (spendingForNextTree / COST_PER_TREE) * 100,
    },
    customBackgroundUrl,
    setCustomBackgroundUrl,
    addTransaction,
    activeIllusion,
    setActiveIllusion,
    linkedAccounts,
    unlinkAccount,
    handlePlaidSuccess,
    weaverState,
    pitchBusinessPlan,
    simulateTestPass,
    subscriptions,
    creditScore,
    upcomingBills,
    savingsGoals,
    marketMovers,
    marketplaceProducts,
    fetchMarketplaceProducts,
    isMarketplaceLoading,
    addProductToTransactions,
    financialGoals,
    addFinancialGoal,
    contributeToGoal,
    generateGoalPlan,
    cryptoAssets,
    paymentOperations,
    walletInfo,
    virtualCard,
    connectWallet,
    issueCard,
    buyCrypto,
    aiInsights,
    isInsightsLoading,
    corporateCards,
    corporateTransactions,
    toggleCorporateCardFreeze,
    updateCorporateCard,
    rewardPoints,
    notifications,
    markNotificationRead,
    isImportingData,
    nftAssets,
    mintNFT,
    mintToken,
    initiatePayment,
    rewardItems,
    redeemReward,
    apiStatus,
    creditFactors,
    paymentOrders,
    invoices,
    addInvoice,
    complianceCases,
    financialAnomalies,
    updateAnomalyStatus,
    users,
    posts,
    createPost,
    lendingPool,
    appIntegrations,
    counterparties,
    createCounterparty,
    addExternalAccountToCounterparty,
    createVirtualAccountForCounterparty,
    biometricData,
    enableBiometricLock,
    toastNotifications,
    approvePaymentOrder,
    denyPaymentOrder,
    sendCashAppPayment,
    loginAttempts,
    aiAgents,
    synapticVaults,
    createSynapticVault,
    createPaymentOrder,
    mintPostAsNFT,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
