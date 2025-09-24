import React from 'react';
import Card from '../../../Card';

const RiskScoringView: React.FC = () => {
    const features = [
        "AI contextual risk scoring per user",
        "Predictive credit scoring",
        "Network-based entity risk detection",
        "Real-time fraud risk dashboard",
        "Smart financial health indicators",
        "Generative risk assessment reports",
        "AI clustering of high-risk groups",
        "Predictive trend analysis",
        "Dynamic regulatory compliance scoring",
        "AI correlation with external data",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Risk Scoring</h2>
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

export default RiskScoringView;
