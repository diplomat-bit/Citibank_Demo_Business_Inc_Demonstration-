import React from 'react';
import Card from '../../../Card';

const CrossBorderPaymentsView: React.FC = () => {
    const features = [
        "AI FX rate forecasting",
        "Predictive payment routing optimization",
        "Fraud detection on international transfers",
        "Conversational payment assistant",
        "AI-driven compliance validation",
        "Predictive settlement time calculation",
        "Smart currency conversion suggestions",
        "AI-based sanctions screening",
        "Payment delay anomaly detection",
        "Generative compliance reports",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Cross-Border Payments</h2>
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

export default CrossBorderPaymentsView;
