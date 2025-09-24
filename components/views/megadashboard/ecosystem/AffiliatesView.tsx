import React from 'react';
import Card from '../../../Card';

const AffiliatesView: React.FC = () => {
    const features = [
        "AI affiliate fraud detection",
        "Predictive affiliate ranking",
        "Conversational affiliate dashboard",
        "Smart commission optimization",
        "AI-driven performance clustering",
        "Generative affiliate outreach campaigns",
        "Predictive affiliate retention scoring",
        "AI anomaly detection in affiliate data",
        "Smart payout forecasting",
        "Affiliate sentiment monitoring",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Affiliates</h2>
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

export default AffiliatesView;
