// components/views/personal/InvestmentsView.tsx
import React, { useContext, useState, useMemo } from 'react';
import { DataContext } from '../../../context/DataContext';
import Card from '../../Card';
import type { Asset } from '../../../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import InvestmentPortfolio from '../../InvestmentPortfolio';

const ESGScore: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < rating ? 'text-green-400' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15a.75.75 0 01-.75-.75V7.612L7.22 9.63a.75.75 0 01-1.06-1.06l3.25-3.25a.75.75 0 011.18 0l3.25 3.25a.75.75 0 11-1.06 1.06L10.75 7.612v6.638A.75.75 0 0110 15z" />
            </svg>
        ))}
    </div>
);

const InvestmentsView: React.FC = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error("InvestmentsView must be within a DataProvider.");

    const { assets, impactInvestments } = context;
    const [monthlyContribution, setMonthlyContribution] = useState(500);

    const totalValue = useMemo(() => assets.reduce((sum, asset) => sum + asset.value, 0), [assets]);

    const projectionData = useMemo(() => {
        let futureValue = totalValue;
        const data = [{ year: 'Now', value: futureValue }];
        for (let i = 1; i <= 10; i++) {
            futureValue = (futureValue + monthlyContribution * 12) * 1.07; // 7% annual growth
            data.push({ year: `Year ${i}`, value: futureValue });
        }
        return data;
    }, [totalValue, monthlyContribution]);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Investments</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3"><InvestmentPortfolio /></div>
                
                <Card title="Asset Performance (YTD)" className="lg:col-span-3">
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={assets} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" stroke="#9ca3af" domain={[0, 50]} unit="%" />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" width={80} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} />
                                <Bar dataKey="performanceYTD" name="YTD Performance" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card title="AI Growth Simulator" className="lg:col-span-3">
                    <div className="mb-4">
                        <label className="block text-sm text-gray-300">Monthly Contribution: <span className="font-bold text-white">${monthlyContribution}</span></label>
                        <input type="range" min="0" max="2000" step="50" value={monthlyContribution} onChange={e => setMonthlyContribution(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData}>
                                <defs><linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient></defs>
                                <XAxis dataKey="year" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" tickFormatter={(tick) => `$${(tick / 1000).toFixed(0)}k`} />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(31, 41, 55, 0.8)', borderColor: '#4b5563' }} formatter={(value: number) => [`$${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`, "Projected Value"]} />
                                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="url(#colorGrowth)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                
                <Card title="Social Impact Investing (ESG)" className="lg:col-span-3">
                    <div className="space-y-4">
                        {impactInvestments.map(asset => (
                            <div key={asset.name} className="p-3 bg-gray-800/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <h4 className="font-semibold text-white">{asset.name}</h4>
                                    <p className="text-sm text-gray-400">{asset.description}</p>
                                </div>
                                <div className="text-right">
                                    <ESGScore rating={asset.esgRating || 0} />
                                    <button onClick={() => alert(`Investing in ${asset.name}`)} className="mt-2 text-xs px-3 py-1 bg-cyan-600/50 hover:bg-cyan-600 text-white rounded-lg">Invest Now</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default InvestmentsView;
