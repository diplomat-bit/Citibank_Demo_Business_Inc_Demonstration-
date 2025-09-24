import React from 'react';
import Card from '../../../Card';

const KycAmlView: React.FC = () => {
    const features = [
        "AI sanction list monitoring",
        "Suspicious activity detection",
        "Predictive AML risk scoring",
        "Document forgery detection",
        "AI-assisted case management",
        "Conversational AML insights",
        "Generative compliance reports",
        "AI real-time AML alert prioritization",
        "Behavior clustering of suspicious users",
        "Predictive AML audit forecasting",
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">KYC/AML</h2>
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

export default KycAmlView;
