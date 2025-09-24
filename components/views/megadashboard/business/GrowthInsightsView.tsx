import React from 'react';
import Card from '../../../Card';

const GrowthInsightsView: React.FC = () => {
    const features = [
        "AI-driven market trend forecasting",
        "Predictive growth trajectory modeling",
        "Conversational growth strategist",
        "Smart expansion opportunity detector",
        "AI competitive benchmarking",
        "Generative growth reports",
        "AI anomaly detection in KPIs",
        "Predictive CAC/LTV modeling",
        "Conversational investment advisor",
        "AI-driven retention growth playbooks",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Growth Insights</h2>
            <Card title="AI-Powered Features">
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                    {features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default GrowthInsightsView;
