import React from 'react';
import Card from '../../../Card';

const TokenIssuanceView: React.FC = () => {
    const features = [
        "AI smart contract generator",
        "Predictive tokenomics modeling",
        "Smart compliance checks for tokens",
        "Conversational issuance assistant",
        "AI risk scoring for new tokens",
        "Predictive adoption forecasting",
        "Auto liquidity pool optimization",
        "Generative whitepaper drafts",
        "AI-based token distribution anomaly detection",
        "Smart governance recommendation engine",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Token Issuance</h2>
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

export default TokenIssuanceView;
