import React, { useContext } from 'react';
// FIX: Added Transaction to imports for explicit typing in reduce function.
import { View, Transaction } from '../../types';
import { DataContext } from '../../context/DataContext';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend } from 'recharts';
// FIX: Imported NAV_ITEMS to look up the correct icon for the preview tile.
import { NAV_ITEMS } from '../../constants';

const KpiCard: React.FC<{ title: string; value: string | number; className?: string }> = ({ title, value, className }) => (
    <div className={`bg-gray-800/50 p-3 rounded-lg text-center ${className}`}>
        <p className="text-xs text-gray-400 truncate">{title}</p>
        <p className="text-xl font-bold text-white">{value}</p>
    </div>
);

const ViewAnalyticsPreview: React.FC<{ viewId: View }> = ({ viewId }) => {
    const context = useContext(DataContext);
    if (!context) return <div className="text-gray-500 p-4">Loading data...</div>;

    const item = NAV_ITEMS.find(navItem => 'id' in navItem && navItem.id === viewId);

    const renderContent = () => {
        switch (viewId) {
            case View.Transactions: {
                const spendingByCategory = context.transactions
                    .filter(t => t.type === 'expense')
                    // FIX: Explicitly typed the accumulator and item in the reduce function to ensure correct type inference for `spendingByCategory`.
                    .reduce((acc: Record<string, number>, tx: Transaction) => {
                        acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                        return acc;
                    }, {});
                
                const chartData = Object.entries(spendingByCategory)
                    .map(([name, value]) => ({ name, value }))
                    .sort((a,b) => b.value - a.value)
                    .slice(0, 5);

                return (
                    <div className="h-full flex flex-col p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <KpiCard title="Total Transactions" value={context.transactions.length} />
                            {/* FIX: Explicitly typed the accumulator (s) and item (t) in the reduce function to resolve the arithmetic operation error where types were not being inferred correctly. */}
                            <KpiCard title="Total Outflow (All Time)" value={`$${context.transactions.filter(t=>t.type==='expense').reduce((s: number, t: Transaction)=>s+t.amount,0).toLocaleString(undefined, {maximumFractionDigits: 0})}`} />
                        </div>
                        <p className="text-sm font-semibold text-gray-300 mb-2">Top 5 Spending Categories</p>
                        <div className="flex-grow">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" stroke="#9ca3af" fontSize={12} width={100} interval={0} />
                                    <Tooltip cursor={{ fill: 'rgba(100,116,139,0.1)' }} contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }} formatter={(v:number) => `$${v.toFixed(2)}`}/>
                                    <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            }

            case View.Investments: {
                const chartData = context.assets.map(a => ({ ...a }));
                const totalValue = chartData.reduce((sum, asset) => sum + asset.value, 0);

                return (
                     <div className="h-full flex flex-col p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <KpiCard title="Total Invested" value={`$${totalValue.toLocaleString()}`} />
                            <KpiCard title="Asset Classes" value={chartData.length} />
                        </div>
                        <p className="text-sm font-semibold text-gray-300 mb-2">Asset Allocation</p>
                         <div className="flex-grow">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="80%">
                                        {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }}/>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            }

            case View.Budgets: {
                const chartData = context.budgets.map(b => ({
                    name: b.name,
                    value: Math.min((b.spent / b.limit) * 100, 100),
                    fill: b.spent > b.limit ? '#ef4444' : (b.spent / b.limit > 0.8 ? '#f59e0b' : '#06b6d4')
                }));
                const overBudget = context.budgets.filter(b => b.spent > b.limit).length;

                return (
                    <div className="h-full flex flex-col p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <KpiCard title="Total Budgets" value={context.budgets.length} />
                            <KpiCard title="Over Limit" value={overBudget} className={overBudget > 0 ? "text-red-400" : ""} />
                        </div>
                        <p className="text-sm font-semibold text-gray-300 mb-2">Budget Utilization (%)</p>
                        <div className="flex-grow">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} layout="horizontal">
                                    <XAxis dataKey="name" fontSize={10} interval={0} />
                                    <YAxis unit="%" domain={[0,100]}/>
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)' }} formatter={(v:number) => `${v.toFixed(1)}%`}/>
                                    <Bar dataKey="value" name="Used">
                                        {chartData.map(entry => <Cell key={entry.name} fill={entry.fill}/>)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            }
            
            case View.CorporateDashboard: {
                 return (
                    <div className="h-full flex flex-col p-4">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <KpiCard title="Pending Approvals" value={context.paymentOrders.filter(p => p.status === 'needs_approval').length} />
                            <KpiCard title="Overdue Invoices" value={context.invoices.filter(i => i.status === 'overdue').length} />
                            <KpiCard title="Open Compliance" value={context.complianceCases.filter(c => c.status === 'open').length} />
                            <KpiCard title="New Anomalies" value={context.financialAnomalies.filter(a => a.status === 'New').length} />
                        </div>
                         <p className="text-sm font-semibold text-gray-300 mb-2">Recent Corporate Transactions</p>
                         <div className="flex-grow text-xs space-y-2 overflow-y-auto">
                            {context.corporateTransactions.slice(0, 10).map(tx => (
                                <div key={tx.id} className="flex justify-between bg-gray-800/50 p-2 rounded">
                                    <span>{tx.merchant}</span>
                                    <span className="font-mono">${tx.amount.toFixed(2)}</span>
                                </div>
                            ))}
                         </div>
                    </div>
                 )
            }

            case View.AIAdStudio: {
                 return (
                    <div className="h-full flex flex-col p-4 items-center justify-center text-center">
                        <h4 className="text-lg font-bold text-white mb-2">AI Ad Studio</h4>
                        <p className="text-gray-400 text-sm mb-4">Generate high-quality video content from a simple text prompt using the Veo 2.0 model.</p>
                         <div className="w-full aspect-video bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700">
                             <p className="text-gray-500">Video previews will appear here.</p>
                         </div>
                    </div>
                );
            }

            default:
                 // FIX: Look up the nav item to get the icon. The 'item' was not defined in this scope.
                if (!item || !('icon' in item) || !item.icon) {
                    return (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
                            <p className="text-sm">Preview not available for {viewId}.</p>
                        </div>
                    );
                }
                return (
                    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-4">
                        <div className="w-16 h-16 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-4">
                            {React.cloneElement(context.unlockedFeatures.has(viewId) ? (item.icon as React.ReactElement) : <p>?</p>, { className: 'h-8 w-8'})}
                        </div>
                        <p className="text-sm">A detailed preview for this module is being generated by our AI.</p>
                        <p className="text-xs mt-2">(Placeholder for {viewId})</p>
                    </div>
                );
        }
    }

    return renderContent();
};

export default ViewAnalyticsPreview;