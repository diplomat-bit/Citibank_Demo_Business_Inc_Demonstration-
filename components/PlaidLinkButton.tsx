```tsx
import React, { useState, useEffect, createContext, useContext, useReducer, useRef } from 'react';

// ================================================================================================
// GLOBAL TYPES AND INTERFACES (Expanded for universe scope)
// ================================================================================================

export type PlaidEnvironment = 'sandbox' | 'development' | 'production';
export type PlaidProduct = 'transactions' | 'auth' | 'identity' | 'investments' | 'assets' | 'liabilities' | 'income' | 'payment_initiation' | 'employment';
export type AccountType = 'depository' | 'credit' | 'loan' | 'investment' | 'brokerage' | 'other';
export type AccountSubType = 'checking' | 'savings' | 'cd' | 'money market' | 'prepaid' | 'cash management' | 'credit card' | 'paypal' | 'mortgage' | 'auto' | 'student' | 'personal' | 'commercial' | 'ira' | '401k' | 'pension' | 'stock' | 'mutual fund' | 'etf' | 'crypto' | 'other';
export type TransactionCategory = 'uncategorized' | 'food_dining' | 'transportation' | 'housing' | 'utilities' | 'healthcare' | 'entertainment' | 'shopping' | 'education' | 'personal_care' | 'income' | 'investments' | 'debt_payments' | 'transfers' | 'travel' | 'fees' | 'business_expenses' | 'gifts' | 'charity' | 'other_expenses';
export type FinancialGoalType = 'savings' | 'debt_reduction' | 'investment' | 'emergency_fund' | 'retirement';
export type TransactionStatus = 'pending' | 'posted' | 'cancelled';
export type AIInsightType = 'spending_alert' | 'budget_deviation' | 'saving_tip' | 'investment_opportunity' | 'subscription_detected' | 'debt_optimization' | 'fraud_alert' | 'bill_reminder' | 'tax_advice';
export type WebhookEventType = 'TRANSACTIONS_UNAVAILABLE' | 'TRANSACTIONS_REMOVED' | 'TRANSACTIONS_NEW' | 'TRANSACTIONS_SYNC_UPDATES' | 'ITEM_ERROR' | 'ITEM_LOGIN_REQUIRED' | 'ITEM_UNLINKED' | 'ITEM_UPDATE_REQUESTED' | 'AUTH_DATA_UPDATE' | 'INVESTMENTS_UPDATES_AVAILABLE' | 'INCOME_VERIFICATION_UPDATES_AVAILABLE' | 'ASSETS_PRODUCT_READY';
export type BudgetFrequency = 'weekly' | 'bi-weekly' | 'monthly' | 'annually';

export interface PlaidLinkButtonProps {
    onSuccess: (publicToken: string, metadata: PlaidLinkSuccessMetadata) => void;
    onExit?: (error: PlaidLinkError | null, metadata: PlaidLinkExitMetadata) => void;
    onEvent?: (eventName: string, metadata: any) => void; // For more detailed Plaid Link events
    linkToken?: string; // Optional: if a link token is already generated server-side
    products?: PlaidProduct[]; // Custom products for the Plaid Link flow
    countryCodes?: string[]; // Custom country codes
    language?: string; // Custom language
    user?: { // User identity for personalized flow
        client_user_id: string;
        legal_name?: string;
        email_address?: string;
    };
    environment?: PlaidEnvironment; // Specifies the Plaid environment
    oauthNonce?: string; // For OAuth flows
    oauthRedirectUri?: string; // For OAuth flows
    institutionId?: string; // Pre-select an institution
    paymentId?: string; // For payment initiation
    isUpdateMode?: boolean; // For re-authenticating an existing item
    accessToken?: string; // Access token for update mode
}

export interface PlaidLinkSuccessMetadata {
    institution: {
        name: string;
        institution_id: string;
    };
    accounts: Array<{
        id: string;
        name: string;
        mask: string; // Last 4 digits
        type: AccountType;
        subtype: AccountSubType;
        verification_status?: string;
    }>;
    link_session_id: string;
    products: PlaidProduct[];
    user_id: string;
    public_token_id: string; // Unique ID for the public token
}

export interface PlaidLinkExitMetadata {
    request_id?: string;
    institution?: {
        name: string;
        institution_id: string;
    };
    link_session_id: string;
    status?: string; // e.g., 'requires_credentials', 'institution_unsupported'
    error_code?: string;
    error_message?: string;
    error_type?: string;
    exit_status?: string;
    flow_type?: 'LOGIN' | 'CREATE_ACCOUNT' | 'MFA' | 'ERROR';
}

export interface PlaidLinkError {
    error_code: string;
    error_message: string;
    error_type: string;
    display_message: string | null;
    request_id: string;
    causes: any[]; // Detailed error causes
    status_code: number;
}

export interface LinkedInstitution {
    id: string; // Plaid Item ID
    name: string;
    institutionId: string; // Plaid Institution ID
    accessToken: string; // Stored securely, but simulated here
    connectedAccounts: FinancialAccount[];
    metadata: PlaidLinkSuccessMetadata;
    lastUpdated: Date;
    status: 'connected' | 'reauth_required' | 'error' | 'disconnected';
    securityAuditLog: Array<{ timestamp: Date; event: string; details: string }>;
}

export interface FinancialAccount {
    id: string; // Plaid Account ID
    institutionId: string; // ID of the linked institution
    name: string;
    officialName?: string;
    mask: string; // Last 4 digits
    type: AccountType;
    subtype: AccountSubType;
    currentBalance: number;
    availableBalance: number;
    currency: string;
    limit?: number; // For credit accounts
    balanceHistory: { date: string; balance: number; }[]; // Daily balance snapshots
    isLinked: boolean;
    isActive: boolean;
    syncStatus: 'synced' | 'pending' | 'error';
    lastSyncAttempt: Date;
    errorDetails?: string; // For sync errors
}

export interface Transaction {
    id: string; // Plaid Transaction ID
    accountId: string;
    institutionId: string;
    name: string; // Original description
    merchantName?: string; // Enriched merchant name
    amount: number;
    currency: string;
    date: string; // YYYY-MM-DD
    authorizedDate?: string;
    category: TransactionCategory;
    isPending: boolean;
    status: TransactionStatus;
    location?: {
        address?: string;
        city?: string;
        region?: string;
        postalCode?: string;
        country?: string;
        lat?: number;
        lon?: number;
    };
    paymentChannel?: string;
    personalFinanceCategory?: {
        primary: string;
        detailed: string;
    };
    isoCurrencyCode: string;
    logoUrl?: string; // Merchant logo
    website?: string; // Merchant website
    notes?: string; // User-added notes
    tags?: string[]; // User-defined tags
    isFlagged: boolean; // For user review
}

export interface Budget {
    id: string;
    name: string;
    category: TransactionCategory;
    amount: number; // Budgeted amount
    spent: number; // Current spent amount
    remaining: number;
    startDate: string;
    endDate: string;
    frequency: BudgetFrequency;
    alertsEnabled: boolean;
    alertThreshold?: number; // % of budget remaining
    isAchieved: boolean; // If budget was successfully maintained
    createdAt: Date;
    updatedAt: Date;
}

export interface FinancialGoal {
    id: string;
    name: string;
    type: FinancialGoalType;
    targetAmount: number;
    currentAmount: number;
    targetDate: string;
    progress: number; // percentage
    isAchieved: boolean;
    priority: 'low' | 'medium' | 'high';
    associatedAccounts: string[]; // Account IDs
    contributionSchedule?: {
        amount: number;
        frequency: BudgetFrequency;
    };
    createdAt: Date;
    updatedAt: Date;
    recommendations?: string[]; // AI recommendations for goal achievement
}

export interface AIInsight {
    id: string;
    type: AIInsightType;
    title: string;
    description: string;
    timestamp: Date;
    isRead: boolean;
    actionableItems?: string[]; // E.g., "Review subscription", "Adjust budget"
    relatedTransactionIds?: string[];
    severity: 'info' | 'warning' | 'critical';
}

export interface UserPreferences {
    theme: 'dark' | 'light' | 'system';
    currencySymbol: string;
    dateFormat: string;
    timeZone: string;
    notificationSettings: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
    aiRecommendationsEnabled: boolean;
    dataRetentionPolicy: 'standard' | 'extended'; // Conceptual: for compliance
    biometricAuthEnabled: boolean;
    voiceControlEnabled: boolean;
    preferredLanguage: string;
}

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    lastLogin: Date;
    preferences: UserPreferences;
    mfaEnabled: boolean;
    avatarUrl?: string;
    // For social finance
    connections?: string[]; // User IDs of connections
}

export interface DeveloperAPIKey {
    id: string;
    key: string; // Masked
    name: string;
    scopes: string[]; // e.g., 'read:transactions', 'write:goals'
    isActive: boolean;
    rateLimit: number; // requests per minute
    createdAt: Date;
    lastUsed: Date;
}

export interface CryptoWallet {
    id: string;
    name: string;
    address: string;
    platform: string; // e.g., 'MetaMask', 'Ledger', 'Coinbase Wallet'
    assets: {
        symbol: string;
        balance: number;
        usdValue: number;
        blockchain: string;
    }[];
    lastSynced: Date;
    status: 'connected' | 'disconnected' | 'error';
    securityAuditLog: Array<{ timestamp: Date; event: string; details: string }>;
}


// ================================================================================================
// SVG ICONS & LOGOS (Expanded with more services, conceptual for 10-year scope)
// ================================================================================================
const PlaidLogo = () => <svg width="88" height="34" viewBox="0 0 88 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M82.2 3.82c-3.32 0-5.83 2.5-5.83 5.82 0 3.31 2.51 5.82 5.83 5.82 3.31 0 5.82-2.5 5.82-5.82 0-3.31-2.51-5.82-5.82-5.82Zm0 9.14c-1.87 0-3.32-1.45-3.32-3.32 0-1.87 1.45-3.32 3.32-3.32 1.87 0 3.31-1.45 3.31-3.32 0-1.87-1.44-3.32-3.31-3.32-1.87 0-3.32-1.45-3.32-3.32s1.45-3.32 3.32-3.32 3.31 1.45 3.31 3.32c0 1.87 1.45 3.32 3.32 3.32s3.32-1.45 3.32-3.32-1.45-3.32-3.32-3.32-3.31-1.45-3.31-3.32c0-3.31 2.5-5.82 5.82-5.82s5.82 2.5 5.82 5.82-2.5 5.82-5.82 5.82c-1.87 0-3.32 1.45-3.32 3.31 0 1.87-1.45 3.32-3.32 3.32Z" fill="#fff"></path><path d="M25.86 10.93c0 4.14-3.55 7.4-7.93 7.4-4.39 0-7.94-3.26-7.94-7.4S13.54 3.53 17.93 3.53c4.38 0 7.93 3.26 7.93 7.4Zm-10.45 0c0 1.45 1.12 2.5 2.52 2.5 1.39 0 2.51-1.05 2.51-2.5 0-1.45-1.12-2.5-2.51-2.5-1.4 0-2.52 1.05-2.52 2.5Z" fill="#fff"></path><path d="M49.6 10.93c0 4.14-3.54 7.4-7.93 7.4-4.38 0-7.93-3.26-7.93-7.4S37.29 3.53 41.67 3.53c4.39 0 7.93 3.26 7.93 7.4Zm-10.45 0c0 1.45 1.12 2.5 2.52 2.5 1.4 0 2.52-1.05 2.52-2.5 0-1.45-1.12-2.5-2.52-2.5-1.4 0-2.52 1.05-2.52 2.5Z" fill="#fff"></path><path d="M68.8 3.82c-3.32 0-5.83 2.5-5.83 5.82 0 3.31 2.51 5.82 5.83 5.82 3.31 0 5.82-2.5 5.82-5.82 0-3.31-2.51-5.82-5.82-5.82Zm0 9.14c-1.87 0-3.32-1.45-3.32-3.32 0-1.87 1.45-3.32 3.32-3.32s3.31-1.45 3.31-3.32c0-1.87-1.44-3.32-3.31-3.32-1.87 0-3.32-1.45-3.32-3.32s1.45-3.32 3.32-3.32 3.31 1.45 3.31 3.32c0 1.87 1.45 3.32 3.32 3.32s3.32-1.45 3.32-3.32-1.45-3.32-3.32-3.32-3.31-1.45-3.31-3.32c0-3.31 2.5-5.82 5.82-5.82s5.82 2.5 5.82 5.82-2.5 5.82-5.82 5.82c-1.87 0-3.32 1.45-3.32 3.31 0 1.87-1.45 3.32-3.32 3.32Z" fill="#fff"></path><path d="M25.86 28.33c0 2.2-1.78 3.97-3.97 3.97h-7.93c-2.2 0-3.97-1.77-3.97-3.97v-7.93c0-2.2 1.78-3.97 3.97-3.97h7.93c2.2 0 3.97 1.77 3.97 3.97v7.93Z" fill="#fff"></path><path d="M17.93 25.43c-2.2 0-3.97-1.78-3.97-3.97s1.78-3.97 3.97-3.97 3.97 1.78 3.97 3.97-1.78 3.97-3.97 3.97Z" fill="#0D0F2A"></path><path d="M2.5 18.23c-1.4 0-2.5-1.12-2.5-2.51V2.5C0 1.1 1.1 0 2.5 0s2.5 1.1 2.5 2.5v13.22c0 1.39-1.1 2.51-2.5 2.51Z" fill="#fff"></path></svg>;
const ChaseLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#005EB8"></path><path d="m15.86 14.88-2.316-2.328 2.316-2.316a.428.428 0 0 0 0-.624l-.876-.876a.428.428 0 0 0-.624 0L12 11.052l-2.316-2.316a.428.428 0 0 0-.624 0l-.876.876a.428.428 0 0 0 0 .624l2.316 2.316-2.316 2.328a.428.428 0 0 0 0 .624l.876.876a.428.428 0 0 0 .624 0l2.316-2.328 2.316 2.328a.428.428 0 0 0 .624 0l.876-.876a.428.428 0 0 0 0-.624Z" fill="#fff"></path></svg>;
const BofALogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#E2001A"></path><path d="M4 11h16v2H4v-2Zm3 4h10v2H7v-2Zm1.5-8h7v2h-7V7Z" fill="#fff"></path></svg>;
const WellsFargoLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#D71E28"></path><path d="M12.3 4 8 13.3l-1.3-2.2L4 16h16l-4-6.7-1.3 2.2-2.4-7.5Z" fill="#FFC72C"></path></svg>;
const AmexLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#006FCF"></path><path d="M4 7h16v10H4V7Z" fill="#fff"></path><path d="M12 8.5 7.5 12l4.5 3.5v-7ZM12 8.5v7l4.5-3.5L12 8.5Z" fill="#006FCF"></path></svg>;
const CitiLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#003B70"></path><path d="M6.5 9.3c0-.3.2-.5.5-.5h10a.5.5 0 0 1 .5.5v5.4a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-5.4Z" fill="#fff"></path><path d="M12.5 8.2a1 1 0 0 0-2 0h2Zm-1 8.6a1 1 0 0 0 0-2v2Zm-1-8.6a1 1 0 1 0-2 0h2Zm-2 0v7.6h2V8.2h-2Zm1 8.6a1 1 0 0 0 2 0h-2Z" fill="#D71E28"></path></svg>;
const BinanceLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0ZM7 17l5-5-5-5H17l-5 5 5 5H7Z" fill="#F0B90B"></path></svg>;
const CoinbaseLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0ZM17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" fill="#0052FF"></path></svg>;
const VenmoLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0ZM10.5 17h-2L6 10v7H4V7h4.5L12 14V7h2v10h-3.5Z" fill="#3D95CE"></path></svg>;
const PaypalLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0ZM15 7H9.7c-1.8 0-3.3 1.5-3.3 3.3v3.4c0 1.8 1.5 3.3 3.3 3.3H15c1.8 0 3.3-1.5 3.3-3.3V10.3c0-1.8-1.5-3.3-3.3-3.3ZM12.7 15.6c-.3.3-.7.5-1.2.5s-.9-.2-1.2-.5c-.3-.3-.5-.7-.5-1.2v-3.4c0-.5.2-.9.5-1.2.3-.3.7-.5 1.2-.5s.9.2 1.2.5c.3.3.5.7.5 1.2v3.4c0 .5-.2.9-.5 1.2Z" fill="#003087"></path><path d="M12 14h-2.3c-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4v-2c0-.5.2-1 .6-1.4.4-.4.9-.6 1.4-.6H12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v2c0 .5-.2 1-.6 1.4-.4.4-.9.6-1.4.6Z" fill="#009CDE"></path><path d="M17 11.5c0-.5-.2-1-.6-1.4-.4-.4-.9-.6-1.4-.6H12v4h4.4c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4v-2Z" fill="#003087"></path></svg>;
const ZelleLogo = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12Z" fill="#6930B5"></path><path d="M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8ZM12 6c3.314 0 6 2.686 6 6s-2.686 6-6 6-6-2.686-6-6 2.686-6 6-6Z" fill="#FFCC00"></path><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="#6930B5"></path></svg>;

export const banks = [
    { name: 'Chase', logo: <ChaseLogo />, institution_id: 'ins_109960' },
    { name: 'Bank of America', logo: <BofALogo />, institution_id: 'ins_109950' },
    { name: 'Wells Fargo', logo: <WellsFargoLogo />, institution_id: 'ins_109980' },
    { name: 'American Express', logo: <AmexLogo />, institution_id: 'ins_100000' },
    { name: 'Citi', logo: <CitiLogo />, institution_id: 'ins_109970' },
    { name: 'Binance', logo: <BinanceLogo />, institution_id: 'crypto_binance' },
    { name: 'Coinbase', logo: <CoinbaseLogo />, institution_id: 'crypto_coinbase' },
    { name: 'Venmo', logo: <VenmoLogo />, institution_id: 'payment_venmo' },
    { name: 'Paypal', logo: <PaypalLogo />, institution_id: 'payment_paypal' },
    { name: 'Zelle', logo: <ZelleLogo />, institution_id: 'payment_zelle' },
];

// ================================================================================================
// PLAID AND FINANCIAL DATA SERVICES (Simulated Backend/API interactions)
// ================================================================================================

// This service simulates interaction with a backend that handles Plaid API calls
// and stores/processes financial data.
export class PlaidIntegrationService {
    private static instance: PlaidIntegrationService;
    private baseURL = '/api/plaid'; // Simulated API endpoint
    private financialDataStore: FinancialDataStore;

    private constructor(financialDataStore: FinancialDataStore) {
        this.financialDataStore = financialDataStore;
    }

    public static getInstance(financialDataStore: FinancialDataStore): PlaidIntegrationService {
        if (!PlaidIntegrationService.instance) {
            PlaidIntegrationService.instance = new PlaidIntegrationService(financialDataStore);
        }
        return PlaidIntegrationService.instance;
    }

    // Generates a mock Plaid Link token
    public async createLinkToken(userId: string, products: PlaidProduct[] = ['transactions'], countryCodes: string[] = ['US']): Promise<{ link_token: string; expiration: string; request_id: string; }> {
        console.log(`PlaidService: Generating link token for user ${userId} with products ${products.join(',')}`);
        // Simulate API call to your backend to get a Plaid Link token
        return new Promise(resolve => setTimeout(() => {
            resolve({
                link_token: `link-sandbox-${Math.random().toString(36).substring(2, 10)}`,
                expiration: new Date(Date.now() + 3600 * 1000).toISOString(),
                request_id: `req-${Math.random().toString(36).substring(2, 10)}`,
            });
        }, 500));
    }

    // Exchanges public token for access token and retrieves initial data
    public async exchangePublicToken(publicToken: string, metadata: PlaidLinkSuccessMetadata): Promise<LinkedInstitution> {
        console.log(`PlaidService: Exchanging public token: ${publicToken}`);
        // Simulate API call to your backend
        return new Promise(resolve => setTimeout(() => {
            const accessToken = `access-sandbox-${Math.random().toString(36).substring(2, 10)}`;
            const item: LinkedInstitution = {
                id: `item_${Math.random().toString(36).substring(7)}`,
                name: metadata.institution.name,
                institutionId: metadata.institution.institution_id,
                accessToken: accessToken,
                connectedAccounts: metadata.accounts.map(acc => ({
                    ...acc,
                    institutionId: metadata.institution.institution_id,
                    currentBalance: Math.floor(Math.random() * 50000) + 100, // Mock balance
                    availableBalance: Math.floor(Math.random() * 50000) + 50,
                    currency: 'USD',
                    balanceHistory: [], // Populated by sync
                    isLinked: true,
                    isActive: true,
                    syncStatus: 'synced',
                    lastSyncAttempt: new Date(),
                })),
                metadata: metadata,
                lastUpdated: new Date(),
                status: 'connected',
                securityAuditLog: [{ timestamp: new Date(), event: 'ITEM_CREATED', details: 'Initial link and token exchange.' }],
            };
            this.financialDataStore.addInstitution(item);
            resolve(item);
        }, 1500));
    }

    // Simulates fetching transactions for a linked institution
    public async getTransactions(institutionId: string, accessToken: string, startDate: string, endDate: string): Promise<Transaction[]> {
        console.log(`PlaidService: Fetching transactions for ${institutionId} from ${startDate} to ${endDate}`);
        // Simulate API call
        return new Promise(resolve => setTimeout(() => {
            const mockTransactions: Transaction[] = [];
            const account = this.financialDataStore.getInstitution(institutionId)?.connectedAccounts[0];
            if (account) {
                for (let i = 0; i < 10; i++) {
                    mockTransactions.push({
                        id: `txn_${Math.random().toString(36).substring(7)}`,
                        accountId: account.id,
                        institutionId: institutionId,
                        name: `Mock Transaction ${i + 1}`,
                        merchantName: ['Starbucks', 'Walmart', 'Amazon', 'Local Cafe', 'Netflix'][Math.floor(Math.random() * 5)],
                        amount: parseFloat((Math.random() * 100).toFixed(2)),
                        currency: 'USD',
                        date: new Date(Date.now() - i * 24 * 3600 * 1000).toISOString().split('T')[0],
                        category: ['food_dining', 'shopping', 'transportation', 'entertainment', 'utilities'][Math.floor(Math.random() * 5)] as TransactionCategory,
                        isPending: Math.random() > 0.8,
                        status: Math.random() > 0.8 ? 'pending' : 'posted',
                        isoCurrencyCode: 'USD',
                        personalFinanceCategory: {
                            primary: 'Food & Drink',
                            detailed: 'Restaurants',
                        },
                    });
                }
            }
            resolve(mockTransactions);
        }, 1000));
    }

    // Simulates fetching balances
    public async getBalances(institutionId: string, accessToken: string): Promise<FinancialAccount[]> {
        console.log(`PlaidService: Fetching balances for ${institutionId}`);
        return new Promise(resolve => setTimeout(() => {
            const institution = this.financialDataStore.getInstitution(institutionId);
            if (institution) {
                const updatedAccounts = institution.connectedAccounts.map(account => ({
                    ...account,
                    currentBalance: parseFloat((account.currentBalance + (Math.random() * 100 - 50)).toFixed(2)), // Mock fluctuation
                    availableBalance: parseFloat((account.availableBalance + (Math.random() * 100 - 50)).toFixed(2)),
                    lastSyncAttempt: new Date(),
                    syncStatus: 'synced',
                }));
                this.financialDataStore.updateAccounts(institutionId, updatedAccounts);
                resolve(updatedAccounts);
            }
            resolve([]);
        }, 700));
    }

    // Simulates webhook receiving and processing
    public async simulateWebhook(eventType: WebhookEventType, itemId: string, data: any): Promise<void> {
        console.log(`PlaidService: Simulating webhook for item ${itemId}, event: ${eventType}`);
        // In a real app, this would be a server-side endpoint.
        // Here, we simulate the effect on the local store.
        const institution = this.financialDataStore.getInstitutionByItemId(itemId);
        if (!institution) return;

        switch (eventType) {
            case 'TRANSACTIONS_NEW':
            case 'TRANSACTIONS_SYNC_UPDATES':
                // Simulate new transactions or updates
                const newTxns = await this.getTransactions(institution.institutionId, institution.accessToken, '2023-01-01', new Date().toISOString().split('T')[0]);
                newTxns.forEach(txn => this.financialDataStore.addTransaction(txn));
                this.financialDataStore.updateInstitutionStatus(itemId, 'connected');
                this.financialDataStore.updateInstitutionLastUpdated(itemId, new Date());
                break;
            case 'ITEM_LOGIN_REQUIRED':
                this.financialDataStore.updateInstitutionStatus(itemId, 'reauth_required');
                console.warn(`PlaidService: Item ${itemId} requires re-authentication.`);
                break;
            case 'ITEM_ERROR':
                this.financialDataStore.updateInstitutionStatus(itemId, 'error');
                console.error(`PlaidService: Item ${itemId} encountered an error: ${JSON.stringify(data)}`);
                break;
            case 'ITEM_UNLINKED':
                this.financialDataStore.removeInstitution(itemId);
                console.log(`PlaidService: Item ${itemId} unlinked.`);
                break;
            // Handle other events as per Plaid docs
            default:
                console.log(`PlaidService: Unhandled webhook event: ${eventType}`);
        }
    }

    // Simulates an API for cryptocurrency wallet connections
    public async linkCryptoWallet(walletType: string, address: string): Promise<CryptoWallet> {
        console.log(`PlaidService: Linking crypto wallet ${walletType} with address ${address}`);
        return new Promise(resolve => setTimeout(() => {
            const mockWallet: CryptoWallet = {
                id: `crypto_${Math.random().toString(36).substring(7)}`,
                name: `${walletType} Wallet`,
                address: address,
                platform: walletType,
                assets: [
                    { symbol: 'BTC', balance: parseFloat((Math.random() * 2).toFixed(4)), usdValue: parseFloat((Math.random() * 50000).toFixed(2)), blockchain: 'Bitcoin' },
                    { symbol: 'ETH', balance: parseFloat((Math.random() * 10).toFixed(4)), usdValue: parseFloat((Math.random() * 30000).toFixed(2)), blockchain: 'Ethereum' },
                ],
                lastSynced: new Date(),
                status: 'connected',
                securityAuditLog: [{ timestamp: new Date(), event: 'WALLET_CONNECTED', details: 'Initial crypto wallet connection.' }],
            };
            this.financialDataStore.addCryptoWallet(mockWallet);
            resolve(mockWallet);
        }, 2000));
    }

    // Simulates an API for payment service connections (e.g., Venmo, Paypal)
    public async linkPaymentService(serviceName: string, userId: string): Promise<LinkedInstitution> {
        console.log(`PlaidService: Linking payment service ${serviceName} for user ${userId}`);
        return new Promise(resolve => setTimeout(() => {
            const mockInstitution: LinkedInstitution = {
                id: `item_payment_${Math.random().toString(36).substring(7)}`,
                name: serviceName,
                institutionId: `payment_${serviceName.toLowerCase()}`,
                accessToken: `payment-token-${Math.random().toString(36).substring(7)}`,
                connectedAccounts: [{
                    id: `acc_payment_${Math.random().toString(36).substring(7)}`,
                    institutionId: `payment_${serviceName.toLowerCase()}`,
                    name: `${serviceName} Balance`,
                    mask: '****',
                    type: 'other',
                    subtype: 'cash management',
                    currentBalance: parseFloat((Math.random() * 1000).toFixed(2)),
                    availableBalance: parseFloat((Math.random() * 1000).toFixed(2)),
                    currency: 'USD',
                    balanceHistory: [],
                    isLinked: true,
                    isActive: true,
                    syncStatus: 'synced',
                    lastSyncAttempt: new Date(),
                }],
                metadata: {
                    institution: { name: serviceName, institution_id: `payment_${serviceName.toLowerCase()}` },
                    accounts: [], link_session_id: '', products: ['transactions'], user_id: userId, public_token_id: ''
                },
                lastUpdated: new Date(),
                status: 'connected',
                securityAuditLog: [{ timestamp: new Date(), event: 'PAYMENT_SERVICE_CONNECTED', details: 'Initial payment service connection.' }],
            };
            this.financialDataStore.addInstitution(mockInstitution);
            resolve(mockInstitution);
        }, 1800));
    }
}

// Global Financial Data Store using React Context and a Reducer
// This centralizes all financial data and operations, simulating a client-side cache/ORM
export interface FinancialDataState {
    userProfile: UserProfile | null;
    linkedInstitutions: LinkedInstitution[];
    financialAccounts: FinancialAccount[];
    transactions: Transaction[];
    budgets: Budget[];
    goals: FinancialGoal[];
    aiInsights: AIInsight[];
    cryptoWallets: CryptoWallet[];
    developerAPIKeys: DeveloperAPIKey[];
    isLoading: boolean;
    error: string | null;
}

const initialState: FinancialDataState = {
    userProfile: {
        id: 'user_global_123',
        email: 'user@example.com',
        firstName: 'Fin',
        lastName: 'Genius',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
            theme: 'dark',
            currencySymbol: '$',
            dateFormat: 'MM/DD/YYYY',
            timeZone: 'America/New_York',
            notificationSettings: { email: true, push: true, sms: false },
            aiRecommendationsEnabled: true,
            dataRetentionPolicy: 'standard',
            biometricAuthEnabled: false,
            voiceControlEnabled: false,
            preferredLanguage: 'en-US',
        },
        mfaEnabled: true,
        avatarUrl: 'https://i.pravatar.cc/150?img=68',
        connections: [],
    },
    linkedInstitutions: [],
    financialAccounts: [],
    transactions: [],
    budgets: [],
    goals: [],
    aiInsights: [],
    cryptoWallets: [],
    developerAPIKeys: [],
    isLoading: false,
    error: null,
};

type FinancialDataAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'ADD_INSTITUTION'; payload: LinkedInstitution }
    | { type: 'REMOVE_INSTITUTION'; payload: string } // itemId
    | { type: 'UPDATE_INSTITUTION_STATUS'; payload: { itemId: string; status: LinkedInstitution['status'] } }
    | { type: 'UPDATE_INSTITUTION_LAST_UPDATED'; payload: { itemId: string; date: Date } }
    | { type: 'ADD_ACCOUNTS'; payload: FinancialAccount[] }
    | { type: 'UPDATE_ACCOUNTS'; payload: { institutionId: string; accounts: FinancialAccount[] } }
    | { type: 'ADD_TRANSACTIONS'; payload: Transaction[] }
    | { type: 'ADD_TRANSACTION'; payload: Transaction }
    | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
    | { type: 'ADD_BUDGET'; payload: Budget }
    | { type: 'UPDATE_BUDGET'; payload: Budget }
    | { type: 'DELETE_BUDGET'; payload: string } // budgetId
    | { type: 'ADD_GOAL'; payload: FinancialGoal }
    | { type: 'UPDATE_GOAL'; payload: FinancialGoal }
    | { type: 'DELETE_GOAL'; payload: string } // goalId
    | { type: 'ADD_INSIGHT'; payload: AIInsight }
    | { type: 'MARK_INSIGHT_READ'; payload: string } // insightId
    | { type: 'ADD_CRYPTO_WALLET'; payload: CryptoWallet }
    | { type: 'REMOVE_CRYPTO_WALLET'; payload: string } // walletId
    | { type: 'UPDATE_CRYPTO_WALLET_STATUS'; payload: { walletId: string; status: CryptoWallet['status'] } }
    | { type: 'ADD_API_KEY'; payload: DeveloperAPIKey }
    | { type: 'REVOKE_API_KEY'; payload: string } // keyId
    | { type: 'UPDATE_USER_PROFILE_PREFERENCES'; payload: Partial<UserPreferences> };


function financialDataReducer(state: FinancialDataState, action: FinancialDataAction): FinancialDataState {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'ADD_INSTITUTION':
            return {
                ...state,
                linkedInstitutions: [...state.linkedInstitutions, action.payload],
                financialAccounts: [...state.financialAccounts, ...action.payload.connectedAccounts],
            };
        case 'REMOVE_INSTITUTION':
            return {
                ...state,
                linkedInstitutions: state.linkedInstitutions.filter(inst => inst.id !== action.payload),
                financialAccounts: state.financialAccounts.filter(acc => acc.institutionId !== action.payload),
                transactions: state.transactions.filter(txn => txn.institutionId !== action.payload),
            };
        case 'UPDATE_INSTITUTION_STATUS':
            return {
                ...state,
                linkedInstitutions: state.linkedInstitutions.map(inst =>
                    inst.id === action.payload.itemId ? { ...inst, status: action.payload.status } : inst
                ),
            };
        case 'UPDATE_INSTITUTION_LAST_UPDATED':
            return {
                ...state,
                linkedInstitutions: state.linkedInstitutions.map(inst =>
                    inst.id === action.payload.itemId ? { ...inst, lastUpdated: action.payload.date } : inst
                ),
            };
        case 'ADD_ACCOUNTS':
            return {
                ...state,
                financialAccounts: [...state.financialAccounts, ...action.payload],
            };
        case 'UPDATE_ACCOUNTS':
            return {
                ...state,
                financialAccounts: state.financialAccounts.map(acc => {
                    const updated = action.payload.accounts.find(a => a.id === acc.id);
                    return updated ? updated : acc;
                }),
                linkedInstitutions: state.linkedInstitutions.map(inst =>
                    inst.institutionId === action.payload.institutionId
                        ? { ...inst, connectedAccounts: action.payload.accounts }
                        : inst
                ),
            };
        case 'ADD_TRANSACTIONS':
            // Merge new transactions, avoiding duplicates by ID
            const newTransactionIds = new Set(action.payload.map(txn => txn.id));
            const existingTransactions = state.transactions.filter(txn => !newTransactionIds.has(txn.id));
            return {
                ...state,
                transactions: [...existingTransactions, ...action.payload].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            };
        case 'ADD_TRANSACTION':
            return {
                ...state,
                transactions: [action.payload, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            };
        case 'UPDATE_TRANSACTION':
            return {
                ...state,
                transactions: state.transactions.map(txn => txn.id === action.payload.id ? action.payload : txn),
            };
        case 'ADD_BUDGET':
            return { ...state, budgets: [...state.budgets, action.payload] };
        case 'UPDATE_BUDGET':
            return { ...state, budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b) };
        case 'DELETE_BUDGET':
            return { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
        case 'ADD_GOAL':
            return { ...state, goals: [...state.goals, action.payload] };
        case 'UPDATE_GOAL':
            return { ...state, goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g) };
        case 'DELETE_GOAL':
            return { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
        case 'ADD_INSIGHT':
            return { ...state, aiInsights: [action.payload, ...state.aiInsights] };
        case 'MARK_INSIGHT_READ':
            return { ...state, aiInsights: state.aiInsights.map(i => i.id === action.payload ? { ...i, isRead: true } : i) };
        case 'ADD_CRYPTO_WALLET':
            return { ...state, cryptoWallets: [...state.cryptoWallets, action.payload] };
        case 'REMOVE_CRYPTO_WALLET':
            return { ...state, cryptoWallets: state.cryptoWallets.filter(w => w.id !== action.payload) };
        case 'UPDATE_CRYPTO_WALLET_STATUS':
            return {
                ...state,
                cryptoWallets: state.cryptoWallets.map(w =>
                    w.id === action.payload.walletId ? { ...w, status: action.payload.status } : w
                ),
            };
        case 'ADD_API_KEY':
            return { ...state, developerAPIKeys: [...state.developerAPIKeys, action.payload] };
        case 'REVOKE_API_KEY':
            return { ...state, developerAPIKeys: state.developerAPIKeys.filter(key => key.id !== action.payload) };
        case 'UPDATE_USER_PROFILE_PREFERENCES':
            if (!state.userProfile) return state; // Should not happen given initial state
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    preferences: { ...state.userProfile.preferences, ...action.payload },
                },
            };
        default:
            return state;
    }
}

// Data Store Class for encapsulating reducer logic and providing helper methods
export class FinancialDataStore {
    private dispatch: React.Dispatch<FinancialDataAction>;
    private getState: () => FinancialDataState;

    constructor(dispatch: React.Dispatch<FinancialDataAction>, getState: () => FinancialDataState) {
        this.dispatch = dispatch;
        this.getState = getState;
    }

    // Public methods to interact with the store
    public get state(): FinancialDataState {
        return this.getState();
    }

    public setLoading(isLoading: boolean) { this.dispatch({ type: 'SET_LOADING', payload: isLoading }); }
    public setError(error: string | null) { this.dispatch({ type: 'SET_ERROR', payload: error }); }

    public addInstitution(institution: LinkedInstitution) { this.dispatch({ type: 'ADD_INSTITUTION', payload: institution }); }
    public removeInstitution(itemId: string) { this.dispatch({ type: 'REMOVE_INSTITUTION', payload: itemId }); }
    public updateInstitutionStatus(itemId: string, status: LinkedInstitution['status']) { this.dispatch({ type: 'UPDATE_INSTITUTION_STATUS', payload: { itemId, status } }); }
    public updateInstitutionLastUpdated(itemId: string, date: Date) { this.dispatch({ type: 'UPDATE_INSTITUTION_LAST_UPDATED', payload: { itemId, date } }); }
    public getInstitution(institutionId: string): LinkedInstitution | undefined { return this.getState().linkedInstitutions.find(inst => inst.institutionId === institutionId); }
    public getInstitutionByItemId(itemId: string): LinkedInstitution | undefined { return this.getState().linkedInstitutions.find(inst => inst.id === itemId); }

    public addAccounts(accounts: FinancialAccount[]) { this.dispatch({ type: 'ADD_ACCOUNTS', payload: accounts }); }
    public updateAccounts(institutionId: string, accounts: FinancialAccount[]) { this.dispatch({ type: 'UPDATE_ACCOUNTS', payload: { institutionId, accounts } }); }
    public getAccount(accountId: string): FinancialAccount | undefined { return this.getState().financialAccounts.find(acc => acc.id === accountId); }
    public getAllAccounts(): FinancialAccount[] { return this.getState().financialAccounts; }

    public addTransactions(transactions: Transaction[]) { this.dispatch({ type: 'ADD_TRANSACTIONS', payload: transactions }); }
    public addTransaction(transaction: Transaction) { this.dispatch({ type: 'ADD_TRANSACTION', payload: transaction }); }
    public updateTransaction(transaction: Transaction) { this.dispatch({ type: 'UPDATE_TRANSACTION', payload: transaction }); }
    public getTransactionsForAccount(accountId: string): Transaction[] { return this.getState().transactions.filter(txn => txn.accountId === accountId); }
    public getAllTransactions(): Transaction[] { return this.getState().transactions; }

    public addBudget(budget: Budget) { this.dispatch({ type: 'ADD_BUDGET', payload: budget }); }
    public updateBudget(budget: Budget) { this.dispatch({ type: 'UPDATE_BUDGET', payload: budget }); }
    public deleteBudget(budgetId: string) { this.dispatch({ type: 'DELETE_BUDGET', payload: budgetId }); }
    public getAllBudgets(): Budget[] { return this.getState().budgets; }

    public addGoal(goal: FinancialGoal) { this.dispatch({ type: 'ADD_GOAL', payload: goal }); }
    public updateGoal(goal: FinancialGoal) { this.dispatch({ type: 'UPDATE_GOAL', payload: goal }); }
    public deleteGoal(goalId: string) { this.dispatch({ type: 'DELETE_GOAL', payload: goalId }); }
    public getAllGoals(): FinancialGoal[] { return this.getState().goals; }

    public addInsight(insight: AIInsight) { this.dispatch({ type: 'ADD_INSIGHT', payload: insight }); }
    public markInsightRead(insightId: string) { this.dispatch({ type: 'MARK_INSIGHT_READ', payload: insightId }); }
    public getAllInsights(): AIInsight[] { return this.getState().aiInsights; }

    public addCryptoWallet(wallet: CryptoWallet) { this.dispatch({ type: 'ADD_CRYPTO_WALLET', payload: wallet }); }
    public removeCryptoWallet(walletId: string) { this.dispatch({ type: 'REMOVE_CRYPTO_WALLET', payload: walletId }); }
    public updateCryptoWalletStatus(walletId: string, status: CryptoWallet['status']) { this.dispatch({ type: 'UPDATE_CRYPTO_WALLET_STATUS', payload: { walletId, status } }); }
    public getAllCryptoWallets(): CryptoWallet[] { return this.getState().cryptoWallets; }

    public addDeveloperAPIKey(key: DeveloperAPIKey) { this.dispatch({ type: 'ADD_API_KEY', payload: key }); }
    public revokeDeveloperAPIKey(keyId: string) { this.dispatch({ type: 'REVOKE_API_KEY', payload: keyId }); }
    public getAllDeveloperAPIKeys(): DeveloperAPIKey[] { return this.getState().developerAPIKeys; }

    public getUserProfile(): UserProfile | null { return this.getState().userProfile; }
    public updateUserProfilePreferences(preferences: Partial<UserPreferences>) { this.dispatch({ type: 'UPDATE_USER_PROFILE_PREFERENCES', payload: preferences }); }

    // Aggregate data methods
    public getTotalNetWorth(): number {
        const fiatBalance = this.getState().financialAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
        const cryptoValue = this.getState().cryptoWallets.reduce((sum, wallet) => sum + wallet.assets.reduce((assetSum, asset) => assetSum + asset.usdValue, 0), 0);
        return fiatBalance + cryptoValue;
    }

    public getSpendingByCategory(month: string): Record<TransactionCategory, number> {
        const monthTxns = this.getState().transactions.filter(txn => txn.date.startsWith(month) && txn.amount > 0);
        return monthTxns.reduce((acc, txn) => {
            acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
            return acc;
        }, {} as Record<TransactionCategory, number>);
    }

    public getIncomeByMonth(month: string): number {
        const monthTxns = this.getState().transactions.filter(txn => txn.date.startsWith(month) && txn.category === 'income' && txn.amount > 0);
        return monthTxns.reduce((sum, txn) => sum + txn.amount, 0);
    }
}

const FinancialDataContext = createContext<{ state: FinancialDataState; store: FinancialDataStore } | undefined>(undefined);

// Provider for the financial data store
export const FinancialDataProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [state, dispatch] = useReducer(financialDataReducer, initialState);
    // Use a ref to hold the store instance, ensuring it's stable across renders
    const storeRef = useRef<FinancialDataStore | null>(null);

    if (!storeRef.current) {
        storeRef.current = new FinancialDataStore(dispatch, () => state);
    } else {
        // Update the internal state reference for the store on each render
        storeRef.current.dispatch = dispatch;
        storeRef.current.getState = () => state;
    }

    // Initialize Plaid service with the data store
    const plaidServiceRef = useRef<PlaidIntegrationService | null>(null);
    if (!plaidServiceRef.current) {
        plaidServiceRef.current = PlaidIntegrationService.getInstance(storeRef.current);
    }

    return (
        <FinancialDataContext.Provider value={{ state, store: storeRef.current }}>
            {children}
        </FinancialDataContext.Provider>
    );
};

// Hook to use the financial data store
export const useFinancialData = () => {
    const context = useContext(FinancialDataContext);
    if (!context) {
        throw new Error('useFinancialData must be used within a FinancialDataProvider');
    }
    return context;
};

// Hook to get the Plaid service instance (will be provided via context in a real app or passed)
export const usePlaidService = () => {
    const { store } = useFinancialData();
    // This is a simplified way to get the service. In a larger app,
    // services might be provided directly via a service locator or another context.
    return PlaidIntegrationService.getInstance(store);
};


// ================================================================================================
// HIGH-FIDELITY PLAID MODAL SIMULATION (Expanded for multi-step, advanced linking)
// ================================================================================================

export const PlaidModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (publicToken: string, metadata: PlaidLinkSuccessMetadata) => void;
    onExit?: (error: PlaidLinkError | null, metadata: PlaidLinkExitMetadata) => void;
    onEvent?: (eventName: string, metadata: any) => void;
    linkToken?: string; // Pre-generated link token
    products?: PlaidProduct[];
    countryCodes?: string[];
    language?: string;
    isUpdateMode?: boolean; // If updating an existing item
    accessToken?: string; // Required for update mode
    itemIdToUpdate?: string; // Plaid Item ID to update
}> = ({
    isOpen, onClose, onSuccess, onExit, onEvent, linkToken: propLinkToken,
    products = ['transactions', 'auth'], countryCodes = ['US'], language = 'en',
    isUpdateMode = false, accessToken, itemIdToUpdate
}) => {
    const { store } = useFinancialData();
    const plaidService = usePlaidService();
    const [step, setStep] = useState<'initialize' | 'select_institution' | 'connecting' | 'connected' | 'select_accounts' | 'configure_products' | 'error' | 'reauth_flow'>('initialize');
    const [selectedBank, setSelectedBank] = useState<{ name: string, logo: React.ReactNode, institution_id: string } | null>(null);
    const [currentLinkToken, setCurrentLinkToken] = useState<string | null>(propLinkToken || null);
    const [error, setError] = useState<PlaidLinkError | null>(null);
    const [selectedAccountIds, setSelectedAccountIds] = useState<Set<string>>(new Set());
    const [availableProducts, setAvailableProducts] = useState<PlaidProduct[]>(products);
    const [selectedProducts, setSelectedProducts] = useState<Set<PlaidProduct>>(new Set(products));
    const [mockLinkedAccounts, setMockLinkedAccounts] = useState<FinancialAccount[]>([]);
    const [linkingStartTime, setLinkingStartTime] = useState<number>(0);

    const userId = store.getUserProfile()?.id || 'default_user';

    useEffect(() => {
        if (isOpen) {
            setStep('initialize');
            setError(null);
            setSelectedBank(null);
            setCurrentLinkToken(null);
            setSelectedAccountIds(new Set());
            setSelectedProducts(new Set(products));
            setMockLinkedAccounts([]);
            setLinkingStartTime(Date.now());
            initializeLinkFlow();
        } else {
            setTimeout(() => { // Reset state after modal closes animation
                setStep('initialize');
            }, 300);
        }
    }, [isOpen, propLinkToken, products, countryCodes, language, isUpdateMode, accessToken, itemIdToUpdate]);

    const initializeLinkFlow = async () => {
        store.setLoading(true);
        try {
            onEvent?.('PLAID_MODAL_INIT', { isUpdateMode, itemIdToUpdate });
            if (isUpdateMode && !accessToken) {
                throw new Error("Access token is required for update mode.");
            }

            // In a real Plaid integration, you'd make an API call to your backend
            // to generate a link_token. We simulate that here.
            const tokenResponse = await plaidService.createLinkToken(
                userId,
                isUpdateMode ? ['transactions'] : products, // For update, typically refresh existing products
                countryCodes
            );
            setCurrentLinkToken(tokenResponse.link_token);
            setStep('select_institution');
        } catch (e: any) {
            console.error('Failed to initialize Plaid Link:', e);
            setError({
                error_code: 'LINK_TOKEN_GEN_FAILED',
                error_message: e.message || 'Failed to generate Plaid Link token.',
                error_type: 'API_ERROR',
                display_message: 'Oops! Something went wrong on our end. Please try again.',
                request_id: 'mock_req_id',
                causes: [],
                status_code: 500,
            });
            setStep('error');
            onExit?.({ error_code: 'LINK_TOKEN_GEN_FAILED', error_message: e.message, error_type: 'API_ERROR', display_message: null, request_id: 'mock', causes: [], status_code: 500 }, { link_session_id: 'mock_session_id', exit_status: 'ERROR' });
        } finally {
            store.setLoading(false);
        }
    };

    const handleBankSelect = (bank: { name: string, logo: React.ReactNode, institution_id: string }) => {
        onEvent?.('SELECT_INSTITUTION', { institution_name: bank.name, institution_id: bank.institution_id });
        setSelectedBank(bank);
        setStep('connecting');
        setLinkingStartTime(Date.now()); // Reset timer for connecting phase

        // Simulate Plaid Link experience
        setTimeout(async () => {
            if (Math.random() < 0.1) { // Simulate a 10% chance of an error
                const mockError: PlaidLinkError = {
                    error_code: 'ITEM_LOGIN_REQUIRED',
                    error_message: 'Login credentials have expired.',
                    error_type: 'ITEM_ERROR',
                    display_message: 'Your bank requires you to re-enter your credentials. Please try again.',
                    request_id: `req-${Math.random().toString(36).substring(7)}`,
                    causes: [],
                    status_code: 400,
                };
                setError(mockError);
                setStep('error');
                onExit?.(mockError, { link_session_id: currentLinkToken || 'mock_session', institution: { name: bank.name, institution_id: bank.institution_id }, exit_status: 'REQUIRES_ACTION' });
                return;
            }

            // Simulate successful connection and public token exchange
            const mockPublicToken = `public-sandbox-${Math.random().toString(36).substring(7)}`;
            const mockMetadata: PlaidLinkSuccessMetadata = {
                institution: { name: bank.name, institution_id: bank.institution_id },
                accounts: [
                    { id: `acct_${Math.random().toString(36).substring(7)}`, name: 'Plaid Checking', mask: Math.floor(1000 + Math.random() * 9000).toString(), type: 'depository', subtype: 'checking' },
                    { id: `acct_${Math.random().toString(36).substring(7)}`, name: 'Plaid Savings', mask: Math.floor(1000 + Math.random() * 9000).toString(), type: 'depository', subtype: 'savings' },
                    { id: `acct_${Math.random().toString(36).substring(7)}`, name: 'Plaid Credit Card', mask: Math.floor(1000 + Math.random() * 9000).toString(), type: 'credit', subtype: 'credit card' },
                ],
                link_session_id: currentLinkToken || `link-session-${Math.random().toString(36).substring(7)}`,
                products: Array.from(selectedProducts),
                user_id: userId,
                public_token_id: `pt_${Math.random().toString(36).substring(7)}`,
            };
            setMockLinkedAccounts(mockMetadata.accounts.map(acc => ({
                ...acc,
                institutionId: mockMetadata.institution.institution_id,
                currentBalance: Math.floor(Math.random() * 50000) + 100,
                availableBalance: Math.floor(Math.random() * 50000) + 50,
                currency: 'USD',
                balanceHistory: [],
                isLinked: true,
                isActive: true,
                syncStatus: 'synced',
                lastSyncAttempt: new Date(),
            })));

            setStep('connected');
            onEvent?.('HANDSHAKE_COMPLETE', { timeTaken: Date.now() - linkingStartTime });

            setTimeout(() => {
                // If update mode, proceed directly to success with all accounts selected
                if (isUpdateMode) {
                    const existingAccounts = store.getInstitutionByItemId(itemIdToUpdate!)?.connectedAccounts || [];
                    const allAccounts = [...existingAccounts, ...mockMetadata.accounts]; // Merge existing and new
                    const finalMetadata: PlaidLinkSuccessMetadata = { ...mockMetadata, accounts: allAccounts };
                    onSuccess(mockPublicToken, finalMetadata);
                    onClose();
                    return;
                }
                setStep('select_accounts'); // Allow user to select which accounts to link
            }, 1000); // Short delay to show 'Connected' state
        }, 2500); // Simulates actual Plaid connection time
    };

    const handleAccountSelectionComplete = async () => {
        if (!selectedBank || !mockLinkedAccounts.length) return;

        const filteredAccounts = mockLinkedAccounts.filter(acc => selectedAccountIds.has(acc.id));
        if (filteredAccounts.length === 0) {
            alert('Please select at least one account.'); // TODO: Use a better UI for this
            return;
        }

        const mockPublicToken = `public-sandbox-${Math.random().toString(36).substring(7)}`;
        const finalMetadata: PlaidLinkSuccessMetadata = {
            institution: { name: selectedBank.name, institution_id: selectedBank.institution_id },
            accounts: filteredAccounts.map(acc => ({ // Return only selected accounts
                id: acc.id,
                name: acc.name,
                mask: acc.mask,
                type: acc.type,
                subtype: acc.subtype,
            })),
            link_session_id: currentLinkToken || `link-session-${Math.random().toString(36).substring(7)}`,
            products: Array.from(selectedProducts),
            user_id: userId,
            public_token_id: `pt_${Math.random().toString(36).substring(7)}`,
        };

        try {
            store.setLoading(true);
            onEvent?.('ACCOUNTS_SELECTED', { count: filteredAccounts.length });
            await plaidService.exchangePublicToken(mockPublicToken, finalMetadata); // Exchange public token and store data
            onSuccess(mockPublicToken, finalMetadata);
            onClose();
        } catch (e: any) {
            console.error('Error exchanging public token:', e);
            setError({
                error_code: 'TOKEN_EXCHANGE_FAILED',
                error_message: e.message || 'Failed to exchange public token.',
                error_type: 'API_ERROR',
                display_message: 'Could not link your accounts. Please try again.',
                request_id: 'mock_req_id',
                causes: [],
                status_code: 500,
            });
            setStep('error');
            onExit?.({ error_code: 'TOKEN_EXCHANGE_FAILED', error_message: e.message, error_type: 'API_ERROR', display_message: null, request_id: 'mock', causes: [], status_code: 500 }, { link_session_id: 'mock_session_id', exit_status: 'ERROR' });
        } finally {
            store.setLoading(false);
        }
    };

    const handleProductToggle = (product: PlaidProduct) => {
        setSelectedProducts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(product)) {
                newSet.delete(product);
            } else {
                newSet.add(product);
            }
            return newSet;
        });
    };

    const handleAccountToggle = (accountId: string) => {
        setSelectedAccountIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(accountId)) {
                newSet.delete(accountId);
            } else {
                newSet.add(accountId);
            }
            return newSet;
        });
    };

    const renderContent = () => {
        switch (step) {
            case 'initialize':
                return (
                    <div className="text-center py-16">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
                            <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-6">Initializing connection...</h3>
                        <p className="text-sm text-gray-400 mt-1">Preparing secure link to your financial institutions.</p>
                    </div>
                );
            case 'connecting':
                return (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 mx-auto mb-4">{selectedBank?.logo}</div>
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
                            <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-6">Connecting to {selectedBank?.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">This may take a few seconds, please do not close this window.</p>
                        <div className="mt-4 text-xs text-gray-500">
                            Simulated secure handshake... <br/>
                            {Date.now() - linkingStartTime > 1000 && "Establishing encrypted tunnel... "}<br/>
                            {Date.now() - linkingStartTime > 2000 && "Authenticating credentials... "}
                        </div>
                    </div>
                );
            case 'connected':
                return (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 mx-auto mb-4">{selectedBank?.logo}</div>
                        <div className="w-24 h-24 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                            <svg className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-6">Connected!</h3>
                        <p className="text-sm text-gray-400 mt-1">Establishing data flow. Almost done!</p>
                    </div>
                );
            case 'select_accounts':
                return (
                    <div>
                        <p className="text-center font-semibold text-white mb-1">Select accounts to link</p>
                        <p className="text-center text-xs text-gray-400 mb-6">Choose which accounts you'd like to link to our platform.</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {mockLinkedAccounts.map(account => (
                                <div key={account.id} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id={account.id}
                                        checked={selectedAccountIds.has(account.id)}
                                        onChange={() => handleAccountToggle(account.id)}
                                        className="h-5 w-5 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                                    />
                                    <label htmlFor={account.id} className="ml-3 text-sm font-medium text-gray-200 flex-1">
                                        {account.name} (ending in {account.mask}) - {account.type}
                                    </label>
                                    <span className="text-sm text-gray-400">${account.currentBalance.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleAccountSelectionComplete}
                            className="mt-6 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            disabled={selectedAccountIds.size === 0 || store.state.isLoading}
                        >
                            {store.state.isLoading ? 'Linking Accounts...' : 'Link Selected Accounts'}
                        </button>
                    </div>
                );
            case 'configure_products': // Future expansion: allow users to select Plaid products
                return (
                    <div>
                        <p className="text-center font-semibold text-white mb-1">Configure Data Access</p>
                        <p className="text-center text-xs text-gray-400 mb-6">Select the types of financial data you wish to share.</p>
                        <div className="space-y-2">
                            {availableProducts.map(product => (
                                <div key={product} className="flex items-center p-3 bg-gray-700/50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        id={product}
                                        checked={selectedProducts.has(product)}
                                        onChange={() => handleProductToggle(product)}
                                        className="h-5 w-5 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                                    />
                                    <label htmlFor={product} className="ml-3 text-sm font-medium text-gray-200 flex-1">
                                        {product.charAt(0).toUpperCase() + product.slice(1)} Data
                                    </label>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => setStep('select_accounts')} className="mt-6 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                            Continue
                        </button>
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mt-6">Connection Failed</h3>
                        <p className="text-sm text-gray-400 mt-1">{error?.display_message || error?.error_message || 'An unexpected error occurred.'}</p>
                        <button onClick={() => setStep('select_institution')} className="mt-4 text-cyan-500 hover:underline">Try Again</button>
                        <button onClick={() => { onClose(); onExit?.(error, { link_session_id: currentLinkToken || 'mock_session', exit_status: 'USER_CLOSE' }); }} className="mt-2 block w-full text-sm text-gray-500 hover:text-white">Close</button>
                    </div>
                );
            case 'reauth_flow': // For existing item re-authentication
                const itemToReauth = itemIdToUpdate ? store.getInstitutionByItemId(itemIdToUpdate) : null;
                return (
                    <div className="text-center py-16">
                        <div className="w-12 h-12 mx-auto mb-4">{itemToReauth ? banks.find(b => b.institution_id === itemToReauth.institutionId)?.logo : <PlaidLogo />}</div>
                        <h3 className="text-lg font-semibold text-white mt-6">Re-authenticate {itemToReauth?.name || 'your institution'}</h3>
                        <p className="text-sm text-gray-400 mt-1">Your connection requires updated credentials. Please log in again.</p>
                        <button
                            onClick={() => handleBankSelect(banks.find(b => b.institution_id === itemToReauth?.institutionId) || banks[0])} // Simulate re-auth as new link
                            className="mt-6 w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                        >
                            Continue to Login
                        </button>
                    </div>
                );
            case 'select_institution':
            default:
                return (
                    <div>
                        <p className="text-center font-semibold text-white mb-1">Connect your financial accounts</p>
                        <p className="text-center text-xs text-gray-400 mb-6">Securely link your accounts to unlock powerful insights and management tools. By continuing, you agree to the Plaid End User Privacy Policy and our Terms of Service.</p>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {banks.map(bank => (
                                <button key={bank.name} onClick={() => handleBankSelect(bank)} className="w-full flex items-center p-3 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors">
                                    {bank.logo}
                                    <span className="ml-4 font-medium text-gray-200">{bank.name}</span>
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 text-center text-xs text-gray-500">
                            Don't see your bank? <a href="#" className="text-cyan-500 hover:underline">Search for it</a> or <a href="#" className="text-cyan-500 hover:underline">connect manually</a>.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className={`fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full border border-gray-700 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <PlaidLogo />
                    <button onClick={() => {
                        onClose();
                        onEvent?.('MODAL_CLOSED_BY_USER', { currentStep: step });
                        if (step !== 'connected' && step !== 'error' && step !== 'initialize') { // Don't trigger exit if already connected or failed
                            onExit?.(null, { link_session_id: currentLinkToken || 'mock_session', exit_status: 'USER_CLOSED' });
                        }
                    }} className="text-gray-500 hover:text-white text-2xl leading-none">&times;</button>
                </div>
                {renderContent()}
            </div>
        </div>
    );
}

// ================================================================================================
// ADVANCED FINANCIAL COMPONENTS (Conceptual, integrated with FinancialDataStore)
// ================================================================================================

export const FinancialDashboard: React.FC = () => {
    const { state, store } = useFinancialData();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const totalNetWorth = store.getTotalNetWorth();
    const primaryAccount = state.financialAccounts.find(acc => acc.type === 'depository' && acc.subtype === 'checking');
    const recentTransactions = state.transactions.slice(0, 5);
    const pendingInsights = state.aiInsights.filter(insight => !insight.isRead).length;

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Your Financial Overview</h2>
            <p className="text-sm text-gray-400 mb-6">Last updated: {store.linkedInstitutions[0]?.lastUpdated.toLocaleString() || 'N/A'} (as of {currentTime.toLocaleTimeString()})</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start">
                    <h3 className="text-lg font-semibold text-gray-300">Total Net Worth</h3>
                    <p className="text-3xl font-bold text-cyan-400 mt-2">${totalNetWorth.toFixed(2)}</p>
                    <span className="text-sm text-gray-500">+1.2% in last 30 days (simulated)</span>
                </div>
                {primaryAccount && (
                    <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start">
                        <h3 className="text-lg font-semibold text-gray-300">{primaryAccount.name}</h3>
                        <p className="text-3xl font-bold text-white mt-2">${primaryAccount.currentBalance.toFixed(2)}</p>
                        <span className="text-sm text-gray-500">Available: ${primaryAccount.availableBalance.toFixed(2)}</span>
                    </div>
                )}
                <div className="bg-gray-700 rounded-lg p-4 flex flex-col items-start">
                    <h3 className="text-lg font-semibold text-gray-300">Pending AI Insights</h3>
                    <p className="text-3xl font-bold text-yellow-400 mt-2">{pendingInsights}</p>
                    <span className="text-sm text-gray-500">Proactive financial guidance</span>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Recent Transactions</h3>
                {recentTransactions.length > 0 ? (
                    <ul className="space-y-3">
                        {recentTransactions.map(txn => (
                            <li key={txn.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                                <div>
                                    <p className="text-gray-200 font-medium">{txn.merchantName || txn.name}</p>
                                    <p className="text-xs text-gray-400">{txn.date} &middot; {txn.category.replace(/_/g, ' ')}</p>
                                </div>
                                <span className={`font-semibold ${txn.amount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {txn.amount > 0 ? '-' : ''}${Math.abs(txn.amount).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-400">No recent transactions yet. Link an account to see your activity!</p>
                )}
            </div>

            <div className="flex justify-end space-x-4">
                <button className="text-cyan-500 hover:text-cyan-400">View All Transactions</button>
                <button className="text-cyan-500 hover:text-cyan-400">Manage Budgets</button>
                <button className="text-cyan-500 hover:text-cyan-400">Set Goals</button>
            </div>
        </div>
    );
};

export const BudgetingModule: React.FC = () => {
    const { state, store } = useFinancialData();
    const [newBudgetName, setNewBudgetName] = useState('');
    const [newBudgetAmount, setNewBudgetAmount] = useState<number>(0);
    const [newBudgetCategory, setNewBudgetCategory] = useState<TransactionCategory>('uncategorized');
    const [newBudgetFrequency, setNewBudgetFrequency] = useState<BudgetFrequency>('monthly');

    const handleCreateBudget = () => {
        if (!newBudgetName || newBudgetAmount <= 0) return;
        const newBudget: Budget = {
            id: `budget_${Math.random().toString(36).substring(7)}`,
            name: newBudgetName,
            category: newBudgetCategory,
            amount: newBudgetAmount,
            spent: 0, // In a real app, this would be calculated from transactions
            remaining: newBudgetAmount,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Mock for monthly
            frequency: newBudgetFrequency,
            alertsEnabled: true,
            isAchieved: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        store.addBudget(newBudget);
        setNewBudgetName('');
        setNewBudgetAmount(0);
        setNewBudgetCategory('uncategorized');
    };

    const calculateBudgetProgress = (budget: Budget) => {
        // In a real app, 'spent' would be dynamically calculated from transactions within the budget's timeframe.
        // For simulation, let's just make it a random percentage of the amount
        const simulatedSpent = budget.spent > 0 ? budget.spent : parseFloat((Math.random() * budget.amount * 0.8).toFixed(2));
        const remaining = budget.amount - simulatedSpent;
        const progress = (simulatedSpent / budget.amount) * 100;
        return { spent: simulatedSpent, remaining, progress };
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Budgeting & Expense Management</h2>

            <div className="mb-6 border-b border-gray-700 pb-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Create New Budget</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Budget Name (e.g., Monthly Groceries)"
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        value={newBudgetName}
                        onChange={(e) => setNewBudgetName(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Budget Amount"
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        value={newBudgetAmount || ''}
                        onChange={(e) => setNewBudgetAmount(parseFloat(e.target.value))}
                    />
                    <select
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        value={newBudgetCategory}
                        onChange={(e) => setNewBudgetCategory(e.target.value as TransactionCategory)}
                    >
                        {Object.values(TransactionCategory).map(cat => (
                            <option key={cat} value={cat}>{cat.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                        ))}
                    </select>
                    <select
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        value={newBudgetFrequency}
                        onChange={(e) => setNewBudgetFrequency(e.target.value as BudgetFrequency)}
                    >
                        {Object.values(BudgetFrequency).map(freq => (
                            <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={handleCreateBudget}
                    className="mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium"
                >
                    Create Budget
                </button>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Your Budgets</h3>
                {state.budgets.length > 0 ? (
                    <div className="space-y-4">
                        {state.budgets.map(budget => {
                            const { spent, remaining, progress } = calculateBudgetProgress(budget);
                            const progressColor = progress > 90 ? 'bg-red-500' : progress > 60 ? 'bg-yellow-500' : 'bg-green-500';
                            return (
                                <div key={budget.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium text-gray-200">{budget.name} - {budget.frequency}</p>
                                        <button onClick={() => store.deleteBudget(budget.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        Budgeted: ${budget.amount.toFixed(2)} | Spent: ${spent.toFixed(2)} | Remaining: ${remaining.toFixed(2)}
                                    </p>
                                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                                        <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${Math.min(100, progress)}%` }}></div>
                                    </div>
                                    <p className="text-xs text-right text-gray-400 mt-1">{progress.toFixed(1)}% spent</p>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400">No budgets set up yet. Start by creating one above!</p>
                )}
            </div>
        </div>
    );
};


export const AIInsightsEngine: React.FC = () => {
    const { state, store } = useFinancialData();
    const plaidService = usePlaidService();
    const insights = state.aiInsights.filter(insight => !insight.isRead);

    useEffect(() => {
        // Simulate generating insights periodically or based on new data
        const generateMockInsight = () => {
            if (Math.random() > 0.7 && state.transactions.length > 0) { // 30% chance to generate an insight
                const randomType: AIInsightType = ['spending_alert', 'saving_tip', 'subscription_detected', 'debt_optimization'][Math.floor(Math.random() * 4)] as AIInsightType;
                const randomTxn = state.transactions[Math.floor(Math.random() * state.transactions.length)];
                const relatedTransactions = Math.random() > 0.5 ? [randomTxn.id] : [];

                let title = 'New Insight!';
                let description = 'Check this out.';
                let severity: AIInsight['severity'] = 'info';

                switch (randomType) {
                    case 'spending_alert':
                        title = 'High Spending Alert!';
                        description = `You've spent a significant amount more on ${randomTxn.category.replace(/_/g, ' ')} this week. Consider reviewing your budget.`;
                        severity = 'warning';
                        break;
                    case 'saving_tip':
                        title = 'Smart Saving Opportunity';
                        description = `We noticed you could save $${(Math.random() * 50).toFixed(2)} by switching providers for a recurring bill.`;
                        severity = 'info';
                        break;
                    case 'subscription_detected':
                        title = 'New Subscription Detected';
                        description = `We found a new subscription to "${randomTxn.merchantName || randomTxn.name}" for $${randomTxn.amount.toFixed(2)} on ${randomTxn.date}.`;
                        severity = 'info';
                        break;
                    case 'debt_optimization':
                        title = 'Debt Optimization Suggestion';
                        description = `You could save on interest by consolidating your credit card debt or paying off high-interest loans first.`;
                        severity = 'critical';
                        break;
                    default:
                        break;
                }

                store.addInsight({
                    id: `insight_${Date.now()}`,
                    type: randomType,
                    title,
                    description,
                    timestamp: new Date(),
                    isRead: false,
                    actionableItems: ['Review', 'Dismiss'],
                    relatedTransactionIds: relatedTransactions,
                    severity,
                });
            }
        };

        const insightInterval = setInterval(generateMockInsight, 15000); // Generate insight every 15 seconds
        return () => clearInterval(insightInterval);
    }, [state.transactions.length]); // Depend on transaction count for simulation

    const getSeverityClass = (severity: AIInsight['severity']) => {
        switch (severity) {
            case 'critical': return 'bg-red-500/20 text-red-300 border-red-500';
            case 'warning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
            case 'info': return 'bg-blue-500/20 text-blue-300 border-blue-500';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">AI-Powered Insights & Recommendations</h2>
            <p className="text-sm text-gray-400 mb-6">Our intelligent engine analyzes your financial data to provide personalized advice.</p>

            {insights.length > 0 ? (
                <div className="space-y-4">
                    {insights.map(insight => (
                        <div key={insight.id} className={`p-4 rounded-lg border ${getSeverityClass(insight.severity)}`}>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="font-semibold text-lg">{insight.title}</h3>
                                <span className="text-xs text-gray-400">{insight.timestamp.toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 mb-3">{insight.description}</p>
                            <div className="flex space-x-2">
                                {insight.actionableItems?.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            // Simulate action, e.g., open budget editor, show transactions
                                            alert(`Action: ${item} for insight: "${insight.title}"`);
                                            store.markInsightRead(insight.id);
                                        }}
                                        className="py-1 px-3 text-sm rounded-md bg-cyan-600 hover:bg-cyan-700 text-white"
                                    >
                                        {item}
                                    </button>
                                ))}
                                <button
                                    onClick={() => store.markInsightRead(insight.id)}
                                    className="py-1 px-3 text-sm rounded-md bg-gray-600 hover:bg-gray-700 text-gray-300"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No new insights at the moment. We'll notify you when we find something valuable!</p>
            )}
            <div className="mt-6 flex justify-end">
                <button className="text-cyan-500 hover:text-cyan-400">View All Past Insights</button>
            </div>
        </div>
    );
};

export const GoalSettingModule: React.FC = () => {
    const { state, store } = useFinancialData();
    const [goalName, setGoalName] = useState('');
    const [goalType, setGoalType] = useState<FinancialGoalType>('savings');
    const [targetAmount, setTargetAmount] = useState<number>(0);
    const [targetDate, setTargetDate] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [selectedGoalAccounts, setSelectedGoalAccounts] = useState<Set<string>>(new Set());

    const handleCreateGoal = () => {
        if (!goalName || targetAmount <= 0 || !targetDate) return;

        const newGoal: FinancialGoal = {
            id: `goal_${Math.random().toString(36).substring(7)}`,
            name: goalName,
            type: goalType,
            targetAmount: targetAmount,
            currentAmount: 0, // Would be dynamically calculated based on linked accounts
            targetDate: targetDate,
            progress: 0,
            isAchieved: false,
            priority: priority,
            associatedAccounts: Array.from(selectedGoalAccounts),
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        store.addGoal(newGoal);
        setGoalName('');
        setTargetAmount(0);
        setTargetDate('');
        setPriority('medium');
        setSelectedGoalAccounts(new Set());
    };

    const calculateGoalProgress = (goal: FinancialGoal): { current: number; progress: number } => {
        // Simulate progress based on a fixed rate or random for demo purposes
        const accountsBalance = state.financialAccounts
            .filter(acc => goal.associatedAccounts.includes(acc.id))
            .reduce((sum, acc) => sum + acc.currentBalance, 0);

        const progress = Math.min(100, (accountsBalance / goal.targetAmount) * 100);
        return { current: accountsBalance, progress };
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Financial Goal Setting</h2>
            <p className="text-sm text-gray-400 mb-6">Define your financial aspirations and track your progress.</p>

            <div className="mb-6 border-b border-gray-700 pb-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Set a New Goal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        placeholder="Goal Name (e.g., House Down Payment)"
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                    />
                    <select
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        value={goalType}
                        onChange={(e) => setGoalType(e.target.value as FinancialGoalType)}
                    >
                        {Object.values(FinancialGoalType).map(type => (
                            <option key={type} value={type}>{type.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Target Amount"
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        value={targetAmount || ''}
                        onChange={(e) => setTargetAmount(parseFloat(e.target.value))}
                    />
                    <input
                        type="date"
                        placeholder="Target Date"
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        value={targetDate}
                        onChange={(e) => setTargetDate(e.target.value)}
                    />
                    <select
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                    >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                    </select>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-gray-400 text-sm mb-2">Associate Accounts:</label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                            {state.financialAccounts.map(account => (
                                <div key={account.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`goal-acc-${account.id}`}
                                        checked={selectedGoalAccounts.has(account.id)}
                                        onChange={() => {
                                            setSelectedGoalAccounts(prev => {
                                                const newSet = new Set(prev);
                                                if (newSet.has(account.id)) newSet.delete(account.id);
                                                else newSet.add(account.id);
                                                return newSet;
                                            });
                                        }}
                                        className="h-4 w-4 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                                    />
                                    <label htmlFor={`goal-acc-${account.id}`} className="ml-2 text-sm text-gray-200">
                                        {account.name} ({account.mask})
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleCreateGoal}
                    className="mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
                >
                    Create Goal
                </button>
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Your Goals</h3>
                {state.goals.length > 0 ? (
                    <div className="space-y-4">
                        {state.goals.map(goal => {
                            const { current, progress } = calculateGoalProgress(goal);
                            const progressColor = progress >= 100 ? 'bg-green-500' : progress > 70 ? 'bg-yellow-500' : 'bg-blue-500';
                            return (
                                <div key={goal.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="font-medium text-gray-200">{goal.name} ({goal.type.replace(/_/g, ' ')})</p>
                                        <button onClick={() => store.deleteGoal(goal.id)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">
                                        Target: ${goal.targetAmount.toFixed(2)} | Current: ${current.toFixed(2)} | Date: {goal.targetDate}
                                    </p>
                                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                                        <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${Math.min(100, progress)}%` }}></div>
                                    </div>
                                    <p className="text-xs text-right text-gray-400 mt-1">{progress.toFixed(1)}% complete</p>
                                    {goal.recommendations && goal.recommendations.length > 0 && (
                                        <ul className="mt-2 text-xs text-blue-300 list-disc list-inside">
                                            {goal.recommendations.map((rec, idx) => <li key={idx}>{rec}</li>)}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-400">No financial goals defined yet. Start planning your future!</p>
                )}
            </div>
        </div>
    );
};

export const UserSettings: React.FC = () => {
    const { state, store } = useFinancialData();
    const userProfile = state.userProfile;
    const [preferences, setPreferences] = useState<UserPreferences>(userProfile?.preferences || initialState.userProfile!.preferences);

    useEffect(() => {
        if (userProfile) {
            setPreferences(userProfile.preferences);
        }
    }, [userProfile]);

    const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const handleSavePreferences = () => {
        if (userProfile) {
            store.updateUserProfilePreferences(preferences);
            alert('Preferences saved!');
        }
    };

    if (!userProfile) return <p className="text-white">Loading user profile...</p>;

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">User Settings & Preferences</h2>

            <div className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">General Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="theme" className="block text-sm font-medium text-gray-400">Theme</label>
                            <select
                                id="theme"
                                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                value={preferences.theme}
                                onChange={(e) => handlePreferenceChange('theme', e.target.value as 'dark' | 'light' | 'system')}
                            >
                                <option value="dark">Dark</option>
                                <option value="light">Light</option>
                                <option value="system">System Default</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-400">Currency Symbol</label>
                            <input
                                type="text"
                                id="currencySymbol"
                                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                value={preferences.currencySymbol}
                                onChange={(e) => handlePreferenceChange('currencySymbol', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-400">Date Format</label>
                            <input
                                type="text"
                                id="dateFormat"
                                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                value={preferences.dateFormat}
                                onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="language" className="block text-sm font-medium text-gray-400">Language</label>
                            <select
                                id="language"
                                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                                value={preferences.preferredLanguage}
                                onChange={(e) => handlePreferenceChange('preferredLanguage', e.target.value)}
                            >
                                <option value="en-US">English (US)</option>
                                <option value="es-ES">Spanish (Spain)</option>
                                <option value="fr-FR">French (France)</option>
                                <option value="de-DE">German (Germany)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">Notification Settings</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="emailNotifications"
                                checked={preferences.notificationSettings.email}
                                onChange={(e) => handlePreferenceChange('notificationSettings', { ...preferences.notificationSettings, email: e.target.checked })}
                                className="h-4 w-4 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-200">Email Notifications</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="pushNotifications"
                                checked={preferences.notificationSettings.push}
                                onChange={(e) => handlePreferenceChange('notificationSettings', { ...preferences.notificationSettings, push: e.target.checked })}
                                className="h-4 w-4 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="pushNotifications" className="ml-2 text-sm text-gray-200">Push Notifications</label>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-gray-200 mb-3">Security & Privacy</h3>
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="biometricAuth"
                                checked={preferences.biometricAuthEnabled}
                                onChange={(e) => handlePreferenceChange('biometricAuthEnabled', e.target.checked)}
                                className="h-4 w-4 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="biometricAuth" className="ml-2 text-sm text-gray-200">Enable Biometric Authentication (Face ID / Touch ID)</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="aiRecommendations"
                                checked={preferences.aiRecommendationsEnabled}
                                onChange={(e) => handlePreferenceChange('aiRecommendationsEnabled', e.target.checked)}
                                className="h-4 w-4 text-cyan-500 bg-gray-900 border-gray-600 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="aiRecommendations" className="ml-2 text-sm text-gray-200">Enable AI-Powered Recommendations</label>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleSavePreferences}
                    className="py-2 px-6 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium"
                >
                    Save Preferences
                </button>
            </div>
        </div>
    );
};


export const CryptoWalletIntegration: React.FC = () => {
    const { state, store } = useFinancialData();
    const plaidService = usePlaidService();
    const [walletAddress, setWalletAddress] = useState('');
    const [walletType, setWalletType] = useState<'MetaMask' | 'Ledger' | 'Coinbase Wallet' | 'Other'>('MetaMask');
    const [linkingStatus, setLinkingStatus] = useState<'idle' | 'linking' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLinkWallet = async () => {
        if (!walletAddress) {
            setErrorMessage("Wallet address cannot be empty.");
            return;
        }
        setLinkingStatus('linking');
        setErrorMessage('');
        try {
            await plaidService.linkCryptoWallet(walletType, walletAddress);
            setLinkingStatus('success');
            setWalletAddress('');
            setTimeout(() => setLinkingStatus('idle'), 3000); // Reset status
        } catch (error: any) {
            setLinkingStatus('error');
            setErrorMessage(error.message || 'Failed to link crypto wallet.');
        }
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 mt-8">
            <h2 className="text-2xl font-bold text-white mb-4">Cryptocurrency Wallet Integration</h2>
            <p className="text-sm text-gray-400 mb-6">Connect your crypto wallets to track assets alongside your traditional finances.</p>

            <div className="mb-6 border-b border-gray-700 pb-6">
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Link New Wallet</h3>
                <div className="grid grid-cols-1 gap-4">
                    <select
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value as any)}
                    >
                        <option value="MetaMask">MetaMask</option>
                        <option value="Ledger">Ledger</option>
                        <option value="Coinbase Wallet">Coinbase Wallet</option>
                        <option value="Other">Other (Manual Address)</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Wallet Address / Public Key"
                        className="p-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400"
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                        disabled={linkingStatus === 'linking'}
                    />
                </div>
                {errorMessage && <p className="text-red-400 text-sm mt-2">{errorMessage}</p>}
                <button
                    onClick={handleLinkWallet}
                    className="mt-4 py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg text-white font-medium disabled:opacity-50"
                    disabled={linkingStatus === 'linking'}
                >
                    {linkingStatus === 'linking' ? 'Connecting...' : 'Link Crypto Wallet'}
                </button>
                {linkingStatus === 'success' && <p className="text-green-400 text-sm mt-2">Wallet linked successfully!</p>}
            </div>

            <div>
                <h3 className="text-xl font-semibold text-gray-200 mb-3">Your Linked Wallets</h3>
                {state.cryptoWallets.length > 0 ? (
                    <div className="space-y-4">
                        {state.cryptoWallets.map(wallet => (
                            <div key={wallet.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-medium text-gray-200">{wallet.name} ({wallet.platform})</p>
                                    <span className={`text-sm ${wallet.status === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                                        {wallet.status.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">Address: {wallet.address}</p>
                                <p className="text-sm text-gray-400">Last Synced: {wallet.lastSynced.toLocaleString()}</p>
                                <div className="mt-2 text-sm">
                                    {wallet.assets.map(asset => (
                                        <div key={asset.symbol} className="flex justify-between text-gray-300">
                                            <span>{asset.symbol}: {asset.balance.toFixed(4)}</span>
                                            <span>~${asset.usdValue.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={() => store.removeCryptoWallet(wallet.id)} className="mt-3 text-red-400 hover:text-red-300 text-sm">Disconnect</button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">No crypto wallets linked yet.</p>
                )}
            </div>
        </div>
    );
};


// ================================================================================================
// MAIN BUTTON AND APP WRAPPER
// ================================================================================================

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ onSuccess, ...rest }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Simulate Plaid Link event handler from Plaid's SDK, passing through to props
    const handlePlaidEvent = (eventName: string, metadata: any) => {
        console.log(`Plaid Event: ${eventName}`, metadata);
        rest.onEvent?.(eventName, metadata); // Pass to parent component
        // Log to internal audit or analytics
    };

    const handlePlaidSuccess = (publicToken: string, metadata: PlaidLinkSuccessMetadata) => {
        console.log('Plaid Link Success:', publicToken, metadata);
        // Additional local processing if needed before calling parent onSuccess
        onSuccess(publicToken, metadata);
    };

    const handlePlaidExit = (error: PlaidLinkError | null, metadata: PlaidLinkExitMetadata) => {
        console.log('Plaid Link Exit:', error, metadata);
        rest.onExit?.(error, metadata); // Pass to parent component
        // Log error, provide user feedback etc.
    };

    return (
        <>
            