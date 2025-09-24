import React from 'react';
import Card from '../../../Card';

const MortgagesView: React.FC = () => {
    const features = [
        "AI interest rate forecasting",
        "Smart pre-qualification scoring",
        "AI risk-adjusted mortgage products",
        "Predictive refinancing alerts",
        "Generative mortgage documents",
        "Conversational mortgage advisor",
        "AI-based property valuation estimator",
        "Smart escrow tracking",
        "Predictive delinquency alerts",
        "AI mortgage payoff optimizations",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Mortgages</h2>
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

export default MortgagesView;
