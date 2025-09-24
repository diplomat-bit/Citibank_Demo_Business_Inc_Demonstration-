// types/ui.ts

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


export enum WeaverStage {
    Pitch = 'pitch',
    Analysis = 'analysis',
    Test = 'test',
    FinalReview = 'final_review',
    Approved = 'approved',
    Error = 'error',
}
