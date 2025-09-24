// components/views/personal/DashboardView.tsx
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import { View } from '../../../types';
// FIX: Added 'Asset' to the type imports to resolve the 'Cannot find name' error.
import type { Asset, GamificationState, Subscription, CreditScore, SavingsGoal, MarketMover, UpcomingBill, Transaction, BudgetCategory, RewardPoints, InvestmentPortfolio, Loan, RealEstateAsset, CryptoWallet } from '../../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, AreaChart, Area, LineChart, Line, ComposedChart, RadialBarChart, RadialBar } from 'recharts';
import PlaidLinkButton from '../../PlaidLinkButton';
import BalanceSummary from '../../BalanceSummary';
import RecentTransactions from '../../RecentTransactions';
import AIInsights from '../../AIInsights';
import ImpactTracker from '../../ImpactTracker';
import WealthTimeline from '../../WealthTimeline';
import AIDynamicKpiButton from '../../AIDynamicKpiButton';
import DynamicKpiLoader from '../../DynamicKpiLoader';


// ================================================================================================
// HELPER FUNCTIONS & MOCK DATA
// ================================================================================================

const formatCurrency = (value: number, digits = 2) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
const calculateNetWorth = (portfolio: {value: number}[], realEstate: {value: number}[], loans: {outstandingBalance: number}[], cash: number) => {
    const assetTotal = portfolio.reduce((sum, asset) => sum + asset.value, 0) + realEstate.reduce((sum, asset) => sum + asset.value, 0) + cash;
    const debtTotal = loans.reduce((sum, loan) => sum + loan.outstandingBalance, 0);
    return assetTotal - debtTotal;
};

// Mock data for new widgets, as it's not in context
const mockLoans: Loan[] = [
    { id: 'l1', name: 'Student Loan', outstandingBalance: 25000, monthlyPayment: 350, nextPaymentDate: '2024-08-01' },
    { id: 'l2', name: 'Auto Loan', outstandingBalance: 12000, monthlyPayment: 450, nextPaymentDate: '2024-08-15' },
];
const mockRealEstate: RealEstateAsset[] = [{ id: 're1', name: 'Primary Residence', value: 450000 }];
const mockCash = 15000;
const mockMonthlyIncome = 5500;
const mockCryptoWallet: CryptoWallet[] = [
    { symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, averageBuyPrice: 60000, currentValue: 34500 },
    { symbol: 'ETH', name: 'Ethereum', quantity: 4, averageBuyPrice: 3000, currentValue: 12000 },
];

// ================================================================================================
// ICON COMPONENTS
// ================================================================================================
const WIDGET_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    video: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
    music: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>,
    cloud: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
    plane: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    rocket: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    send: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
    bill: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    deposit: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    anomaly: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    listBullet: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
    banknotes: ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-15c-.621 0-1.125-.504-1.125-1.125v-9.75c0-.621.504-1.125 1.125-1.125h1.5M12 4.5v15m0 0H6.75m5.25 0h5.25" /></svg>,
    crypto: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 7.5l.415-.207a.75.75 0 011.06 0l.415.207a.75.75 0 001.06 0l.415-.207a.75.75 0 011.06 0l.415.207a.75.75 0 001.06 0l.415-.207a.75.75 0 011.06 0l.415.207M8.25 15l.415.207a.75.75 0 001.06 0l.415-.207a.75.75 0 011.06 0l.415.207a.75.75 0 001.06 0l.415-.207a.75.75 0 011.06 0l.415.207" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75v-3.75a.75.75 0 01.75-.75h.75c.414 0 .75.336.75.75v3.75m0 0H3.75m.75 0H2.25m19.5 0v-3.75a.75.75 0 00-.75-.75h-.75a.75.75 0 00-.75.75v3.75m0 0h-.75m.75 0h.75M12 19.5v-3.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v3.75m0 0h-.75m.75 0h.75M12 4.5v3.75a.75.75 0 00.75.75h.75a.75.75 0 00.75.75V4.5m0 0h-.75m.75 0h.75" /></svg>,
};


// ================================================================================================
// MODAL & OVERLAY COMPONENTS
// ================================================================================================
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-gray-800 rounded-lg shadow-2xl max-w-md w-full border border-gray-700" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};


// ================================================================================================
// DASHBOARD WIDGET SUB-COMPONENTS
// ================================================================================================
const NetWorthSummary: React.FC<{ assets: Asset[], realEstate: RealEstateAsset[], loans: Loan[], cash: number }> = ({ assets, realEstate, loans, cash }) => {
    const netWorth = useMemo(() => calculateNetWorth(assets, realEstate, loans, cash), [assets, realEstate, loans, cash]);
    const data = [
        { name: 'Investments', value: assets.reduce((s, a) => s + a.value, 0) },
        { name: 'Real Estate', value: realEstate.reduce((s, a) => s + a.value, 0) },
        { name: 'Cash', value: cash },
    ];
    const COLORS = ['#06b6d4', '#6366f1', '#10b981'];

    return (
        <Card title="Net Worth Summary" className="h-full">
             <div className="flex justify-between items-center h-full">
                <div className="h-40 w-40">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5}>
                                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total Net Worth</p>
                    <p className="text-4xl font-bold text-white">{formatCurrency(netWorth, 0)}</p>
                </div>
             </div>
        </Card>
    );
};

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


interface DashboardViewProps {
    setActiveView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("DashboardView must be within a DataProvider");

    const {
        transactions,
        assets,
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

    if (linkedAccounts.length === 0 && !isImportingData) {
        return <LinkAccountPrompt onSuccess={handlePlaidSuccess} isLoading={isImportingData} />;
    }

    if (isImportingData) {
         return (
             <Card>
                <div className="text-center py-16">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                        <div className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"></div>
                        <div className="absolute inset-4 border-4 border-t-cyan-500 border-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-semibold text-white">Importing Your Financial Data...</h3>
                    <p className="text-gray-400 mt-2">This may take a moment. We're building your personalized dashboard.</p>
                </div>
            </Card>
         );
    }
    
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <BalanceSummary />
                </div>
                <div className="lg:col-span-2">
                    <NetWorthSummary assets={assets} realEstate={mockRealEstate} loans={mockLoans} cash={mockCash} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WealthTimeline />
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

export default DashboardView;
