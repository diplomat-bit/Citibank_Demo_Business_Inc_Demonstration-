// @/context/DataContext.tsx
// --- The Live Data Nexus: All Data Fetching, State, and API Interactions ---
// This file has been completely refactored to be the application's live data layer.
// It removes all mock data imports and implements real-time data fetching from a backend server.
// It manages loading/error states and provides functions to mutate data via API calls.

import React, { createContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
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
    NexusNode, NexusLink,
    SalesDeal, MarketingCampaign, GrowthMetric, Competitor, Benchmark,
    License, Disclosure, LegalDoc, SandboxExperiment, ConsentRecord,
    ContainerImage, ApiUsage, Incident, BackupJob,
    PayRun, Project, Course, Employee, PortfolioAsset
} from '../types'; 

interface IDataContext {
  // Loading & Error states
  isLoading: boolean;
  error: string | null;

  // Personal Finance
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  assets: Asset[];
  portfolioAssets: PortfolioAsset[];
  impactInvestments: Asset[];
  budgets: BudgetCategory[];
  addBudget: (budget: Omit<BudgetCategory, 'id' | 'spent' | 'color'>) => void;
  financialGoals: FinancialGoal[];
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'progressHistory'>) => void;
  generateGoalPlan: (goalId: string) => Promise<void>;
  subscriptions: Subscription[];
  upcomingBills: UpcomingBill[];
  savingsGoals: SavingsGoal[];
  
  // Gamification & Rewards
  gamification: GamificationState | null;
  rewardPoints: RewardPoints | null;
  rewardItems: RewardItem[];
  redeemReward: (item: RewardItem) => boolean;
  
  // Credit & Health
  creditScore: CreditScore | null;
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
  marketplaceProducts: MarketplaceProduct[];
  isMarketplaceLoading: boolean;
  fetchMarketplaceProducts: () => Promise<void>;
  addProductToTransactions: (product: MarketplaceProduct) => void;
  dynamicKpis: DynamicKpi[];
  addDynamicKpi: (kpi: DynamicKpi) => void;
  getNexusData: () => NexusGraphData;


  // Crypto & Web3
  cryptoAssets: CryptoAsset[];
  nftAssets: NFTAsset[];
  paymentOperations: PaymentOperation[];
  walletInfo: any | null; // Simplified
  connectWallet: () => void;
  virtualCard: VirtualCard | null;
  issueCard: () => void;
  buyCrypto: (amount: number, currency: string) => void;
  mintNFT: (name: string, imageUrl: string) => void;

  // Corporate Finance
  corporateCards: CorporateCard[];
  corporateTransactions: CorporateTransaction[];
  paymentOrders: PaymentOrder[];
  updatePaymentOrderStatus: (orderId: string, status: PaymentOrderStatus) => void;
  invoices: Invoice[];
  complianceCases: ComplianceCase[];
  financialAnomalies: FinancialAnomaly[];
  updateAnomalyStatus: (anomalyId: string, status: AnomalyStatus) => void;
  counterparties: Counterparty[];
  toggleCorporateCardFreeze: (cardId: string) => void;
  updateCorporateCardControls: (cardId: string, controls: CorporateCardControls) => void;
  payRuns: PayRun[];


  // Mega Dashboard Data
  accessLogs: AccessLog[];
  fraudCases: FraudCase[];
  updateFraudCaseStatus: (caseId: string, status: FraudCase['status']) => void;
  mlModels: MLModel[];
  retrainMlModel: (modelId: string) => void;
  loanApplications: LoanApplication[];
  mortgageAssets: MortgageAsset[];
  threatIntelBriefs: ThreatIntelBrief[];
  insuranceClaims: InsuranceClaim[];
  riskProfiles: RiskProfile[];
  dataCatalogItems: DataSet[];
  dataLakeStats: DataLakeStat[];
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

  // Demo Bank Platform
  projects: Project[];
  courses: Course[];
  employees: Employee[];

  // System & Misc
  impactData: { treesPlanted: number; progressToNextTree: number; };
  linkedAccounts: LinkedAccount[];
  isImportingData: boolean;
  handlePlaidSuccess: (publicToken: string, metadata: any) => void;
  unlinkAccount: (accountId: string) => void;
  marketMovers: MarketMover[];
  notifications: Notification[];
  markNotificationRead: (notificationId: string) => void;
  apiStatus: APIStatus[];

  // Paywall
  unlockedFeatures: Set<View>;
  unlockFeature: (view: View) => void;

  // API Key Management
  apiKey: string | null;
  generateApiKey: () => Promise<string | null>;

  // New functions to interact with backend
  refetchData: () => void;
}

export const DataContext = createContext<IDataContext | undefined>(undefined);

const API_BASE_URL = 'http://localhost:3001';

// Helper for API calls
const apiFetch = async (endpoint: string, options?: RequestInit) => {
    const headers = new Headers(options?.headers);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        throw new Error(`API Error on ${endpoint}: ${response.status} ${response.statusText || 'File not found'}`);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    // All data states, initialized as empty
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([]);
    const [budgets, setBudgets] = useState<BudgetCategory[]>([]);
    const [impactInvestments, setImpactInvestments] = useState<Asset[]>([]);
    const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [upcomingBills, setUpcomingBills] = useState<UpcomingBill[]>([]);
    const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
    const [gamification, setGamification] = useState<GamificationState | null>(null);
    const [rewardPoints, setRewardPoints] = useState<RewardPoints | null>(null);
    const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
    const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
    const [creditFactors, setCreditFactors] = useState<CreditFactor[]>([]);
    const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
    const [isInsightsLoading, setIsInsightsLoading] = useState(false);
    const [marketplaceProducts, setMarketplaceProducts] = useState<MarketplaceProduct[]>([]);
    const [isMarketplaceLoading, setIsMarketplaceLoading] = useState(false);
    const [dynamicKpis, setDynamicKpis] = useState<DynamicKpi[]>([]);
    const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>([]);
    const [nftAssets, setNftAssets] = useState<NFTAsset[]>([]);
    const [paymentOperations, setPaymentOperations] = useState<PaymentOperation[]>([]);
    const [walletInfo, setWalletInfo] = useState<any | null>(null);
    const [virtualCard, setVirtualCard] = useState<VirtualCard | null>(null);
    const [corporateCards, setCorporateCards] = useState<CorporateCard[]>([]);
    const [corporateTransactions, setCorporateTransactions] = useState<CorporateTransaction[]>([]);
    const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [complianceCases, setComplianceCases] = useState<ComplianceCase[]>([]);
    const [financialAnomalies, setFinancialAnomalies] = useState<FinancialAnomaly[]>([]);
    const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
    const [payRuns, setPayRuns] = useState<PayRun[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
    const [fraudCases, setFraudCases] = useState<FraudCase[]>([]);
    const [mlModels, setMlModels] = useState<MLModel[]>([]);
    const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([]);
    const [mortgageAssets, setMortgageAssets] = useState<MortgageAsset[]>([]);
    const [threatIntelBriefs, setThreatIntelBriefs] = useState<ThreatIntelBrief[]>([]);
    const [insuranceClaims, setInsuranceClaims] = useState<InsuranceClaim[]>([]);
    const [riskProfiles, setRiskProfiles] = useState<RiskProfile[]>([]);
    const [dataCatalogItems, setDataCatalogItems] = useState<DataSet[]>([]);
    const [dataLakeStats, setDataLakeStats] = useState<DataLakeStat[]>([]);
    const [salesDeals, setSalesDeals] = useState<SalesDeal[]>([]);
    const [marketingCampaigns, setMarketingCampaigns] = useState<MarketingCampaign[]>([]);
    const [growthMetrics, setGrowthMetrics] = useState<GrowthMetric[]>([]);
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
    const [licenses, setLicenses] = useState<License[]>([]);
    const [disclosures, setDisclosures] = useState<Disclosure[]>([]);
    const [legalDocs, setLegalDocs] = useState<LegalDoc[]>([]);
    const [sandboxExperiments, setSandboxExperiments] = useState<SandboxExperiment[]>([]);
    const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
    const [containerImages, setContainerImages] = useState<ContainerImage[]>([]);
    const [apiUsage, setApiUsage] = useState<ApiUsage[]>([]);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
    const [impactData, setImpactData] = useState({ treesPlanted: 0, progressToNextTree: 0 });
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
    const [isImportingData, setIsImportingData] = useState(false);
    const [marketMovers, setMarketMovers] = useState<MarketMover[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [apiStatus, setApiStatus] = useState<APIStatus[]>([]);
    
    const [customBackgroundUrl, setCustomBackgroundUrlState] = useState<string | null>(() => localStorage.getItem('customBackgroundUrl'));
    const [activeIllusion, setActiveIllusionState] = useState<IllusionType>(() => (localStorage.getItem('activeIllusion') as IllusionType) || 'none');
    const [unlockedFeatures, setUnlockedFeatures] = useState<Set<View>>(() => new Set<View>([View.Dashboard, View.DeveloperApiKeys]));
    const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('apiKey'));
    
     const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [personal, corporate, system, mega, payroll, platform] = await Promise.all([
                apiFetch('/api/personal/data'),
                apiFetch('/api/corporate/dashboard'),
                apiFetch('/api/system/all'),
                apiFetch('/api/megadashboard/all'),
                apiFetch('/api/corporate/payroll'),
                apiFetch('/api/platform/all'),
            ]);
            
            setTransactions(personal.transactions || []);
            setAssets(personal.assets || []);
            setPortfolioAssets(personal.portfolioAssets || []);
            setBudgets(personal.budgets.map((b: any) => ({...b, limit: b.limit_val})) || []);
            setImpactInvestments(personal.impactInvestments || []);
            setFinancialGoals(personal.financialGoals || []);
            setSubscriptions(personal.subscriptions || []);
            setUpcomingBills(personal.upcomingBills || []);
            setSavingsGoals(personal.savingsGoals || []);
            setGamification(personal.gamification || null);
            setRewardPoints(personal.rewardPoints || null);
            setRewardItems(personal.rewardItems || []);
            setCreditScore(personal.creditScore || null);
            setCreditFactors(personal.creditFactors || []);
            setAiInsights(personal.aiInsights || []);
            setCryptoAssets(personal.cryptoAssets || []);
            setNftAssets(personal.nftAssets || []);
            setPaymentOperations(personal.paymentOperations || []);
            setLinkedAccounts(personal.linkedAccounts || []);
            setNotifications(personal.notifications || []);
            
            setCorporateCards(corporate.corporateCards || []);
            setCorporateTransactions(corporate.corporateTransactions || []);
            setPaymentOrders(corporate.paymentOrders || []);
            setInvoices(corporate.invoices || []);
            setComplianceCases(corporate.complianceCases || []);
            setFinancialAnomalies(corporate.financialAnomalies || []);
            setCounterparties(corporate.counterparties || []);
            setPayRuns(payroll.payRuns || []);

            setProjects(platform.projects || []);
            setCourses(platform.courses || []);
            setEmployees(platform.employees || []);
            
            setMarketMovers(system.marketMovers || []);
            setApiStatus(system.apiStatus || []);
            
            setAccessLogs(mega.accessLogs || []);
            setFraudCases(mega.fraudCases || []);
            setMlModels(mega.mlModels || []);
            setLoanApplications(mega.loanApplications || []);
            setMortgageAssets(mega.mortgageAssets || []);
            setThreatIntelBriefs(mega.threatIntelBriefs || []);
            setInsuranceClaims(mega.insuranceClaims || []);
            setRiskProfiles(mega.riskProfiles || []);
            setDataCatalogItems(mega.dataCatalogItems || []);
            setDataLakeStats(mega.dataLakeStats || []);
            setSalesDeals(mega.salesDeals || []);
            setMarketingCampaigns(mega.marketingCampaigns || []);
            setGrowthMetrics(mega.growthMetrics || []);
            setCompetitors(mega.competitors || []);
            setBenchmarks(mega.benchmarks || []);
            setLicenses(mega.licenses || []);
            setDisclosures(mega.disclosures || []);
            setLegalDocs(mega.legalDocs || []);
            setSandboxExperiments(mega.sandboxExperiments || []);
            setConsentRecords(mega.consentRecords || []);
            setContainerImages(mega.containerImages || []);
            setApiUsage(mega.apiUsage || []);
            setIncidents(mega.incidents || []);
            setBackupJobs(mega.backupJobs || []);
            
            setImpactData(personal.impactData || { treesPlanted: 0, progressToNextTree: 0 });

        } catch (err: any) {
            console.error("Failed to fetch data:", err);
            setError(err.message || "Could not connect to the server. Please ensure it's running.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateApiKey = async (): Promise<string | null> => {
        try {
            // This is a temporary measure. In a real app, the API key would be passed
            // in headers for subsequent requests.
            const data = await apiFetch('/api/auth/generate-key', { method: 'POST' });
            const key = data.apiKey;
            if(key) {
                localStorage.setItem('apiKey', key);
                setApiKey(key);
                // After getting a key, we can now fetch the actual data.
                fetchData();
                return key;
            }
            return null;
        } catch(err: any) {
            setError("Could not generate API key. Is the server running?");
            return null;
        }
    };


    useEffect(() => {
        // Only fetch data if we already have an API key.
        // Otherwise, the user will be prompted to generate one.
        if (apiKey) {
            fetchData();
        } else {
            setIsLoading(false); // Not loading if we don't have a key
        }
    }, [apiKey, fetchData]);
    
    const addTransaction = useCallback(async (tx: Omit<Transaction, 'id'>) => {
        try {
            await apiFetch('/api/personal/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tx),
            });
            await fetchData();
        } catch (err: any) { setError(err.message); }
    }, [fetchData]);

    const addProductToTransactions = useCallback((product: MarketplaceProduct) => {
        const newTx: Omit<Transaction, 'id'> = { type: 'expense', category: 'Shopping', description: product.name, amount: product.price, date: new Date().toISOString().split('T')[0] };
        addTransaction(newTx);
    }, [addTransaction]);
    
    const addBudget = useCallback((budget: Omit<BudgetCategory, 'id'|'spent'|'color'>) => {
        const newBudget: BudgetCategory = { ...budget, id: `budget_${Date.now()}`, spent: 0, color: '#8b5cf6' };
        setBudgets(prev => [...prev, newBudget]);
    }, []);

    const unlinkAccount = useCallback((accountId: string) => setLinkedAccounts(prev => prev.filter(acc => acc.id !== accountId)), []);

    const handlePlaidSuccess = useCallback(async (publicToken: string, metadata: any) => {
        setIsImportingData(true);
        await new Promise(res => setTimeout(res, 2000)); 
        await fetchData();
        setIsImportingData(false);
    }, [fetchData]);

    const markNotificationRead = useCallback((notificationId: string) => setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n)), []);
    
    const redeemReward = useCallback((item: RewardItem) => {
        if (rewardPoints && rewardPoints.balance >= item.cost) {
            setRewardPoints(prev => prev ? ({ ...prev, balance: prev.balance - item.cost }) : null);
            return true;
        }
        return false;
    }, [rewardPoints]);

    const updatePaymentOrderStatus = useCallback((orderId: string, status: PaymentOrderStatus) => setPaymentOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o)), []);
    const updateAnomalyStatus = useCallback((anomalyId: string, status: AnomalyStatus) => setFinancialAnomalies(prev => prev.map(a => a.id === anomalyId ? { ...a, status } : a)), []);
    const connectWallet = useCallback(() => setWalletInfo({ address: '0x1234...abcd', balance: 1.25 }), []);
    const issueCard = useCallback(() => setVirtualCard({ cardNumber: '**** **** **** 1234', cvv: '123', expiry: '12/28', holderName: 'The Visionary' }), []);
    const buyCrypto = useCallback((amount: number, currency: string) => addTransaction({ type: 'expense', category: 'Investments', description: `Buy ${currency}`, amount: amount, date: new Date().toISOString().split('T')[0] }), [addTransaction]);
    const mintNFT = useCallback((name: string, imageUrl: string) => setNftAssets(prev => [...prev, { id: `nft_${Date.now()}`, name, imageUrl, contractAddress: '0xabcd...1234' }]), []);
    const addFinancialGoal = useCallback((goal: Omit<FinancialGoal, 'id' | 'currentAmount' | 'plan' | 'progressHistory'>) => setFinancialGoals(prev => [...prev, { ...goal, id: `goal_${Date.now()}`, currentAmount: 0, plan: null }]), []);
    const generateGoalPlan = useCallback(async (goalId: string) => {
        const goal = financialGoals.find(g => g.id === goalId);
        if (!goal) return;
        await new Promise(res => setTimeout(res, 1500));
        const mockPlan: AIGoalPlan = { feasibilitySummary: "This goal is achievable.", monthlyContribution: (goal.targetAmount - goal.currentAmount) / 36, steps: [] };
        setFinancialGoals(prev => prev.map(g => g.id === goalId ? { ...g, plan: mockPlan } : g));
    }, [financialGoals]);
    
    const retrainMlModel = useCallback((modelId: string) => {
        setMlModels(prev => prev.map(m => m.id === modelId ? {...m, status: 'Training'} : m));
        setTimeout(() => setMlModels(prev => prev.map(m => m.id === modelId ? {...m, status: 'Production', accuracy: m.accuracy + 0.1} : m)), 3000);
    }, []);
    const updateFraudCaseStatus = useCallback((caseId: string, status: FraudCase['status']) => setFraudCases(prev => prev.map(c => c.id === caseId ? {...c, status} : c)), []);
    const toggleCorporateCardFreeze = useCallback((cardId: string) => setCorporateCards(prev => prev.map(c => c.id === cardId ? {...c, frozen: !c.frozen} : c)), []);
    const updateCorporateCardControls = useCallback((cardId: string, controls: CorporateCardControls) => setCorporateCards(prev => prev.map(c => c.id === cardId ? {...c, controls} : c)), []);
    const generateDashboardInsights = useCallback(async () => {}, []);

    const fetchMarketplaceProducts = useCallback(async () => {
        if (transactions.length === 0) return;
        setIsMarketplaceLoading(true);
        setError('');
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const transactionSummary = transactions.slice(0, 10).map(t => t.description).join(', ');
            const prompt = `Based on these recent purchases (${transactionSummary}), generate 5 diverse, compelling product recommendations. Provide a short, one-sentence justification for each.`;
            const responseSchema = { type: Type.OBJECT, properties: { products: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, price: { type: Type.NUMBER }, category: { type: Type.STRING }, aiJustification: { type: Type.STRING } } } } } };
            const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: "application/json", responseSchema: responseSchema }});
            const parsed = JSON.parse(response.text);
            const productsWithIds = parsed.products.map((p: any, i: number) => ({ ...p, id: `prod_${Date.now()}_${i}`, imageUrl: `https://source.unsplash.com/random/400x300?${p.name.split(' ').join(',')}` }));
            setMarketplaceProducts(productsWithIds);
        } catch (error) {
            console.error("Error fetching marketplace products:", error);
            setError("Plato AI encountered an error while curating your products.");
        } finally {
            setIsMarketplaceLoading(false);
        }
    }, [transactions]);

    const getNexusData = useCallback((): NexusGraphData => {
        const nodes: NexusNode[] = [];
        const links: NexusLink[] = [];
        if (!transactions || !financialGoals || !budgets) return { nodes, links };
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

    const unlockFeature = useCallback((view: View) => {
      setUnlockedFeatures(prev => new Set(prev).add(view));
    }, []);
    
    const addDynamicKpi = (kpi: DynamicKpi) => setDynamicKpis(prev => [...prev, kpi]);
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
  
    const value: IDataContext = {
        isLoading, error, refetchData: fetchData,
        transactions, addTransaction, assets, portfolioAssets, impactInvestments, budgets, addBudget, 
        financialGoals, addFinancialGoal, generateGoalPlan, subscriptions, upcomingBills, savingsGoals, gamification, 
        rewardPoints, rewardItems, redeemReward, creditScore, creditFactors, customBackgroundUrl, 
        setCustomBackgroundUrl, activeIllusion, setActiveIllusion, aiInsights, 
        isInsightsLoading, generateDashboardInsights, marketplaceProducts, 
        isMarketplaceLoading, fetchMarketplaceProducts, addProductToTransactions, dynamicKpis, addDynamicKpi, getNexusData,
        cryptoAssets, nftAssets, paymentOperations, walletInfo, connectWallet, virtualCard, issueCard, buyCrypto, mintNFT,
        corporateCards, corporateTransactions, paymentOrders, updatePaymentOrderStatus, invoices, complianceCases,
        financialAnomalies, updateAnomalyStatus, counterparties, toggleCorporateCardFreeze, updateCorporateCardControls, payRuns,
        projects, courses, employees,
        accessLogs, fraudCases, updateFraudCaseStatus, mlModels, retrainMlModel,
        loanApplications, mortgageAssets, threatIntelBriefs, insuranceClaims,
        riskProfiles, dataCatalogItems, dataLakeStats, salesDeals, marketingCampaigns,
        growthMetrics, competitors, benchmarks, licenses, disclosures, legalDocs,
        sandboxExperiments, consentRecords, containerImages, apiUsage, incidents, backupJobs,
        impactData, linkedAccounts, isImportingData, handlePlaidSuccess, unlinkAccount, marketMovers, notifications, markNotificationRead, apiStatus,
        unlockedFeatures, unlockFeature, apiKey, generateApiKey
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
