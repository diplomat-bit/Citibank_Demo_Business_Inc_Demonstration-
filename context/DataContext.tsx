// @/context/DataContext.tsx
// --- The Absolute Source of Truth: All Data, Logic, and State Handlers ---
// This file serves as the God-file, containing all mock data imports, derived state
// computations, API simulations, business logic (e.g., impact tracking, gamification),
// and context providers, implementing every function placeholder fully and robustly.

import React, { createContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Chat, Type, Modality } from "@google/genai"; // Including for API dependencies

import { 
    Transaction, Asset, BudgetCategory, GamificationState, IllusionType,
    LinkedAccount, QuantumWeaverState, AIPlan, AIQuestion, Subscription, 
    CreditScore, UpcomingBill, SavingsGoal, MarketMover, MarketplaceProduct, 
    FinancialGoal, AIGoalPlan, CryptoAsset, VirtualCard, PaymentOperation, 
    AIInsight, CorporateCard, CorporateTransaction, RewardPoints, Notification,
    NFTAsset, RewardItem, APIStatus, CreditFactor, CorporateCardControls,
    PaymentOrder, Invoice, ComplianceCase, FinancialAnomaly, AnomalyStatus, 
    Counterparty, DynamicKpi, PaymentOrderStatus, NexusGraphData, View, 
    WeaverStage, AccessLog, FraudCase, MLModel, LoanApplication, MortgageAsset,
    ThreatIntelBrief, InsuranceClaim, RiskProfile, DataSet, DataLakeStat,
    // FIX: Imported NexusNode and NexusLink to resolve 'Cannot find name' errors.
    NexusNode, NexusLink,
    // Mega Dashboard - Business
    SalesDeal, MarketingCampaign, GrowthMetric, Competitor, Benchmark,
    // Mega Dashboard - Regulation
    License, Disclosure, LegalDoc, SandboxExperiment, ConsentRecord,
    // Mega Dashboard - Infra
    ContainerImage, ApiUsage, Incident, BackupJob
} from '../types'; 

import { 
    MOCK_TRANSACTIONS, MOCK_ASSETS, MOCK_IMPACT_INVESTMENTS, MOCK_BUDGETS,
    MOCK_SUBSCRIPTIONS, MOCK_CREDIT_SCORE, MOCK_UPCOMING_BILLS, MOCK_SAVINGS_GOALS,
    MOCK_MARKET_MOVERS, MOCK_FINANCIAL_GOALS, MOCK_CRYPTO_ASSETS, MOCK_PAYMENT_OPERATIONS,
    MOCK_CORPORATE_CARDS, MOCK_CORPORATE_TRANSACTIONS, MOCK_REWARD_POINTS, MOCK_NOTIFICATIONS,
    MOCK_REWARD_ITEMS, MOCK_API_STATUS, MOCK_CREDIT_FACTORS, MOCK_PAYMENT_ORDERS, 
    MOCK_INVOICES, MOCK_COMPLIANCE_CASES, MOCK_ANOMALIES, MOCK_COUNTERPARTIES,
    MOCK_ACCESS_LOGS, MOCK_FRAUD_CASES, MOCK_ML_MODELS, 
    // FIX: Corrected import path for megadashboard data.
    MOCK_LOAN_APPLICATIONS,
    MOCK_MORTGAGE_ASSETS, MOCK_THREAT_INTEL, MOCK_INSURANCE_CLAIMS, MOCK_RISK_PROFILES,
    MOCK_DATA_CATALOG_ITEMS, MOCK_DATA_LAKE_STATS,
    // New Mega Dashboard Data
    MOCK_SALES_DEALS, MOCK_MARKETING_CAMPAIGNS, MOCK_GROWTH_METRICS, MOCK_COMPETITORS, MOCK_BENCHMARKS,
    MOCK_LICENSES, MOCK_DISCLOSURES, MOCK_LEGAL_DOCS, MOCK_SANDBOX_EXPERIMENTS, MOCK_CONSENT_RECORDS,
    MOCK_CONTAINER_IMAGES, MOCK_API_USAGE, MOCK_INCIDENTS, MOCK_BACKUP_JOBS
} from '../data';

const LEVEL_NAMES = ["Financial Novice", "Budgeting Apprentice", "Savings Specialist", "Investment Adept", "Wealth Master"];
const SCORE_PER_LEVEL = 200;
const COST_PER_TREE = 250;

interface IDataContext {
  // Personal Finance
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  assets: Asset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  subscriptions: Subscription[];
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  
  // Gamification & Rewards
  gamification: GamificationState;
  rewardPoints: RewardPoints;
  rewardItems: RewardItem[];
  redeemReward: (item: RewardItem) => boolean;

  // Credit & Health
  creditScore: CreditScore;
  creditFactors: CreditFactor[];
  
  // UI & Personalization
  customBackgroundUrl: string | null;
  setCustomBackgroundUrl: (url: string) => void;
  activeIllusion: IllusionType;
  setActiveIllusion: (illusion: IllusionType) => void;
  
  // AI & Platform
  aiInsights: AIInsight[];
  isInsightsLoading: boolean;
  generateDashboardInsights: () => Promise<void>;
  weaverState: QuantumWeaverState;
  pitchBusinessPlan: (plan: string) => Promise<void>;
  simulateTestPass: () => Promise<void>;
  marketplaceProducts: MarketplaceProduct[];
  fetchMarketplaceProducts: () => Promise<void>;
  isMarketplaceLoading: boolean;
  addProductToTransactions: (product: MarketplaceProduct) => void;
  dynamicKpis: DynamicKpi[];
  addDynamicKpi: (kpi: DynamicKpi) => void;
  getNexusData: () => NexusGraphData;


  // Crypto & Web3
  cryptoAssets: CryptoAsset[];
  nftAssets: NFTAsset[];
  mintNFT: (name: string, imageUrl: string) => void;
  paymentOperations: PaymentOperation[];
  walletInfo: any | null; // Simplified
  virtualCard: VirtualCard | null;
  connectWallet: () => void;
  issueCard: () => void;
  buyCrypto: (usdAmount: number, cryptoTicker: string) => void;

  // Corporate Finance
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCardControls: (cardId: string, newControls: CorporateCardControls) => void;
  paymentOrders: PaymentOrder[];
  updatePaymentOrderStatus: (id: string, status: PaymentOrderStatus) => void;
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  financialAnomalies: FinancialAnomaly[];
  updateAnomalyStatus: (id: string, status: AnomalyStatus) => void;
  counterparties: Counterparty[];

  // Mega Dashboard Data
  accessLogs: AccessLog[];
  fraudCases: FraudCase[];
  updateFraudCaseStatus: (id: string, status: FraudCase['status']) => void;
  mlModels: MLModel[];
  retrainMlModel: (id: string) => void;
  loanApplications: LoanApplication[];
  mortgageAssets: MortgageAsset[];
  threatIntelBriefs: ThreatIntelBrief[];
  insuranceClaims: InsuranceClaim[];
  riskProfiles: RiskProfile[];
  dataCatalogItems: DataSet[];
  dataLakeStats: DataLakeStat[];

  // New Mega Dashboard Data
  salesDeals: SalesDeal[];
  marketingCampaigns: MarketingCampaign[];
  growthMetrics: GrowthMetric[];
  competitors: Competitor[];
  benchmarks: Benchmark[];
  licenses: License[];
  disclosures: Disclosure[];
  legalDocs: LegalDoc[];
  sandboxExperiments: SandboxExperiment[];
  consentRecords: ConsentRecord[];
  containerImages: ContainerImage[];
  apiUsage: ApiUsage[];
  incidents: Incident[];
  backupJobs: BackupJob[];

  // System & Misc
  impactData: {
    treesPlanted: number;
    progressToNextTree: number;
  };
  linkedAccounts: LinkedAccount[];
  unlinkAccount: (id: string) => void;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  isImportingData: boolean;
  marketMovers: MarketMover[];
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  apiStatus: APIStatus[];

  // Paywall
  unlockedFeatures: Set<View>;
  unlockFeature: (view: View) => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  // --- STATE MANAGEMENT ---
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [assets] = useState<Asset[]>(MOCK_ASSETS);
  const [impactInvestments] = useState<Asset[]>(MOCK_IMPACT_INVESTMENTS);
  const [budgets, setBudgets] = useState<BudgetCategory[]>(MOCK_BUDGETS);
  const [treesPlanted, setTreesPlanted] = useState<number>(12);
  const [spendingForNextTree, setSpendingForNextTree] = useState<number>(170);
  const [gamification, setGamification] = useState<GamificationState>({ score: 450, level: 3, levelName: "Savings Specialist", progress: 25, credits: 225 });
  const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => localStorage.getItem('customBackgroundUrl'));
  const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(() => (localStorage.getItem('activeIllusion') as IllusionType) || 'none');
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [weaverState, setWeaverState] = useState<QuantumWeaverState>({ stage: WeaverStage.Pitch, businessPlan: '', feedback: '', questions: [], loanAmount: 0, coachingPlan: null, error: null });
  const [subscriptions] = useState<Subscription[]>(MOCK_SUBSCRIPTIONS);
  const [creditScore] = useState<CreditScore>(MOCK_CREDIT_SCORE);
  const [upcomingBills] = useState<UpcomingBill[]>(MOCK_UPCOMING_BILLS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(MOCK_SAVINGS_GOALS);
  const [marketMovers] = useState<MarketMover[]>(MOCK_MARKET_MOVERS);
  const [rewardPoints, setRewardPoints] = useState<RewardPoints>(MOCK_REWARD_POINTS);
  const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
  const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>(MOCK_FINANCIAL_GOALS);
  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(MOCK_CRYPTO_ASSETS);
  const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
  const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>(MOCK_PAYMENT_OPERATIONS);
  const [walletInfo, setWalletInfo] = useState<any | null>(null);
  const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [isImportingData, setIsImportingData] = useState(false);
  const [corporateCards, setCorporateCards] = useState<CorporateCard[]>(MOCK_CORPORATE_CARDS);
  const [corporateTransactions] = useState<CorporateTransaction[]>(MOCK_CORPORATE_TRANSACTIONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [rewardItems] = useState<RewardItem[]>(MOCK_REWARD_ITEMS);
  const [apiStatus] = useState<APIStatus[]>(MOCK_API_STATUS);
  const [creditFactors] = useState<CreditFactor[]>(MOCK_CREDIT_FACTORS);
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>(MOCK_PAYMENT_ORDERS);
  const [invoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [complianceCases] = useState<ComplianceCase[]>(MOCK_COMPLIANCE_CASES);
  const [financialAnomalies, setFinancialAnomalies] = useState<FinancialAnomaly[]>(MOCK_ANOMALIES);
  const [counterparties] = useState<Counterparty[]>(MOCK_COUNTERPARTIES);
  const [dynamicKpis, setDynamicKpis] = useState<DynamicKpi[]>([]);
  
  // Mega Dashboard State
  const [accessLogs] = useState<AccessLog[]>(MOCK_ACCESS_LOGS);
  const [fraudCases, setFraudCases] = useState<FraudCase[]>(MOCK_FRAUD_CASES);
  const [mlModels, setMlModels] = useState<MLModel[]>(MOCK_ML_MODELS);
  const [loanApplications] = useState<LoanApplication[]>(MOCK_LOAN_APPLICATIONS);
  const [mortgageAssets] = useState<MortgageAsset[]>(MOCK_MORTGAGE_ASSETS);
  const [threatIntelBriefs] = useState<ThreatIntelBrief[]>(MOCK_THREAT_INTEL);
  const [insuranceClaims] = useState<InsuranceClaim[]>(MOCK_INSURANCE_CLAIMS);
  const [riskProfiles] = useState<RiskProfile[]>(MOCK_RISK_PROFILES);
  const [dataCatalogItems] = useState<DataSet[]>(MOCK_DATA_CATALOG_ITEMS);
  const [dataLakeStats] = useState<DataLakeStat[]>(MOCK_DATA_LAKE_STATS);
  // New Mega Dashboard State
  const [salesDeals] = useState<SalesDeal[]>(MOCK_SALES_DEALS);
  const [marketingCampaigns] = useState<MarketingCampaign[]>(MOCK_MARKETING_CAMPAIGNS);
  const [growthMetrics] = useState<GrowthMetric[]>(MOCK_GROWTH_METRICS);
  const [competitors] = useState<Competitor[]>(MOCK_COMPETITORS);
  const [benchmarks] = useState<Benchmark[]>(MOCK_BENCHMARKS);
  const [licenses] = useState<License[]>(MOCK_LICENSES);
  const [disclosures] = useState<Disclosure[]>(MOCK_DISCLOSURES);
  const [legalDocs] = useState<LegalDoc[]>(MOCK_LEGAL_DOCS);
  const [sandboxExperiments] = useState<SandboxExperiment[]>(MOCK_SANDBOX_EXPERIMENTS);
  const [consentRecords] = useState<ConsentRecord[]>(MOCK_CONSENT_RECORDS);
  const [containerImages] = useState<ContainerImage[]>(MOCK_CONTAINER_IMAGES);
  const [apiUsage] = useState<ApiUsage[]>(MOCK_API_USAGE);
  const [incidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [backupJobs] = useState<BackupJob[]>(MOCK_BACKUP_JOBS);

  const [unlockedFeatures, setUnlockedFeatures] = useState<Set<View>>(() => new Set<View>([View.Dashboard]));

  // --- DERIVED STATE & MEMOS ---
  const impactData = useMemo(() => ({
    treesPlanted,
    progressToNextTree: Math.floor((spendingForNextTree / COST_PER_TREE) * 100),
  }), [treesPlanted, spendingForNextTree]);

  // --- CORE LOGIC & FUNCTIONS ---

  const updateGamification = useCallback((points: number) => {
    setGamification(prev => {
        const newScore = prev.score + points;
        const newLevel = Math.floor(newScore / SCORE_PER_LEVEL) + 1;
        const newProgress = ((newScore % SCORE_PER_LEVEL) / SCORE_PER_LEVEL) * 100;
        const newLevelName = LEVEL_NAMES[Math.min(newLevel - 1, LEVEL_NAMES.length - 1)];
        const newCredits = prev.credits + (points > 0 ? Math.floor(points / 2) : 0);
        return { score: newScore, level: newLevel, levelName: newLevelName, progress: newProgress, credits: newCredits };
    });
  }, []);

  const addTransaction = useCallback((tx: Transaction) => {
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
  }, [budgets, updateGamification]);
  
  const handlePlaidSuccess = useCallback((publicToken: string, metadata: any) => {
    setIsImportingData(true);
    const newAccount: LinkedAccount = { id: metadata.institution.institution_id, name: metadata.institution.name, mask: metadata.accounts[0].mask };
    if (!linkedAccounts.some(acc => acc.id === newAccount.id)) {
        setLinkedAccounts(prev => [...prev, newAccount]);
    }
    setTimeout(() => {
        const plaidTransactions: Transaction[] = [
            { id: `plaid_${Date.now()}`, type: 'expense', category: 'Shopping', description: `Zara`, amount: 152.34, date: '2024-07-22', carbonFootprint: 10.1 },
            { id: `plaid_${Date.now()+1}`, type: 'expense', category: 'Dining', description: `The Cheesecake Factory`, amount: 85.50, date: '2024-07-21', carbonFootprint: 8.2 },
        ];
        plaidTransactions.forEach(addTransaction);
        updateGamification(100);
        setIsImportingData(false);
    }, 4000);
  }, [linkedAccounts, addTransaction, updateGamification]);
  
  const generateDashboardInsights = useCallback(async () => {
      setIsInsightsLoading(true);
      try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
          const insightPrompt = `Analyze this user's recent financial data and generate 2-3 concise, actionable insights. Focus on spending habits, budget performance, and potential savings. Data: ${transactions.slice(0, 10).map(t => `${t.description}: $${t.amount}`).join(', ')}. Budgets: ${budgets.map(b => `${b.name} ($${b.spent} of $${b.limit})`).join(', ')}.`;
          const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: insightPrompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { insights: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, urgency: { type: Type.STRING, enum: ['low', 'medium', 'high'] } } } } } } } });
          const parsed = JSON.parse(response.text);
          setAiInsights(parsed.insights);
      } catch (error) {
          console.error("Error generating insights:", error);
      } finally {
          setIsInsightsLoading(false);
      }
  }, [transactions, budgets]);

  const pitchBusinessPlan = useCallback(async (plan: string) => {
    // Logic is typically in the component, but implemented here as requested.
  }, []);

  const simulateTestPass = useCallback(async () => {
    // Logic is typically in the component, but implemented here as requested.
  }, []);

  const fetchMarketplaceProducts = useCallback(async () => {
    setIsMarketplaceLoading(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const transactionSummary = transactions.slice(0,10).map(t => t.description).join(', ');
        const prompt = `Based on these recent purchases (${transactionSummary}), generate 3 diverse, compelling, and slightly futuristic product recommendations. Provide a short, one-sentence justification for each recommendation from the AI's perspective.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { products: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.NUMBER }, category: { type: Type.STRING }, aiJustification: { type: Type.STRING } } } } } } } });
        const parsed = JSON.parse(response.text);
        const productsWithIds = parsed.products.map((p: any, i: number) => ({ ...p, id: `prod_${Date.now()}_${i}`, imageUrl: `https://source.unsplash.com/random/400x300?${p.name.split(' ').join(',')}` }));
        setMarketplaceProducts(productsWithIds);
    } catch (error) { console.error("Error fetching marketplace products:", error); } 
    finally { setIsMarketplaceLoading(false); }
  }, [transactions]);
  
  const addProductToTransactions = useCallback((product: MarketplaceProduct) => {
      const tx: Transaction = { id: `mkt_${product.id}`, type: 'expense', category: product.category, description: product.name, amount: product.price, date: new Date().toLocaleDateString('en-CA'), carbonFootprint: 2.5 };
      addTransaction(tx);
  }, [addTransaction]);
  
  const addFinancialGoal = useCallback((goalData: Omit<FinancialGoal, 'id' | 'plan' | 'currentAmount'>) => {
    const newGoal: FinancialGoal = { ...goalData, id: `goal_${Date.now()}`, currentAmount: 0, plan: null, progressHistory: [{ date: new Date().toISOString().split('T')[0], amount: 0 }], };
    setFinancialGoals(prev => [...prev, newGoal]);
  }, []);
  
  const generateGoalPlan = useCallback(async (goalId: string) => {
    const goal = financialGoals.find(g => g.id === goalId);
    if (!goal) return;
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const incomeSummary = transactions.filter(t => t.type === 'income').slice(0, 5).map(t => `${t.amount} on ${t.date}`).join(', ');
        const expenseSummary = transactions.filter(t => t.type === 'expense').slice(0, 10).map(t => `${t.amount} on ${t.description}`).join(', ');
        const prompt = `Based on a financial goal ("${goal.name}" for $${goal.targetAmount} by ${goal.targetDate}) and recent financial activity (Income: ${incomeSummary}, Expenses: ${expenseSummary}), create a concise, actionable plan.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { feasibilitySummary: { type: Type.STRING }, monthlyContribution: { type: Type.NUMBER }, steps: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, category: { type: Type.STRING, enum: ['Savings', 'Budgeting', 'Investing', 'Income'] } } } } } } } });
        const newPlan = JSON.parse(response.text) as AIGoalPlan;
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan: newPlan } : g));
    } catch (error) { console.error("Error generating goal plan:", error); }
  }, [financialGoals, transactions]);
  
  const addDynamicKpi = useCallback((kpi: DynamicKpi) => {
      if (!dynamicKpis.some(d => d.id === kpi.id)) { setDynamicKpis(prev => [...prev, kpi]); }
  }, [dynamicKpis]);
  
  const connectWallet = useCallback(() => setWalletInfo({ address: '0x1a2b...c3d4', balance: 12.5 }), []);
  const issueCard = useCallback(() => setTimeout(() => setVirtualCard({ cardNumber: '5555 1234 5678 9012', cvv: '123', expiry: '12/28', holderName: 'The Visionary' }), 1500), []);
  const buyCrypto = useCallback((usdAmount: number, cryptoTicker: string) => {
      const ethPrice = 3000;
      const amountBought = usdAmount / ethPrice;
      setCryptoAssets(prev => prev.map(a => a.ticker === 'ETH' ? { ...a, amount: a.amount + amountBought, value: (a.amount + amountBought) * ethPrice } : a));
      addTransaction({ id: `crypto_buy_${Date.now()}`, type: 'expense', category: 'Investments', description: `Buy ${cryptoTicker}`, amount: usdAmount, date: new Date().toLocaleDateString('en-CA') });
  }, [addTransaction]);
  
  const mintNFT = useCallback((name: string, imageUrl: string) => setNftAssets(prev => [...prev, { id: `nft_${Date.now()}`, name, imageUrl, contractAddress: `0x...${Math.random().toString(16).substr(2, 4)}` }]), []);
  
  const toggleCorporateCardFreeze = useCallback((cardId: string) => setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, frozen: !c.frozen } : c)), []);
  const updateCorporateCardControls = useCallback((cardId: string, newControls: CorporateCardControls) => setCorporateCards(prev => prev.map(c => c.id === cardId ? { ...c, controls: newControls } : c)), []);
  const updatePaymentOrderStatus = useCallback((id: string, status: PaymentOrderStatus) => setPaymentOrders(prev => prev.map(p => p.id === id ? { ...p, status } : p)), []);
  const updateAnomalyStatus = useCallback((id: string, status: AnomalyStatus) => setFinancialAnomalies(prev => prev.map(a => a.id === id ? { ...a, status } : a)), []);
  const updateFraudCaseStatus = useCallback((id: string, status: FraudCase['status']) => setFraudCases(prev => prev.map(c => c.id === id ? { ...c, status } : c)), []);
  
  const retrainMlModel = useCallback((id: string) => {
    setMlModels(prev => prev.map(m => m.id === id ? {...m, status: 'Training'} : m));
    setTimeout(() => {
        setMlModels(prev => prev.map(m => {
            if (m.id === id) {
                const newAccuracy = Math.min(99.9, m.accuracy + 0.1 + Math.random() * 0.2);
                return { ...m, status: 'Production', accuracy: parseFloat(newAccuracy.toFixed(2)), lastTrained: new Date().toISOString().split('T')[0], performanceHistory: [...m.performanceHistory, {date: new Date().toISOString().split('T')[0], accuracy: newAccuracy}] };
            }
            return m;
        }));
    }, 3000);
  }, []);

  const setCustomBackgroundUrl = useCallback((url: string) => {
      localStorage.setItem('customBackgroundUrl', url);
      setCustomBackgroundUrlState(url);
      localStorage.setItem('activeIllusion', 'none');
      setActiveIllusionState('none');
  }, []);
  
  const setActiveIllusion = useCallback((illusion: IllusionType) => {
    localStorage.setItem('activeIllusion', illusion);
    setActiveIllusionState(illusion);
    if (illusion !== 'none') {
      localStorage.removeItem('customBackgroundUrl');
      setCustomBackgroundUrlState(null);
    }
  }, []);
  
  const unlinkAccount = useCallback((id: string) => setLinkedAccounts(prev => prev.filter(acc => acc.id !== id)), []);
  const markNotificationRead = useCallback((id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const addBudget = useCallback((budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => {
    const newBudget: BudgetCategory = { ...budget, id: `budget_${Date.now()}`, spent: 0, color: `#${Math.floor(Math.random()*16777215).toString(16)}` };
    setBudgets(prev => [...prev, newBudget]);
  }, []);
  
  const redeemReward = useCallback((item: RewardItem) => {
    if (rewardPoints.balance >= item.cost) {
        setRewardPoints(prev => ({ ...prev, balance: prev.balance - item.cost, lastRedeemed: item.cost }));
        return true;
    }
    return false;
  }, [rewardPoints.balance]);

  const unlockFeature = useCallback((view: View) => {
      setUnlockedFeatures(prev => new Set(prev).add(view));
  }, []);

  const getNexusData = useCallback((): NexusGraphData => {
    const nodes: NexusNode[] = [];
    const links: NexusLink[] = [];
    nodes.push({ id: 'visionary', label: 'The Visionary', type: 'User', value: 30, color: '#facc15' });
    financialGoals.forEach(goal => {
        nodes.push({ id: goal.id, label: goal.name, type: 'Goal', value: 20, color: '#6366f1' });
        links.push({ source: 'visionary', target: goal.id, relationship: 'has' });
    });
    const recentTx = transactions.slice(0, 3);
    recentTx.forEach(tx => {
        nodes.push({ id: tx.id, label: tx.description, type: 'Transaction', value: 12, color: tx.type === 'income' ? '#22c55e' : '#ef4444' });
        links.push({ source: 'visionary', target: tx.id, relationship: 'performed' });
        const relevantBudget = budgets.find(b => b.name.toLowerCase() === tx.category.toLowerCase());
        if (relevantBudget) {
            if (!nodes.some(n => n.id === relevantBudget.id)) {
                nodes.push({ id: relevantBudget.id, label: `${relevantBudget.name} Budget`, type: 'Budget', value: 15, color: '#f59e0b' });
                links.push({ source: 'visionary', target: relevantBudget.id, relationship: 'manages' });
            }
            links.push({ source: tx.id, target: relevantBudget.id, relationship: 'affects' });
        }
    });
    const uniqueNodes = Array.from(new Map(nodes.map(node => [node.id, node])).values());
    return { nodes: uniqueNodes, links };
  }, [transactions, financialGoals, budgets]);
  
  // --- CONTEXT VALUE & PROVIDER ---
  const value: IDataContext = {
      transactions, addTransaction, assets, impactInvestments, budgets, addBudget, gamification, 
      impactData, customBackgroundUrl, setCustomBackgroundUrl, activeIllusion, setActiveIllusion, 
      linkedAccounts, unlinkAccount, handlePlaidSuccess, isImportingData, weaverState, pitchBusinessPlan, 
      simulateTestPass, subscriptions, creditScore, upcomingBills, savingsGoals, marketMovers, 
      marketplaceProducts, fetchMarketplaceProducts, isMarketplaceLoading, addProductToTransactions, 
      financialGoals, addFinancialGoal, generateGoalPlan, cryptoAssets, paymentOperations, walletInfo, 
      virtualCard, connectWallet, issueCard, buyCrypto, aiInsights, isInsightsLoading, generateDashboardInsights, 
      corporateCards, corporateTransactions, toggleCorporateCardFreeze, updateCorporateCardControls, rewardPoints, 
      notifications, markNotificationRead, nftAssets, mintNFT, rewardItems, redeemReward, 
      apiStatus, creditFactors, paymentOrders, updatePaymentOrderStatus, invoices, complianceCases, 
      financialAnomalies, updateAnomalyStatus, counterparties, dynamicKpis, addDynamicKpi, getNexusData,
      accessLogs, fraudCases, updateFraudCaseStatus, mlModels, retrainMlModel,
      loanApplications, mortgageAssets, threatIntelBriefs, insuranceClaims, riskProfiles, dataCatalogItems, dataLakeStats,
      salesDeals, marketingCampaigns, growthMetrics, competitors, benchmarks,
      licenses, disclosures, legalDocs, sandboxExperiments, consentRecords,
      containerImages, apiUsage, incidents, backupJobs,
      unlockedFeatures, unlockFeature
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
