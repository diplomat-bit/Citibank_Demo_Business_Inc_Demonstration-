// types/ui.ts

/**
 * @description Defines every possible view/page in the application.
 * This enum is the single source of truth for navigation state.
 */
export enum View {
    // Personal Finance
    Dashboard = 'dashboard',
    TheNexus = 'the-nexus', // The 27th Module
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

    // Demo Bank Platform Suite
    DemoBankSocial = 'db-social',
    DemoBankERP = 'db-erp',
    DemoBankCRM = 'db-crm',
    DemoBankAPIGateway = 'db-api-gateway',
    DemoBankGraphExplorer = 'db-graph-explorer',
    DemoBankDBQL = 'db-dbql',
    DemoBankCloud = 'db-cloud',
    DemoBankIdentity = 'db-identity',
    DemoBankStorage = 'db-storage',
    DemoBankCompute = 'db-compute',
    DemoBankAIPlatform = 'db-ai-platform',
    DemoBankMachineLearning = 'db-ml',
    DemoBankDevOps = 'db-devops',
    DemoBankSecurityCenter = 'db-security-center',
    DemoBankComplianceHub = 'db-compliance-hub',
    DemoBankAppMarketplace = 'db-app-marketplace',
    DemoBankConnect = 'db-connect',
    DemoBankEvents = 'db-events',
    DemoBankLogicApps = 'db-logic-apps',
    DemoBankFunctions = 'db-functions',
    DemoBankDataFactory = 'db-data-factory',
    DemoBankAnalytics = 'db-analytics',
    DemoBankBI = 'db-bi',
    DemoBankIoTHub = 'db-iot-hub',
    DemoBankMaps = 'db-maps',
    DemoBankCommunications = 'db-communications',
    DemoBankCommerce = 'db-commerce',
    DemoBankTeams = 'db-teams',
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