import React from 'react';
import Card from '../../../Card';

const OnChainAnalyticsView: React.FC = () => {
    const features = [
        "AI-driven wallet clustering",
        "Predictive transaction flow analysis",
        "Fraud detection on blockchain",
        "Generative chain activity reports",
        "Smart token velocity indicators",
        "AI-based whale tracking alerts",
        "Predictive DeFi risk scoring",
        "Conversational on-chain insights",
        "Smart liquidity flow forecasting",
        "AI-driven compliance tagging",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">On-Chain Analytics</h2>
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

export default OnChainAnalyticsView;
