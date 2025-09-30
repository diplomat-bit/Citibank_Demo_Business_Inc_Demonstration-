import React, { useContext } from 'react';
import { DataContext } from '../../../context/DataContext';
import { View } from '../../../types';
import BalanceSummary from '../../BalanceSummary';
import RecentTransactions from '../../RecentTransactions';
import InvestmentPortfolio from '../../InvestmentPortfolio';
import AIInsights from '../../AIInsights';
import WealthTimeline from '../../WealthTimeline';
import ImpactTracker from '../../ImpactTracker';

interface DashboardViewProps {
    setActiveView: (view: View) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard must be within a DataProvider");

    const { transactions, impactData } = context;

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <BalanceSummary />
                </div>
                <AIInsights />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <RecentTransactions transactions={transactions.slice(0, 5)} setActiveView={setActiveView} />
                </div>
                <div className="lg:col-span-2">
                    <InvestmentPortfolio />
                </div>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WealthTimeline />
                <ImpactTracker treesPlanted={impactData.treesPlanted} progress={impactData.progressToNextTree} />
            </div>
        </div>
    );
};

export default DashboardView;
