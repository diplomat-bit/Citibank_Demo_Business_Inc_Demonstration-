// components/Dashboard.tsx
// RE-ENACTED & EXPANDED: This component has been resurrected from its deprecated state.
// It is now the "Panopticon," the true command center of the application, as per the
// original architectural vision. It orchestrates all personal finance widgets,
// manages its own complex state, and serves as the primary user-facing hub.

import React, { useContext, useMemo, useState, useEffect, useReducer } from 'react';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { View } from '../types';
import type { Asset, GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, InvestmentPortfolio, Loan, RealEstateAsset, CryptoWallet } from '../types';
import PlaidLinkButton from './PlaidLinkButton';
import BalanceSummary from './BalanceSummary';
import RecentTransactions from './RecentTransactions';
import AIInsights from './AIInsights';
import ImpactTracker from './ImpactTracker';
import WealthTimeline from './WealthTimeline';
import AIDynamicKpiButton from './AIDynamicKpiButton';
import DynamicKpiLoader from './DynamicKpiLoader';

// ================================================================================================
// ARCHITECTURAL DEFINITIONS (PANOPTICON SPEC)
// ================================================================================================

/**
 * @description Defines the possible states of the Panopticon dashboard.
 * This state machine governs the overall UI presentation and behavior.
 * - VIEW: The default state for passive information consumption.
 * - ACTION: A state initiated by user intent, highlighting actionable components.
 * - RECOVERY: A state for handling errors or missing data, guiding the user.
 */
type DashboardState = 'VIEW' | 'ACTION' | 'RECOVERY' | 'LOADING';

/**
 * @description Defines the actions that can be dispatched to the dashboard's state reducer.
 */
type DashboardAction =
  | { type: 'DATA_LOAD_SUCCESS' }
  | { type: 'DATA_LOAD_FAILURE' }
  | { type: 'USER_INTENT_DETECTED'; payload: string }
  | { type: 'ACTION_COMPLETE' }
  | { type: 'RECOVER_STATE' };

/**
 * @description The shape of the dashboard's internal state object.
 */
interface IState {
  status: DashboardState;
  lastIntent: string | null;
}

/**
 * @description The state reducer for the Panopticon dashboard. Manages transitions
 * between different UI states based on dispatched actions.
 * @param {IState} state - The current state.
 * @param {DashboardAction} action - The action to process.
 * @returns {IState} The new state.
 */
const dashboardReducer = (state: IState, action: DashboardAction): IState => {
    switch (action.type) {
        case 'DATA_LOAD_SUCCESS':
            return { ...state, status: 'VIEW' };
        case 'DATA_LOAD_FAILURE':
            return { ...state, status: 'RECOVERY' };
        case 'USER_INTENT_DETECTED':
            return { ...state, status: 'ACTION', lastIntent: action.payload };
        case 'ACTION_COMPLETE':
        case 'RECOVER_STATE':
            return { ...state, status: 'VIEW', lastIntent: null };
        default:
            return state;
    }
};

const initialState: IState = {
    status: 'LOADING',
    lastIntent: null,
};

// ================================================================================================
// HELPER FUNCTIONS & MOCK DATA
// ================================================================================================

const formatCurrency = (value: number, digits = 2) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

const WIDGET_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    video: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    music: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
    cloud: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    rocket: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    send: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    bill: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    deposit: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
};


// ================================================================================================
// DASHBOARD WIDGET SUB-COMPONENTS
// These are defined here to encapsulate dashboard-specific presentation logic.
// In a larger system, they might be further broken down.
// ================================================================================================

const QuickActions: React.FC<{ setActiveView: (view: View) => void }> = ({ setActiveView }) => {
    const actions = [
        { label: 'Send Money', view: View.SendMoney, icon: 'send' },
        { label: 'Pay Bills', view: View.Transactions, icon: 'bill' },
        { label: 'Deposit', view: View.Transactions, icon: 'deposit' },
    ];
    return (
        <Card title="Quick Actions">
            <div className="grid grid-cols-3 gap-4 text-center">
                {actions.map(action => {
                    const Icon = WIDGET_ICONS[action.icon];
                    return (
                        <button key={action.label} onClick={() => setActiveView(action.view)} className="p-2 rounded-lg hover:bg-gray-700/50">
                            <Icon className="w-8 h-8 mx-auto text-cyan-400" />
                            <span className="text-xs mt-2 block text-gray-300">{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </Card>
    );
};

const CreditScoreMonitor: React.FC<{ creditScore: CreditScore }> = ({ creditScore }) => (
    <Card title="Credit Score">
        <div className="text-center">
            <p className="text-4xl font-bold text-white">{creditScore.score}</p>
            <p className="text-sm text-green-400">+{creditScore.change} points</p>
        </div>
    </Card>
);

const RewardPointsWidget: React.FC<{ rewardPoints: RewardPoints }> = ({ rewardPoints }) => (
    <Card title="Rewards">
        <div className="text-center">
            <p className="text-4xl font-bold text-white">{rewardPoints.balance.toLocaleString()}</p>
            <p className="text-sm text-gray-400">Points</p>
        </div>
    </Card>
);

const SecurityStatus: React.FC = () => (
    <Card title="Security">
        <div className="text-center text-green-400 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 019-2.606m0-15.394v15.394" /></svg>
            <p className="font-semibold">Secure</p>
        </div>
    </Card>
);

const SubscriptionTracker: React.FC<{ subscriptions: Subscription[] }> = ({ subscriptions }) => (
    <Card title="Recurring Subscriptions">
        <ul className="space-y-3">
            {subscriptions.map(sub => {
                const Icon = WIDGET_ICONS[sub.iconName];
                return (
                    <li key={sub.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center"><Icon className="w-5 h-5 text-cyan-300" /></div>
                            <span className="text-sm text-white">{sub.name}</span>
                        </div>
                        <span className="font-mono text-sm text-gray-300">{formatCurrency(sub.amount)}</span>
                    </li>
                );
            })}
        </ul>
    </Card>
);

const SavingsGoals: React.FC<{ savingsGoals: SavingsGoal[] }> = ({ savingsGoals }) => (
    <Card title="Savings Goals">
        <ul className="space-y-4">
            {savingsGoals.map(goal => {
                const Icon = WIDGET_ICONS[goal.iconName];
                const progress = (goal.saved / goal.target) * 100;
                return (
                    <li key={goal.id}>
                        <div className="flex justify-between items-center text-sm mb-1">
                            <div className="flex items-center gap-2 text-white"><Icon className="w-4 h-4 text-cyan-300" /><span>{goal.name}</span></div>
                            <span className="text-gray-400">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div></div>
                    </li>
                );
            })}
        </ul>
    </Card>
);

const LinkAccountPrompt: React.FC<{ onSuccess: (token: string, metadata: any) => void, isLoading: boolean }> = ({ onSuccess, isLoading }) => (
    <Card>
        <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-white mb-2">Welcome to Demo Bank</h3>
            <p className="text-gray-400 mb-6">Link your bank account to get started.</p>
            {isLoading ? <p className="text-cyan-300">Importing data...</p> : <PlaidLinkButton onSuccess={onSuccess} />}
        </div>
    </Card>
);


interface DashboardProps {
    setActiveView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    const [state, dispatch] = useReducer(dashboardReducer, initialState);
    
    // This effect simulates an initial data load for the dashboard.
    useEffect(() => {
        const timer = setTimeout(() => {
            if (context && context.linkedAccounts.length > 0) {
                dispatch({ type: 'DATA_LOAD_SUCCESS' });
            } else if (context && !context.isImportingData) {
                 // If there's no data and we are not importing, it's a recovery state.
                dispatch({ type: 'DATA_LOAD_FAILURE' });
            }
        }, 1500); // Simulate network delay
        return () => clearTimeout(timer);
    }, [context]);

    if (!context) {
        // This can be a more sophisticated loading or error state in a real app.
        return <div>Initializing context...</div>;
    }

    const {
        transactions,
        impactData,
        linkedAccounts,
        handlePlaidSuccess,
        isImportingData,
        subscriptions,
        creditScore,
        savingsGoals,
        rewardPoints,
        dynamicKpis,
    } = context;
    
    // Memoize recent transactions to prevent re-filtering on every render
    const recentTransactions = useMemo(() => transactions.slice(0, 5), [transactions]);

    // Render loading state for initial load or Plaid import
    if (state.status === 'LOADING' || isImportingData) {
         return (
             <Card>
                <div className="text-center py-16">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                        <div className="absolute inset-4 border-4 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">
                        {isImportingData ? 'Importing Your Financial Data...' : 'Building Your Panopticon...'}
                    </h3>
                    <p className="text-gray-400 mt-2">This may take a moment. We're building your personalized command center.</p>
                </div>
            </Card>
         );
    }
    
    // Render recovery state if no accounts are linked
    if (state.status === 'RECOVERY' || linkedAccounts.length === 0) {
        return <LinkAccountPrompt onSuccess={handlePlaidSuccess} isLoading={isImportingData} />;
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BalanceSummary />
                <WealthTimeline />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RecentTransactions transactions={recentTransactions} setActiveView={setActiveView} />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <AIInsights />
                    <div className="grid grid-cols-2 gap-6">
                        <ImpactTracker treesPlanted={impactData.treesPlanted} progress={impactData.progressToNextTree} />
                        <AIDynamicKpiButton />
                    </div>
                </div>
            </div>

            {dynamicKpis.map(kpi => (
                <Card key={kpi.id} title={kpi.title} subtitle={kpi.description} isCollapsible>
                    <DynamicKpiLoader kpiId={kpi.id} />
                </Card>
            ))}

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickActions setActiveView={setActiveView} />
                <CreditScoreMonitor creditScore={creditScore} />
                <RewardPointsWidget rewardPoints={rewardPoints} />
                <SecurityStatus />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubscriptionTracker subscriptions={subscriptions} />
                <SavingsGoals savingsGoals={savingsGoals} />
            </div>

        </div>
    );
};

export default Dashboard;
