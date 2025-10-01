import React, { useContext, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import { View } from '../../../types';
import DashboardChart from '../../DashboardChart';
import { getDashboardChartsData } from '../../../data/dashboardChartsData';

interface DashboardViewProps {
    setActiveView: (view: View) => void;
    // openModalView is now unused and can be removed.
}

const DashboardView: React.FC<DashboardViewProps> = ({ setActiveView }) => {
    const context = useContext(DataContext);
    if (!context) throw new Error("Dashboard must be within a DataProvider");

    // Memoize the chart data generation to prevent re-calculation on every render
    const allCharts = useMemo(() => getDashboardChartsData(context), [context]);

    const chartCategories = [
        "Personal Finance", "Investment Analysis", "Budget & Spending", 
        "Corporate Finance", "Platform Analytics", "Security & Compliance",
        "Business Growth", "Developer & Infra"
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-white tracking-wider">The Sovereign's Observatory</h1>
                <p className="text-gray-400 mt-2">A complete, 100-point inspection of your entire financial and operational universe.</p>
            </div>
            
            {chartCategories.map(category => (
                <section key={category}>
                    <h2 className="text-2xl font-semibold text-cyan-300 col-span-full mb-4 sticky top-0 bg-gray-950/80 backdrop-blur-sm py-2 z-10">
                        {category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {allCharts.filter(chart => chart.category === category).map(chart => (
                            <DashboardChart
                                key={chart.id}
                                title={chart.title}
                                type={chart.type}
                                data={chart.data}
                                config={chart.config}
                            />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default DashboardView;
