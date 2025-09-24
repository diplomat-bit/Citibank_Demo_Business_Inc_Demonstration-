import React, { useState, useContext, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { View } from './types';
import { DataContext } from './context/DataContext';

// Personal Finance Views
import DashboardView from './components/views/personal/DashboardView';
import TransactionsView from './components/views/personal/TransactionsView';
import SendMoneyView from './components/views/personal/SendMoneyView';
import BudgetsView from './components/views/personal/BudgetsView';
import InvestmentsView from './components/views/personal/InvestmentsView';
import CryptoView from './components/views/personal/CryptoView';
import FinancialGoalsView from './components/views/personal/FinancialGoalsView';
import MarketplaceView from './components/views/personal/MarketplaceView';
import PersonalizationView from './components/views/personal/PersonalizationView';
import CardCustomizationView from './components/views/personal/CardCustomizationView';
import RewardsHubView from './components/views/personal/RewardsHubView';
import CreditHealthView from './components/views/personal/CreditHealthView';
import SecurityView from './components/views/personal/SecurityView';
import OpenBankingView from './components/views/personal/OpenBankingView';
import SettingsView from './components/views/personal/SettingsView';

// AI & Platform Views
import AIAdvisorView from './components/views/platform/AIAdvisorView';
import QuantumWeaverView from './components/views/platform/QuantumWeaverView';
import AIAdStudioView from './components/views/platform/AIAdStudioView';
import TheVisionView from './components/views/platform/TheVisionView';
import APIStatusView from './components/views/platform/APIStatusView';

// Corporate Finance Views
import CorporateDashboardView from './components/views/corporate/CorporateDashboardView';
import PaymentOrdersView from './components/views/corporate/PaymentOrdersView';
import CounterpartiesView from './components/views/corporate/CounterpartiesView';
import InvoicesView from './components/views/corporate/InvoicesView';
import ComplianceView from './components/views/corporate/ComplianceView';
import AnomalyDetectionView from './components/views/corporate/AnomalyDetectionView';

// Global Components
import VoiceControl from './components/VoiceControl';

/**
 * @description The root component of the application.
 * It acts as a controller or router, managing the active view and rendering the
 * appropriate child component. It also orchestrates the main layout, including
 * the Sidebar, Header, and main content area.
 */
const App: React.FC = () => {
    const [activeView, setActiveView] = useState<View>(View.Dashboard);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [previousView, setPreviousView] = useState<View | null>(null);
    const dataContext = useContext(DataContext);

    if (!dataContext) {
        throw new Error("App must be used within a DataProvider");
    }

    const { customBackgroundUrl, activeIllusion } = dataContext;

    /**
     * @description A custom view setter that keeps track of the previous view.
     * This is useful for providing context to views like the AI Advisor.
     */
    const handleSetView = (view: View) => {
        if (view !== activeView) {
            setPreviousView(activeView);
            setActiveView(view);
        }
    };

    /**
     * @description The main view renderer. It uses a switch statement to determine
     * which page component to render based on the `activeView` state. This acts as
     * a simple and effective client-side router.
     * @returns {React.ReactElement} The component for the currently active view.
     */
    const renderView = () => {
        switch (activeView) {
            // Personal Finance
            case View.Dashboard: return <DashboardView setActiveView={handleSetView} />;
            case View.Transactions: return <TransactionsView />;
            case View.SendMoney: return <SendMoneyView setActiveView={handleSetView} />;
            case View.Budgets: return <BudgetsView />;
            case View.Investments: return <InvestmentsView />;
            case View.Crypto: return <CryptoView />;
            case View.FinancialGoals: return <FinancialGoalsView />;
            case View.Marketplace: return <MarketplaceView />;
            case View.Personalization: return <PersonalizationView />;
            case View.CardCustomization: return <CardCustomizationView />;
            case View.RewardsHub: return <RewardsHubView />;
            case View.CreditHealth: return <CreditHealthView />;
            case View.Security: return <SecurityView />;
            case View.OpenBanking: return <OpenBankingView />;
            case View.Settings: return <SettingsView />;
            
            // AI & Platform
            case View.AIAdvisor: return <AIAdvisorView previousView={previousView} />;
            case View.QuantumWeaver: return <QuantumWeaverView />;
            case View.AIAdStudio: return <AIAdStudioView />;
            case View.TheWinningVision: return <TheVisionView />;
            case View.APIStatus: return <APIStatusView />;
            
            // Corporate Finance
            case View.CorporateDashboard: return <CorporateDashboardView setActiveView={handleSetView} />;
            case View.PaymentOrders: return <PaymentOrdersView />;
            case View.Counterparties: return <CounterpartiesView />;
            case View.Invoices: return <InvoicesView />;
            case View.Compliance: return <ComplianceView />;
            case View.AnomalyDetection: return <AnomalyDetectionView />;
            
            default: return <DashboardView setActiveView={handleSetView} />;
        }
    };

    const backgroundStyle = {
        backgroundImage: customBackgroundUrl ? `url(${customBackgroundUrl})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
    };

    const IllusionLayer = () => {
        if (!activeIllusion || activeIllusion === 'none') return null;
        
        // The actual CSS for the illusion effect is defined in index.html
        // to keep it global and avoid style tag injection on re-renders.
        return <div className={`absolute inset-0 z-0 ${activeIllusion}-illusion`}></div>
    };

    return (
        <div className="relative min-h-screen bg-gray-950 text-gray-300 font-sans" style={backgroundStyle}>
            <IllusionLayer />
             <div className="relative z-10 flex h-screen bg-transparent">
                 <Sidebar activeView={activeView} setActiveView={handleSetView} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} setActiveView={handleSetView} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>
                <VoiceControl setActiveView={handleSetView} />
            </div>
        </div>
    );
};

export default App;
